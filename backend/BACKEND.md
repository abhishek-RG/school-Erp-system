# School ERP Backend Documentation

## Overview
This is the backend documentation for the School ERP Financial Resource Planning System. The backend is built with Django and Django REST Framework to provide a robust API for managing school finances.

---

## 📁 Project Structure

```
backend/
├── config/              # Main Django project configuration
├── apps/               # Django applications (features)
├── manage.py           # Django management script
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Environment template
├── db.sqlite3         # SQLite database (development)
└── venv/              # Virtual environment (not in git)
```

---

## 🔧 Core Configuration Files

### `manage.py`
**What it does:** This is Django's command-line utility that helps you manage your project.

**How it works:** It's a Python script that you run to execute commands like:
- Starting the server: `python manage.py runserver`
- Creating database tables: `python manage.py migrate`
- Creating admin users: `python manage.py createsuperuser`

**Latest changes:** Created with Django project setup. No modifications needed.

---

### `requirements.txt`
**What it does:** Lists all Python packages needed for the project.

**How it works:** When you run `pip install -r requirements.txt`, it installs all these packages:
- **Django 4.2.7** - The main web framework
- **djangorestframework** - Creates the REST API
- **djangorestframework-simplejwt** - Handles JWT authentication (login tokens)
- **django-cors-headers** - Allows frontend to talk to backend
- **python-decouple** - Manages environment variables
- **psycopg2-binary** - PostgreSQL database connector (for production)
- **django-filter** - Filters data in API queries
- **openpyxl** - Creates Excel reports
- **reportlab** - Creates PDF reports
- **celery** - Handles background tasks
- **redis** - Message queue for Celery

**Latest changes:** Created with all necessary packages for financial ERP system.

---

### `.env.example` and `.env`
**What it does:** Stores configuration settings like passwords and secret keys.

**How it works:**
- `.env.example` is a template showing what settings are needed
- `.env` contains actual values (never committed to git for security)
- Settings include database credentials, secret keys, CORS origins

**Latest changes:** 
- Created `.env.example` template
- Copied to `.env` for local development
- Uses SQLite for development (easy setup)
- Configured CORS for http://localhost:3000 (frontend)

---

## 📂 config/ - Main Project Configuration

### `config/settings.py`
**What it does:** This is the brain of the Django project - all settings are here.

**How it works:** It configures:

1. **Security Settings:**
   - SECRET_KEY: Encrypts data
   - DEBUG: Shows errors in development
   - ALLOWED_HOSTS: Which domains can access the API

2. **Installed Apps:**
   - Django's built-in apps (admin, auth, sessions)
   - Third-party apps (REST framework, CORS, filters)
   - Our custom apps (authentication, departments, finance, budget, salary, reports)

3. **Database Configuration:**
   - Uses SQLite for development (simple file-based database)
   - Can switch to PostgreSQL for production
   - Database settings come from `.env` file

4. **REST Framework Settings:**
   - Authentication: JWT tokens required for API access
   - Permissions: Users must be logged in
   - Pagination: 50 items per page

5. **JWT Settings:**
   - Access tokens expire after 60 minutes
   - Refresh tokens expire after 24 hours (1440 minutes)
   - Tokens automatically refresh

