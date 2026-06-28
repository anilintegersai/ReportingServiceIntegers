from pydantic import BaseModel


# ── Power BI ──────────────────────────────────────────────────────────────────

class ReportEntry(BaseModel):
    id: str
    title: str
    description: str = ""
    powerBIReportId: str
    powerBIWorkspaceId: str
    embedType: str = "report"        # "report" or "dashboard"
    rlsRole: str | None = None
    rlsUsername: str | None = None
    tags: list[str] = []


class ReportCategory(BaseModel):
    name: str
    icon: str = "bi-bar-chart"
    reports: list[ReportEntry] = []


class ReportManifest(BaseModel):
    appName: str
    appIcon: str = "bi-grid"
    categories: list[ReportCategory] = []


class EmbedConfig(BaseModel):
    embedToken: str
    embedUrl: str
    reportId: str
    embedType: str = "report"


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserInfo(BaseModel):
    id: str
    username: str
    displayName: str
    email: str
    tenant: str
    allowedReports: dict[str, list[str]]


# ── Tenant ────────────────────────────────────────────────────────────────────

class Tenant(BaseModel):
    id: str
    displayName: str
    allowedApps: list[str]
