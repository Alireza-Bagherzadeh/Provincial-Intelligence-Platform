from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView
from django.urls import include, path

from apps.intelligence.views import (
    ai_assistant,
    management_crud,
    management_import_archive,
    management_ingest_news,
)
from config.schema import schema

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", csrf_exempt(GraphQLView.as_view(schema=schema, graphql_ide="graphiql"))),
    path("api/ai/assistant/", ai_assistant, name="ai-assistant"),
    path("api/management/crud/", management_crud, name="management-crud"),
    path("api/management/import-archive/", management_import_archive, name="management-import-archive"),
    path("api/management/ingest-news/", management_ingest_news, name="management-ingest-news"),
    path("api/collector/", include("apps.ingestion.urls")),

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
