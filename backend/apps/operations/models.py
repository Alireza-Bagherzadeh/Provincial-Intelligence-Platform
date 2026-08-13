from django.db import models

from apps.core.models import ProvenancedModel
from apps.geography.models import County


class Organization(ProvenancedModel):
    name = models.CharField(max_length=180, unique=True)
    code = models.CharField(max_length=40, unique=True)
    performance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self) -> str:
        return self.name


class Decision(ProvenancedModel):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        AT_RISK = "at_risk", "At risk"
        OVERDUE = "overdue", "Overdue"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    due_date = models.DateField()
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    owner = models.ForeignKey(Organization, on_delete=models.PROTECT, related_name="decisions")
    county = models.ForeignKey(County, on_delete=models.PROTECT, related_name="decisions", null=True, blank=True)


class BudgetRecord(ProvenancedModel):
    county = models.ForeignKey(County, on_delete=models.PROTECT, related_name="budget_records")
    category = models.CharField(max_length=160)
    fiscal_year = models.CharField(max_length=10)
    allocated_amount = models.DecimalField(max_digits=18, decimal_places=0, default=0)
    actual_spending = models.DecimalField(max_digits=18, decimal_places=0, default=0)


class CitizenSignal(ProvenancedModel):
    county = models.ForeignKey(County, on_delete=models.PROTECT, related_name="citizen_signals")
    category = models.CharField(max_length=160)
    request_count = models.PositiveIntegerField(default=0)
    resolved_count = models.PositiveIntegerField(default=0)
    average_response_hours = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    change_percent = models.DecimalField(max_digits=7, decimal_places=2, default=0)


class ExecutiveReport(ProvenancedModel):
    class Status(models.TextChoices):
        READY = "ready", "Ready"
        REVIEW = "review", "Under review"
        DRAFT = "draft", "Draft"

    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=80)
    period_label = models.CharField(max_length=80)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT, related_name="reports", null=True, blank=True)
