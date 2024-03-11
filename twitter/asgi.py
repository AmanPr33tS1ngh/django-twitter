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
import sys
import django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "twitter.settings")
django.setup()
from django.core.asgi import get_asgi_application
django_app = get_asgi_application()
from chat.server import sio
import socketio
import uvicorn
app = socketio.ASGIApp(sio, other_asgi_app=django_app)

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=12346)