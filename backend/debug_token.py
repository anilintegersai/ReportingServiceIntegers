"""Run this to diagnose the 401 error from Power BI."""
import httpx
import msal
import json

TENANT_ID = "183883b5-3564-446d-8fea-646a171d3518"
CLIENT_ID = "78c40f08-9402-43d2-936c-55bf50691046"
CLIENT_SECRET = "J5n8Q~2pGw_SjsTeHP7oEB5tYNwiUI~qqbl_JaBS"
WORKSPACE_ID = "643b655f-10c9-46fb-8ee9-0e85a0b69d04"
REPORT_ID = "ee6c80c6-be78-4d53-8e3a-a97c8bbebf61"

print(f"Authenticating against tenant: {TENANT_ID}")
print("Step 1: Acquiring access token from Azure AD...")
app = msal.ConfidentialClientApplication(
    client_id=CLIENT_ID,
    client_credential=CLIENT_SECRET,
    authority=f"https://login.microsoftonline.com/{TENANT_ID}",
)
result = app.acquire_token_for_client(scopes=["https://analysis.windows.net/powerbi/api/.default"])

if "access_token" not in result:
    print("FAILED to get token:")
    print(json.dumps(result, indent=2))
else:
    print("SUCCESS: Access token acquired.")
    token = result["access_token"]
    print(f"Token (first 60 chars): {token[:60]}...")

    headers = {"Authorization": f"Bearer {token}"}

    print("\nStep 2: Fetching report metadata...")
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/reports/{REPORT_ID}"
    resp = httpx.get(url, headers=headers)
    print(f"Status: {resp.status_code}")
    meta = resp.json()
    print(f"Report name: {meta.get('name')}")
    print(f"Dataset ID: {meta.get('datasetId')}")

    if resp.status_code == 200:
        print("\nStep 3: Generating embed token...")
        body = {"accessLevel": "View"}
        token_url = f"https://api.powerbi.com/v1.0/myorg/groups/{WORKSPACE_ID}/reports/{REPORT_ID}/GenerateToken"
        token_resp = httpx.post(token_url, headers=headers, json=body)
        print(f"Status: {token_resp.status_code}")
        print(f"Response: {token_resp.text}")
