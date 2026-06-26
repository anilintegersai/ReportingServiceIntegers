from fastapi import APIRouter, HTTPException
from models import ReportManifest
from services import manifest_service

router = APIRouter(prefix="/api/manifests", tags=["manifests"])


@router.get("", response_model=list[ReportManifest])
def list_apps():
    return manifest_service.get_available_apps()


@router.get("/{app_name}", response_model=ReportManifest)
def get_manifest(app_name: str):
    try:
        return manifest_service.get_manifest(app_name)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"No manifest found for app '{app_name}'")
