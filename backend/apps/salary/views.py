"""
Salary Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Employee, Salary
from .serializers import EmployeeSerializer, SalarySerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """Employee ViewSet"""
    queryset = Employee.objects.filter(is_active=True)
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['department', 'role', 'is_active']
    search_fields = ['employee_id', 'first_name', 'last_name', 'email']


class SalaryViewSet(viewsets.ModelViewSet):
    """Salary ViewSet"""
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['employee', 'month', 'year', 'status']
    search_fields = ['employee__employee_id', 'employee__first_name', 'employee__last_name']
    ordering = ['-year', '-month']
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark salary as paid"""
        salary = self.get_object()
        
        if not request.user.has_finance_access():
            return Response(
                {'error': 'You do not have permission to mark salaries as paid'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if salary.status != 'PENDING':
            return Response(
                {'error': 'Only pending salaries can be marked as paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        salary.status = 'PAID'
        salary.payment_date = request.data.get('payment_date')
        salary.payment_mode = request.data.get('payment_mode')
        salary.reference_id = request.data.get('reference_id')
        salary.save()
        
        serializer = self.get_serializer(salary)
        return Response(serializer.data)
