from django.urls import re_path
from .consumers import ChatConsumer
 
websocket_urlpatterns = [
    # re_path(r"^ws/(?P<slug>[^/]+)/$", ChatConsumer.as_asgi(), name='chat'),
    # re_path(r"^ws/$", ChatConsumer.as_asgi(), name='chat'),
    re_path(r"^ws/(?P<user>[^/]+)/(?P<slug>[^/]+)/$", ChatConsumer.as_asgi()),
]
