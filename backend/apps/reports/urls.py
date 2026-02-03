"""
Reports URLs
"""
from django.urls import path
from .views import (
    MonthlyExpenseReportView,
    BudgetVsActualReportView,
    IncomeVsExpenseSummaryView,
    DepartmentFinancialSummaryView,
    AuditReportView
)

urlpatterns = [
    path('monthly-expense/', MonthlyExpenseReportView.as_view(), name='monthly-expense-report'),
    path('budget-vs-actual/', BudgetVsActualReportView.as_view(), name='budget-vs-actual'),
    path('income-vs-expense/', IncomeVsExpenseSummaryView.as_view(), name='income-vs-expense'),
    path('department-summary/', DepartmentFinancialSummaryView.as_view(), name='department-summary'),
    path('audit-download/', AuditReportView.as_view(), name='audit-download'),
]
