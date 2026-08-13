from django.core.management.base import BaseCommand, CommandError

from apps.intelligence.services.gemini import save_news_from_url


class Command(BaseCommand):
    help = "Read one public news URL with Gemini URL Context, enrich it and save it to NewsArticle."

    def add_arguments(self, parser):
        parser.add_argument("url")

    def handle(self, *args, **options):
        url = options["url"].strip()
        if not url.startswith(("http://", "https://")):
            raise CommandError("URL باید با http:// یا https:// شروع شود.")
        article = save_news_from_url(url)
        self.stdout.write(self.style.SUCCESS(f"Saved: {article.title}"))
