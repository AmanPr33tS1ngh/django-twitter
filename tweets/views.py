from django.http import JsonResponse
from rest_framework.views import APIView
from .models import *
from user.models import User
from .serializers import *
from user.serializers import UserLabelValueSerializer

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
            print(matching_users)
            return JsonResponse({'success': True, 'msg': 'new tweet', 'results': result, "users": matching_users})
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        

class GetTweetsBasedOnTab(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            # if user.is_anonymous:
                # return JsonResponse({'success': False, 'msg': 'You need to authenticate first to search!'})
            tweets = Tweet.objects.filter().order_by("timestamp")
            return JsonResponse({'success': True, 'msg': 'new tweet', 'tweets': TweetSerializer(tweets, many=True).data})
        except Exception as e:
            print('error while creating tweet', str(e))
            return JsonResponse({'success': False, "msg": str(e)})
        


class BookmarkTweet(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                user = User.objects.filter(username='superuser').first()
                # return JsonResponse({'success': False, 'msg': 'Please login to bookmark tweets'})

            tweet_id = request.data.get("tweet_id")
            if not tweet_id:
                return JsonResponse({'success': False, 'msg': 'There was an issue while saving this bookmark. Please try again later'})
            tweet = Tweet.objects.filter(id=id).first()
            if not tweet:
                return JsonResponse({'success': False, 'msg': 'There was an error while saving this bookmark. Please try again later'})

            bookmarks = Bookmark.objects.filter(user=user).first()
            if not bookmarks:
                bookmarks = Bookmark.objects.create(
                    user=user,
                )
            bookmarked_tweet = bookmarks.tweet.filter(id=tweet_id).first()
            if bookmarked_tweet:
                bookmarks.tweet.remove(bookmarked_tweet)
            else:
                bookmarks.tweet.remove(tweet)
            
            return JsonResponse({'success': True, 'msg': "Got profile!", "user": BookmarkSerializer(bookmarks).data})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

