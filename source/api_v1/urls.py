from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import LogoutView

app_name = 'api_v1'

urlpatterns = [
    path('login/', obtain_auth_token, name='login'),
    path('logout/', LogoutView.as_view(), name='logout')
]