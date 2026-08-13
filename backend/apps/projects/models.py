from django.db import models

from apps.core.models import ProvenancedModel
from apps.geography.models import County


class Project(ProvenancedModel):
    class Status(models.TextChoices):
        ON_TRACK = "on_track", "On track"
        ATTENTION = "attention", "Needs attention"
        CRITICAL = "critical", "Critical"
        COMPLETE = "complete", "Complete"

    title = models.CharField(max_length=255)
    county = models.ForeignKey(County, on_delete=models.PROTECT, related_name="projects")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ON_TRACK)
    planned_progress = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    actual_progress = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    responsible_organization = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.title
