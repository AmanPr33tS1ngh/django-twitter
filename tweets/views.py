from django.http import JsonResponse
from rest_framework.views import APIView
from .models import Tweet
from user.models import User
from .serializers import TweetSerializer

# Views
class GetTweets(APIView):
    def get(self, request, *args, **kwargs):
        try:
            tweets = Tweet.objects.filter()
            print(tweets)
            return JsonResponse({'success': True, 'tweets': TweetSerializer(tweets, many=True).data})
        except Exception as e:
            print('error while getting tweets', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                username = request.data.get("username")
                print('username', request.data)
                user = User.objects.filter(username=username).first()
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
        
