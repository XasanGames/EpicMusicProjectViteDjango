from django.contrib import admin
from .models import MediaItem

@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    # Эти колонки будут видны в списке всех записей
    list_display = ('id', 'name', 'is_featured', 'is_recommended', 'created_at')
    # А по этим можно будет кликнуть и изменить прямо в списке
    list_editable = ('is_featured', 'is_recommended')
    # Добавляем поиск по имени прямо в админке
    search_fields = ('name',)