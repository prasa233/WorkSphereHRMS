
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Employee
from app.schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


@router.post("/", response_model=EmployeeResponse)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = getattr(current_user.role, "value", current_user.role)

    # Only authorized roles can create employee records.
    if role not in ("ADMIN", "HR", "EMPLOYEE"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    # EMPLOYEE users can create only their own linked profile.
    if role == "EMPLOYEE":
        existing_employee = (
            db.query(Employee)
            .filter(Employee.user_id == current_user.id)
            .first()
        )

        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Your employee profile already exists",
            )

        # Build the profile using only trusted identity data.
        # This assumes Employee.user_id exists and other required
        # Employee fields are nullable or have database defaults.
        employee = Employee(
            user_id=current_user.id,
        )

    else:
        # ADMIN and HR may create employee records.
        # Adapt this mapping to the required fields in your model.
        employee = Employee(
            **employee_data.model_dump(exclude={"user_id"})
        )

    db.add(employee)

    try:
        db.commit()
        db.refresh(employee)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create employee record",
        )

    return employee
