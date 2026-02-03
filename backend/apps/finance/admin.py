"""
Finance Admin Configuration
"""
from django.contrib import admin
from .models import IncomeSource, Income, ExpenseCategory, Expense


@admin.register(IncomeSource)
class IncomeSourceAdmin(admin.ModelAdmin):
    """Income Source Admin"""
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    """Income Admin"""
    list_display = ['income_source', 'amount', 'date', 'payment_mode', 'department', 'recorded_by', 'created_at']
    list_filter = ['income_source', 'payment_mode', 'date', 'department']
    search_fields = ['reference_id', 'description', 'student_id']
    date_hierarchy = 'date'
    readonly_fields = ['recorded_by', 'created_at', 'updated_at']


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    """Expense Category Admin"""
    list_display = ['name', 'code', 'category_type', 'is_active', 'created_at']
    list_filter = ['category_type', 'is_active']
    search_fields = ['name', 'code']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """Expense Admin"""
    list_display = ['category', 'department', 'amount', 'date', 'status', 'requested_by', 'approved_by']
    list_filter = ['category', 'department', 'status', 'date']
    search_fields = ['reference_id', 'description']
    date_hierarchy = 'date'
    readonly_fields = ['requested_by', 'approved_by', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'department', 'amount', 'date', 'description')
        }),
        ('Payment Details', {
            'fields': ('payment_mode', 'reference_id', 'receipt')
        }),
        ('Status', {
            'fields': ('status', 'requested_by', 'approved_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
