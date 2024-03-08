from django.urls import path
from .views import *
from twitter import settings
from rest_framework_simplejwt.views import TokenRefreshView

url_patterns = [
    path('user_api/', UserAPI.as_view(), name='users'),
    path('sign_in/', SignIn.as_view(), name='users'),
    path('sign_up/', SignUp.as_view(), name='users'),
    path('log_out/', LogOut.as_view(), name='users'),
    path('get_profile/', GetProfile.as_view(), name='users'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns = url_patterns
