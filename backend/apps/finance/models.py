"""
Finance Models - Income and Expense Management
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.departments.models import Department

User = get_user_model()


class IncomeSource(models.Model):
    """Income Source Categories"""
    
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'income_sources'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Income(models.Model):
    """Income Transactions"""
    
    PAYMENT_MODES = [
        ('CASH', 'Cash'),
        ('UPI', 'UPI'),
        ('BANK', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('CARD', 'Card'),
    ]
    
    income_source = models.ForeignKey(IncomeSource, on_delete=models.PROTECT, related_name='incomes')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODES)
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    # Optional links
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='incomes'
    )
    student_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Tracking
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recorded_incomes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'incomes'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['income_source']),
        ]
    
    def __str__(self):
        return f"{self.income_source.name} - ₹{self.amount} ({self.date})"


class ExpenseCategory(models.Model):
    """Expense Categories"""
    
    CATEGORY_TYPES = [
        ('OPERATIONAL', 'Operational'),
        ('CAPITAL', 'Capital'),
        ('SALARY', 'Salary'),
    ]
    
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=20, unique=True)
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='OPERATIONAL')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'expense_categories'
        verbose_name_plural = 'Expense Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Expense(models.Model):
    """Expense Transactions"""
    
    PAYMENT_MODES = [
        ('CASH', 'Cash'),
        ('UPI', 'UPI'),
        ('BANK', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('CARD', 'Card'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('PAID', 'Paid'),
        ('REJECTED', 'Rejected'),
    ]
    
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name='expenses')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='expenses')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODES, blank=True, null=True)
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    
    # Receipts/Documents
    receipt = models.FileField(upload_to='expenses/receipts/', blank=True, null=True)
    
    # Tracking
    requested_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='requested_expenses')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expenses'
        ordering = ['-date', '-created_at']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['category']),
            models.Index(fields=['department']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.category.name} - {self.department.name} - ₹{self.amount} ({self.date})"
