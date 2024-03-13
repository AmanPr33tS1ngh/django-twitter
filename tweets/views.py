from django.http import JsonResponse
from rest_framework.views import APIView
from .models import *
from user.models import User
from .serializers import *
from user.serializers import UserLabelValueSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Views
class GetTweets(APIView):
    def get(self, request, *args, **kwargs):
        try:
            tweets = Tweet.objects.filter(parent__isnull=True)
            return JsonResponse({'success': True, 'tweets': TweetSerializer(tweets, many=True).data})
        except Exception as e:
            print('error while getting tweets', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                username = request.data.get("username")
                user = User.objects.filter(username=username).first()

            if not user:
                return JsonResponse({'success': False, 'msg': 'user not found!'})
            content = request.data.get('content')
            if not content:
                return JsonResponse({'success': False, 'msg': 'Please add content!'})
            parent_id = request.data.get('id')
            parent_username = request.data.get("parent_username")

            parent = Tweet.objects.filter(id=parent_id, user__username=parent_username).first()
            
            tweet = Tweet.objects.create(
                user=user,
                content=content,
                parent=parent,
            )
            
            return JsonResponse({'success': True, 'msg': 'new tweet', 'tweet': TweetSerializer(tweet).data})
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        

class GetMatchingTweets(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            # if user.is_anonymous:
                # return JsonResponse({'success': False, 'msg': 'You need to authenticate first to search!'})
            input_val = request.data.get('input_val')
            if not input_val:
                return JsonResponse({'success': True, 'results': list()})

            tweets = Tweet.objects.filter(content__icontains=input_val)[:5]
            result = TweetLabelValueSerializer(tweets, many=True).data
            
            users = User.objects.filter(username__icontains=input_val)[:5]
            matching_users = UserLabelValueSerializer(users, many=True).data
            return JsonResponse({'success': True, 'msg': 'new tweet', 'results': result, "users": matching_users})
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        

class GetTweet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            tweet_id = request.data.get('tweet_id')
            if not tweet_id:
                return JsonResponse({'success': False, 'msg': 'Wrong url'})
            # if user.is_anonymous:
                # return JsonResponse({'success': False, 'msg': 'You need to authenticate first to search!'})
            tweet = Tweet.objects.filter(id=tweet_id).first()
            replies = Tweet.objects.filter(parent=tweet).order_by('timestamp')
            return JsonResponse({'success': True, 'msg': 'new tweet', "replies":TweetSerializer(replies, many=True).data,
                                 'tweet': TweetSerializer(tweet).data})
        
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        


class TakeAction(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            username = request.data.get("user")
            if user.is_anonymous:
                user = User.objects.filter(username=request.data.get("user")).first()
            # return JsonResponse({'success': False, 'msg': 'Please login to bookmark tweets'})
        
            tweet_id = request.data.get("tweet_id")
            if not tweet_id:
                return JsonResponse({'success': False, 'msg': 'There was an issue while saving this bookmark. Please try again later'})
            tweet = Tweet.objects.filter(id=tweet_id).first()
            if not tweet:
                return JsonResponse({'success': False, 'msg': 'There was an error while saving this bookmark. Please try again later'})

            interaction_type = request.data.get("action_type")
            bookmarks = Interaction.objects.filter(user=user, interaction_type=interaction_type).first()
            if not bookmarks:
                bookmarks = Interaction.objects.create(
                    user=user,
                    interaction_type=interaction_type,
                )

            if bookmarks.tweets.filter(id=tweet_id).exists():
                bookmarks.tweets.remove(tweet)
            else:
                bookmarks.tweets.add(tweet)
            
            return JsonResponse({'success': True, 'msg': "Got profile!", "bookmarks": TweetSerializer(bookmarks.tweets.all(), many=True).data,})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

class GetBookmarks(APIView):
    def post(self, request,  *args, **kwargs):
        try:
            user = User.objects.filter(username=request.data.get("username")).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "User not found"})
            bookmark = Interaction.objects.filter(user=user, interaction_type="bookmark", ).first()
            if not bookmark:
                return JsonResponse({'success': False, 'msg': "No bookmarks found"})
            return JsonResponse({'success': True, 'bookmarks': TweetSerializer(bookmark.tweets.all(), many=True).data})
        except Exception as e:
            print('err', str(e))
            return JsonResponse({'success': False, 'msg': str(e)})