import json
from pathlib import Path
from models import ReportManifest, ReportEntry
from config import MANIFESTS_DIR


def get_manifest(app_name: str) -> ReportManifest:
    path = MANIFESTS_DIR / f"{app_name}.json"
    if not path.exists():
        raise FileNotFoundError(f"Manifest not found for app: {app_name}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return ReportManifest(**data)


def get_available_apps() -> list[ReportManifest]:
    if not MANIFESTS_DIR.exists():
        return []
    apps = []
    for f in MANIFESTS_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            apps.append(ReportManifest(**data))
        except Exception:
            pass
    return apps


def get_report(app_name: str, report_id: str) -> ReportEntry | None:
    manifest = get_manifest(app_name)
    for category in manifest.categories:
        for report in category.reports:
            if report.id == report_id:
                return report
    return None
