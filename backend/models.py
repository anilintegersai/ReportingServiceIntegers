from pydantic import BaseModel


class ReportEntry(BaseModel):
    id: str
    title: str
    description: str = ""
    powerBIReportId: str
    powerBIWorkspaceId: str
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


class ErrorResponse(BaseModel):
    error: str
