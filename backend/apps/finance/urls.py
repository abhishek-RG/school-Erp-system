"""
Finance URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    IncomeSourceViewSet,
    IncomeViewSet,
    ExpenseCategoryViewSet,
    ExpenseViewSet
)

router = DefaultRouter()
router.register(r'income-sources', IncomeSourceViewSet, basename='income-source')
router.register(r'incomes', IncomeViewSet, basename='income')
router.register(r'expense-categories', ExpenseCategoryViewSet, basename='expense-category')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', include(router.urls)),
]