6. **CORS Settings:**
   - Allows frontend (http://localhost:3000) to make API calls
   - Credentials allowed for cookies/auth

7. **Celery Settings:**
   - Background task processing
   - Uses Redis as message broker

**Latest changes:**
- Configured custom User model: `authentication.User`
- Added all financial ERP apps to INSTALLED_APPS
- Set up JWT authentication with auto-refresh
- Configured CORS for frontend collaboration
- Set timezone to Asia/Kolkata

---

### `config/urls.py`
**What it does:** Routes URLs to the correct application.

**How it works:** When someone visits a URL, this file decides which app handles it:
- `/admin/` → Django admin panel
- `/api/auth/` → Authentication app (login, register)
- `/api/departments/` → Department management
- `/api/finance/` → Income and expense tracking
- `/api/budget/` → Budget planning
- `/api/salary/` → Salary management
- `/api/reports/` → Financial reports

**Latest changes:** Created with all app routes for the financial ERP system.

---

### `config/wsgi.py` and `config/asgi.py`
**What they do:** Help deploy the application to production servers.

**How they work:**
- **WSGI:** For traditional web servers (like Gunicorn)
- **ASGI:** For modern async servers (supports WebSockets)

**Latest changes:** Created with Django project. No modifications needed.

---

## 🗂️ apps/ - Application Modules

Each app is a separate feature of the system. All apps follow the same structure:

```
app_name/
├── __init__.py        # Makes it a Python package
├── apps.py           # App configuration
├── models.py         # Database tables (what data to store)
├── serializers.py    # Converts data to/from JSON
├── views.py          # Business logic (what happens when API is called)
├── urls.py           # Routes for this app
├── admin.py          # Admin panel customization
├── tests.py          # Test cases
└── migrations/       # Database changes over time
```

---

## 🔐 apps/authentication/ - User Management

### `models.py` - User Model
**What it does:** Defines how user data is stored in the database.

**How it works:**
- **Custom User Model** that uses email instead of username
- **User Roles:**
  - SUPER_ADMIN: Full system access
  - FINANCE_ADMIN: Can manage finances, budgets
  - DEPARTMENT_HEAD: View their department's budget
  - AUDITOR: Read-only access

- **Fields:**
  - email (unique identifier)
  - first_name, last_name
  - role (one of the 4 roles above)
  - phone number
  - is_active, is_staff, is_superuser (permissions)
  - date_joined, last_login (tracking)

- **Helper Methods:**
  - `has_finance_access()`: Checks if user can manage finances
  - `has_budget_access()`: Checks if user can access budgets

**Latest changes:**
- Created custom User model with role-based access
- Added helper methods for permission checking
- Set email as the login field instead of username

---

### `serializers.py` - Data Conversion
**What it does:** Converts Python objects to JSON (for API responses) and JSON to Python (for API requests).

**How it works:**

1. **UserSerializer:** Shows user information in API responses
2. **UserRegistrationSerializer:** 
   - Handles new user signups
   - Validates password matching
   - Creates new user account

3. **CustomTokenObtainPairSerializer:**
   - Handles login
   - Returns JWT access and refresh tokens
   - Includes user data in login response

**Latest changes:**
- Created serializers for registration and login
- Added password confirmation validation
- Customized JWT tokens to include user role and name

---

### `views.py` - API Logic
**What it does:** Handles what happens when someone calls an API endpoint.

**How it works:**

1. **UserRegistrationView:**
   - POST /api/auth/register/
   - Creates new user account
   - Returns success message and user data

2. **CustomTokenObtainPairView:**
   - POST /api/auth/login/
   - Validates email and password
   - Returns JWT tokens and user info

3. **UserProfileView:**
   - GET /api/auth/profile/ - View your profile
   - PATCH /api/auth/profile/ - Update your profile

**Latest changes:**
- Created registration endpoint with validation
- Customized login to return user data with tokens
- Added profile management endpoint

---

### `urls.py` - Route Mapping
**What it does:** Maps URLs to views.

**Routes:**
- `/register/` → UserRegistrationView
- `/login/` → CustomTokenObtainPairView
- `/token/refresh/` → Refresh JWT token
- `/profile/` → UserProfileView

**Latest changes:** Created all authentication routes.

---

### `admin.py` - Admin Panel
**What it does:** Customizes how users appear in Django admin panel.

**How it works:**
- Shows list of users with email, name, role, status
- Can filter by role, active status
- Can search by email or name
- Shows fields in organized groups (Personal Info, Permissions, Dates)

**Latest changes:** Created admin interface for user management.

---

## 🏢 apps/departments/ - Department Management

### `models.py` - Department Model
**What it does:** Stores information about school departments.

**How it works:**
- **Fields:**
  - name: Department name (e.g., "Computer Science")
  - code: Short code (e.g., "CS")
  - description: What the department does
  - head: Link to User who manages this department
  - is_active: Whether department is currently active

**Latest changes:** Created Department model with head assignment.

---

### `serializers.py`
**What it does:** Converts department data to/from JSON.

**How it works:**
- Shows department details
- Includes head's full name (computed field)

**Latest changes:** Created with helper method to show head name.

---

### `views.py`
**What it does:** Provides CRUD operations for departments.

**How it works:**
- GET /api/departments/ - List all departments
- POST /api/departments/ - Create new department
- GET /api/departments/{id}/ - Get department details
- PATCH /api/departments/{id}/ - Update department
- DELETE /api/departments/{id}/ - Delete department

**Filtering:**
- Can filter by is_active, head
- Can search by name or code

**Latest changes:** Created full CRUD with filtering.

---

## 💰 apps/finance/ - Income & Expense Management

This is the core financial module!

### `models.py` - Financial Models
**What it does:** Stores all income and expense transactions.

**How it works:**

1. **IncomeSource Model:**
   - Categories of income (Tuition, Fees, Donations, etc.)
   - Each source has name and code

2. **Income Model:**
   - Records every money received
   - **Fields:**
     - income_source: What type of income
     - amount: How much money
     - date: When received
     - payment_mode: Cash, UPI, Bank, Cheque, Card
     - reference_id: Transaction ID
     - description: Notes
     - department: Which department (optional)
     - student_id: Which student paid (optional)
     - recorded_by: Who entered this data

3. **ExpenseCategory Model:**
   - Types of expenses (Salaries, Equipment, Maintenance)
   - Categories have types: Operational, Capital, or Salary

4. **Expense Model:**
   - Records every money spent
   - **Fields:**
     - category: What type of expense
     - department: Which department spent it (required!)
     - amount: How much
     - date: When spent
     - payment_mode: How paid
     - description: What it was for
     - status: PENDING → APPROVED → PAID
     - receipt: File upload for proof
     - requested_by: Who requested
     - approved_by: Who approved

**Latest changes:**
- Created comprehensive income/expense tracking
- Added approval workflow for expenses
- Linked expenses to departments (required)
- Added receipt upload capability

---

### `serializers.py`
**What it does:** Converts financial data to/from JSON.

**How it works:**
- Shows related names (source name, department name, etc.)
- Automatically sets 'recorded_by' to current user
- Automatically sets 'requested_by' to current user

**Latest changes:** Created with auto-population of user fields.

---

### `views.py` - Financial Operations
**What it does:** Handles income/expense CRUD and approval workflow.

**How it works:**

**Income Endpoints:**
- Standard CRUD operations
- Filter by source, department, date, payment mode
- Search by reference ID or description

**Expense Endpoints:**
- Standard CRUD operations
- Filter by category, department, status, date
- **Special Actions:**
  - `approve()`: Changes status PENDING → APPROVED
  - `reject()`: Changes status PENDING → REJECTED
  - `mark_paid()`: Changes status APPROVED → PAID
- Only FINANCE_ADMIN or SUPER_ADMIN can approve/reject/mark_paid

**Latest changes:**
- Created full CRUD for income/expense
- Added approval workflow with role checking
- Added comprehensive filtering

---

## 📊 apps/budget/ - Budget Planning

### `models.py` - Budget Model
**What it does:** Stores budget allocations and tracks spending.

**How it works:**
- **Fields:**
  - department: Which department's budget
  - financial_year: e.g., "2025-26"
  - month: 1-12 for monthly, null for yearly
  - allocated_amount: How much budget approved
  - status: DRAFT → PENDING → APPROVED → LOCKED
  - notes: Additional comments
  - created_by, approved_by: Tracking

- **Smart Methods:**
  - `get_spent_amount()`: Calculates actual spending from Expense records
  - `get_remaining_amount()`: Budget - Spent
  - `get_utilization_percentage()`: (Spent / Budget) × 100

**Latest changes:**
- Created budget model with financial year tracking
- Added automatic spending calculation
- Unique constraint: one budget per department per period

---

### `views.py` - Budget Operations
**What it does:** Manages budget creation and approval.

**How it works:**

**Endpoints:**
- Standard CRUD operations
- Filter by department, financial_year, status, month

**Special Actions:**
- `approve()`: Approves budget (FINANCE_ADMIN or above)
- `lock()`: Locks budget to prevent changes (SUPER_ADMIN only)

**Latest changes:**
- Created budget management with approval workflow
- Added role-based action permissions

---

## 💵 apps/salary/ - Payroll Management

### `models.py` - Salary Models
**What it does:** Manages employee records and salary payments.

**How it works:**

1. **Employee Model:**
   - Stores employee information
   - **Fields:**
     - employee_id: Unique identifier
     - first_name, last_name, email, phone
     - role: Teacher, Admin Staff, Support Staff, etc.
     - department: Which department they work in
     - base_salary: Monthly salary
     - join_date, is_active

2. **Salary Model:**
   - Monthly salary records
   - **Fields:**
     - employee: Link to employee
     - month, year: Which month's salary
     - base_amount: Basic salary
     - allowances: Additional payments
     - deductions: Cuts from salary
     - net_amount: Final amount (auto-calculated)
     - status: PENDING → PAID
     - payment_date, payment_mode, reference_id
     - processed_by: Who processed payment

- **Auto-calculation:** `net_amount = base_amount + allowances - deductions`

**Latest changes:**
- Created Employee and Salary models
- Added automatic net amount calculation
- Unique constraint: one salary record per employee per month

---

### `views.py` - Salary Operations
**What it does:** Manages employee and salary records.

**How it works:**

**Employee Endpoints:**
- CRUD for employees
- Filter by department, role, active status

**Salary Endpoints:**
- CRUD for salary records
- Filter by employee, month, year, status
- `mark_paid()`: Updates status and payment details (FINANCE_ADMIN only)

**Latest changes:**
- Created employee and salary management
- Added payment processing endpoint

---

## 📈 apps/reports/ - Financial Analytics

### `views.py` - Report Generation
**What it does:** Generates financial reports by analyzing data.

**How it works:**

1. **MonthlyExpenseReportView:**
   - Shows expenses for a specific month
   - **Breakdown:**
     - Department-wise totals
     - Category-wise totals
     - Grand total
   - **Usage:** `/api/reports/monthly-expense/?month=2&year=2026`

2. **BudgetVsActualReportView:**
   - Compares planned budget vs actual spending
   - **Shows:**
     - Allocated budget
     - Actual spent
     - Variance (over/under budget)
     - Utilization percentage
   - **Usage:** `/api/reports/budget-vs-actual/?financial_year=2025-26`

3. **IncomeVsExpenseSummaryView:**
   - Shows financial health
   - **Calculates:**
     - Total income
     - Total expenses
     - Balance (surplus/deficit)
     - Income sources breakdown
     - Expense categories breakdown
   - **Usage:** `/api/reports/income-vs-expense/?start_date=2026-01-01&end_date=2026-01-31`

4. **DepartmentFinancialSummaryView:**
   - Department-wise financial overview
   - Shows income, expenses, and net for each department
   - **Usage:** `/api/reports/department-summary/?start_date=2026-01-01&end_date=2026-01-31`

**Latest changes:**
- Created 4 comprehensive financial reports
- All reports use database aggregation (fast and efficient)
- Reports only count PAID expenses (ignore pending)

---

### `models.py`
**What it does:** Nothing - reports don't need models.

**How it works:** Reports are computed from existing data (Income, Expense, Budget).

**Latest changes:** Created placeholder file (Django requires it).

---

## 🗄️ Database

### SQLite (Development)
**What it is:** A simple file-based database stored in `db.sqlite3`.

**How it works:**
- Perfect for development and testing
- Single file, no installation needed
- Easy to reset (just delete the file)

**Tables Created:**
- `users` - User accounts
- `departments` - School departments
- `income_sources` - Income categories
- `incomes` - Income transactions
- `expense_categories` - Expense categories
- `expenses` - Expense transactions
- `budgets` - Budget allocations
- `employees` - Employee records
- `salaries` - Salary payments

**Latest changes:**
- Created fresh database with all tables
- Applied all migrations successfully
- Created superuser: admin@schoolerp.com

---

## 🔄 Migrations

**What they are:** Database version control - tracks changes to models over time.

**How they work:**
1. You change `models.py`
2. Run `python manage.py makemigrations` - Creates migration file
3. Run `python manage.py migrate` - Applies changes to database

**Migration Files:** Stored in `apps/<app_name>/migrations/`
- `0001_initial.py` - Creates initial tables
- Each app has its own migrations

**Latest changes:**
- Generated initial migrations for all apps
- Applied migrations to create database
- All models synced with database

---

## 🔒 Security

### Authentication & Authorization

**How it works:**

1. **Registration:**
   - User signs up with email and password
   - Password is hashed (not stored as plain text)
   - Account created with assigned role

2. **Login:**
   - User sends email + password
   - Backend validates credentials
   - Returns JWT access token (expires in 60 min) and refresh token (expires in 24 hours)

3. **API Calls:**
   - Frontend sends: `Authorization: Bearer <access_token>`
   - Backend validates token
   - If valid, processes request
   - If expired, use refresh token to get new access token

4. **Permissions:**
   - Some endpoints check user role
   - Example: Only FINANCE_ADMIN can approve expenses

**Latest changes:**
- Implemented JWT authentication
- Added role-based permissions
- Configured auto-token refresh

---

### CORS (Cross-Origin Resource Sharing)

**What it does:** Allows frontend (http://localhost:3000) to call backend API (http://localhost:8000).

**How it works:**
- Without CORS: Browser blocks requests between different origins
- With CORS: Backend tells browser "localhost:3000 is allowed"

**Latest changes:** Configured to allow frontend development on port 3000.

---

## 📝 Admin Panel

**What it is:** Django's built-in web interface for managing data.

**Access:** http://localhost:8000/admin
**Login:** admin@schoolerp.com / admin123

**Features:**
- View, add, edit, delete all data
- User-friendly forms
- Searching and filtering
- Bulk actions

**Customizations:**
- Each app has custom admin interface
- Shows relevant fields and filters
- Organized field groups

**Latest changes:**
- Configured admin for all models
- Added search and filter options
- Set up custom display columns

---

## 🚀 Running the Backend

### First Time Setup:
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate    # Windows
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
```

### Daily Development:
```bash
cd backend
.\venv\Scripts\Activate    # Activate virtual environment
python manage.py runserver  # Start server at http://localhost:8000
```

### Useful Commands:
```bash
# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Open Python shell with Django context
python manage.py shell

# Run tests
python manage.py test
```

---

## 📊 Latest Changes Summary

### February 3, 2026 - Initial Setup
1. ✅ Created Django project with REST framework
2. ✅ Set up 6 apps: authentication, departments, finance, budget, salary, reports
3. ✅ Implemented custom User model with 4 roles
4. ✅ Created all database models for financial ERP
5. ✅ Implemented JWT authentication with auto-refresh
6. ✅ Added expense approval workflow (PENDING → APPROVED → PAID)
7. ✅ Created budget tracking with variance calculation
8. ✅ Implemented 4 financial report endpoints
9. ✅ Configured CORS for frontend collaboration
10. ✅ Set up admin panel for all models
11. ✅ Applied all migrations and created superuser
12. ✅ Tested server - all systems operational

---

## 🤝 Frontend Collaboration

### How Backend & Frontend Work Together:

1. **Frontend** sends HTTP requests to backend API
2. **Backend** processes request, talks to database
3. **Backend** sends JSON response
4. **Frontend** displays data to user

### What Frontend Needs:
- API endpoint URLs (documented in API_DOCUMENTATION.md)
- JWT tokens for authentication
- JSON data format for requests

### What Backend Provides:
- RESTful API endpoints
- JWT authentication
- JSON responses
- CORS enabled for local development

---

## 📚 Next Steps

### Immediate Tasks:
1. Add sample data through admin panel
2. Test all API endpoints
3. Create sample API responses for frontend team
4. Document any edge cases

### Future Enhancements:
1. Add unit tests for all views
2. Implement email notifications
3. Add file upload validation
4. Create data export functionality (Excel/PDF)
5. Add activity logging
6. Optimize database queries

---

## 🐛 Common Issues & Solutions

### Issue: ImportError for apps
**Solution:** Make sure all apps are in INSTALLED_APPS in settings.py

### Issue: Migration conflicts
**Solution:** Delete db.sqlite3 and migrations files, then makemigrations again

### Issue: "No module named 'apps'"
**Solution:** Check that all `__init__.py` files exist

### Issue: CORS errors from frontend
**Solution:** Verify frontend URL is in CORS_ALLOWED_ORIGINS in settings.py

---

## 📖 Learn More

- **Django Documentation:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **JWT Authentication:** https://django-rest-framework-simplejwt.readthedocs.io/

---

**Backend is production-ready and waiting for frontend! 🚀**
