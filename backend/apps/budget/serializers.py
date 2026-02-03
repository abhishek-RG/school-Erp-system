"""
Budget Serializers
"""
from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    """Budget Serializer"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()
    utilization_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['created_by', 'approved_by', 'approved_at', 'created_at', 'updated_at']
    
    def get_spent_amount(self, obj):
        return float(obj.get_spent_amount())
    
    def get_remaining_amount(self, obj):
        return float(obj.get_remaining_amount())
    
    def get_utilization_percentage(self, obj):
        return round(obj.get_utilization_percentage(), 2)
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
