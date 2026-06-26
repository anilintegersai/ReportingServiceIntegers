import httpx
import msal
from config import settings
from models import EmbedConfig, ReportEntry

POWERBI_API = "https://api.powerbi.com/v1.0/myorg"
AUTHORITY = f"https://login.microsoftonline.com/{settings.powerbi_tenant_id}"
SCOPES = ["https://analysis.windows.net/powerbi/api/.default"]


def _get_access_token() -> str:
    app = msal.ConfidentialClientApplication(
        client_id=settings.powerbi_client_id,
        client_credential=settings.powerbi_client_secret,
        authority=AUTHORITY,
    )
    result = app.acquire_token_for_client(scopes=SCOPES)
    if "access_token" not in result:
        raise RuntimeError(f"Failed to acquire token: {result.get('error_description')}")
    return result["access_token"]


def get_embed_config(report: ReportEntry) -> EmbedConfig:
    token = _get_access_token()
    headers = {"Authorization": f"Bearer {token}"}

    workspace_id = report.powerBIWorkspaceId
    report_id = report.powerBIReportId

    with httpx.Client() as client:
        # Fetch report metadata (embedUrl, datasetId)
        meta_resp = client.get(
            f"{POWERBI_API}/groups/{workspace_id}/reports/{report_id}",
            headers=headers,
            timeout=30,
        )
        meta_resp.raise_for_status()
        meta = meta_resp.json()

        # Build generate-token request body
        body: dict = {"accessLevel": "View"}
        if report.rlsRole:
            body["identities"] = [
                {
                    "username": report.rlsUsername or "anonymous",
                    "roles": [report.rlsRole],
                    "datasets": [meta["datasetId"]],
                }
            ]

        token_resp = client.post(
            f"{POWERBI_API}/groups/{workspace_id}/reports/{report_id}/GenerateToken",
            headers=headers,
            json=body,
            timeout=30,
        )
        token_resp.raise_for_status()
        embed_token = token_resp.json()["token"]

    return EmbedConfig(
        embedToken=embed_token,
        embedUrl=meta["embedUrl"],
        reportId=report_id,
    )
