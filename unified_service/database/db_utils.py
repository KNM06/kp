"""
SQLite database utilities (Unified Schema)
"""
import json
import sqlite3
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from config import settings
from utils.exceptions import DatabaseException

logger = logging.getLogger(__name__)

def _ensure_column_exists(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    cursor = conn.execute(f"PRAGMA table_info({table})")
    columns = {row["name"] for row in cursor.fetchall()}
    if column not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
        conn.commit()
        logger.info("Added missing column %s.%s", table, column)

def get_db_connection() -> sqlite3.Connection:
    try:
        conn = sqlite3.connect(settings.sqlite_db_name)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        raise DatabaseException(f"Failed to connect to database: {str(e)}")

def init_database() -> None:
    logger.info("Initializing unified database...")
    conn = get_db_connection()
    try:
        # Chat & Session Tables (твои стандартные)
        conn.execute('''CREATE TABLE IF NOT EXISTS chat_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL, user_query TEXT NOT NULL, agent_response TEXT NOT NULL, category TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS document_store (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT NOT NULL, upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS session_state (session_id TEXT PRIMARY KEY, category TEXT, original_query TEXT, collected_data TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')

        # 1. EMBEDDING Knowledge Base
        conn.execute('''
            CREATE TABLE IF NOT EXISTS embedding_knowledge_base (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, family TEXT, type TEXT, description TEXT,
                mtebScore TEXT, dimension TEXT, contextWindow TEXT, rating TEXT, hardwareRequirements TEXT,
                multilingual TEXT, license TEXT, releaseDate TEXT, country TEXT, tags TEXT, link TEXT,
                downloads INTEGER, stars INTEGER
            )
        ''')

        # 2. LLM Knowledge Base (Унифицировано)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS llm_knowledge_base (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, family TEXT, type TEXT, description TEXT,
                architecture TEXT, parameterCount TEXT, contextWindow TEXT, rating TEXT, hardwareRequirements TEXT,
                multilingual TEXT, benchmarks TEXT, license TEXT, releaseDate TEXT, country TEXT, tags TEXT, link TEXT,
                downloads INTEGER, stars INTEGER
            )
        ''')

        # 3. OCR Knowledge Base (Унифицировано)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS ocr_knowledge_base (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, family TEXT, type TEXT, description TEXT,
                ned TEXT, teds TEXT, architecture TEXT, parameterCount TEXT, rating TEXT, hardwareRequirements TEXT,
                license TEXT, releaseDate TEXT, country TEXT, tags TEXT, link TEXT,
                downloads INTEGER, stars INTEGER
            )
        ''')

        # 4. VL (Vision-Language) Knowledge Base (НОВОЕ)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS vl_knowledge_base (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, family TEXT, type TEXT, description TEXT,
                applicationSpecifics TEXT, visionEncoder TEXT, architecture TEXT, parameterCount TEXT,
                contextWindow TEXT, benchmarks TEXT, economics TEXT, rating TEXT, hardwareRequirements TEXT,
                license TEXT, releaseDate TEXT, country TEXT, tags TEXT, link TEXT,
                downloads INTEGER, stars INTEGER
            )
        ''')

        _ensure_column_exists(conn, "chat_logs", "agent_meta", "TEXT")
        _ensure_column_exists(conn, "session_state", "title", "TEXT")
        _ensure_column_exists(conn, "session_state", "is_active", "INTEGER DEFAULT 1")
        _ensure_column_exists(conn, "session_state", "chat_mode", "TEXT DEFAULT 'auto'")
        
        conn.commit()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise DatabaseException(f"Failed to initialize database: {str(e)}")
    finally:
        conn.close()

# --- CHAT & SESSION METHODS ---
def insert_chat_log(session_id: str, user_query: str, agent_response: str, category: Optional[str] = None, agent_meta: Optional[Dict[str, Any]] = None) -> None:
    conn = get_db_connection()
    try:
        meta_json = json.dumps(agent_meta, ensure_ascii=False) if agent_meta else None
        conn.execute('''INSERT INTO chat_logs (session_id, user_query, agent_response, category, agent_meta) VALUES (?, ?, ?, ?, ?)''', (session_id, user_query, agent_response, category, meta_json))
        conn.commit()
    finally:
        conn.close()

