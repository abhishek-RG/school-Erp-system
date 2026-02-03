"""
Budget Admin Configuration
"""
from django.contrib import admin
from .models import Budget


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    """Budget Admin"""
    list_display = ['department', 'financial_year', 'month', 'allocated_amount', 'status', 'created_by', 'approved_by']
    list_filter = ['status', 'financial_year', 'department']
    search_fields = ['department__name', 'financial_year']
    readonly_fields = ['created_by', 'approved_by', 'approved_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Budget Details', {
            'fields': ('department', 'financial_year', 'month', 'allocated_amount', 'notes')
        }),
        ('Status', {
            'fields': ('status', 'created_by', 'approved_by', 'approved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
