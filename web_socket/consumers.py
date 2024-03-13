from channels.generic.websocket import AsyncWebsocketConsumer
import json
from chat.models import *
from user.models import User
from chat.serializers import MessageSerializer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f"room_{self.scope['url_route']['kwargs']['slug']}"
        print("connect", self.scope)
        await self.accept()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_chat_room(self, text_data_json):
        slug = text_data_json.get('slug')
        print('Inside create_chat_room')
        if not slug:
            print("No slug provided")
            return

        self.room_name = f"room_{slug}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get("action_type")
        print("Received:", text_data_json)

        if action_type == 'connect':
            await self.create_chat_room(text_data_json)
        elif action_type == 'chat_message':
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': action_type,
                    'data': text_data_json,
                }
            )

    async def chat_message(self, event):
        print('chat_message', event)
        data = event.get('data')
        action_type = data.get('action_type')
        message = data.get("message")
        username = data.get("username")
        room_name = data.get("room_name")
        user = await self.get_user_details(username)
        if not user:
            await self.send(text_data=json.dumps({"success": False, "msg": "Please authenticate first!"}))
            
        message = await self.create_message(room_name, user, message)
        
        json_data = {
            "new_message": MessageSerializer(message).data, 'action_type': action_type
        }
        print('WebSocket Message:', message, 'Username:', username)
        await self.send(text_data=json.dumps(json_data))
        
        
    @database_sync_to_async
    def get_user_details(self, username):
        try:
            user = User.objects.get(username=username)
            return user
        except Exception as e:
            print('get_user_details', str(e))
            return None
            
    @database_sync_to_async
    def create_message(self, room_name, user, message):
        try:
            room = Room.objects.get(slug=room_name)
            return Message.objects.create(
                room=room,
                sender=user,
                content=message,
            )
        except Exception as e:
            print('get_user_details', str(e))
            return None