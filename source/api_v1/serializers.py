from rest_framework.serializers import ModelSerializer
from webapp.models import Quote


class QuoteSerializer(ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'email', 'status', 'rating', 'created_at']

