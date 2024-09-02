
from rest_framework import serializers
from .models import *
from chat.models import Room
from django.db.models import Q
from twitter.utils import create_image_url

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            return None

    def get_profile_picture(self, obj):
        try:
            return create_image_url(obj.profile_picture)
        except Exception as e:
            return None

    class Meta:
        model = User
        fields = ("username", "profile_picture", "full_name", "is_verified")

class UserConnectionSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    can_message = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            return None

    def get_profile_picture(self, obj):
        try:
            return create_image_url(obj.profile_picture)
        except Exception as e:
            return None

    def get_can_message(self, obj):
        try:
            receiver = self.context.get('user')
            return Connection.objects.filter(sender=receiver, receiver=obj, is_accepted=True).exists() or not\
                obj.is_private or receiver == obj
        except Exception as e:
            return False

    class Meta:
        model = User
        fields = ("username", "profile_picture", "full_name", "is_verified", 'can_message')

class UserLabelValueSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_label(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            return None

    def get_value(self, obj):
        try:
            return str(obj.username)
        except Exception as e:
            return None

    def get_profile_picture(self, obj):
        try:
            return create_image_url(obj.profile_picture)
        except Exception as e:
            return None

    class Meta:
        model = User
        fields = ("label", "value", 'profile_picture')

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    joining_date = serializers.SerializerMethodField()
    biography = serializers.SerializerMethodField()
    is_user_profile = serializers.SerializerMethodField()
    has_connection = serializers.SerializerMethodField()
    room_slug = serializers.SerializerMethodField()
    req_sent = serializers.SerializerMethodField()

    def get_profile_picture(self, obj):
        try:
            return create_image_url(obj.profile_picture)
        except Exception as e:
            return None

    def get_banner(self, obj):
        try:
            return create_image_url(obj.profile_picture)
        except Exception as e:
            return None

    def get_full_name(self, obj):
        try:
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            return None

    def get_joining_date(self, obj):
        try:
            return obj.joining_date.strftime("%d %b %Y")
        except Exception as e:
            return None

    def get_biography(self, obj):
        try:
            return obj.biography
        except Exception as e:
            return None

    def get_is_user_profile(self, obj):
        try:
            user = self.context.get('user')
            
            if not user:
                return False
            return user.username == obj.username
        except Exception as e:
            return None

    def get_has_connection(self, obj):
        try:
            user = self.context.get('user')
            return Connection.objects.filter(sender=user, receiver=obj, is_accepted=True).exists()
        except Exception as e:
            return None

    def get_req_sent(self, obj):
        try:
            user = self.context.get('user')
            conn = Connection.objects.filter(sender=user, receiver=obj, is_accepted=False).exists()
            
            return conn and obj.is_private
        except Exception as e:
            return None
        
    def get_can_message(self, obj):
        try:
            user = self.context.get('user')
            return Connection.objects.filter(sender=user, receiver=obj, is_accepted=True).exists() or not obj.is_private
        except Exception as e:
            return None

    def get_room_slug(self, obj):
        try:
            user = self.context.get('user')
            room = Room.objects.filter(Q(participants=user) & Q(participants=obj)).first()
            if not room:
                return None
            return str(room.slug)
        except Exception as e:
            return None

    class Meta:
        model = User
        fields = ("banner", "full_name", "first_name", "last_name", "username", "location", "profile_picture", "biography", "joining_date", 'is_user_profile', 'is_private', 'has_connection', 'room_slug', 'req_sent')

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
