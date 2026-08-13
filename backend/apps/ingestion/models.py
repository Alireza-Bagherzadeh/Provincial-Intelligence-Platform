from __future__ import annotations

from django.db import models

from apps.core.models import ProvenancedModel


class RawContent(ProvenancedModel):
    class Status(models.TextChoices):
        RECEIVED = "received", "Received"
        ANALYZED = "analyzed", "Analyzed"
        PUBLISHED = "published", "Published"
        FAILED = "failed", "Failed"

    source_name = models.CharField(max_length=160, default="استانداری سمنان")
    source_url = models.URLField(max_length=1000, unique=True)
    canonical_url = models.URLField(max_length=1000, blank=True)
    title = models.CharField(max_length=500)
    clean_text = models.TextField()
    description = models.TextField(blank=True)
    published_at = models.DateField(null=True, blank=True)
    fetched_at = models.DateTimeField(auto_now=True)
    content_hash = models.CharField(max_length=64, db_index=True)
    local_hint = models.CharField(max_length=40, blank=True)
    images = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    classification = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RECEIVED)
    last_error = models.TextField(blank=True)

    class Meta:
        ordering = ["-fetched_at"]
        indexes = [models.Index(fields=["content_hash", "status"])]

    def __str__(self) -> str:
        return self.title
