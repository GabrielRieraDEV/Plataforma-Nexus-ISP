from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Nexus ISP API"
    debug: bool = False
    database_url: str = "postgresql+psycopg://postgres:postgres@db:5432/nexus_isp"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 720
    admin_username: str = "admin"
    admin_password: str = "admin123"
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
