from django.db import models
from user.models import User
# Create your models here.

class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL) # tweets on our tweet(threads)
    content = models.TextField(blank=True, null=True, default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='tweet_user', blank=True)
    
    def __str__(self) -> str:
        return super().__str__() + " -> " + self.content
    

class Bookmark(models.Model):
    tweets = models.ManyToManyField(Tweet, related_name="tweets")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return super().__str__() + " -> " + self.tweet.content
    