from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

MANIFESTS_DIR = Path(__file__).parent / "manifests"


class Settings(BaseSettings):
    powerbi_tenant_id: str = ""
    powerbi_client_id: str = ""
    powerbi_client_secret: str = ""

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / ".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
