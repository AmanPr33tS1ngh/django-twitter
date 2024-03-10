from django.shortcuts import render
from .models import *
from user.models import User
from django.http import JsonResponse
from rest_framework.views import APIView
from .serializers import *
import uuid
from django.utils.text import slugify

def generate_room_id():
    unique_id = uuid.uuid4().hex[:8]
    return slugify(unique_id)

class CreateRoom(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get('username')).first()
            participant_usernames = request.data.get("participant_usernames")
            print(participant_usernames)
            if not participant_usernames:
                participant_usernames = list()
            print(participant_usernames)
            participants = User.objects.filter(username__in=participant_usernames)
            if not participants.exists():
                return JsonResponse({'success': False, 'msg': "add users to chat with them"})
            group_name = request.data.get('group_name')
            slug = generate_room_id()
            room = Room.objects.create(slug=slug, name=group_name)
            room.participants.add(*participants)
            room.participants.add(user)
            
            return JsonResponse({'success': True, 'msg': 'room created', "room": RoomSerializer(room).data})
            
        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while creating room {e}"})
        
        
class GetRooms(APIView):
    def post(self, request, *args, **kwargs):
        try:
            
            user = User.objects.filter(username=request.data.get("username")).first()
            print('chat', user)
            if not user:
                return JsonResponse({'success': False, 'msg': "Authenticate first"})
                
            rooms = Room.objects.filter(participants=user)
            print(rooms)
            return JsonResponse({'success': True, 'msg': 'got rooms', "rooms": RoomSerializer(rooms, many=True, context={"user": user}).data})
        
        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while getting rooms {str(e)}"})
              
class GetRoom(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get("username")).first()
            print('chat', user)
            if not user:
                return JsonResponse({'success': False, 'msg': "Authenticate first"})
            slug = request.data.get('slug')
            
            room = Room.objects.filter(participants=user, slug=slug).first()
            if not room:
                return JsonResponse({'success': False, 'msg': "Wrong slug!"})

            print(room)
            return JsonResponse({'success': True, 'msg': 'got rooms', "room": RoomSerializerWithMessage(room, context={"user": user}).data})
        
        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error while getting rooms {str(e)}"})
        
        
class SendMessage(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get("username")).first()
            print('message', user)
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
            
            print(room)
            return JsonResponse({'success': True, 'msg': 'got rooms', "message": MessageSerializer(message).data})
        
        except Exception as e:
            print(str(e))
            return JsonResponse({'succcess': False, 'msg': f"There was an error SendMessage {str(e)}"})
        