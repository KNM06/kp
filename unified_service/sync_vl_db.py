import pandas as pd
import os
import re
from database.db_utils import upsert_vl_model, get_db_connection

def clear_vl_table():
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM vl_knowledge_base")
        conn.commit()
        print("Старые данные VL удалены.")
    except Exception as e:
        print(f"Ошибка при очистке таблицы: {e}")
    finally:
        conn.close()

def sync():
    # Получаем абсолютный путь к папке, где лежит этот скрипт
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Собираем относительный путь до файла
    excel_path = os.path.join(base_dir, "database", "tables", "VL_models.xlsx")
    
    try:
        clear_vl_table()
        df = pd.read_excel(excel_path).fillna("—")
        
        for _, row in df.iterrows():
            model_name = str(row["Модель"])
            family_name = str(row["Разработчик"])
            
            raw_data = str(row["Архитектура и Параметры"])
            
            # 1. Попытка вытащить параметры через поиск "XXB" или "XXM"
            # Ищем число + B (например, 34B, 236B, 0.1B)
            param_match = re.search(r'(\d+\.?\d*\s?[BbMmTt])', raw_data, re.IGNORECASE)
            parameters = param_match.group(1) if param_match else "N/A"
            
            # 2. Архитектура — это всё, что осталось, если убрать параметры (или просто текст до первой скобки)
            architecture = raw_data.split('(')[0].strip().replace('|', '').strip()
            # Очистим архитектуру от параметров, если они там случайно затесались
            if param_match:
                architecture = architecture.replace(param_match.group(1), "").strip(", ")

            model_data = {
                "id": model_name.lower().replace(" ", "-").replace(".", "-"),
                "name": model_name,
                "type": "VL",
                "family": family_name,
                "country": str(row["Страна"]),
                "license": str(row["Лицензия"]),
                "applicationSpecifics": str(row["Специфика применения"]),
                "architecture": architecture,
                "parameterCount": parameters, 
                "visionEncoder": str(row["Визуальный энкодер и Разрешение"]),
                "contextWindow": str(row["Макс. контекст"]),
                "benchmarks": str(row["Бенчмарки (MMMU-Pro / MathVista / DocVQA)"]),
                "economics": str(row["Экономика и Доступность"]),
                "link": str(row["Ссылка"]),
                "description": f"VL Модель от {family_name}",
                "tags": f"VL,{family_name}",
                "downloads": 1000,
                "stars": 0
            }
            
            upsert_vl_model(model_data)
            print(f"Добавлена VL: {model_name} | Arch: {architecture} | Params: {parameters}")
            
        print("\nVL модели успешно синхронизированы!")
    except Exception as e:
        print(f"Ошибка при синхронизации VL: {e}")

if __name__ == "__main__":
    sync()