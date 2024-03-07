from django.urls import path
from .views import *
from twitter import settings

url_patterns = [
    path('user_api/', UserAPI.as_view(), name='users'),
    path('sign_in/', SignIn.as_view(), name='users'),
    path('sign_up/', SignUp.as_view(), name='users'),
    path('sign_out/', SignOut.as_view(), name='users'),
]

if settings.DEBUG:
    urlpatterns = url_patterns