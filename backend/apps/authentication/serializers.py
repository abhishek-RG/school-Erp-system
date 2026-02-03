"""
Serializers for Authentication
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User Serializer"""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """User Registration Serializer"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role', 'phone', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT Token Serializer with user data"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to response
        data['user'] = UserSerializer(self.user).data
        
        return data
