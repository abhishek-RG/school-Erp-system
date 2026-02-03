"""
Salary & Payroll Models
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.departments.models import Department

User = get_user_model()


class Employee(models.Model):
    """Employee Model"""
    
    ROLE_CHOICES = [
        ('TEACHER', 'Teacher'),
        ('ADMIN_STAFF', 'Administrative Staff'),
        ('SUPPORT_STAFF', 'Support Staff'),
        ('LAB_ASSISTANT', 'Lab Assistant'),
        ('LIBRARIAN', 'Librarian'),
        ('OTHER', 'Other'),
    ]
    
    employee_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='employees')
    
    # Salary details
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    join_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employees'
        ordering = ['employee_id']
    
    def __str__(self):
        return f"{self.employee_id} - {self.first_name} {self.last_name}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Salary(models.Model):
    """Monthly Salary Records"""
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='salaries')
    month = models.PositiveSmallIntegerField()  # 1-12
    year = models.PositiveIntegerField()
    
    # Salary breakdown
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment details
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    payment_date = models.DateField(null=True, blank=True)
    payment_mode = models.CharField(max_length=20, blank=True, null=True)
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    
    notes = models.TextField(blank=True, null=True)
    
    # Tracking
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='processed_salaries')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'salaries'
        ordering = ['-year', '-month', 'employee']
        unique_together = [['employee', 'month', 'year']]
        indexes = [
            models.Index(fields=['employee', 'month', 'year']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.month}/{self.year} - ₹{self.net_amount}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate net amount
        self.net_amount = self.base_amount + self.allowances - self.deductions
        super().save(*args, **kwargs)
