from django.db import models

from apps.core.models import ProvenancedModel
from apps.geography.models import County
from apps.operations.models import Organization


class NewsArticle(ProvenancedModel):
    class Kind(models.TextChoices):
        NEWS = "news", "News"
        TOURISM = "tourism", "Tourism"
        CULTURE = "culture", "Culture & heritage"
        NOTICE = "notice", "Notice"
        REPORT = "report", "Report"
        SPEECH = "speech", "Speech"
        PROCUREMENT = "procurement", "Procurement"
        PROJECT = "project", "Project"
        CRISIS = "crisis", "Crisis"
        SECTOR = "sector", "Sector intelligence"
        INVESTMENT = "investment", "Investment"
        OTHER = "other", "Other"

    title = models.CharField(max_length=280)
    summary = models.TextField()
    body = models.TextField(blank=True)
    images = models.JSONField(default=list, blank=True)
    ai_modules = models.JSONField(default=list, blank=True)
    ai_confidence = models.PositiveSmallIntegerField(default=0)
    category = models.CharField(max_length=100)
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.NEWS)
    published_at = models.DateField()
    source_url = models.URLField(blank=True)
    source_label = models.CharField(max_length=120, default="استانداری سمنان")
    county = models.ForeignKey(County, on_delete=models.SET_NULL, related_name="news_articles", null=True, blank=True)
    sentiment_score = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    importance = models.PositiveSmallIntegerField(default=3)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["-published_at", "-importance", "title"]

    def __str__(self) -> str:
        return self.title


class SectorIndicator(ProvenancedModel):
    class Status(models.TextChoices):
        HEALTHY = "healthy", "Healthy"
        ATTENTION = "attention", "Attention"
        CRITICAL = "critical", "Critical"

    code = models.CharField(max_length=80)
    domain = models.CharField(max_length=80)
    label = models.CharField(max_length=180)
    value = models.DecimalField(max_digits=14, decimal_places=2)
    unit = models.CharField(max_length=40, blank=True)
    period_label = models.CharField(max_length=80)
    trend_percent = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    benchmark_value = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.HEALTHY)
    county = models.ForeignKey(County, on_delete=models.CASCADE, related_name="sector_indicators", null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["code", "period_label", "county"], name="uniq_indicator_period_county")]
        ordering = ["domain", "label", "county__name"]


class ProcurementNotice(ProvenancedModel):
    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        OPEN = "open", "Open"
        EVALUATION = "evaluation", "Evaluation"
        AWARDED = "awarded", "Awarded"

    title = models.CharField(max_length=280)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT, related_name="procurements")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    published_at = models.DateField()
    deadline = models.DateField(null=True, blank=True)
    estimated_amount = models.DecimalField(max_digits=20, decimal_places=0, default=0)
    procurement_method = models.CharField(max_length=100, default="مناقصه عمومی")
    county = models.ForeignKey(County, on_delete=models.SET_NULL, related_name="procurements", null=True, blank=True)
    reference_code = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["-published_at", "title"]


class SpeechInsight(ProvenancedModel):
    class CommitmentStatus(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In progress"
        COMPLETED = "completed", "Completed"
        AT_RISK = "at_risk", "At risk"

    speaker = models.CharField(max_length=160)
    role = models.CharField(max_length=160)
    spoken_at = models.DateField()
    topic = models.CharField(max_length=120)
    summary = models.TextField()
    commitment_text = models.TextField(blank=True)
    commitment_status = models.CharField(max_length=20, choices=CommitmentStatus.choices, default=CommitmentStatus.OPEN)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, related_name="speech_insights", null=True, blank=True)
    source_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-spoken_at", "topic"]


class PerformanceIndicator(ProvenancedModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="performance_indicators")
    category = models.CharField(max_length=100)
    label = models.CharField(max_length=180)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    target = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    period_label = models.CharField(max_length=80)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["organization", "label", "period_label"], name="uniq_org_kpi_period")]
        ordering = ["organization__name", "category", "label"]


class CrisisSignal(ProvenancedModel):
    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        MONITORING = "monitoring", "Monitoring"
        RESOLVED = "resolved", "Resolved"

    title = models.CharField(max_length=240)
    category = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=Severity.choices, default=Severity.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.MONITORING)
    occurred_at = models.DateField()
    impact_score = models.PositiveSmallIntegerField(default=0)
    summary = models.TextField(blank=True)
    source_label = models.CharField(max_length=120, default="سامانه پایش")
    county = models.ForeignKey(County, on_delete=models.SET_NULL, related_name="crisis_signals", null=True, blank=True)

    class Meta:
        ordering = ["-occurred_at", "-impact_score", "title"]


class ForecastSignal(ProvenancedModel):
    class Risk(models.TextChoices):
        HEALTHY = "healthy", "Healthy"
        ATTENTION = "attention", "Attention"
        CRITICAL = "critical", "Critical"

    domain = models.CharField(max_length=100)
    metric_label = models.CharField(max_length=180)
    as_of = models.DateField()
    horizon_label = models.CharField(max_length=80)
    current_value = models.DecimalField(max_digits=14, decimal_places=2)
    forecast_value = models.DecimalField(max_digits=14, decimal_places=2)
    lower_bound = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    upper_bound = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=40, blank=True)
    risk_level = models.CharField(max_length=20, choices=Risk.choices, default=Risk.HEALTHY)
    confidence = models.PositiveSmallIntegerField(default=0)
    methodology = models.CharField(max_length=180, blank=True)
    county = models.ForeignKey(County, on_delete=models.SET_NULL, related_name="forecast_signals", null=True, blank=True)

    class Meta:
        ordering = ["domain", "metric_label", "county__name"]
