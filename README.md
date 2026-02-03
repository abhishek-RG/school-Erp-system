# school-Erp-system
# School ERP System – Finance Resource Planning (Admin Module)

## 📌 Overview
This project is a **School ERP System** with an initial and strong focus on **Finance Resource Planning** for school administration.

The goal is to build a **centralized, transparent, and data-driven finance system** that helps school management:
- Track all income sources
- Track all expenses (department-wise)
- Manage salaries and operational costs
- Plan budgets
- Generate monthly financial reports
- Compare **Budget vs Actual Spending**

This module is being built **admin-first**, with scalability for future student, teacher, and parent modules.

---

## 🎯 Core Objective
Create a **single source of truth** for school finances that enables:
- Better financial control
- Clear accountability
- Smarter budgeting decisions
- Audit-ready financial records

---

## 🧩 Module Scope (MVP)

### 1️⃣ Income Management
Tracks all incoming funds:
- Tuition fees
- Admission fees
- Transport fees
- Examination fees
- Donations / grants
- Miscellaneous income

**Key Attributes**
- Income source
- Amount
- Date
- Department / Student (optional)
- Payment mode (Cash / UPI / Bank)
- Reference ID

---

### 2️⃣ Expense Management
Tracks all operational and capital expenses:
- Salaries (teachers, admin staff, support staff)
- Electricity, water, internet
- Lab equipment
- Maintenance & repairs
- Events and activities
- Transport and fuel
- Miscellaneous expenses

**Key Feature**
- Fully configurable **expense categories**
- Mandatory department tagging for reporting

---

### 3️⃣ Salary & Payroll (Phase 1 – Basic)
- Monthly salary entry
- Role-based salary tracking
- Paid / pending status
- Auto-linked to expense reports

> Advanced payroll features will be added in later phases.

---

### 4️⃣ Budget Planning
Budget allocation per:
- Department
- Month / Year

**Capabilities**
- Planned budget definition
- Budget approval by super admin
- Budget locking
- Used for budget vs actual analysis

---

### 5️⃣ Reports & Analytics (Critical Module)

#### 📊 Monthly Expense Report
- Month-wise summary
- Department-wise breakdown
- Category-wise analysis

#### 📈 Budget vs Actual Report
- Planned budget vs real spending
- Variance calculation
- Over-budget / under-budget indicators

#### 💰 Income vs Expense Summary
- Monthly surplus or deficit
- Financial health overview

---

## 👥 Roles & Access Control

| Role | Permissions |
|----|----|
| Super Admin | Full system access |
| Finance Admin | Income, expense, budgets, reports |
| Department Head | View department budget & spending |
| Auditor | Read-only access |

---

## 🗄️ High-Level Database Design

Core entities:
- Users
- Departments
- Income Sources
- Incomes
- Expense Categories
- Expenses
- Budgets
- Salaries
- Monthly Reports (cached/derived)

> Reports are **computed**, not manually entered.

---

## ⚙️ Tech Stack

### Backend
- Django
- Django REST Framework
- SQLlite(For Dev)

### Frontend (Planned)
- React / Next.js
- Chart.js / Recharts

### Authentication
- JWT-based authentication
- Role-based access control

---

## 🧑‍💻 Development Workflow (Team Collaboration)

### Branch Strategy
- `main` → stable production-ready code
- `dev` → active development
- `feature/<module-name>` → individual features

Examples:
- `feature/finance-income`
- `feature/expense-management`
- `feature/budget-module`
- `feature/reports-engine`

### Contribution Rules
- One feature per branch
- Small, focused pull requests
- Mandatory code review before merge
- No direct pushes to `main`

---

## 🛠️ Execution Roadmap

### Phase 1 – Foundation
- Admin authentication
- Department management
- Income CRUD
- Expense CRUD

### Phase 2 – Intelligence
- Budget planning module
- Monthly aggregation logic
- Budget vs actual computation

### Phase 3 – Experience & Trust
- Admin dashboards
- Report export (Excel / PDF)
- Audit logs and tracking

---

## 🚀 Immediate Priorities (Next 7 Days)
1. Department model & APIs  
2. Income & Expense models  
3. Monthly financial aggregation logic  
4. Budget vs Actual calculation (API level)

> UI comes later. Financial logic comes first.

---

## 📌 Vision
This ERP aims to become a **scalable, production-grade financial system for schools**, enabling better governance, transparency, and data-driven decision-making.

---

## 🤝 Contributors
This project is collaboratively built by a team using best practices in:
- Software engineering
- System design
- Financial modeling

---

## 📄 License
To be defined.

---

## 📁 Project Structure

The project has been organized with a clean separation between frontend and backend:

