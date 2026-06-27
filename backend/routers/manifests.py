from fastapi import APIRouter, HTTPException, Depends
from models import ReportManifest, UserInfo
from services import manifest_service
from services.auth_service import get_current_user
from services.user_service import get_tenant

router = APIRouter(prefix="/api/manifests", tags=["manifests"])


def _filter_manifest(manifest: ReportManifest, user: UserInfo) -> ReportManifest:
    """Strip categories/reports the user has no access to."""
    allowed_ids = set(user.allowedReports.get(manifest.appName.lower().replace(" ", "-"), []))
    filtered_categories = []
    for cat in manifest.categories:
        visible_reports = [r for r in cat.reports if r.id in allowed_ids]
        if visible_reports:
            filtered_categories.append(cat.model_copy(update={"reports": visible_reports}))
    return manifest.model_copy(update={"categories": filtered_categories})


@router.get("", response_model=list[ReportManifest])
def list_apps(user: UserInfo = Depends(get_current_user)):
    tenant = get_tenant(user.tenant)
    if not tenant:
        raise HTTPException(status_code=403, detail="Tenant not found")

    all_manifests = manifest_service.get_available_apps()
    result = []
    for m in all_manifests:
        slug = m.appName.lower().replace(" ", "-")
        if slug not in tenant.allowedApps:
            continue
        filtered = _filter_manifest(m, user)
        if filtered.categories:          # only include if user has ≥1 report
            result.append(filtered)
    return result


@router.get("/{app_name}", response_model=ReportManifest)
def get_manifest(app_name: str, user: UserInfo = Depends(get_current_user)):
    tenant = get_tenant(user.tenant)
    if not tenant or app_name not in tenant.allowedApps:
        raise HTTPException(status_code=403, detail="Access denied to this application")
    try:
        manifest = manifest_service.get_manifest(app_name)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"No manifest found for app '{app_name}'")

    filtered = _filter_manifest(manifest, user)
    if not filtered.categories:
        raise HTTPException(status_code=403, detail="No reports available for your account")
    return filtered
