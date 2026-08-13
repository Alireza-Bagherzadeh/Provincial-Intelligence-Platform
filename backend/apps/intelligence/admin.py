from django.contrib import admin

from .models import (
    CrisisSignal,
    ForecastSignal,
    NewsArticle,
    PerformanceIndicator,
    ProcurementNotice,
    SectorIndicator,
    SpeechInsight,
)


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "kind", "county", "published_at", "importance", "source_label", "is_demo")
    list_filter = ("kind", "category", "county", "published_at", "is_demo")
    search_fields = ("title", "summary", "category", "source_label", "source_url")
    date_hierarchy = "published_at"
    ordering = ("-published_at", "-importance")


@admin.register(SectorIndicator)
class SectorIndicatorAdmin(admin.ModelAdmin):
    list_display = ("label", "domain", "county", "value", "unit", "period_label", "status", "is_demo")
    list_filter = ("domain", "status", "period_label", "county", "is_demo")
    search_fields = ("code", "label", "domain", "description")


@admin.register(ProcurementNotice)
class ProcurementNoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "organization", "county", "status", "published_at", "deadline", "reference_code", "is_demo")
    list_filter = ("status", "organization", "county", "published_at", "is_demo")
    search_fields = ("title", "reference_code", "organization__name")


@admin.register(SpeechInsight)
class SpeechInsightAdmin(admin.ModelAdmin):
    list_display = ("speaker", "topic", "county", "spoken_at", "commitment_status", "is_demo")
    list_filter = ("topic", "commitment_status", "county", "spoken_at", "is_demo")
    search_fields = ("speaker", "role", "summary", "commitment_text", "topic")
    date_hierarchy = "spoken_at"


@admin.register(PerformanceIndicator)
class PerformanceIndicatorAdmin(admin.ModelAdmin):
    list_display = ("organization", "label", "category", "score", "target", "period_label", "weight", "is_demo")
    list_filter = ("organization", "category", "period_label", "is_demo")
    search_fields = ("organization__name", "label", "category")


@admin.register(CrisisSignal)
class CrisisSignalAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "county", "severity", "status", "impact_score", "occurred_at", "is_demo")
    list_filter = ("severity", "status", "category", "county", "occurred_at", "is_demo")
    search_fields = ("title", "summary", "source_label")
    date_hierarchy = "occurred_at"


@admin.register(ForecastSignal)
class ForecastSignalAdmin(admin.ModelAdmin):
    list_display = ("metric_label", "domain", "county", "current_value", "forecast_value", "risk_level", "confidence", "as_of", "is_demo")
    list_filter = ("domain", "risk_level", "county", "as_of", "is_demo")
    search_fields = ("metric_label", "methodology", "domain")
    date_hierarchy = "as_of"
