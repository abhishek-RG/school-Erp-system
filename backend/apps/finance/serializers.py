"""
Finance Serializers
"""
from rest_framework import serializers
from .models import IncomeSource, Income, ExpenseCategory, Expense


class IncomeSourceSerializer(serializers.ModelSerializer):
    """Income Source Serializer"""
    
    class Meta:
        model = IncomeSource
        fields = '__all__'


class IncomeSerializer(serializers.ModelSerializer):
    """Income Serializer"""
    source_name = serializers.CharField(source='income_source.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)
    
    class Meta:
        model = Income
        fields = '__all__'
        read_only_fields = ['recorded_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['recorded_by'] = self.context['request'].user
        return super().create(validated_data)


class ExpenseCategorySerializer(serializers.ModelSerializer):
    """Expense Category Serializer"""
    
    class Meta:
        model = ExpenseCategory
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    """Expense Serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['requested_by', 'approved_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)
