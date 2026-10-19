

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import LoginRequest
from app.models import User
from app.security import verify_password
from app.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.username == credentials.username)
        .first()
    )

    if not user or not verify_password(
        credentials.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token({
        "sub": user.username,
        "role": user.role.value
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
