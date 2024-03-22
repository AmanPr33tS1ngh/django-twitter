from channels.generic.websocket import AsyncWebsocketConsumer
import json
from chat.models import *
from user.models import User
from chat.serializers import *
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    # def __init__(self):
    #     self.room_name = None
    #     self.username = None

    async def connect(self):
        self.room_name = f"room_{self.scope['url_route']['kwargs']['slug']}"
        self.username = self.scope['url_route']['kwargs']['user']
        await self.accept()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_chat_room(self, text_data_json):
        pass
        # slug = text_data_json.get('slug')
        # print('Inside create_chat_room')
        # if not slug:
        #     print("No slug provided")
        #     return

        # self.room_name = f"room_{slug}"
        # await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get("action_type")
        print('action_type', text_data_json)
        if action_type == 'connect':
            await self.create_chat_room(text_data_json)
        elif (action_type == 'chat_message' or action_type == 'delete_message') and self.username == text_data_json.get('username'):
            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': action_type,
                    'data': text_data_json,
                }
            )

    async def chat_message(self, event):
        data = event.get('data')
        action_type = data.get('action_type')
        message = data.get("message")
        username = data.get("username")
        room_name = data.get("room_name")
        user = await self.get_user_details(username)

        if not user:
            await self.send(text_data=json.dumps({"success": False, "msg": "Please authenticate first!"}))
        room = await self.create_message_and_return_room(room_name, user, message)

        json_data = {
            "new_room": room, 'action_type': action_type
        }
        await self.send(text_data=json.dumps(json_data))

    async def delete_message(self, event):
        data = event.get('data')
        action_type = data.get('action_type')
        message_id = data.get("message_id")
        username = data.get("username")
        room_name = data.get("room_name")
        if not message_id:
            await self.send(text_data=json.dumps({"success": False, "msg": "There was an error while deleting message!"}))

        user = await self.get_user_details(username)
        if not user:
            await self.send(text_data=json.dumps({"success": False, "msg": "Please authenticate first!"}))

        new_room = await self.delete_msg(room_name, message_id, user)

        json_data = {
            "new_room": new_room, 'action_type': action_type,
        }
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
    def create_message_and_return_room(self, room_name, user, message):
        try:
            room = Room.objects.get(slug=room_name)
            if not room:
                return None

            message = Message.objects.create(
                room=room,
                sender=user,
                content=message,
            )
            room.room_creation_timestamp = message.timestamp
            room.save()
            return RoomSerializerWithMessage(room, context={'user': user}).data
        except Exception as e:
            print('Error creating message:', str(e))
            return None

    @database_sync_to_async
    def delete_msg(self, room_name, message_id, user):
        try:
            room = Room.objects.get(slug=room_name)
            if not room:
                return None

            messages = Message.objects.filter(room=room)
            messages.filter(sender=user, id=message_id).delete()
            last_message = messages.order_by('room_creation_timestamp').last()
            if last_message and last_message.timestamp:
                room.room_creation_timestamp = last_message.timestamp
                room.save()

            return RoomSerializerWithMessage(room, context={'user': user}).data
        except Room.DoesNotExist:
            print('Room does not exist:', room_name)
            return None
        except Exception as e:
            print('Error creating message:', str(e))
            return None
