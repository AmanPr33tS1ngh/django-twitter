from django.urls import path
from .consumers import ChatConsumer

print('urlssss')
urlpatterns = [
    path("ws/<str:slug>/", ChatConsumer),
]
