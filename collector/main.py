from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

from semnan_collector.config import settings
from semnan_collector.crawler import Crawler
from semnan_collector.extractor import content_hash
from semnan_collector.storage import StateDB
from semnan_collector.uploader import Uploader


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler(settings.log_path, encoding="utf-8")],
    )


def process_page(page, db: StateDB, uploader: Uploader | None, force: bool) -> None:
    digest = content_hash(page)
    state_url = page.canonical_url or page.url
    db.upsert_extracted(url=state_url, canonical_url=page.canonical_url, content_hash=digest, title=page.title)

    print(f"\n[{page.local_hint}] {page.title}")
    print(page.canonical_url)
    print(f"text={len(page.clean_text)} chars | date={page.published_at or '-'} | images={len(page.images)}")

    if not force and db.has_same_hash(state_url, digest):
        print("  ↳ unchanged/already uploaded")
        return
    if not uploader:
        return
    try:
        result = uploader.upload(page, digest)
        db.mark_uploaded(state_url)
        classification = result.get("classification", {}) if isinstance(result, dict) else {}
        kind = classification.get("content_type") or page.local_hint
        category = classification.get("category") or "-"
        mirrored = len(result.get("images", [])) if isinstance(result, dict) and isinstance(result.get("images"), list) else "?"
        print(f"  ✓ uploaded | created={result.get('created')} | type={kind} | category={category} | mirrored_images={mirrored}")
    except Exception as exc:
        db.mark_failed(state_url, str(exc))
        print(f"  ✗ upload failed: {exc}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Semnan local website collector")
    sub = parser.add_subparsers(dest="command", required=True)

    crawl = sub.add_parser("crawl", help="Discover same-domain pages and optionally upload new/changed content")
    crawl.add_argument("--upload", action="store_true")
    crawl.add_argument("--force", action="store_true")
    crawl.add_argument("--limit", type=int, default=None)

    one = sub.add_parser("one", help="Test one URL")
    one.add_argument("url")
    one.add_argument("--upload", action="store_true")
    one.add_argument("--force", action="store_true")

    sub.add_parser("stats", help="Show local SQLite queue/status")

    args = parser.parse_args()
    configure_logging()
    db = StateDB(settings.database_path)

    if args.command == "stats":
        print(json.dumps(db.stats(), ensure_ascii=False, indent=2))
        db.close()
        return 0

    uploader = Uploader(settings) if args.upload else None
    crawler = Crawler(settings)
    try:
        if args.command == "one":
            page = crawler.one(args.url)
            if not page:
                print("صفحه قابل استخراج نبود یا متن کافی نداشت.")
                return 2
            process_page(page, db, uploader, args.force)
            return 0

        count = 0
        for page in crawler.crawl(args.limit):
            count += 1
            process_page(page, db, uploader, args.force)
        print(f"\nDone. extracted={count} stats={db.stats()}")
        return 0
    finally:
        crawler.close()
        if uploader:
            uploader.close()
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
