
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_profile_picture(self, obj):
        return str(obj.profile_picture)
    
    class Meta:
        model = User
        fields = ("username", "profile_picture", "full_name", "is_verified")

# class UserSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = User
#         fields = "__all__"
