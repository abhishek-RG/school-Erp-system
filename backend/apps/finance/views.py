"""
Finance Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import IncomeSource, Income, ExpenseCategory, Expense
from .serializers import (
    IncomeSourceSerializer,
    IncomeSerializer,
    ExpenseCategorySerializer,
    ExpenseSerializer
)


class IncomeSourceViewSet(viewsets.ModelViewSet):
    """Income Source ViewSet"""
    queryset = IncomeSource.objects.filter(is_active=True)
    serializer_class = IncomeSourceSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'code']


class IncomeViewSet(viewsets.ModelViewSet):
    """Income ViewSet"""
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['income_source', 'department', 'payment_mode', 'date']
    search_fields = ['reference_id', 'description', 'student_id']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    """Expense Category ViewSet"""
    queryset = ExpenseCategory.objects.filter(is_active=True)
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name', 'code']
    filterset_fields = ['category_type']


class ExpenseViewSet(viewsets.ModelViewSet):
    """Expense ViewSet"""
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'department', 'status', 'payment_mode', 'date']
    search_fields = ['reference_id', 'description']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an expense"""
        expense = self.get_object()
        
        if not request.user.has_finance_access():
            return Response(
                {'error': 'You do not have permission to approve expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if expense.status != 'PENDING':
            return Response(
                {'error': 'Only pending expenses can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        expense.status = 'APPROVED'
        expense.approved_by = request.user
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an expense"""
        expense = self.get_object()
        
        if not request.user.has_finance_access():
            return Response(
                {'error': 'You do not have permission to reject expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if expense.status != 'PENDING':
            return Response(
                {'error': 'Only pending expenses can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        expense.status = 'REJECTED'
        expense.approved_by = request.user
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark expense as paid"""
        expense = self.get_object()
        
        if not request.user.has_finance_access():
            return Response(
                {'error': 'You do not have permission to mark expenses as paid'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if expense.status != 'APPROVED':
            return Response(
                {'error': 'Only approved expenses can be marked as paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        expense.status = 'PAID'
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)
