from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    banner = models.ImageField(upload_to="user_banner/", default='user_banner.jpg')
    profile_picture = models.ImageField(upload_to="user_banner/", default='user_banner.jpg')
    joining_date = models.DateTimeField(auto_now_add=True, null=True)
    biography = models.TextField(max_length=100, default=None, blank=True, null=True)
    location = models.TextField(max_length=200, default=None, blank=True, null=True)
    is_private = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return super().__str__() + " -> " + self.username
