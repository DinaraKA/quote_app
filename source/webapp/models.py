from django.db import models

NEW_QUOTE = 'new'
CONFIRMED_QUOTE = 'confirmed'
QUOTE_STATUS_CHOICES = (
    (NEW_QUOTE, 'New'),
    (CONFIRMED_QUOTE, 'Confirmed')
)


class Quote(models.Model):
    text = models.TextField(max_length=1000, verbose_name="Text")
    author = models.CharField(max_length=20, verbose_name='Added by')
    email = models.EmailField(verbose_name='Email')
    status = models.CharField(max_length=20, choices=QUOTE_STATUS_CHOICES, default=NEW_QUOTE, verbose_name='Status')
    rating = models.IntegerField(default=0, verbose_name='Raiting')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Added date")

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'Quote'
        verbose_name_plural = 'Quotes'


