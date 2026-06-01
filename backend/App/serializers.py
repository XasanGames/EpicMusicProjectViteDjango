# backend/App/serializers.py

from rest_framework import serializers
from .models import MediaItem

class MediaItemSerializer(serializers.ModelSerializer):
    # Поле 'file' автоматически превратится в полную ссылку (URL),
    # если ты правильно настроил MEDIA_URL и MEDIA_ROOT в settings.py
    class Meta:
        model = MediaItem
        fields = ['id', 'name', 'file', 'description', 'is_featured', 'is_recommended', 'created_at']