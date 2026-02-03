"""
Financial Reports Views - Analytics Engine
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from datetime import datetime
from apps.finance.models import Income, Expense
from apps.budget.models import Budget
from apps.departments.models import Department


class MonthlyExpenseReportView(APIView):
    """Monthly Expense Report - Department-wise and Category-wise breakdown"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        if not month or not year:
            return Response({'error': 'Month and year parameters are required'}, status=400)
        
        # Get expenses for the month
        expenses = Expense.objects.filter(
            date__month=month,
            date__year=year,
            status='PAID'
        )
        
        # Department-wise breakdown
        dept_summary = expenses.values('department__name').annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        # Category-wise breakdown
        category_summary = expenses.values('category__name', 'category__category_type').annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        # Total expenses
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            'month': month,
            'year': year,
            'total_expenses': float(total_expenses),
            'department_breakdown': list(dept_summary),
            'category_breakdown': list(category_summary),
        })


class BudgetVsActualReportView(APIView):
    """Budget vs Actual Report - Variance Analysis"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        financial_year = request.query_params.get('financial_year')
        department_id = request.query_params.get('department')
        
        if not financial_year:
            return Response({'error': 'Financial year parameter is required'}, status=400)
        
        # Query budgets
        budgets = Budget.objects.filter(
            financial_year=financial_year,
            status__in=['APPROVED', 'LOCKED']
        )
        
        if department_id:
            budgets = budgets.filter(department_id=department_id)
        
        # Calculate budget vs actual
        report_data = []
        for budget in budgets:
            spent = budget.get_spent_amount()
            allocated = float(budget.allocated_amount)
            variance = allocated - spent
            variance_percentage = (variance / allocated * 100) if allocated > 0 else 0
            
            report_data.append({
                'department': budget.department.name,
                'period': f"FY {budget.financial_year}" + (f" - Month {budget.month}" if budget.month else ""),
                'allocated_budget': allocated,
                'actual_spent': spent,
                'variance': variance,
                'variance_percentage': round(variance_percentage, 2),
                'utilization_percentage': round(budget.get_utilization_percentage(), 2),
                'status': 'Over Budget' if variance < 0 else 'Under Budget'
            })
        
        return Response({
            'financial_year': financial_year,
            'budgets': report_data,
        })


class IncomeVsExpenseSummaryView(APIView):
    """Income vs Expense Summary - Financial Health"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({'error': 'start_date and end_date parameters are required'}, status=400)
        
        # Total income
        total_income = Income.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Total expenses
        total_expenses = Expense.objects.filter(
            date__gte=start_date,
            date__lte=end_date,
            status='PAID'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Calculate surplus/deficit
        balance = float(total_income) - float(total_expenses)
        
        # Income breakdown by source
        income_breakdown = Income.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).values('income_source__name').annotate(total=Sum('amount')).order_by('-total')
        
        # Expense breakdown by category
        expense_breakdown = Expense.objects.filter(
            date__gte=start_date,
            date__lte=end_date,
            status='PAID'
        ).values('category__name').annotate(total=Sum('amount')).order_by('-total')
        
        return Response({
            'period': {
                'start_date': start_date,
                'end_date': end_date,
            },
            'summary': {
                'total_income': float(total_income),
                'total_expenses': float(total_expenses),
                'balance': balance,
                'status': 'Surplus' if balance >= 0 else 'Deficit'
            },
            'income_breakdown': list(income_breakdown),
            'expense_breakdown': list(expense_breakdown),
        })


class DepartmentFinancialSummaryView(APIView):
    """Department-wise Financial Summary"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response({'error': 'start_date and end_date parameters are required'}, status=400)
        
        departments = Department.objects.filter(is_active=True)
        
        summary = []
        for dept in departments:
            # Department income
            dept_income = Income.objects.filter(
                department=dept,
                date__gte=start_date,
                date__lte=end_date
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Department expenses
            dept_expenses = Expense.objects.filter(
                department=dept,
                date__gte=start_date,
                date__lte=end_date,
                status='PAID'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            summary.append({
                'department': dept.name,
                'income': float(dept_income),
                'expenses': float(dept_expenses),
                'net': float(dept_income) - float(dept_expenses),
            })
        
        return Response({
            'period': {'start_date': start_date, 'end_date': end_date},
            'departments': summary
        })
