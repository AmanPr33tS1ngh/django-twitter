from django.urls import path
from .views import *
from twitter import settings

url_patterns = [
    path('user_api/', UserAPI.as_view(), name='users'),
]

if settings.DEBUG:
    urlpatterns = url_patterns