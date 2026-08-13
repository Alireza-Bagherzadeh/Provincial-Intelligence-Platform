from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.core.management.commands.seed_demo import DEMO_COUNTIES, DOCUMENT_NEWS
from apps.geography.models import County
from apps.intelligence.models import NewsArticle


class Command(BaseCommand):
    help = "Import only the Semnan document-archive news/tourism items used by the dashboard."

    @transaction.atomic
    def handle(self, *args, **options):
        counties: dict[str, County] = {}
        for code, name in DEMO_COUNTIES:
            county, _ = County.objects.update_or_create(
                code=code,
                defaults={"name": name, "source_system": "document_archive", "is_demo": True},
            )
            counties[code] = county

        captured = date(2026, 8, 10)
        created_or_updated = 0
        for index, (title, category, kind, summary, county_code) in enumerate(DOCUMENT_NEWS):
            NewsArticle.objects.update_or_create(
                title=title,
                defaults={
                    "summary": summary,
                    "category": category,
                    "kind": kind,
                    "published_at": captured - timedelta(days=index % 4),
                    "source_label": "آرشیو اسناد ارسالی استانداری سمنان",
                    "county": counties.get(county_code) if county_code else None,
                    "sentiment_score": "0.10",
                    "importance": max(68, 92 - index * 2),
                    "tags": [category, "آرشیو اسناد"],
                    "source_system": "document_archive",
                    "source_record_id": f"document-news-{index + 1}",
                    "is_demo": True,
                },
            )
            created_or_updated += 1

        self.stdout.write(self.style.SUCCESS(f"Imported/updated {created_or_updated} document news items."))
