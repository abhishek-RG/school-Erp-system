"""
Department Serializers
"""
from rest_framework import serializers
from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    """Department Serializer"""
    head_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'description', 'head', 'head_name', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_head_name(self, obj):
        return obj.head.get_full_name() if obj.head else None
