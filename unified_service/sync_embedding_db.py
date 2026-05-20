import openpyxl
import os
from database import upsert_embedding_model, get_db_connection


def clear_embedding_table():
    """Полная очистка таблицы перед синхронизацией"""
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM embedding_knowledge_base")
        conn.commit()
        print("Старые данные удалены. Начинается чистая загрузка Embedding моделей...")
    except Exception as e:
        print(f"Ошибка при очистке таблицы: {e}")
    finally:
        conn.close()


def clean_val(val):
    """Помощник для очистки значений из ячеек Excel"""
    return str(val).strip() if val is not None else ""


def sync_excel_to_db():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(
        base_dir, "database", "tables", "Embedding.xlsx"
    )

    print(f"Reading data from {excel_path}...")
    try:
        clear_embedding_table()

        wb = openpyxl.load_workbook(excel_path, data_only=True)
        ws = wb.active

        current_country = ""
        current_family = ""
        count = 0

        for row in ws.iter_rows(min_row=2):
            col_country = clean_val(row[0].value)
            col_family = clean_val(row[1].value)
            name = clean_val(row[2].value)

            if col_country:
                current_country = col_country
            if col_family:
                current_family = col_family

            if not name:
                continue

            date_str = clean_val(row[3].value)
            mteb_str = clean_val(row[4].value)
            rating = clean_val(row[5].value)
            dimension = clean_val(row[6].value)
            context = clean_val(row[7].value)
            license_ = clean_val(row[8].value)
            multilingual = clean_val(row[9].value)
            vram = clean_val(row[10].value)

            link_cell = row[11]
            link = ""
            if link_cell.hyperlink and link_cell.hyperlink.target:
                link = link_cell.hyperlink.target
            else:
                link = clean_val(link_cell.value)

            description = f"Модель {current_family}"
            if rating and rating != "—" and rating != "None":
                description += f" ({rating})"

            model_id = name.lower().replace(" ", "-").replace(".", "-")

            model_data = {
                "id": model_id,
                "name": name,
                "family": current_family,
                "type": "Embedding",
                "description": description,
                "mtebScore": mteb_str,
                "dimension": dimension,
                "contextWindow": context,
                "rating": rating,
                "hardwareRequirements": vram,
                "multilingual": multilingual,
                "license": license_,
                "releaseDate": date_str,
                "country": current_country,
                "tags": f"Embedding,{current_family}",
                "link": link,
                "downloads": 1000,
                "stars": 0,
            }

            upsert_embedding_model(model_data)
            count += 1
            print(f"Добавлена Embedding модель: {name}")

        print(
            f"\nБаза знаний Embedding успешно синхронизирована! Загружено {count} моделей."
        )

    except Exception as e:
        print(f"Ошибка при синхронизации Embedding: {e}")


if __name__ == "__main__":
    sync_excel_to_db()
