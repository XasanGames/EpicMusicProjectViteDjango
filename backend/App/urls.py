from django.urls import path
from .views import (
    get_featured, get_recommended, search_media, upload_media, get_recent,
    login_view, logout_view, current_user_view, register_view
)

urlpatterns = [
    path('featured/', get_featured, name='featured'),
    path('recommended/', get_recommended, name='recommended'),
    path('search/', search_media, name='search'),
    path('upload/', upload_media, name='upload'),
    path('recent/', get_recent, name='recent'),
    
    # Auth endpoints
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', current_user_view, name='current_user'),
    path('auth/register/', register_view, name='register'),
]
