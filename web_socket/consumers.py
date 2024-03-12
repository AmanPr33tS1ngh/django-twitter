from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def websocket_connect(self, message):
        print("connect", message)
        await self.accept()
        
    async def websocket_disconnect(self , close_code):
        print("disconnect")
        
    async def receive(self, text_data):
        print("receiveeeee")
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        await self.channel_layer.group_send(
            self.roomGroupName,{
                "type" : "sendMessage" ,
                "message" : message , 
                "username" : username ,
            })
    async def websocket_message(self , event) : 
        print("sendMessage")
        message = event["message"]
        username = event["username"]
        await self.send(text_data = json.dumps({"message":message ,"username":username}))