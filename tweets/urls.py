from django.urls import path
from .views import *
from twitter import settings
url_patterns = [
    path('tweet_api/', GetTweets.as_view(), name='get_tweets'),
    path('get_tweets_with_tab/', GetTweetsBasedOnTab.as_view(), name="get_tweets_with_tab"),
    path('get_matching_tweets/', GetMatchingTweets.as_view(), name="get_matching_tweets"),
]

if settings.DEBUG:
    urlpatterns = url_patterns