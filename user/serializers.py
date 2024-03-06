
from rest_framework import serializers
from .models import *

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_full_name(self, obj):
        user = obj.user
        return f"{user.first_name} {user.last_name}"
    
    def get_profile_picture(self, obj):
        return str(obj.profile_picture)
    
    class Meta:
        model = UserProfile
        fields = ("username", "profile_picture", "full_name", "is_verified")

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = user
        fields = "__all__"
