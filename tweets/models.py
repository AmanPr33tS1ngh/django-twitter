from django.db import models
from user.models import UserProfile
# Create your models here.

class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL) # tweets on our tweet(threads)
    content = models.TextField(blank=True, null=True, default=None)
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(UserProfile, related_name='tweet_user', blank=True)
    
    def __str__(self) -> str:
        return super().__str__() + " -> " + self.content
    