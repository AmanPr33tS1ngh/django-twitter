from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

user = get_user_model()

class UserProfile(models.Model):
    user = models.OneToOneField(user, related_name="user", on_delete=models.CASCADE)
    banner = models.ImageField(upload_to="user_banner/", default='user_banner.jpg')
    profile_picture = models.ImageField(upload_to="user_banner/", default='user_banner.jpg')
    joining_date = models.DateTimeField(auto_now_add=True, null=True)
    biography = models.TextField(max_length=100, default=None, blank=True, null=True)
    location = models.TextField(max_length=200, default=None, blank=True, null=True)
    private = models.BooleanField(default=False)

    def __str__(self) -> str:
        return super().__str__() + " -> " + self.user.username