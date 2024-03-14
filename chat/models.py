from django.db import models
from user.models import User

# Create your models here.

from django.db import models

class Room(models.Model):
    participants = models.ManyToManyField(User, related_name='chats')
    room_creation_timestamp = models.DateTimeField(auto_now_add=True)
    slug = models.TextField(max_length=120)
    name =  models.TextField(max_length=120, default=None, blank=True, null=True)
    
    def get_messages(self):
        return self.messages.all()
    
    def __str__(self) -> str:
        return super().__str__() + " " + self.slug
    
    
class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages', default=None)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender', default=None)
    content = models.TextField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.sender.username} ({self.timestamp}): {self.content}'
