from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .serializers import UserSerializer, UserProfileSerializer, ConnectionRequestSerializer, UserConnectionSerializer
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
        token['user'] = UserProfileSerializer(user).data
        return token

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        request = self.context.get('request')

        print("Request object:", request)  # Debugging statement

        if request:
            user = authenticate(request=request, username=username, password=password)
            if user:
                print("Logging in...")
                login(request, user)
                print('Request user:', request.user)  # Debugging statement
        else:
            print("Request object is None.")

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
            return JsonResponse({'success': True, 'msg': "users", "users": UserConnectionSerializer(
                users, context={'user': user}, many=True).data})

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
            print('user', user, 'profile', profile)
            access_for_profile = Connection.objects.filter(sender=user, receiver=profile).exists() or not_private or user == profile

            posts = Tweet.objects.none()

            if access_for_profile and view_type == 'likes':
                likes = Interaction.objects.filter(user=profile, interaction_type="like").first()
                if likes:
                    posts = likes.tweets.all().order_by("timestamp")
            elif access_for_profile  and view_type == 'replies':
                posts = Tweet.objects.filter(parent__isnull=False, user=profile).order_by("timestamp")
            elif access_for_profile  and view_type == 'bookmarks':
                bookmark = Interaction.objects.filter(user=profile, interaction_type="bookmark").first()
                if bookmark:
                    posts = bookmark.tweets.all().order_by("timestamp")
            else:
                posts = Tweet.objects.filter(user=profile).order_by("timestamp")

            serialized_data = TweetSerializer(posts, many=True, context={'user': user}).data

            return JsonResponse({'success': True, 'msg': "Got profile!", "user": UserProfileSerializer(profile, context={'user': user}).data,
                                 'posts': serialized_data,})
        except Exception as e:
            print('err at get_profile', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})


class UploadImage(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Please Authenticate'})

            image = None
            upload_type = request.data.get('upload_type')

            if 'image' in request.FILES:
                image = request.FILES.get('image')
                if image.size > 4194304:
                    return JsonResponse({'success': False, 'msg': 'Image Size Too Big. Please upload an image with '
                                                                  'size less than 4MB.'})

            if upload_type == 'profile_picture':
                user.profile_picture = image
                img_url = str(user.profile_picture)
            elif upload_type == 'banner':
                user.banner = image
                img_url = str(user.banner)
            else:
                return JsonResponse({'success': False, 'msg': 'Provide valid type!'})
            user.save()

            return JsonResponse({'success': True, 'msg': "Updated Picture!", 'profile_picture': img_url})
        except Exception as e:
            print('err at get_profile', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})


class ConnectionAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            receiver_username = request.data.get("receiver")
            # if not receiver_username:
            #     return JsonResponse({'success': False, 'msg': 'Wrong user!'})

            receiver = User.objects.filter(username=receiver_username).first()
            if not receiver or receiver == user:
                return JsonResponse({'success': False, 'msg': 'Wrong user!'})

            connection_type = request.data.get("type")
            if Connection.objects.filter(sender=user, receiver=receiver).exists() and connection_type == 'create':
                return JsonResponse({'success': False, 'msg': 'Connection already exists!'})

            is_accepted = not receiver.is_private
            if connection_type == 'create':
                Connection.objects.create(
                    sender=user,
                    receiver=receiver,
                    is_accepted=is_accepted,
                )
            elif connection_type == 'delete':
                Connection.objects.filter(
                    sender=user,
                    receiver=receiver,
                ).delete()
            else:
                return JsonResponse({'success': False, 'msg': 'Wrong connection type!'})

            return JsonResponse({'success': True, 'msg': f'Connection {connection_type}d!', 'user': UserProfileSerializer(receiver, context={'user': user}).data})

        except Exception as e:
            print("err ConnectionAPI", str(e))
            return JsonResponse({'success': False, 'msg': str(e)})


class GetRequests(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!', 'requests': list()})

            connections = Connection.objects.filter(
                receiver=user,
                is_accepted=False,
            )
            return JsonResponse({'success': True, 'msg': "requests received", 'requests': ConnectionRequestSerializer(connections, many=True).data})

        except Exception as e:
            print('err GetRequests', str(e))
            return JsonResponse({'success': False, 'msg': str(e), 'requests': list()})


class GetRequests(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!', 'requests': list()})

            connections = Connection.objects.filter(
                receiver=user,
                is_accepted=False,
            )
            return JsonResponse({'success': True, 'msg': "requests received", 'requests': ConnectionRequestSerializer(connections, many=True).data})

        except Exception as e:
            print('err GetRequests', str(e))
            return JsonResponse({'success': False, 'msg': str(e), 'requests': list()})


class RequestApi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            id = request.data.get('id')
            connection = Connection.objects.filter(
                id=id,
            ).first()
            if not connection:
                return JsonResponse({'success': False, 'msg': 'Connection not found!'})

            request_action_type = request.data.get('type')
            if request_action_type == 'delete':
                connection.delete()
            elif request_action_type == 'accept':
                connection.is_accepted = True
                connection.save()
                request_action_type = 'accepted'
            else:
                return JsonResponse({'success': False, 'msg': 'Wrong connection type!'})

            return JsonResponse({'success': True, 'msg': f'Request {request_action_type} successfully!'})

        except Exception as e:
            print('err GetRequests', str(e))
            return JsonResponse({'success': False, 'msg': str(e)})


class EditProfile(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if user.is_anonymous:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            edited_profile = request.data.get('user')
            if not edited_profile:
                return JsonResponse({'success': False, 'msg': 'Authenticate!'})

            username = edited_profile.get('username')
            if username:
                user.username = username

            first_name = edited_profile.get('firstName')
            if first_name:
                user.first_name = first_name

            last_name = edited_profile.get('lastName')
            if last_name:
                user.last_name = last_name

            location = edited_profile.get('location')
            if location:
                user.location = location

            bio = edited_profile.get('bio')
            if bio:
                user.biography = bio

            is_private = edited_profile.get('isPrivate')
            user.is_private = is_private
            user.save()

            return JsonResponse({'success': True, 'msg': f'Profile updated!', 'user': UserProfileSerializer(user, context={'user': user}).data})

        except Exception as e:
            print('err GetRequests', str(e))
            return JsonResponse({'success': False, 'msg': str(e)})
