from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    gcp_project_id: str = "miriart-dev"
    gcp_region: str = "asia-northeast3"
    gcs_bucket_name: str = "miriart-bucket"
    google_application_credentials: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
