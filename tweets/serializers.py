
from rest_framework import serializers
from .models import *
from user.serializers import UserSerializer
from django.utils import timezone

class TweetSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    post_duration = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    
    def get_user(self, obj):
        return UserSerializer(obj.user).data
    
    def get_like_count(self, obj):
        return Interaction.objects.filter(user=obj.user, interaction_type="like").count()
    
    def get_replies_count(self, obj):
        return Tweet.objects.filter(parent=obj).count()
        # return Interaction.objects.filter(user=obj.user, interaction_type="bookmark").count()
    
    def get_post_duration(self, obj):
        try:
            time_difference = timezone.now() - obj.timestamp

            # Convert the time difference to a readable format
            days = time_difference.days
            hours, remainder = divmod(time_difference.seconds, 3600)
            minutes, _ = divmod(remainder, 60)

            if days > 0:
                return f"{days}d ago"
            elif hours > 0:
                return f"{hours}h ago"
            elif minutes > 0:
                return f"{minutes}m ago"
            # elif seconds > 0:
            #     return f"{seconds}s ago"
            else:
                return "Just now"
        except Exception as e:
            print("err", str(e))
            
    class Meta:
        model = Tweet
        fields = ("id", "content", "user", "post_duration", "like_count", "replies_count",)


class TweetLabelValueSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    
    def get_label(self, obj):
        return str(obj.content)
    
    def get_value(self, obj):
        return obj.id
    
    class Meta:
        model = Tweet
        fields = ("label", "value", )


class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    tweets = serializers.SerializerMethodField()
    
    def get_user(self, obj):
        return UserSerializer(obj.user).data
    
    def get_tweets(self, obj):
        return TweetSerializer(obj.tweets, many=True).data
    
    class Meta:
        model = Interaction
        fields = ("user", "tweets", "interaction_type")