import logging
from fastapi import APIRouter, HTTPException, Depends
from models import EmbedConfig, UserInfo
from services import manifest_service, powerbi_service
from services.auth_service import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/embed", tags=["embed"])


@router.get("/token/{app_name}/{report_id}", response_model=EmbedConfig)
def get_embed_token(
    app_name: str,
    report_id: str,
    user: UserInfo = Depends(get_current_user),
):
    # Check user has explicit access to this report
    allowed = user.allowedReports.get(app_name, [])
    if report_id not in allowed:
        raise HTTPException(status_code=403, detail="Access denied to this report")

    report = manifest_service.get_report(app_name, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found in app '{app_name}'")

    # Pass the authenticated username into the RLS embed token
    if report.rlsRole:
        report = report.model_copy(update={"rlsUsername": user.username})

    try:
        return powerbi_service.get_embed_config(report)
    except Exception as exc:
        logger.error("Embed token error for %s/%s: %s", app_name, report_id, exc)
        raise HTTPException(status_code=500, detail="Failed to generate embed token. Check Power BI configuration.")
