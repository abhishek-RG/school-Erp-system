"""
Salary Serializers
"""
from rest_framework import serializers
from .models import Employee, Salary


class EmployeeSerializer(serializers.ModelSerializer):
    """Employee Serializer"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class SalarySerializer(serializers.ModelSerializer):
    """Salary Serializer"""
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    department_name = serializers.CharField(source='employee.department.name', read_only=True)
    processed_by_name = serializers.CharField(source='processed_by.get_full_name', read_only=True)
    
    class Meta:
        model = Salary
        fields = '__all__'
        read_only_fields = ['net_amount', 'processed_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['processed_by'] = self.context['request'].user
        return super().create(validated_data)
