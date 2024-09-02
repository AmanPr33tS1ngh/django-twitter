from django.shortcuts import render
from .models import *
from user.models import User
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import *
import uuid
from django.utils.text import slugify
from django.db.models import Q, Max

def generate_room_id():
    unique_id = uuid.uuid4().hex[:8]
    return slugify(unique_id)

class CreateRoom(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            participant_usernames = request.data.get("participant_usernames")
            if not participant_usernames:
                participant_usernames = list()

            participants = User.objects.filter(Q(username__in=participant_usernames) | Q(id=user.id))
            if not participants.exists():
                return JsonResponse({'success': False, 'msg': "add users to chat with them"})

            group_name = request.data.get('group_name')
            slug = generate_room_id()

            if Room.objects.filter(participants__username__in=participant_usernames).exists():
                return JsonResponse({'success': False, 'msg': 'Room already exists!'})
            room = Room.objects.create(slug=slug, name=group_name)
            room.participants.add(*participants)
            room.participants.add(user)
            get_only_slug = request.data.get('get_only_slug')
            if get_only_slug:
                room_data = room.slug
            else:
                room_data = RoomSerializer(room, context={"user": user}).data

            return JsonResponse({'success': True, 'msg': 'room created', "room": room_data})

        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while creating room {e}"})


class GetRooms(APIView):
    def post(self, request, *args, **kwargs):
        try:

            user = User.objects.filter(username=request.data.get("username")).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "Authenticate first"})

            rooms = Room.objects.filter(participants=user).annotate(
                latest_message_timestamp=Max('messages__timestamp')
            ).order_by('-latest_message_timestamp')

            return JsonResponse({'success': True, 'msg': 'got rooms', "rooms": RoomSerializer(rooms, many=True, context={"user": user}).data})

        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while getting rooms {str(e)}"})

class GetRoom(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get("username")).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "Authenticate first"})
            slug = request.data.get('slug')

            room = Room.objects.filter(participants=user, slug=slug).first()
            if not room:
                return JsonResponse({'success': False, 'msg': "Wrong slug!"})

            return JsonResponse({'success': True, 'msg': 'got rooms', "room": RoomSerializerWithMessage(room, context={"user": user}).data})

        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while getting rooms {str(e)}"})


class SendMessage(APIView):
    def post(self, request, *args, **kwargs):
        try:
            print("called send message SendMessage")
            user = User.objects.filter(username=request.data.get("username")).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "Authenticate first"})
            slug = request.data.get('slug')

            room = Room.objects.filter(participants=user, slug=slug).first()
            if not room:
                return JsonResponse({'success': False, 'msg': "Wrong slug!"})
            content = request.data.get('message')
            if not content:
                return JsonResponse({'success': False, 'msg': "Write a message to send"})

            message = Message.objects.create(
                room=room,
                sender=user,
                content=content,
            )

            return JsonResponse({'success': True, 'msg': 'got rooms', "message": MessageSerializer(message).data})

        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error SendMessage {str(e)}"})
