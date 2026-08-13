from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def _float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, str(default)))
    except ValueError:
        return default


def _csv(name: str, default: str = "") -> tuple[str, ...]:
    return tuple(x.strip() for x in os.getenv(name, default).split(",") if x.strip())


@dataclass(frozen=True)
class Settings:
    base_url: str = os.getenv("SEMNAN_BASE_URL", "https://semnan.moi.ir/").strip()
    start_urls: tuple[str, ...] = _csv("SEMNAN_START_URLS", "https://semnan.moi.ir/")
    ingest_url: str = os.getenv("INGEST_URL", "http://localhost:9000/api/collector/ingest/").strip()
    api_key: str = os.getenv("COLLECTOR_API_KEY", "").strip()
    media_upload_url: str = os.getenv("MEDIA_UPLOAD_URL", "").strip()
    max_images_per_page: int = _int("MAX_IMAGES_PER_PAGE", 6)
    max_image_bytes: int = _int("MAX_IMAGE_BYTES", 8 * 1024 * 1024)
    max_pages: int = _int("MAX_PAGES", 80)
    timeout: int = _int("REQUEST_TIMEOUT", 25)
    min_text_chars: int = _int("MIN_TEXT_CHARS", 220)
    delay: float = _float("CRAWL_DELAY_SECONDS", 0.35)
    user_agent: str = os.getenv("USER_AGENT", "SemnanSmartGovernanceCollector/1.0").strip()
    ignore_patterns: tuple[str, ...] = _csv("IGNORE_URL_PATTERNS")
    database_path: Path = ROOT / "collector.db"
    log_path: Path = ROOT / "collector.log"


settings = Settings()
