import pandas as pd
import os
from database.db_utils import upsert_llm_model, get_db_connection

def clear_llm_table():
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM llm_knowledge_base")
        conn.commit()
        print("Старые данные удалены. Начинается чистая загрузка LLM...")
    except Exception as e:
        print(f"Ошибка при очистке таблицы: {e}")
    finally:
        conn.close()

def sync_excel_to_db():
    # Получаем абсолютный путь к папке, где лежит этот скрипт (unified_service)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Собираем относительный путь до файла внутри проекта
    excel_path = os.path.join(base_dir, "database", "tables", "LLM.xlsx")
    
    print(f"Reading data from {excel_path}...")

    try:
        clear_llm_table()
        df = pd.read_excel(excel_path).fillna("—")

        for _, row in df.iterrows():
            family_name = str(row["Разработчик"])
            model_data = {
                "id": str(row["Модель"]).lower().replace(" ", "-").replace(".", "-"),
                "name": str(row["Модель"]),
                "type": "LLM",                           # Устанавливаем строгий тип
                "family": family_name,                   # Унифицировано (было developer)
                "country": str(row["Страна"]),
                "releaseDate": str(row["Дата выхода"]),
                "parameterCount": str(row["Размер (всего / активные)"]), # Унифицировано
                "architecture": str(row["Архитектура"]),
                "contextWindow": str(row["Контекст"]),   # Унифицировано
                "rating": str(row["LMArena Elo"]),       # Унифицировано (было elo)
                "multilingual": str(row["Языки"]),       # Унифицировано
                "description": str(row["Специализация"]),# Унифицировано
                "hardwareRequirements": str(row["Аппаратные требования"]), # Унифицировано
                "benchmarks": str(row["Основные бенчмарки"]),
                "license": str(row["Лицензия"]),
                "link": str(row["Источник"]),            # Унифицировано (было sourceUrl)
                "tags": f"LLM,{family_name}",
                "downloads": 1000,
                "stars": 0
            }
            upsert_llm_model(model_data)
            print(f"Добавлена LLM модель: {model_data['name']}")

        print("\nБаза LLM успешно синхронизирована!")
    except Exception as e:
        print(f"Ошибка при синхронизации LLM: {e}")

if __name__ == "__main__":
    sync_excel_to_db()