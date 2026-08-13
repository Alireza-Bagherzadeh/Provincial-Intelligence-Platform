from django.contrib import admin

from .models import BudgetRecord, CitizenSignal, Decision, ExecutiveReport, Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "performance_score", "is_demo")
    search_fields = ("name", "code")
    list_filter = ("is_demo",)


@admin.register(Decision)
class DecisionAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "county", "status", "due_date", "progress", "is_demo")
    list_filter = ("status", "owner", "county", "due_date", "is_demo")
    search_fields = ("title", "owner__name")
    date_hierarchy = "due_date"


@admin.register(BudgetRecord)
class BudgetRecordAdmin(admin.ModelAdmin):
    list_display = ("county", "category", "fiscal_year", "allocated_amount", "actual_spending", "is_demo")
    list_filter = ("fiscal_year", "category", "county", "is_demo")
    search_fields = ("county__name", "category")


@admin.register(CitizenSignal)
class CitizenSignalAdmin(admin.ModelAdmin):
    list_display = ("county", "category", "request_count", "resolved_count", "average_response_hours", "change_percent", "is_demo")
    list_filter = ("county", "category", "is_demo")
    search_fields = ("county__name", "category")


@admin.register(ExecutiveReport)
class ExecutiveReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_type", "period_label", "status", "organization", "is_demo")
    list_filter = ("status", "report_type", "period_label", "organization", "is_demo")
    search_fields = ("title", "report_type", "organization__name")
