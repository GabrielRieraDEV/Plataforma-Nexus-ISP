from fastapi import APIRouter, HTTPException, status

from app.core import settings
from app.schemas import LoginRequest, TokenResponse
from app.security import create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    if (
        payload.username != settings.admin_username
        or payload.password != settings.admin_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales invalidas.",
        )
    return TokenResponse(access_token=create_access_token(payload.username))
