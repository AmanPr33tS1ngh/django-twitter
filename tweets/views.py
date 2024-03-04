from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Tweet
from django.core import serializers
from user.models import UserProfile

# Views
class GetTweets(APIView):
    def get(self, request, *args, **kwargs):
        try:
            tweet = Tweet.objects.filter()
            print(tweet)
            return JsonResponse({'success': True, 'tweet': serializers.serialize('json', tweet)})
        except Exception as e:
            print('error while getting tweets', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                user = UserProfile.objects.filter(user__username='amanpreet').first()
            if not user:
                return JsonResponse({'success': False, 'msg': 'user not found!'})
            content = request.data.get('content')
            if not content:
                return JsonResponse({'success': False, 'msg': 'Please add content!'})

            tweet = Tweet.objects.create(
                user=user,
                content=content,
                parent=None,
            )
            
            print(tweet)
            return JsonResponse({'success': True, 'msg': 'new tweet'})
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        
