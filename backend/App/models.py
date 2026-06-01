from django.db import models

class MediaItem(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='media_files/')
    description = models.TextField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name