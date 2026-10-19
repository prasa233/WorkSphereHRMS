from getpass import getpass

from sqlalchemy import select

from app.database import Base, engine, SessionLocal
from app.models import User, UserRole
from app.security import hash_password


def main():
    Base.metadata.create_all(bind=engine)

    username = input("Admin username: ").strip()
    email = input("Admin email: ").strip().lower()
    password = getpass("Admin password (minimum 12 characters): ")

    if len(password) < 12:
        raise SystemExit("Password must contain at least 12 characters.")

    with SessionLocal() as db:
        existing = db.scalar(
            select(User).where(
                (User.username == username) | (User.email == email)
            )
        )

        if existing:
            raise SystemExit("Username or email already exists.")

        admin = User(
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role=UserRole.ADMIN,
        )

        db.add(admin)
        db.commit()

    print("Administrator created successfully.")


if __name__ == "__main__":
    main()