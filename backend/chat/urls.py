from django.urls import path
from .views import chat_query

urlpatterns = [
    path('', chat_query),   # IMPORTANT (empty path)
]