def get_chat_history(session_id: str) -> List[Dict[str, str]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''SELECT user_query, agent_response FROM chat_logs WHERE session_id = ? ORDER BY created_at''', (session_id,))
        messages = []
        for row in cursor.fetchall():
            messages.extend([{"role": "human", "content": row['user_query']}, {"role": "ai", "content": row['agent_response']}])
        return messages
    finally:
        conn.close()

def insert_document_record(filename: str) -> int:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO document_store (filename) VALUES (?)', (filename,))
        file_id = cursor.lastrowid
        conn.commit()
        return file_id
    finally:
        conn.close()

def delete_document_record(file_id: int) -> bool:
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM document_store WHERE id = ?', (file_id,))
        conn.commit()
        return True
    finally:
        conn.close()

def get_all_documents() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''SELECT id, filename, upload_timestamp FROM document_store ORDER BY upload_timestamp DESC''')
        return [dict(doc) for doc in cursor.fetchall()]
    finally:
        conn.close()

def get_document_by_filename(filename: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''SELECT id, filename, upload_timestamp FROM document_store WHERE filename = ?''', (filename,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def create_session(session_id: str, category: Optional[str] = None, original_query: Optional[str] = None, collected_data: Optional[str] = None, title: Optional[str] = None, chat_mode: Optional[str] = None, is_active: bool = True) -> None:
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO session_state (session_id, category, original_query, collected_data, title, chat_mode, is_active, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(session_id) DO UPDATE SET
                category = COALESCE(excluded.category, session_state.category),
                collected_data = COALESCE(excluded.collected_data, session_state.collected_data),
                title = COALESCE(excluded.title, session_state.title),
                chat_mode = COALESCE(excluded.chat_mode, session_state.chat_mode),
                is_active = excluded.is_active,
                original_query = COALESCE(session_state.original_query, excluded.original_query),
                updated_at = CURRENT_TIMESTAMP
        ''', (session_id, category, original_query, collected_data, title, chat_mode or 'auto', 1 if is_active else 0))
        conn.commit()
    finally:
        conn.close()

def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM session_state WHERE session_id = ?', (session_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def _get_last_message(conn: sqlite3.Connection, session_id: str) -> Optional[str]:
    cursor = conn.cursor()
    cursor.execute('''SELECT agent_response FROM chat_logs WHERE session_id = ? ORDER BY created_at DESC LIMIT 1''', (session_id,))
    row = cursor.fetchone()
    if row and row["agent_response"]: return row["agent_response"]
    cursor.execute('''SELECT user_query FROM chat_logs WHERE session_id = ? ORDER BY created_at DESC LIMIT 1''', (session_id,))
    row = cursor.fetchone()
    return row["user_query"] if row else None

def delete_session(session_id: str) -> bool:
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM chat_logs WHERE session_id = ?', (session_id,))
        conn.execute('DELETE FROM session_state WHERE session_id = ?', (session_id,))
        conn.commit()
        return True
    finally:
        conn.close()

