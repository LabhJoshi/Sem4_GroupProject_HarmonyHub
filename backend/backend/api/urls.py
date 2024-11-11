from rest_framework.routers import DefaultRouter
from django.urls import path,include
from login.views import register_view,get_email,get_username,verify_password
from login.api.urls import user_router

router=DefaultRouter()

router.registry.extend(user_router.registry)

urlpatterns = [
    path('',include(router.urls)),
    path('register/', register_view, name='register'),
    path('get-email/',get_email,name='get email'),
    path('get-username/',get_username,name='get username'),
    path('verify_password/',verify_password,name='verify password')
]
