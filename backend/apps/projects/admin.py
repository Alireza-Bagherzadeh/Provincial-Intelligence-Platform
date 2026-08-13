from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "county", "status", "planned_progress", "actual_progress", "responsible_organization", "is_demo")
    list_filter = ("status", "county", "is_demo")
    search_fields = ("title", "responsible_organization", "county__name")
