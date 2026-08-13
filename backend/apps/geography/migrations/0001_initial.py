# Generated manually from the initial geography model. Re-run makemigrations after model changes.
import django.contrib.gis.db.models.fields
import django.db.models.deletion
import uuid
from django.contrib.postgres.operations import CreateExtension
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        CreateExtension("postgis"),
        migrations.CreateModel(
            name="County",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("source_system", models.CharField(default="manual", max_length=100)),
                ("source_record_id", models.CharField(blank=True, max_length=255)),
                ("observed_at", models.DateTimeField(blank=True, null=True)),
                ("ingested_at", models.DateTimeField(auto_now_add=True)),
                ("is_demo", models.BooleanField(default=False)),
                ("name", models.CharField(max_length=120, unique=True)),
                ("code", models.CharField(max_length=30, unique=True)),
                ("population", models.PositiveIntegerField(blank=True, null=True)),
                (
                    "boundary",
                    django.contrib.gis.db.models.fields.MultiPolygonField(
                        blank=True, null=True, srid=4326
                    ),
                ),
            ],
            options={"verbose_name_plural": "counties"},
        ),
    ]
