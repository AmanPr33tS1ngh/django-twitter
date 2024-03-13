from django.urls import path
from .consumers import ChatConsumer

urlpatterns = [
    path("ws/", ChatConsumer, name="chat"),
]
