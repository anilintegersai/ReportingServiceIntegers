"""
Diagnostic script for testing Power BI embed token generation.
Run from the backend/ directory: python debug_token.py

Reads credentials from .env via config.py — no hardcoded secrets.
"""
import httpx
import msal
from config import settings

WORKSPACE_ID = "YOUR_WORKSPACE_ID"
REPORT_ID = "YOUR_REPORT_ID"

AUTHORITY = f"https://login.microsoftonline.com/{settings.powerbi_tenant_id}"


def main():
    print(f"Authenticating against tenant: {settings.powerbi_tenant_id}")
    print(f"Client ID: {settings.powerbi_client_id}")

    app = msal.ConfidentialClientApplication(
        client_id=settings.powerbi_client_id,
        client_credential=settings.powerbi_client_secret,
        authority=AUTHORITY,
    )
    result = app.acquire_token_for_client(
        scopes=["https://analysis.windows.net/powerbi/api/.default"]
    )

    if "access_token" not in result:
        print("FAILED to get token:", result.get("error_description"))
        return

    print("SUCCESS: Access token acquired.")
    token = result["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\nFetching report metadata...")
    meta_resp = httpx.get(
        f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/reports/{REPORT_ID}",
        headers=headers,
    )
    print(f"Status: {meta_resp.status_code}")
    if meta_resp.status_code != 200:
        print(meta_resp.text)
        return

    meta = meta_resp.json()
    print(f"Report: {meta.get('name')}")

    print("\nGenerating embed token...")
    token_resp = httpx.post(
        f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/reports/{REPORT_ID}/GenerateToken",
        headers=headers,
        json={"accessLevel": "View"},
    )
    print(f"Status: {token_resp.status_code}")
    if token_resp.status_code == 200:
        print("Embed token generated successfully.")
    else:
        print(token_resp.text)


if __name__ == "__main__":
    main()