def list_sessions(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''SELECT session_id, title, category, original_query, collected_data, chat_mode, created_at, updated_at FROM session_state WHERE IFNULL(is_active, 1) = 1 ORDER BY updated_at DESC LIMIT ?''', (limit,))
        sessions = []
        for row in cursor.fetchall():
            entry = dict(row)
            entry["last_message"] = _get_last_message(conn, entry["session_id"])
            sessions.append(entry)
        return sessions
    finally:
        conn.close()

def get_structured_chat_history(session_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute('''SELECT id, user_query, agent_response, category, agent_meta, created_at FROM chat_logs WHERE session_id = ? ORDER BY created_at''', (session_id,))
        messages: List[Dict[str, Any]] = []
        for row in cursor.fetchall():
            created_at = row["created_at"]
            meta = json.loads(row["agent_meta"]) if row["agent_meta"] else None
            messages.append({"id": f"{row['id']}-user", "role": "user", "content": row["user_query"], "timestamp": created_at})
            messages.append({"id": f"{row['id']}-assistant", "role": "assistant", "content": row["agent_response"], "timestamp": created_at, "category": row["category"], "meta": meta})
        return messages
    finally:
        conn.close()

def update_session(session_id: str, category: Optional[str] = None, collected_data: Optional[str] = None, title: Optional[str] = None, is_active: Optional[bool] = None) -> None:
    conn = get_db_connection()
    try:
        updates = []
        params = []
        if category is not None:
            updates.append("category = ?")
            params.append(category)
        if collected_data is not None:
            updates.append("collected_data = ?")
            params.append(collected_data)
        if title is not None:
            updates.append("title = ?")
            params.append(title)
        if is_active is not None:
            updates.append("is_active = ?")
            params.append(1 if is_active else 0)
        updates.append("updated_at = CURRENT_TIMESTAMP")
        params.append(session_id)
        query = f"UPDATE session_state SET {', '.join(updates)} WHERE session_id = ?"
        conn.execute(query, params)
        conn.commit()
    finally:
        conn.close()

def delete_old_sessions(hours: int = 24) -> int:
    conn = get_db_connection()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM session_state WHERE updated_at < ?', (cutoff,))
        deleted_count = cursor.rowcount
        conn.commit()
        return deleted_count
    finally:
        conn.close()

# --- EMBEDDING METHODS ---
def get_all_embedding_models() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM embedding_knowledge_base")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def upsert_embedding_model(model_data: Dict[str, Any]) -> None:
    conn = get_db_connection()
    try:
        columns = ", ".join(model_data.keys())
        placeholders = ", ".join(["?"] * len(model_data))
        updates = ", ".join([f"{k} = excluded.{k}" for k in model_data.keys() if k != "id"])
        query = f"INSERT INTO embedding_knowledge_base ({columns}) VALUES ({placeholders}) ON CONFLICT(id) DO UPDATE SET {updates}"
        conn.execute(query, tuple(model_data.values()))
        conn.commit()
    finally:
        conn.close()

def get_embedding_model_by_id(model_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM embedding_knowledge_base WHERE id = ?", (model_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

# --- LLM METHODS ---
def get_all_llm_models() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM llm_knowledge_base")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def upsert_llm_model(model_data: Dict[str, Any]) -> None:
    conn = get_db_connection()
    try:
        columns = ", ".join(model_data.keys())
        placeholders = ", ".join(["?"] * len(model_data))
        updates = ", ".join([f"{k} = excluded.{k}" for k in model_data.keys() if k != "id"])
        query = f"INSERT INTO llm_knowledge_base ({columns}) VALUES ({placeholders}) ON CONFLICT(id) DO UPDATE SET {updates}"
        conn.execute(query, tuple(model_data.values()))
        conn.commit()
    finally:
        conn.close()

# --- OCR METHODS ---
def get_all_ocr_models() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ocr_knowledge_base")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def upsert_ocr_model(model_data: Dict[str, Any]) -> None:
    conn = get_db_connection()
    try:
        columns = ", ".join(model_data.keys())
        placeholders = ", ".join(["?"] * len(model_data))
        updates = ", ".join([f"{k} = excluded.{k}" for k in model_data.keys() if k != "id"])
        query = f"INSERT INTO ocr_knowledge_base ({columns}) VALUES ({placeholders}) ON CONFLICT(id) DO UPDATE SET {updates}"
        conn.execute(query, tuple(model_data.values()))
        conn.commit()
    finally:
        conn.close()

# --- VL METHODS (НОВОЕ) ---
def get_all_vl_models() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM vl_knowledge_base")
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def upsert_vl_model(model_data: Dict[str, Any]) -> None:
    conn = get_db_connection()
    try:
        columns = ", ".join(model_data.keys())
        placeholders = ", ".join(["?"] * len(model_data))
        updates = ", ".join([f"{k} = excluded.{k}" for k in model_data.keys() if k != "id"])
        query = f"INSERT INTO vl_knowledge_base ({columns}) VALUES ({placeholders}) ON CONFLICT(id) DO UPDATE SET {updates}"
        conn.execute(query, tuple(model_data.values()))
        conn.commit()
    finally:
        conn.close()

init_database()