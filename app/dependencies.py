
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.jwt_handler import decode_access_token
from app.database import get_db
from app.models import User, UserRole
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        bearer_scheme
    ),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        username = payload.get("sub")

        if not username or not isinstance(username, str):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.scalar(
        select(User).where(User.username == username)
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def require_roles(*roles: UserRole):
    allowed_roles = {
        role.value if isinstance(role, UserRole)
        else str(role).upper()
        for role in roles
    }

    def role_checker(
        user: User = Depends(get_current_user),
    ) -> User:
        actual_role = user.role

        if isinstance(actual_role, UserRole):
            actual_role = actual_role.value
        else:
            actual_role = str(actual_role).upper()

        if actual_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Permission denied. Required role: "
                    f"{', '.join(sorted(allowed_roles))}. "
                    f"Your role: {actual_role}."
                ),
            )

        return user

    return role_checker
