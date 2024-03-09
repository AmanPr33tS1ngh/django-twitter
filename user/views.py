from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import User
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .serializers import UserSerializer, UserProfileSerializer
# Create your views here.
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from tweets.serializers import TweetSerializer
from tweets.models import Tweet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.username

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username')
            if not username:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            user = User.objects.filter(username=username).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            User.objects.create(
                user=user,
            )
            return JsonResponse({'success': True, 'msg': "user created"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

class SignUp(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_authenticated:
                return JsonResponse({'success': False, 'msg': "You are already authenticated. Refresh the page"})
            username = request.data.get('username').strip()
            first_name = request.data.get('first_name').strip()
            last_name = request.data.get('last_name').strip()
            password = request.data.get('password').strip()
            email = request.data.get('email').strip()
            verify_pass = request.data.get('verifyPassword').strip()
            print(username, first_name, last_name, password, email, verify_pass)
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'msg': "Username/email already registered. Please try with another username."})

            if not username.isalnum():
                return JsonResponse({'success': False, 'msg': "Username should be alpha numeric"})

            if password != verify_pass:
                return JsonResponse({'success': False, 'msg': "Both passwords should match"})

            user = User.objects.create_user(
                username=username,
                last_name=last_name,
                first_name=first_name,
                password=password,
                email=email
            )

            authenticated_user = authenticate(request, username=username, password=password)
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            token_serializer = MyTokenObtainPairSerializer(data={'username': user.username, 'password': password})
            token_serializer.is_valid(raise_exception=True)
            print("auth", user)
            
            if not authenticated_user:
                return JsonResponse({'success': False, 'msg': "Failed to authenticate user."})
        
            login(request, authenticated_user)
            return JsonResponse({'success': True, 'msg': "User Created", "user": UserSerializer(user).data, 
                                    "token": {'access_token': access_token, 'refresh_token': str(refresh)}})

        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

class SignIn(APIView):
    permission_classes = (permissions.AllowAny, )
    authentication_classes = (SessionAuthentication, )

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            print(user)
            if user.is_authenticated:
                return JsonResponse({'success': False, 'msg': "You are already authenticated. Refresh the page"})
            username = request.data.get('username')
            password = request.data.get('password')
            if not User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'msg': "Username is not registered. Please Sign up first."})
            user = authenticate(request, username=username, password=password)
            print(user)
            if user:
                login(request, user)
                return JsonResponse({'success': True, 'msg': "Sign up successful!"})
            return JsonResponse({'success': True, 'msg': "Couldn't signin due to an error. Please try again later"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})



class LogOut(APIView):
    def post(self, request, *args, **kwargs):
        try:
            logout(request)
            return JsonResponse({'success': True, 'msg': "Logged out!"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})


class GetProfile(APIView):
    def post(self, request, *args, **kwargs):
        try:
            profile_name = request.data.get('profile')
            if not profile_name:
                return JsonResponse({'success': False, 'msg': 'Please provide valid username'})
            profile = User.objects.filter(username=profile_name).first()
            print(profile)
            if not profile:
                return JsonResponse({'success': False, 'msg': 'Please provide valid username'})
            not_private = not profile.is_private
            view_type = request.data.get('view_type')
            posts = likes = replies = Tweet.objects.none()
            
            if not_private and view_type == 'likes':
                likes = Tweet.objects.filter(likes=profile).order_by("timestamp")
            elif not_private  and view_type == 'replies':
                replies = Tweet.objects.filter(parent__isnull=False, user=profile).order_by("timestamp")
            else:
                posts = Tweet.objects.filter(user=profile).order_by("timestamp")
            
            return JsonResponse({'success': True, 'msg': "Got profile!", "user": UserProfileSerializer(profile).data,
                                 'posts': TweetSerializer(posts, many=True).data, 'replies': TweetSerializer(replies, many=True).data, 
                                 'likes': TweetSerializer(likes, many=True).data})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

