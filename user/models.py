from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    banner = models.ImageField(upload_to="user_banner/", default='user_banner.jpg')
    profile_picture = models.ImageField(upload_to="user_profile_picture/", default='user_banner.jpg')
    joining_date = models.DateTimeField(auto_now_add=True, null=True)
    biography = models.TextField(max_length=100, default=None, blank=True, null=True)
    location = models.TextField(max_length=200, default=None, blank=True, null=True)
    is_private = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return super().__str__() + " -> " + self.username


class Connection(models.Model):
    sender = models.ForeignKey(User, related_name='conn_sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='conn_receiver', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return str(self.sender) + ' -> ' + str(self.receiver) + ' : ' + str(self.is_accepted)
    