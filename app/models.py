import enum
from datetime import datetime, date, timezone
from decimal import Decimal
from app.database import Base, engine
from app import models
from app.database import Base
Base.metadata.create_all(bind=engine)
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    HR = "HR"
    ADMIN = "ADMIN"


class EmployeeStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    HALF_DAY = "HALF_DAY"


class LeaveType(str, enum.Enum):
    SICK = "SICK"
    CASUAL = "CASUAL"
    PAID = "PAID"


class LeaveStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.EMPLOYEE
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now
    )

    employee: Mapped["Employee | None"] = relationship(
        back_populates="user", uselist=False
    )
    notifications: Mapped[list["Notification"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        unique=True,
        index=True,
    )
    full_name: Mapped[str] = mapped_column(String(150))
    designation: Mapped[str] = mapped_column(String(100))
    department: Mapped[str] = mapped_column(String(100))
    joining_date: Mapped[date] = mapped_column(Date)
    salary: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    status: Mapped[EmployeeStatus] = mapped_column(
        Enum(EmployeeStatus), default=EmployeeStatus.ACTIVE
    )

    user: Mapped["User"] = relationship(back_populates="employee")
    attendance_records: Mapped[list["Attendance"]] = relationship(
        back_populates="employee"
    )
    leave_requests: Mapped[list["Leave"]] = relationship(
        back_populates="employee"
    )
    payroll_records: Mapped[list["Payroll"]] = relationship(
        back_populates="employee"
    )


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (
        UniqueConstraint(
            "employee_id", "date", name="uq_attendance_employee_date"
        ),
        CheckConstraint(
            "check_out IS NULL OR check_in IS NULL OR check_out >= check_in",
            name="ck_attendance_checkout_after_checkin",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id", ondelete="RESTRICT"), index=True
    )
    check_in: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    check_out: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(AttendanceStatus), default=AttendanceStatus.PRESENT
    )

    employee: Mapped["Employee"] = relationship(
        back_populates="attendance_records"
    )


class Leave(Base):
    __tablename__ = "leaves"
    __table_args__ = (
        CheckConstraint(
            "end_date >= start_date", name="ck_leave_valid_date_range"
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id", ondelete="RESTRICT"), index=True
    )
    leave_type: Mapped[LeaveType] = mapped_column(Enum(LeaveType))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    reason: Mapped[str] = mapped_column(Text)
    status: Mapped[LeaveStatus] = mapped_column(
        Enum(LeaveStatus), default=LeaveStatus.PENDING
    )
    reviewed_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now
    )

    employee: Mapped["Employee"] = relationship(
        back_populates="leave_requests"
    )


class Payroll(Base):
    __tablename__ = "payroll"
    __table_args__ = (
        UniqueConstraint(
            "employee_id", "month", name="uq_payroll_employee_month"
        ),
        CheckConstraint(
            "basic_salary >= 0 AND deductions >= 0 AND bonus >= 0",
            name="ck_payroll_nonnegative_amounts",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id", ondelete="RESTRICT"), index=True
    )
    basic_salary: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    deductions: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=Decimal("0.00")
    )
    bonus: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=Decimal("0.00")
    )
    net_salary: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    month: Mapped[str] = mapped_column(String(7), index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now
    )

    employee: Mapped["Employee"] = relationship(
        back_populates="payroll_records"
    )


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(150))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now
    )

    user: Mapped["User"] = relationship(
        back_populates="notifications"
    )