WorkSphere - HR Management System (HRMS)
Overview
WorkSphere is a full-stack Human Resource Management System (HRMS) designed to streamline employee management, attendance tracking, leave processing, payroll management, and HR operations.

The project simulates a real-world enterprise HR platform with role-based access control, secure authentication, analytics dashboards, and workflow automation.

Project Goals
Implement enterprise-level HR workflows
Practice role-based authentication and authorization
Build scalable REST APIs using FastAPI
Develop a modern React frontend
Manage employee lifecycle efficiently
Gain experience with data-driven dashboards and reporting
Technology Stack
Backend
FastAPI
SQLAlchemy
PostgreSQL / SQLite
Pydantic
JWT Authentication
Alembic Migrations
Frontend
React.js
React Router
Axios
Context API / Redux
Material UI / Tailwind CSS
Chart.js / Recharts
Security
JWT Authentication
Password Hashing
Role-Based Access Control (RBAC)
Environment Variables
Input Validation
User Roles
Employee
View profile
Mark attendance
Apply for leave
View leave history
View payroll details
Receive notifications
HR
Manage employees
Approve/reject leave requests
Track attendance
Generate payroll
View HR dashboard
Admin
Full system access
Manage users and roles
HR operations oversight
Dashboard analytics access
Database Schema
Users Table
Field	Type
id	Integer
username	String
email	String
hashed_password	String
role	EMPLOYEE / HR / ADMIN
created_at	DateTime
Employees Table
Field	Type
id	Integer
user_id	Foreign Key
full_name	String
designation	String
department	String
joining_date	Date
salary	Decimal
status	ACTIVE / INACTIVE
Attendance Table
Field	Type
id	Integer
employee_id	Foreign Key
check_in	DateTime
check_out	DateTime
date	Date
status	PRESENT / ABSENT / HALF_DAY
Leaves Table
Field	Type
id	Integer
employee_id	Foreign Key
leave_type	SICK / CASUAL / PAID
start_date	Date
end_date	Date
reason	Text
status	PENDING / APPROVED / REJECTED
Payroll Table
Field	Type
id	Integer
employee_id	Foreign Key
basic_salary	Decimal
deductions	Decimal
bonus	Decimal
net_salary	Decimal
month	String
created_at	DateTime
Notifications Table
Field	Type
id	Integer
user_id	Foreign Key
title	String
message	Text
is_read	Boolean
created_at	DateTime
Phase 1 Modules
Module 1: User Authentication & Roles
Objective
Implement secure authentication and authorization.

Features
User Registration
User Login
JWT Token Authentication
Password Hashing
Role-Based Access Control
Protected API Routes
Frontend
Login Page
Authentication Context
Role-Based Dashboard Redirect
Module 2: Employee Management
Objective
Manage employee records and profiles.

Features
Add Employee
Update Employee
View Employee Details
Employee Search
Department Filtering
Employee Status Tracking
Frontend
Employee List Page
Employee Profile
Add Employee Form
Edit Employee Form
Module 3: Attendance Management
Objective
Track employee attendance and working hours.

Features
Check In
Check Out
Attendance History
Auto Working Hours Calculation
Attendance Status Management
Frontend
Attendance Dashboard
Check-In Button
Check-Out Button
Attendance History Table
Module 4: Leave Management
Objective
Provide leave request workflows.

Features
Leave Application
Leave Approval
Leave Rejection
Leave History
Leave Status Tracking
Frontend
Leave Application Form
Leave Status Page
Leave History Table
Module 5: Payroll Management
Objective
Manage employee salary processing.

Features
Payroll Generation
Salary Calculations
Deductions Management
Bonus Management
Payslip Download (Optional)
Frontend
Payroll Dashboard
Salary Details View
Payslip Viewer
Module 6: Dashboard & Analytics
Objective
Provide actionable HR insights.

Features
Total Employees
Active Employees
Attendance Summary
Leave Statistics
Payroll Overview
KPI Cards
Charts and Reports
Frontend
Dashboard Cards
Attendance Charts
Leave Analytics
Payroll Graphs
Module 7: Notifications System
Objective
Keep users updated with important events.

Features
Leave Approval Notifications
Leave Rejection Notifications
Attendance Alerts
Payroll Notifications
Read/Unread Status
Frontend
Notification Bell
Notification Dropdown
Notification History Page
API Structure
Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
Employees
POST   /api/employees
GET    /api/employees
GET    /api/employees/{id}
PATCH  /api/employees/{id}
DELETE /api/employees/{id}
Attendance
POST   /api/attendance/check-in
POST   /api/attendance/check-out
GET    /api/attendance
Leaves
POST   /api/leaves
GET    /api/leaves
PATCH  /api/leaves/{id}/approve
PATCH  /api/leaves/{id}/reject
Payroll
POST   /api/payroll/generate
GET    /api/payroll
GET    /api/payroll/{id}
Dashboard
GET    /api/dashboard/summary
GET    /api/dashboard/analytics
Notifications
GET    /api/notifications
PATCH  /api/notifications/{id}/read
Security Requirements
JWT Authentication
Secure Password Hashing
Environment Variables
RBAC Authorization
Protected Routes
Input Validation using Pydantic
Database Constraints
Error Handling
Project Deliverables
✅ Authentication System

✅ Employee Management

✅ Attendance Tracking

✅ Leave Management

✅ Payroll Processing

✅ Dashboard & Analytics

✅ Notification System

✅ FastAPI Backend

✅ React Frontend

✅ Role-Based Access Control

✅ Database Design

✅ RESTful API Architecture

Future Enhancements
Email Notifications
Multi-Factor Authentication
Performance Reviews
Recruitment Module
Asset Management
Employee Self-Service Portal
Organization Hierarchy
Mobile Application
AI-Based Workforce Analytics


