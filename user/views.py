from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .serializers import UserSerializer, UserProfileSerializer
# Create your views here.
from rest_framework import permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from tweets.serializers import TweetSerializer, BookmarkSerializer
from tweets.models import Tweet, Interaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.username
        return token
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request')
        user = authenticate(request=request, username=username, password=password)

        if user:
            print("logginding")
            login(request, user)
        print('request user', request.user)
        data = super().validate(attrs)
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.user
            if username.is_anonymous:
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

class GetUsers(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': "please authenticate first"})

            username = request.data.get('username')
            if not username:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            
            users = User.objects.filter(username__icontains=username)
            return JsonResponse({'success': True, 'msg': "users", "users": UserSerializer(users, many=True).data})
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
            print("created_user", user)
            authenticated_user = authenticate(request, username=username, password=password)
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            token_serializer = MyTokenObtainPairSerializer(data={'username': user.username, 'password': password})
            token_serializer.is_valid(raise_exception=True)
            
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
            if user.is_authenticated:
                return JsonResponse({'success': False, 'msg': "You are already authenticated. Refresh the page"})
            username = request.data.get('username')
            password = request.data.get('password')
            if not User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'msg': "Username is not registered. Please Sign up first."})
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return JsonResponse({'success': True, 'msg': "Sign up successful!"})
            print(request.user)
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
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            print(request.user.is_authenticated)
            print(request.user)
            profile_name = request.data.get('profile')
            if not profile_name:
                return JsonResponse({'success': False, 'msg': 'Please provide valid username'})
            profile = User.objects.filter(username=profile_name).first()
            if not profile:
                return JsonResponse({'success': False, 'msg': 'Please provide valid username'})
            not_private = not profile.is_private
            view_type = request.data.get('view_type')
            posts = likes = replies = Tweet.objects.none()
            serialized_bookmarks = serialized_likes = None
            bookmark = Interaction.objects.filter(user=profile, interaction_type="bookmark").first()
            likes = Interaction.objects.filter(user=profile, interaction_type="like").first()
            
            if likes and not_private and view_type == 'likes':
                serialized_likes = TweetSerializer(likes.tweets.all().order_by("timestamp"), context={'user': user}, many=True).data
            elif not_private  and view_type == 'replies':
                replies = Tweet.objects.filter(parent__isnull=False, user=profile).order_by("timestamp")
            elif bookmark and not_private  and view_type == 'bookmarks':
                serialized_bookmarks = TweetSerializer(bookmark.tweets.all().order_by("timestamp"), context={'user': user}, many=True).data
            else:
                posts = Tweet.objects.filter(user=profile).order_by("timestamp")
            
            return JsonResponse({'success': True, 'msg': "Got profile!", "user": UserProfileSerializer(profile).data,
                                 'posts': TweetSerializer(posts, many=True, context={'user': user}).data, 'replies': TweetSerializer(replies, many=True, context={'user': user}).data, 
                                 'likes': serialized_likes, 'bookmarks': serialized_bookmarks})
        except Exception as e:
            print('err at get_profile', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})
