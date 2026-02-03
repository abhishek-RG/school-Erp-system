"""
Budget Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """Budget ViewSet"""
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department', 'financial_year', 'status', 'month']
    ordering = ['-financial_year', 'department']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a budget"""
        budget = self.get_object()
        
        if not request.user.has_finance_access():
            return Response(
                {'error': 'You do not have permission to approve budgets'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if budget.status not in ['DRAFT', 'PENDING']:
            return Response(
                {'error': 'Only draft or pending budgets can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        budget.status = 'APPROVED'
        budget.approved_by = request.user
        budget.approved_at = timezone.now()
        budget.save()
        
        serializer = self.get_serializer(budget)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        """Lock a budget (make it immutable)"""
        budget = self.get_object()
        
        if not request.user.role == 'SUPER_ADMIN':
            return Response(
                {'error': 'Only super admin can lock budgets'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if budget.status != 'APPROVED':
            return Response(
                {'error': 'Only approved budgets can be locked'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        budget.status = 'LOCKED'
        budget.save()
        
        serializer = self.get_serializer(budget)
        return Response(serializer.data)
