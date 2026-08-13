from __future__ import annotations

import hashlib
from pathlib import Path
from urllib.parse import urlparse

import httpx

from .config import Settings
from .models import ExtractedPage


ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
}


def _looks_like_image(blob: bytes, content_type: str) -> bool:
    if content_type == "image/jpeg":
        return blob.startswith(b"\xff\xd8\xff")
    if content_type == "image/png":
        return blob.startswith(b"\x89PNG\r\n\x1a\n")
    if content_type == "image/gif":
        return blob.startswith((b"GIF87a", b"GIF89a"))
    if content_type == "image/webp":
        return len(blob) > 12 and blob[:4] == b"RIFF" and blob[8:12] == b"WEBP"
    if content_type == "image/avif":
        return len(blob) > 16 and b"ftyp" in blob[:16] and b"avif" in blob[:32]
    return False


class Uploader:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = httpx.Client(timeout=max(settings.timeout, 60), follow_redirects=True)
        self.image_client = httpx.Client(
            timeout=max(settings.timeout, 45),
            follow_redirects=True,
            headers={
                "User-Agent": settings.user_agent,
                "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.5",
                "Accept": "image/avif,image/webp,image/png,image/jpeg,image/gif;q=0.9,*/*;q=0.2",
                "Referer": settings.base_url,
            },
        )
        self.media_url = settings.media_upload_url or self._derive_media_url(settings.ingest_url)

    @staticmethod
    def _derive_media_url(ingest_url: str) -> str:
        if ingest_url.rstrip("/").endswith("/ingest"):
            return ingest_url.rstrip("/")[:-len("ingest")] + "media/"
        base = ingest_url.rsplit("/", 1)[0].rstrip("/")
        return f"{base}/media/"

    def close(self) -> None:
        self.client.close()
        self.image_client.close()

    def _filename(self, source_url: str, content_type: str) -> str:
        ext = ALLOWED_IMAGE_TYPES[content_type]
        name = Path(urlparse(source_url).path).name
        stem = Path(name).stem if name else hashlib.sha256(source_url.encode("utf-8")).hexdigest()[:20]
        stem = stem[:80] or hashlib.sha256(source_url.encode("utf-8")).hexdigest()[:20]
        return f"{stem}{ext}"

    def _mirror_one_image(self, source_url: str) -> str | None:
        try:
            response = self.image_client.get(source_url)
            response.raise_for_status()
            content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
            if content_type not in ALLOWED_IMAGE_TYPES:
                return None
            blob = response.content
            if len(blob) < 2048 or len(blob) > self.settings.max_image_bytes:
                return None
            if not _looks_like_image(blob, content_type):
                return None
            filename = self._filename(source_url, content_type)
            upload = self.client.post(
                self.media_url,
                data={"source_url": source_url},
                files={"file": (filename, blob, content_type)},
                headers={"X-Collector-Key": self.settings.api_key},
            )
            upload.raise_for_status()
            data = upload.json()
            value = data.get("url") if isinstance(data, dict) else None
            return str(value) if value else None
        except Exception:
            return None

    def _mirror_images(self, urls: list[str]) -> list[str]:
        mirrored: list[str] = []
        for source_url in urls[: self.settings.max_images_per_page]:
            value = self._mirror_one_image(source_url)
            if value and value not in mirrored:
                mirrored.append(value)
        return mirrored

    def upload(self, page: ExtractedPage, content_hash: str) -> dict:
        if not self.settings.api_key:
            raise RuntimeError("COLLECTOR_API_KEY در collector/.env تنظیم نشده است.")

        payload = page.to_payload()
        payload["content_hash"] = content_hash
        payload.setdefault("metadata", {})["source_images"] = list(page.images)
        payload["images"] = self._mirror_images(page.images)

        response = self.client.post(
            self.settings.ingest_url,
            json=payload,
            headers={"X-Collector-Key": self.settings.api_key},
        )
        try:
            data = response.json()
        except Exception:
            data = {"raw": response.text[:1000]}
        if response.status_code >= 400:
            raise RuntimeError(f"upload HTTP {response.status_code}: {data}")
        return data
