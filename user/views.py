from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .models import UserProfile, user
from django.contrib.auth.models import User

# Create your views here.

class UserAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username')
            if not username:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            user = User.objects.filter(username=username).first()
            if not user:
                return JsonResponse({'success': False, 'msg': "please provide username"})
            UserProfile.objects.create(
                user=user,
            )
            return JsonResponse({'success': True, 'msg': "user created"})
        except Exception as e:
            print('err while creating user', str(e))
            return JsonResponse({'success': False, 'msg': "err: " + str(e)})

            