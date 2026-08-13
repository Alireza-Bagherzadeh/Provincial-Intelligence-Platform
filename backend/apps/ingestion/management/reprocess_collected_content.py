from django.core.management.base import BaseCommand

from apps.ingestion.models import RawContent
from apps.ingestion.services import classify, publish


class Command(BaseCommand):
    help = "Reclassify and republish existing RawContent with deterministic rules (no Gemini/API calls)."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=0)

    def handle(self, *args, **options):
        queryset = RawContent.objects.order_by("fetched_at")
        if options["limit"]:
            queryset = queryset[: options["limit"]]

        done = 0
        failed = 0
        for raw in queryset:
            try:
                result = classify(raw)
                raw.classification = result.model_dump(mode="json")
                publish(raw, result)
                raw.status = RawContent.Status.PUBLISHED
                raw.last_error = ""
                raw.save(update_fields=["classification", "status", "last_error", "fetched_at"])
                done += 1
                self.stdout.write(self.style.SUCCESS(f"✓ [{result.content_type}] {raw.title}"))
            except Exception as exc:
                failed += 1
                raw.status = RawContent.Status.FAILED
                raw.last_error = str(exc)
                raw.save(update_fields=["status", "last_error", "fetched_at"])
                self.stderr.write(f"✗ {raw.title}: {exc}")

        self.stdout.write(self.style.SUCCESS(f"done={done} failed={failed} | classifier=rules | gemini_calls=0"))
