from urllib.parse import urlparse

from django.core.management.base import BaseCommand

from apps.ingestion.models import RawContent
from apps.intelligence.models import NewsArticle


def is_obvious_non_article(url: str, title: str) -> bool:
    path = urlparse(url or "").path.rstrip("/").lower()
    title = (title or "").strip()
    if path in {"", "/fa", "/fa/news", "/news"}:
        return True
    if title.count("عنوان مطلب") >= 2:
        return True
    normalized_title = " ".join(title.replace("|", " ").split()).strip()
    if normalized_title in {"استانداری سمنان", "پورتال استانداری سمنان"}:
        return True
    return False


class Command(BaseCommand):
    help = "Preview/delete obvious homepage/archive/placeholder records created by older collector versions."

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="Actually delete matched rows. Default is dry-run.")

    def handle(self, *args, **options):
        raw_matches = [row for row in RawContent.objects.filter(source_system="semnan_collector") if is_obvious_non_article(row.source_url, row.title)]
        news_matches = [row for row in NewsArticle.objects.filter(source_system="semnan_collector") if is_obvious_non_article(row.source_url, row.title)]

        self.stdout.write(f"RawContent matches: {len(raw_matches)}")
        self.stdout.write(f"NewsArticle matches: {len(news_matches)}")
        for row in (news_matches[:20]):
            self.stdout.write(f" - {row.title} | {row.source_url}")

        if not options["apply"]:
            self.stdout.write(self.style.WARNING("Dry-run only. Run again with --apply to delete these obvious non-article rows."))
            return

        # Delete published records first; RawContent deletion can then proceed independently.
        for row in news_matches:
            row.delete()
        for row in raw_matches:
            row.delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted news={len(news_matches)} raw={len(raw_matches)}"))
