
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            print('er', str(e))
            return None

    def get_profile_picture(self, obj):
        try:
            return str(obj.profile_picture)
        except Exception as e:
            print('err', str(e))
            return None

    class Meta:
        model = User
        fields = ("username", "profile_picture", "full_name", "is_verified")

class UserLabelValueSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()

    def get_label(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            print('er', str(e))
            return None

    def get_value(self, obj):
        try:
            return str(obj.username)
        except Exception as e:
            print('err', str(e))
            return None

    class Meta:
        model = User
        fields = ("label", "value", )

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    joining_date = serializers.SerializerMethodField()
    biography = serializers.SerializerMethodField()
    is_user_profile = serializers.SerializerMethodField()
    
    def get_profile_picture(self, obj):
        try:
            return str(obj.profile_picture)
        except Exception as e:
            print('er', str(e))
            return None

    def get_banner(self, obj):
        try:
            return str(obj.banner)
        except Exception as e:
            print('err', str(e))
            return None

    def get_full_name(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            print('err', str(e))
            return None

    def get_joining_date(self, obj):
        try:
            return obj.joining_date.strftime("%d %b %Y")
        except Exception as e:
            print('err', str(e))
            return None

    def get_biography(self, obj):
        try:
            return obj.biography
        except Exception as e:
            print('err', str(e))
            return None
        
    def get_is_user_profile(self, obj):
        try:
            user = self.context.get('user')
            print(self.context, obj.username)
            if not user:
                return False
            return user.username == obj.username
        except Exception as e:
            return None

    class Meta:
        model = User
        fields = ("banner", "full_name", "first_name", "last_name", "username", "location", "profile_picture", "biography", "joining_date", 'is_user_profile')

class ConnectionSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()
    
    def get_sender(self, obj):
        return UserSerializer(obj.sender).data
    
    def get_receiver(self, obj):
        return UserSerializer(obj.receiver).data
    
    def get_timestamp(self, obj):
        return obj.timestamp.strftime('%d %b %Y')
    
    class Meta:
        model = Connection
        fields = ("sender", "receiver", "timestamp", )

class ConnectionRequestSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()
    
    def get_sender(self, obj):
        return UserSerializer(obj.sender).data
    
    def get_timestamp(self, obj):
        return obj.timestamp.strftime('%d %b %Y')
    
    class Meta:
        model = Connection
        fields = ("sender", "timestamp", 'id')
