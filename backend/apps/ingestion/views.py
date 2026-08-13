from __future__ import annotations

import hashlib
import json
import mimetypes
import os
from datetime import datetime
from hmac import compare_digest
from pathlib import Path

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import RawContent
from .services import classify, publish


def _authorized(request) -> bool:
    expected = os.environ.get("COLLECTOR_API_KEY", "").strip()
    supplied = request.headers.get("X-Collector-Key", "").strip()
    return bool(expected) and bool(supplied) and compare_digest(expected, supplied)


def _body(request):
    try:
        value = json.loads(request.body.decode("utf-8") or "{}")
        return value if isinstance(value, dict) else {}
    except Exception:
        return {}


@csrf_exempt
@require_POST
def ingest(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)
    payload = _body(request)
    url = str(payload.get("canonical_url") or payload.get("url") or "").strip()
    text = str(payload.get("clean_text") or "").strip()
    title = str(payload.get("title") or "").strip()
    if not url.startswith(("http://", "https://")) or not text or not title:
        return JsonResponse({"error": "url/title/clean_text are required"}, status=400)

    defaults = {
        "source_system": "semnan_collector",
        "source_name": str(payload.get("source_name") or "استانداری سمنان")[:160],
        "source_url": str(payload.get("url") or url),
        "canonical_url": url,
        "title": title[:500],
        "clean_text": text,
        "description": str(payload.get("description") or ""),
        "published_at": payload.get("published_at") or None,
        "content_hash": str(payload.get("content_hash") or "")[:64],
        "local_hint": str(payload.get("local_hint") or "")[:40],
        "images": payload.get("images") if isinstance(payload.get("images"), list) else [],
        "metadata": payload.get("metadata") if isinstance(payload.get("metadata"), dict) else {},
        "is_demo": False,
    }
    raw, created = RawContent.objects.update_or_create(source_url=defaults["source_url"], defaults=defaults)

    try:
        result = classify(raw)
        raw.classification = result.model_dump(mode="json")
        raw.status = RawContent.Status.ANALYZED
        raw.last_error = ""
        raw.save(update_fields=["classification", "status", "last_error", "fetched_at"])

        if os.environ.get("COLLECTOR_AUTO_PUBLISH", "true").lower() == "true":
            publish(raw, result)
            raw.status = RawContent.Status.PUBLISHED
            raw.save(update_fields=["status", "fetched_at"])

        return JsonResponse({
            "ok": True,
            "created": created,
            "raw_id": str(raw.id),
            "status": raw.status,
            "classification": raw.classification,
            "images": raw.images if isinstance(raw.images, list) else [],
        }, status=201 if created else 200)
    except Exception as exc:
        raw.status = RawContent.Status.FAILED
        raw.last_error = str(exc)
        raw.save(update_fields=["status", "last_error", "fetched_at"])
        # Raw content is safely retained even when deterministic classification/publish fails.
        return JsonResponse({"ok": False, "created": created, "raw_id": str(raw.id), "stored": True, "error": str(exc)}, status=202)


@csrf_exempt
@require_GET
def health(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)
    return JsonResponse({
        "ok": True,
        "received": RawContent.objects.count(),
        "published": RawContent.objects.filter(status=RawContent.Status.PUBLISHED).count(),
        "failed": RawContent.objects.filter(status=RawContent.Status.FAILED).count(),
    })


@csrf_exempt
@require_POST
def media(request):
    """Receive image bytes from the local collector and persist them through Django storage.

    The collector can reach semnan.moi.ir from Iran, so it downloads source images locally and
    uploads the bytes here. This prevents the public frontend from hot-linking blocked source URLs.
    """
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    uploaded = request.FILES.get("file")
    if uploaded is None:
        return JsonResponse({"error": "file is required"}, status=400)

    content_type = (getattr(uploaded, "content_type", "") or "").lower()
    if content_type and not content_type.startswith("image/"):
        return JsonResponse({"error": "only image files are accepted"}, status=415)
    if uploaded.size > 8 * 1024 * 1024:
        return JsonResponse({"error": "image is larger than 8 MB"}, status=413)

    blob = uploaded.read()
    digest = hashlib.sha256(blob).hexdigest()
    source_url = str(request.POST.get("source_url") or "")
    original_name = Path(getattr(uploaded, "name", "image") or "image").name
    ext = Path(original_name).suffix.lower()
    if not ext or len(ext) > 6:
        ext = mimetypes.guess_extension(content_type.split(";", 1)[0]) or ".jpg"
    if ext == ".jpe":
        ext = ".jpg"

    now = datetime.now()
    relative_path = f"collector/{now:%Y/%m}/{digest[:24]}{ext}"
    if not default_storage.exists(relative_path):
        from django.core.files.base import ContentFile
        default_storage.save(relative_path, ContentFile(blob))

    storage_url = default_storage.url(relative_path)
    absolute_url = request.build_absolute_uri(storage_url)
    return JsonResponse({
        "ok": True,
        "url": absolute_url,
        "path": relative_path,
        "source_url": source_url,
        "sha256": digest,
        "size": len(blob),
    })
