
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        try:
            print("full_name", obj)
            return f"{obj.first_name} {obj.last_name}"
        except Exception as e:
            print('er', str(e))
            return None

    def get_profile_picture(self, obj):
        try:
            print("pro", obj)
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
