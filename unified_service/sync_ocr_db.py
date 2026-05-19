import pandas as pd
import re
import os
from database.db_utils import upsert_ocr_model, get_db_connection

def clear_ocr_table():
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM ocr_knowledge_base")
        conn.commit()
        print("Старые данные OCR удалены.")
    finally:
        conn.close()

def sync_ocr_to_db():
    # Укажи тут свой путь к Excel файлу OCR
    excel_path = r"D:\БГУИР\OSTIS\ostis-ann\problem-solver\py\unified_service\database\tables\OCR.xlsx"

    try:
        clear_ocr_table()
        df = pd.read_excel(excel_path).fillna("—")
        
        for _, row in df.iterrows():
            model_name = str(row["Модель"])
            family_name = str(row.get("Разработчик / Команда", "N/A"))
            
            model_data = {
                "id": model_name.lower().replace(" ", "-").replace(".", "-"),
                "name": model_name,
                "type": "OCR",                            # Устанавливаем строгий тип
                "family": family_name,                    # Унифицировано
                "country": str(row.get("Страна производства", "N/A")),
                "releaseDate": str(row.get("Дата выхода", "N/A")),
                "license": str(row.get("Лицензия", "N/A")),
                "ned": str(row.get("NED ↓", "N/A")),
                "teds": str(row.get("TEDS ↑", "N/A")),
                "architecture": str(row.get("Архитектура", "N/A")),
                "rating": str(row.get("Место в топе", "99")), # Унифицировано (было rank_position)
                "parameterCount": str(row.get("Параметры", "N/A")), # Унифицировано
                "link": str(row.get("Ссылка", "")),       # Унифицировано
                "hardwareRequirements": "N/A",            # Заглушка для общности
                "description": f"Модель {family_name}",
                "tags": f"OCR,{family_name}",
                "downloads": 1000,
                "stars": 0
            }
            upsert_ocr_model(model_data)
            print(f"Добавлена OCR модель: {model_data['name']}")
            
        print("\nOCR модели успешно синхронизированы!")
    except Exception as e:
        print(f"Ошибка при синхронизации OCR: {e}")

if __name__ == "__main__":
    sync_ocr_to_db()