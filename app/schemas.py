

from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator
from pydantic import BaseModel, EmailStr, ConfigDict, Field


# =========================
# Authentication Schemas
# =========================

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    username: str = Field(min_length=1) 
    password: str = Field(min_length=1)
class LoginIn(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)




class LoginIn(BaseModel):
    username: str
    password: str



class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Schemas also used by the existing auth router




class RegisterIn(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)

# =========================
# Employee Schemas
# =========================

class EmployeeCreate(BaseModel):
    employee_code: str
    first_name: str
    last_name: str
    email: EmailStr
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None


class EmployeeOut(BaseModel):
    id: int
    employee_code: str
    first_name: str
    last_name: str
    email: EmailStr
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

class EmployeeCreate(BaseModel):
    user_id: int
    full_name: str
    designation: str
    department: str
    joining_date: date
    salary: float


class EmployeeResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    designation: str
    department: str
    joining_date: date
    salary: float
    status: str

    model_config = ConfigDict(from_attributes=True)

# =========================
# Attendance Schemas
# =========================

class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# =========================
# Leave Schemas
# =========================

class LeaveCreate(BaseModel):
    leave_type: Literal["SICK", "CASUAL", "PAID"]
    start_date: date
    end_date: date
    reason: str = Field(min_length=3, max_length=1000)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("End date must be on or after start date")
        return self


class LeaveReview(BaseModel):
    status: Literal["APPROVED", "REJECTED"]
    review_comment: Optional[str] = None


class LeaveDecision(BaseModel):
    status: Literal["APPROVED", "REJECTED"]


class LeaveOut(BaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str

    model_config = ConfigDict(from_attributes=True)


# =========================
# Payroll Schemas
# =========================

class PayrollCreate(BaseModel):
    employee_id: int
    basic_salary: Decimal = Field(
        ge=0, max_digits=12, decimal_places=2
    )
    deductions: Decimal = Field(
        default=Decimal("0"), ge=0, max_digits=12, decimal_places=2
    )
    bonus: Decimal = Field(
        default=Decimal("0"), ge=0, max_digits=12, decimal_places=2
    )
    month: str = Field(
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$"
    )


class PayrollOut(BaseModel):
    id: int
    employee_id: int
    basic_salary: Decimal
    deductions: Decimal
    bonus: Decimal
    month: str

    model_config = ConfigDict(from_attributes=True)


# =========================
# Notification Schemas
# =========================

class NotificationOut(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool

    model_config = ConfigDict(from_attributes=True)
