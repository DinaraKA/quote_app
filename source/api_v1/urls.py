from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from api_v1.views import LogoutView, QuoteViewSet


app_name = 'api_v1'

router = DefaultRouter()
router.register(r'quote', QuoteViewSet)

urlpatterns = [
    path('login/', obtain_auth_token, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls))
]