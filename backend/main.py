from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import embed, manifests

app = FastAPI(title="Insight Hub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(manifests.router)
app.include_router(embed.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/debug/config")
def debug_config():
    from config import settings
    import msal, httpx
    tenant = settings.powerbi_tenant_id
    client = settings.powerbi_client_id
    secret = settings.powerbi_client_secret
    # Try token acquisition
    try:
        pbi_app = msal.ConfidentialClientApplication(
            client_id=client, client_credential=secret,
            authority=f"https://login.microsoftonline.com/{tenant}",
        )
        result = pbi_app.acquire_token_for_client(["https://analysis.windows.net/powerbi/api/.default"])
        if "access_token" not in result:
            return {"config": {"tenant": tenant, "client": client, "secret_prefix": secret[:5]},
                    "token": "FAILED", "error": result.get("error_description")}
        token = result["access_token"]
        # Try Power BI call
        r = httpx.get(
            "https://api.powerbi.com/v1.0/myorg/groups/643b655f-10c9-46fb-8ee9-0e85a0b69d04/reports/ee6c80c6-be78-4d53-8e3a-a97c8bbebf61",
            headers={"Authorization": f"Bearer {token}"}, timeout=15
        )
        return {"config": {"tenant": tenant, "client": client, "secret_prefix": secret[:5]},
                "token": "OK", "pbi_status": r.status_code, "pbi_body": r.json()}
    except Exception as e:
        return {"error": str(e)}
