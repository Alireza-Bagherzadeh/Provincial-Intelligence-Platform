import uuid

from django.db import models


class ProvenancedModel(models.Model):
    """Base for imported facts: authoritative records always retain their origin."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_system = models.CharField(max_length=100, default="manual")
    source_record_id = models.CharField(max_length=255, blank=True)
    observed_at = models.DateTimeField(null=True, blank=True)
    ingested_at = models.DateTimeField(auto_now_add=True)
    is_demo = models.BooleanField(default=False)

    class Meta:
        abstract = True
