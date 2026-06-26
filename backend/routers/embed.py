import logging
from fastapi import APIRouter, HTTPException
from models import EmbedConfig
from services import manifest_service, powerbi_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/embed", tags=["embed"])


@router.get("/token/{app_name}/{report_id}", response_model=EmbedConfig)
def get_embed_token(app_name: str, report_id: str):
    report = manifest_service.get_report(app_name, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found in app '{app_name}'")
    try:
        return powerbi_service.get_embed_config(report)
    except Exception as exc:
        logger.error("Embed token error for %s/%s: %s", app_name, report_id, exc)
        raise HTTPException(status_code=500, detail="Failed to generate embed token. Check Power BI configuration.")
