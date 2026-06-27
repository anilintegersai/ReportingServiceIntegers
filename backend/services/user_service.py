import json
from models import UserInfo, Tenant
from config import USERS_FILE, TENANTS_FILE


def _load_users() -> list[dict]:
    return json.loads(USERS_FILE.read_text(encoding="utf-8"))


def _load_tenants() -> list[dict]:
    return json.loads(TENANTS_FILE.read_text(encoding="utf-8"))


def get_user_by_username(username: str) -> dict | None:
    return next((u for u in _load_users() if u["username"] == username), None)


def get_tenant(tenant_id: str) -> Tenant | None:
    raw = next((t for t in _load_tenants() if t["id"] == tenant_id), None)
    return Tenant(**raw) if raw else None


def to_user_info(raw: dict) -> UserInfo:
    return UserInfo(
        id=raw["id"],
        username=raw["username"],
        displayName=raw["displayName"],
        email=raw["email"],
        tenant=raw["tenant"],
        allowedReports=raw["allowedReports"],
    )
