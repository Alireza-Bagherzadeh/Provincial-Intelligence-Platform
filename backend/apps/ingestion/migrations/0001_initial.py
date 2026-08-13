# Generated for Semnan collector integration.
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="RawContent",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("source_system", models.CharField(default="manual", max_length=100)),
                ("source_record_id", models.CharField(blank=True, max_length=255)),
                ("observed_at", models.DateTimeField(blank=True, null=True)),
                ("ingested_at", models.DateTimeField(auto_now_add=True)),
                ("is_demo", models.BooleanField(default=False)),
                ("source_name", models.CharField(default="استانداری سمنان", max_length=160)),
                ("source_url", models.URLField(max_length=1000, unique=True)),
                ("canonical_url", models.URLField(blank=True, max_length=1000)),
                ("title", models.CharField(max_length=500)),
                ("clean_text", models.TextField()),
                ("description", models.TextField(blank=True)),
                ("published_at", models.DateField(blank=True, null=True)),
                ("fetched_at", models.DateTimeField(auto_now=True)),
                ("content_hash", models.CharField(db_index=True, max_length=64)),
                ("local_hint", models.CharField(blank=True, max_length=40)),
                ("images", models.JSONField(blank=True, default=list)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("classification", models.JSONField(blank=True, default=dict)),
                ("status", models.CharField(choices=[("received", "Received"), ("analyzed", "Analyzed"), ("published", "Published"), ("failed", "Failed")], default="received", max_length=20)),
                ("last_error", models.TextField(blank=True)),
            ],
            options={"ordering": ["-fetched_at"]},
        ),
        migrations.AddIndex(
            model_name="rawcontent",
            index=models.Index(fields=["content_hash", "status"], name="ingestion_r_content_6f2dbd_idx"),
        ),
    ]
