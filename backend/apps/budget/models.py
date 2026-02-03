"""
Budget Planning Models
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.departments.models import Department

User = get_user_model()


class Budget(models.Model):
    """Budget Model for Planning"""
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('LOCKED', 'Locked'),
    ]
    
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='budgets')
    financial_year = models.CharField(max_length=10)  # e.g., "2024-25"
    month = models.PositiveSmallIntegerField(null=True, blank=True)  # 1-12 for monthly, null for yearly
    allocated_amount = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Status tracking
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    notes = models.TextField(blank=True, null=True)
    
    # Approval tracking
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_budgets')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_budgets')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budgets'
        ordering = ['-financial_year', 'department']
        unique_together = [['department', 'financial_year', 'month']]
        indexes = [
            models.Index(fields=['department', 'financial_year']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        period = f"FY {self.financial_year}"
        if self.month:
            period += f" - Month {self.month}"
        return f"{self.department.name} - {period} - ₹{self.allocated_amount}"
    
    def get_spent_amount(self):
        """Calculate actual spent amount against this budget"""
        from apps.finance.models import Expense
        from datetime import datetime
        
        # Get year range
        year_parts = self.financial_year.split('-')
        start_year = int(f"20{year_parts[0]}")
        
        if self.month:
            # Monthly budget
            start_date = datetime(start_year, self.month, 1).date()
            if self.month == 12:
                end_date = datetime(start_year + 1, 1, 1).date()
            else:
                end_date = datetime(start_year, self.month + 1, 1).date()
        else:
            # Yearly budget
            start_date = datetime(start_year, 4, 1).date()  # FY starts in April in India
            end_date = datetime(start_year + 1, 4, 1).date()
        
        expenses = Expense.objects.filter(
            department=self.department,
            date__gte=start_date,
            date__lt=end_date,
            status='PAID'
        ).aggregate(total=models.Sum('amount'))
        
        return expenses['total'] or 0
    
    def get_remaining_amount(self):
        """Calculate remaining budget"""
        return self.allocated_amount - self.get_spent_amount()
    
    def get_utilization_percentage(self):
        """Calculate budget utilization percentage"""
        if self.allocated_amount == 0:
            return 0
        return (self.get_spent_amount() / self.allocated_amount) * 100
