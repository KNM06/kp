import logging
from fastapi import APIRouter, HTTPException
from database.db_utils import (
    get_all_embedding_models, 
    get_all_llm_models, 
    get_all_ocr_models,
    get_all_vl_models
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/knowledge/models", tags=["Knowledge Models"])

@router.get("")
def read_all_models():
    """Получает все записи из всех баз знаний (Embedding, LLM, OCR, VL)"""
    try:
        embeddings = get_all_embedding_models()
        llms = get_all_llm_models()
        ocrs = get_all_ocr_models()
        vls = get_all_vl_models()

        all_models = embeddings + llms + ocrs + vls 

        for model in all_models:
            if model.get("tags") and isinstance(model["tags"], str):
                model["tags"] = model["tags"].split(",")
        return all_models
    except Exception as e:
        logger.error(f"Failed to fetch models: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@router.get("/{model_id}")
def read_model_by_id(model_id: str):
    """Ищет одну модель по ее ID во всех таблицах"""
    try:
        embeddings = get_all_embedding_models()
        llms = get_all_llm_models()
        ocrs = get_all_ocr_models()
        vls = get_all_vl_models() 
        
        all_models = embeddings + llms + ocrs + vls 

        model = next((m for m in all_models if m["id"] == model_id), None)
        
        if not model:
            raise HTTPException(status_code=404, detail="Модель не найдена")
        
        if model.get("tags") and isinstance(model["tags"], str):
            model["tags"] = model["tags"].split(",")
        return model
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch model {model_id}: {e}")
        raise HTTPException(status_code=500, detail="Database error")