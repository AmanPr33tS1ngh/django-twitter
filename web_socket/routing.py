from django.urls import re_path
from .consumers import ChatConsumer
 
print('inside routing')
websocket_urlpatterns = [
    re_path(r"^ws/(?P<slug>[^/]+)/$", ChatConsumer.as_asgi(), name='chat'),
]
