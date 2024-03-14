from django.urls import path
from .views import *
from twitter import settings

url_patterns = [
    path('get_rooms/', GetRooms.as_view(), name='get_rooms'),
    path('get_room/', GetRoom.as_view(), name='get_rooms'),
    path('create_room/', CreateRoom.as_view(), name="create_roome"),
    path('send_message/', SendMessage.as_view(), name="send_message"),
    
]

if settings.DEBUG:
    urlpatterns = url_patterns