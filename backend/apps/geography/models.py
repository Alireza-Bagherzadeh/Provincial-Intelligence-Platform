from django.contrib.gis.db import models as gis_models
from django.db import models

from apps.core.models import ProvenancedModel


class County(ProvenancedModel):
    name = models.CharField(max_length=120, unique=True)
    code = models.CharField(max_length=30, unique=True)
    population = models.PositiveIntegerField(null=True, blank=True)
    boundary = gis_models.MultiPolygonField(srid=4326, null=True, blank=True)

    class Meta:
        verbose_name_plural = "counties"

    def __str__(self) -> str:
        return self.name
