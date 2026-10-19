
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.database import Base, engine, settings
from app.dependencies import get_current_user
from app.routers import (
    auth,
    employees,
    attendance,
    leaves,
    payroll,
    dashboard,
    notifications,
)



@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to WorkSphere HRMS API"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/protected")
def protected_route(
    current_user=Depends(get_current_user)
):
    return {
        "message": "Access granted",
        "username": current_user.username,
    }

app.include_router(auth.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(leaves.router, prefix="/api")
app.include_router(payroll.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")

app.include_router(employees.router, prefix="/api")