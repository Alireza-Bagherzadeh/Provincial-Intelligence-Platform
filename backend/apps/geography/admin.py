from django.contrib import admin

from .models import County


@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "population", "is_demo")
    search_fields = ("name", "code")
    list_filter = ("is_demo",)
