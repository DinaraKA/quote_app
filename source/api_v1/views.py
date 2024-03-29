from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from api_v1.serializers import QuoteSerializer
from webapp.models import Quote, CONFIRMED_QUOTE


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class QuoteViewSet(ModelViewSet):
    permission_classes = IsAuthenticated
    queryset = Quote.objects.none()
    serializer_class = QuoteSerializer


    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Quote.objects.all()
        return Quote.objects.filter(status='confirmed')


    def get_permissions(self):
        if self.request.method == 'GET' or 'POST':
            return []
        else:
            return super().get_permissions()


    @action(methods=['post'], detail=True)
    def rate_up(self, request, pk=None):
        quote = self.get_object()
        quote.rating += 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.rating})


    @action(methods=['post'], detail=True)
    def rate_down(self, request, pk=None):
        quote = self.get_object()
        quote.rating -= 1
        quote.save()
        return Response({'id': quote.pk, 'rating': quote.rating})
