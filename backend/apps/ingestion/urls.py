from django.urls import path

from .views import health, ingest, media

urlpatterns = [
    path("ingest/", ingest, name="collector-ingest"),
    path("media/", media, name="collector-media"),
    path("health/", health, name="collector-health"),
]
