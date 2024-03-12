from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None

    async def websocket_connect(self, message):
        self.room_name = f"room_{self.scope.get('url_route').get('kwargs').get('slug')}"     
        print("connect", message, self.scope)
        await self.accept()
        
    async def websocket_disconnect(self , close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        
    async def create_chat_room(self, slug):
        print('inside create_chat_room')
        if not slug:
            print("no slug")
        print("slug", slug)
        
        self.room_name = f"room_{slug}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        slug = text_data_json.get("slug")
        action_type = text_data_json.get("type")
        
        print("receiveeeee", text_data_json)
        if action_type == 'connect':
            print('actiontype matched')
            # await self.create_chat_room(slug=slug)
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                text_data_json
            )
            
    def chat_message(self, event):
        # Receive message from room group
        text = event.get('message')
        sender = event.get('slug')
        print('chat_message', text, sender)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'text': text,
            'sender': sender
        }))
        
    async def websocket_message(self , event) : 
        print("sendMessage")
        message = event.get("message")
        username = event.get("username")
        print('websocket_message', message, username)
        await self.send(text_data = json.dumps({"message":message ,"username":username}))
        