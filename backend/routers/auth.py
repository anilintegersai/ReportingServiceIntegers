from fastapi import APIRouter, HTTPException, status, Depends
from models import LoginRequest, TokenResponse, UserInfo
from services.auth_service import authenticate_user, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = authenticate_user(body.username, body.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    token = create_access_token(user.username)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserInfo)
def me(current_user: UserInfo = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout():
    # JWT is stateless — client simply discards the token
    return {"message": "Logged out"}
