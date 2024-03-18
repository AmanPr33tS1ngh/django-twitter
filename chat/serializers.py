from rest_framework import serializers
from .models import *
from django.utils import timezone
from user.serializers import UserSerializer, UserProfileSerializer
from twitter.utils import get_timestamp_difference

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()

    def get_sender(self, obj):
        return UserSerializer(obj.sender).data

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%I:%M %p")

    class Meta:
        model = Message
        fields = ("sender", "content", "timestamp", "is_read", 'id')

class RoomSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    participants = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    participant = serializers.SerializerMethodField()

    def get_participants(self, obj):
        try:
            user = self.context.get('user')
            if not user:
                return UserProfileSerializer(obj.participants.all(), many=True).data
            participants = obj.participants.filter().exclude(username=user.username)
            if participants.count() <= 1:
                return list()

            return UserProfileSerializer(participants, many=True).data
        except Exception as e:
            print('seriii', str(e))
            return list()

    def get_participant(self, obj):
        try:
            user = self.context.get('user')
            participant = obj.participants.filter().exclude(username=user.username)

            if participant.count() == 1:
                participant = participant.first()
                return UserProfileSerializer(participant).data
            return None

        except Exception as e:
            print('seriii', str(e))
            return list()

    def get_last_message(self, obj):
        last_message = obj.get_messages().order_by('timestamp').last()
        if not last_message:
            return None
        return MessageSerializer(last_message).data

    def get_timestamp(self, obj):
        return get_timestamp_difference(obj.room_creation_timestamp)

    class Meta:
        model = Room
        fields = ("slug", "timestamp", "participants", "participant", "last_message", "name",  )

class RoomSerializerWithMessage(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    participants = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()
    participant = serializers.SerializerMethodField()

    def get_participants(self, obj):
        try:
            user = self.context.get('user')
            if not user:
                return UserProfileSerializer(obj.participants.all(), many=True).data
            participants = obj.participants.filter().exclude(username=user.username)
            if participants.count() <= 1:
                return list()

            return UserProfileSerializer(participants, many=True).data
        except Exception as e:
            print('seriii', str(e))
            return list()

    def get_participant(self, obj):
        try:
            user = self.context.get('user')
            participant = obj.participants.filter().exclude(username=user.username)
            if participant.count() == 1:
                participant = participant.first()
                return UserProfileSerializer(participant).data
            return None

        except Exception as e:
            print('seriii', str(e))
            return list()

    def get_messages(self, obj):
        last_message = obj.get_messages().order_by('timestamp')
        if not last_message.exists():
            return list()
        return MessageSerializer(last_message, many=True).data

    def get_timestamp(self, obj):
        return get_timestamp_difference(obj.room_creation_timestamp)

    class Meta:
        model = Room
        fields = ("slug", "timestamp", "participants", "participant", "messages", "name",  )
