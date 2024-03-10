from django.urls import path
from .views import *
from twitter import settings
url_patterns = [
    path('tweet_api/', GetTweets.as_view(), name='get_tweets'),
    path('get_tweet/', GetTweet.as_view(), name="get_tweet"),
    path('get_matching_tweets/', GetMatchingTweets.as_view(), name="get_matching_tweets"),
    path('take_action/', TakeAction.as_view(), name="bookmark"),
    path('get_bookmarks/', GetBookmarks.as_view(), name="get_bookmarks"),
]

if settings.DEBUG:
    urlpatterns = url_patterns