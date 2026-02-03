"""
Salary Admin Configuration
"""
from django.contrib import admin
from .models import Employee, Salary


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """Employee Admin"""
    list_display = ['employee_id', 'first_name', 'last_name', 'role', 'department', 'base_salary', 'is_active']
    list_filter = ['role', 'department', 'is_active']
    search_fields = ['employee_id', 'first_name', 'last_name', 'email']
    ordering = ['employee_id']


@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    """Salary Admin"""
    list_display = ['employee', 'month', 'year', 'base_amount', 'net_amount', 'status', 'payment_date']
    list_filter = ['status', 'year', 'month']
    search_fields = ['employee__employee_id', 'employee__first_name', 'employee__last_name']
    readonly_fields = ['net_amount', 'processed_by', 'created_at', 'updated_at']
    ordering = ['-year', '-month']
