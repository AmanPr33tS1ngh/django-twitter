"""
ASGI config for twitter project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twitter.settings')

# application = get_asgi_application()

import os
from django.core.asgi import get_asgi_application
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twitter.settings')
from channels.routing import ProtocolTypeRouter , URLRouter
from web_socket.routing import websocket_urlpatterns
 
application = ProtocolTypeRouter(
    {
        "http" : get_asgi_application() , 
        "websocket" :
            URLRouter(
                websocket_urlpatterns
            )    
        
    }
)