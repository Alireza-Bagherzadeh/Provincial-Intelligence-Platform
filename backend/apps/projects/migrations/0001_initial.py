# Generated manually from the initial project model. Re-run makemigrations after model changes.
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [("geography", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("source_system", models.CharField(default="manual", max_length=100)),
                ("source_record_id", models.CharField(blank=True, max_length=255)),
                ("observed_at", models.DateTimeField(blank=True, null=True)),
                ("ingested_at", models.DateTimeField(auto_now_add=True)),
                ("is_demo", models.BooleanField(default=False)),
                ("title", models.CharField(max_length=255)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("on_track", "On track"),
                            ("attention", "Needs attention"),
                            ("critical", "Critical"),
                            ("complete", "Complete"),
                        ],
                        default="on_track",
                        max_length=20,
                    ),
                ),
                ("planned_progress", models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ("actual_progress", models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ("responsible_organization", models.CharField(max_length=255)),
                (
                    "county",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="projects",
                        to="geography.county",
                    ),
                ),
            ],
        )
    ]