```
school-Erp-system/
├── backend/                          # Django Backend
│   ├── config/                       # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py              # Main settings with JWT, CORS, etc.
│   │   ├── urls.py                  # Main URL routing
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/                        # Django applications
│   │   ├── authentication/          # User authentication & JWT
│   │   │   ├── models.py           # Custom User model with roles
│   │   │   ├── serializers.py      # User & JWT serializers
│   │   │   ├── views.py            # Login, register, profile views
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── departments/             # Department management
│   │   │   ├── models.py           # Department model
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── finance/                 # Income & Expense Management
│   │   │   ├── models.py           # Income, Expense, Categories
│   │   │   ├── serializers.py
│   │   │   ├── views.py            # CRUD + Approval workflow
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── budget/                  # Budget Planning
│   │   │   ├── models.py           # Budget allocation & tracking
│   │   │   ├── serializers.py
│   │   │   ├── views.py            # Budget approval & locking
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── salary/                  # Payroll Management
│   │   │   ├── models.py           # Employee & Salary records
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   └── reports/                 # Financial Analytics
│   │       ├── views.py            # Monthly reports, Budget vs Actual
│   │       └── urls.py
│   ├── manage.py
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example               # Environment variables template
│   └── .gitignore
│
├── frontend/                        # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/            # Shared components
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── finance/           # Finance module components
│   │   │   ├── budget/            # Budget module components
│   │   │   ├── reports/           # Reports components
│   │   │   └── salary/            # Salary components
│   │   ├── pages/                 # Page components
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── finance/
│   │   │   │   ├── IncomeList.jsx
│   │   │   │   └── ExpenseList.jsx
│   │   │   ├── budget/
│   │   │   │   └── BudgetList.jsx
│   │   │   ├── salary/
│   │   │   │   └── SalaryList.jsx
│   │   │   └── reports/
│   │   │       └── ReportsDashboard.jsx
│   │   ├── services/              # API services
│   │   │   ├── api.js            # Axios instance with interceptors
│   │   │   ├── authService.js    # Authentication API calls
│   │   │   ├── financeService.js # Finance API calls
│   │   │   └── reportsService.js # Reports API calls
│   │   ├── context/              # State management
│   │   │   └── authStore.js      # Zustand auth store
│   │   ├── utils/                # Utility functions
│   │   ├── assets/               # Static assets
│   │   ├── App.jsx               # Main App component with routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js
│   └── .gitignore
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or use SQLite for development)
- Redis (for Celery tasks)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at `http://localhost:8000`
   Admin panel: `http://localhost:8000/admin`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (JWT)
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile

### Departments
- `GET /api/departments/` - List all departments
- `POST /api/departments/` - Create department
- `GET /api/departments/{id}/` - Get department details
- `PATCH /api/departments/{id}/` - Update department

### Finance
- `GET /api/finance/incomes/` - List incomes
- `POST /api/finance/incomes/` - Record income
- `GET /api/finance/expenses/` - List expenses
- `POST /api/finance/expenses/` - Record expense
- `POST /api/finance/expenses/{id}/approve/` - Approve expense
- `POST /api/finance/expenses/{id}/mark_paid/` - Mark as paid

### Budget
- `GET /api/budget/` - List budgets
- `POST /api/budget/` - Create budget
- `POST /api/budget/{id}/approve/` - Approve budget
- `POST /api/budget/{id}/lock/` - Lock budget

### Salary
- `GET /api/salary/employees/` - List employees
- `POST /api/salary/employees/` - Add employee
- `GET /api/salary/salaries/` - List salary records
- `POST /api/salary/salaries/` - Create salary record
- `POST /api/salary/salaries/{id}/mark_paid/` - Mark salary as paid

### Reports
- `GET /api/reports/monthly-expense/` - Monthly expense report
- `GET /api/reports/budget-vs-actual/` - Budget variance analysis
- `GET /api/reports/income-vs-expense/` - Income vs expense summary
- `GET /api/reports/department-summary/` - Department-wise summary

---

## 📊 Current Development Status

### ✅ Completed
- [x] Complete backend file structure with Django
- [x] Custom User model with role-based access
- [x] Department management module
- [x] Finance module (Income & Expense tracking)
- [x] Budget planning module with approval workflow
- [x] Salary & Payroll management
- [x] Financial reports & analytics engine
- [x] JWT authentication setup
- [x] Complete frontend file structure with React + Vite
- [x] API service layer with axios
- [x] Authentication state management (Zustand)
- [x] Responsive layout with Tailwind CSS

### 🚧 In Progress
- [ ] Implement all frontend pages (currently placeholders)
- [ ] Data visualization charts for reports
- [ ] Expense approval workflow UI
- [ ] Budget tracking dashboard
- [ ] Export reports to PDF/Excel

### 📋 Next Steps
1. Run migrations and test all backend models
2. Populate sample data for testing
3. Implement frontend pages for each module
4. Create chart components using Recharts
5. Add form validation with React Hook Form + Zod
6. Implement real-time updates with React Query
7. Add comprehensive error handling
8. Write unit tests for critical functions

---

## 🎨 Tech Stack Summary

### Backend
- **Framework:** Django 4.2 + Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** PostgreSQL (production), SQLite (development)
- **Task Queue:** Celery + Redis
- **API Documentation:** DRF Browsable API

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod

### DevOps
- **Version Control:** Git
- **Development:** Hot reload for both frontend and backend

---

## 🔐 Default User Roles

1. **SUPER_ADMIN** - Full system access
2. **FINANCE_ADMIN** - Income, expense, budgets, reports
3. **DEPARTMENT_HEAD** - View department budget & spending
4. **AUDITOR** - Read-only access

---

## 💡 Key Features

### Financial Management
- ✅ Track all income sources with categorization
- ✅ Record expenses with department tagging
- ✅ Multi-level expense approval workflow
- ✅ Payment mode tracking (Cash, UPI, Bank, Cheque)
- ✅ Receipt/document upload support

### Budget Planning
- ✅ Yearly and monthly budget allocation
- ✅ Budget approval and locking mechanism
- ✅ Real-time budget utilization tracking
- ✅ Budget vs. actual variance analysis

### Reporting & Analytics
- ✅ Monthly expense reports (department & category-wise)
- ✅ Income vs. Expense summary
- ✅ Budget variance reports
- ✅ Department-wise financial summaries

### Payroll Management
- ✅ Employee records management
- ✅ Monthly salary tracking
- ✅ Salary breakdown (base, allowances, deductions)
- ✅ Payment status tracking

---

## 📞 Support & Contact
For questions or issues, please open an issue in the repository.

---

**Last Updated:** February 3, 2026  
**Project Status:** Core structure complete, frontend implementation in progress
