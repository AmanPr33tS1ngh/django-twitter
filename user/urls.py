from django.urls import path
from .views import *
from twitter import settings
from rest_framework_simplejwt.views import TokenRefreshView

url_patterns = [
    path('user_api/', UserAPI.as_view(), name='users'),
    path('sign_in/', SignIn.as_view(), name='users'),
    path('sign_up/', SignUp.as_view(), name='users'),
    path('sign_out/', LogOut.as_view(), name='users'),
    path('get_profile/', GetProfile.as_view(), name='users'),
    path('get_users/', GetUsers.as_view(), name='get_users'),
    path('upload_image/', UploadImage.as_view(), name='upload_image'),
    path('create_connection/', CreateConnection.as_view(), name='create_connection'),
    path('get_requests/', GetRequests.as_view(), name='get_requests'),
    path('request_api/', RequestApi.as_view(), name='request_api'),
    path('edit_profile/', EditProfile.as_view(), name='edit_profile'),

    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns = url_patterns
