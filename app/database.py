
import os
from types import SimpleNamespace

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables before reading DATABASE_URL.
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:YOUR_PASSWORD@localhost:5432/worksphere_hrms",
)


settings = SimpleNamespace(
    APP_NAME="WorkSphere HRMS",
    APP_VERSION="1.0.0",
    FRONTEND_URL=os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    ),
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
