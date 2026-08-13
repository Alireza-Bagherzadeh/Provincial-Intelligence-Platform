from __future__ import annotations

import json
import os
from dataclasses import dataclass
from hmac import compare_digest
from typing import Any

from django.conf import settings
from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.db.models import Model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_POST

from apps.geography.models import County
from apps.intelligence.models import (
    CrisisSignal,
    ForecastSignal,
    NewsArticle,
    PerformanceIndicator,
    ProcurementNotice,
    SectorIndicator,
    SpeechInsight,
)
from apps.intelligence.services.gemini import answer_management_question
from apps.operations.models import BudgetRecord, CitizenSignal, Decision, ExecutiveReport, Organization
from apps.projects.models import Project


@dataclass(frozen=True)
class ResourceSpec:
    model: type[Model]
    fields: tuple[str, ...]
    relations: dict[str, type[Model]]
    search_fields: tuple[str, ...] = ()


RESOURCES: dict[str, ResourceSpec] = {
    "news": ResourceSpec(
        NewsArticle,
        ("title", "summary", "body", "images", "category", "kind", "published_at", "source_url", "source_label", "county_id", "importance", "tags"),
        {"county_id": County},
        ("title", "category", "summary"),
    ),
    "project": ResourceSpec(
        Project,
        ("title", "county_id", "status", "planned_progress", "actual_progress", "responsible_organization"),
        {"county_id": County},
        ("title", "responsible_organization"),
    ),
    "decision": ResourceSpec(
        Decision,
        ("title", "status", "due_date", "progress", "owner_id", "county_id"),
        {"owner_id": Organization, "county_id": County},
        ("title",),
    ),
    "budget": ResourceSpec(
        BudgetRecord,
        ("county_id", "category", "fiscal_year", "allocated_amount", "actual_spending"),
        {"county_id": County},
        ("category", "fiscal_year"),
    ),
    "organization": ResourceSpec(
        Organization,
        ("name", "code", "performance_score"),
        {},
        ("name", "code"),
    ),
    "sector": ResourceSpec(
        SectorIndicator,
        ("code", "domain", "label", "value", "unit", "period_label", "trend_percent", "benchmark_value", "status", "county_id", "description"),
        {"county_id": County},
        ("label", "domain", "code"),
    ),
    "procurement": ResourceSpec(
        ProcurementNotice,
        ("title", "organization_id", "status", "published_at", "deadline", "estimated_amount", "procurement_method", "county_id", "reference_code"),
        {"organization_id": Organization, "county_id": County},
        ("title", "reference_code", "procurement_method"),
    ),
    "speech": ResourceSpec(
        SpeechInsight,
        ("speaker", "role", "spoken_at", "topic", "summary", "commitment_text", "commitment_status", "county_id", "source_url"),
        {"county_id": County},
        ("speaker", "topic", "summary"),
    ),
    "performance": ResourceSpec(
        PerformanceIndicator,
        ("organization_id", "category", "label", "score", "target", "period_label", "weight"),
        {"organization_id": Organization},
        ("label", "category"),
    ),
    "crisis": ResourceSpec(
        CrisisSignal,
        ("title", "category", "severity", "status", "occurred_at", "impact_score", "summary", "source_label", "county_id"),
        {"county_id": County},
        ("title", "category", "summary"),
    ),
    "forecast": ResourceSpec(
        ForecastSignal,
        ("domain", "metric_label", "as_of", "horizon_label", "current_value", "forecast_value", "lower_bound", "upper_bound", "unit", "risk_level", "confidence", "methodology", "county_id"),
        {"county_id": County},
        ("domain", "metric_label", "methodology"),
    ),
    "citizen": ResourceSpec(
        CitizenSignal,
        ("county_id", "category", "request_count", "resolved_count", "average_response_hours", "change_percent"),
        {"county_id": County},
        ("category",),
    ),
    "report": ResourceSpec(
        ExecutiveReport,
        ("title", "report_type", "period_label", "status", "organization_id"),
        {"organization_id": Organization},
        ("title", "report_type", "period_label"),
    ),
    "county": ResourceSpec(
        County,
        ("name", "code", "population"),
        {},
        ("name", "code"),
    ),
}


def _authorized(request) -> bool:
    # در محیط توسعه، پنل Frontend بدون تنظیم توکن اضافه کار می‌کند.
    # در Production (DEBUG=False) توکن الزامی است.
    if settings.DEBUG:
        return True
    expected = os.environ.get("MANAGEMENT_API_TOKEN", "").strip()
    supplied = request.headers.get("X-Management-Token", "").strip()
    return bool(expected) and bool(supplied) and compare_digest(supplied, expected)


def _body(request) -> dict[str, Any]:
    try:
        value = json.loads(request.body.decode("utf-8") or "{}")
        return value if isinstance(value, dict) else {}
    except json.JSONDecodeError:
        return {}


def _dashboard_context() -> str:
    projects = list(Project.objects.values("title", "status", "planned_progress", "actual_progress", "county__name", "is_demo")[:40])
    decisions = list(Decision.objects.values("title", "status", "due_date", "progress", "county__name", "is_demo")[:30])
    news = list(NewsArticle.objects.values("title", "summary", "category", "published_at", "county__name", "importance", "source_url", "is_demo")[:40])
    sectors = list(SectorIndicator.objects.filter(county__isnull=True).values("domain", "label", "value", "unit", "trend_percent", "status", "is_demo")[:30])
    speeches = list(SpeechInsight.objects.values("speaker", "topic", "summary", "commitment_text", "commitment_status", "county__name", "is_demo")[:30])
    crises = list(CrisisSignal.objects.values("title", "category", "severity", "status", "impact_score", "county__name", "summary", "is_demo")[:30])
    forecasts = list(ForecastSignal.objects.values("domain", "metric_label", "current_value", "forecast_value", "risk_level", "confidence", "county__name", "is_demo")[:30])
    return json.dumps(
        {
            "projects": projects,
            "decisions": decisions,
            "news": news,
            "sector_indicators": sectors,
            "speech_insights": speeches,
            "crisis_signals": crises,
            "forecast_signals": forecasts,
        },
        ensure_ascii=False,
        default=str,
    )


def _resource_or_error(name: str) -> tuple[ResourceSpec | None, JsonResponse | None]:
    spec = RESOURCES.get(name)
    if not spec:
        return None, JsonResponse({"error": "نوع داده نامعتبر است."}, status=400)
    return spec, None


def _serialize_value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool, list, dict)):
        return value
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


def _serialize(instance: Model, spec: ResourceSpec) -> dict[str, Any]:
    item: dict[str, Any] = {"id": str(instance.pk), "is_demo": bool(getattr(instance, "is_demo", False))}
    for field in spec.fields:
        if field.endswith("_id"):
            item[field] = str(getattr(instance, field)) if getattr(instance, field) else ""
            relation_name = field[:-3]
            relation = getattr(instance, relation_name, None)
            if relation is not None:
                item[f"{field}_label"] = str(relation)
            continue
        value = getattr(instance, field)
        item[field] = _serialize_value(value)
    return item


def _clean_payload(spec: ResourceSpec, payload: dict[str, Any], *, partial: bool) -> dict[str, Any]:
    cleaned: dict[str, Any] = {}
    for field in spec.fields:
        if field not in payload:
            continue
        value = payload.get(field)

        if field in spec.relations:
            if value in (None, ""):
                model_field = spec.model._meta.get_field(field[:-3])
                if model_field.null:
                    cleaned[field] = None
                    continue
                if partial:
                    continue
                raise ValueError(f"فیلد {field} الزامی است.")
            relation_model = spec.relations[field]
            try:
                relation_model.objects.get(pk=value)
            except relation_model.DoesNotExist as exc:
                raise ValueError(f"مقدار انتخاب‌شده برای {field} معتبر نیست.") from exc
            cleaned[field] = value
            continue

        model_field = spec.model._meta.get_field(field)
        if value == "":
            if getattr(model_field, "null", False):
                cleaned[field] = None
            elif model_field.get_internal_type() in {"CharField", "TextField", "URLField"} and getattr(model_field, "blank", False):
                cleaned[field] = ""
            else:
                cleaned[field] = value
            continue

        if field in {"tags", "images"}:
            if isinstance(value, str):
                cleaned[field] = [item.strip() for item in value.replace("،", ",").split(",") if item.strip()]
            elif isinstance(value, list):
                cleaned[field] = [str(item).strip() for item in value if str(item).strip()]
            else:
                cleaned[field] = []
            continue

        cleaned[field] = value

    if not partial:
        # رکوردهای ساخته‌شده از UI داده واقعی/دستی هستند، نه seed نمایشی.
        cleaned["source_system"] = "dashboard_manual"
        cleaned["is_demo"] = False
    elif "is_demo" in {f.name for f in spec.model._meta.fields}:
        cleaned["is_demo"] = False
    return cleaned


def _lookups() -> dict[str, list[dict[str, str]]]:
    return {
        "counties": [{"value": str(item.id), "label": item.name} for item in County.objects.order_by("name")],
        "organizations": [{"value": str(item.id), "label": item.name} for item in Organization.objects.order_by("name")],
    }


@csrf_exempt
@require_http_methods(["GET", "POST", "PATCH", "DELETE"])
def management_crud(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    resource = request.GET.get("resource", "").strip()
    spec, error = _resource_or_error(resource)
    if error or spec is None:
        return error

    if request.method == "GET":
        query = spec.model.objects.all()
        search = request.GET.get("search", "").strip()
        if search and spec.search_fields:
            from django.db.models import Q

            condition = Q()
            for field in spec.search_fields:
                condition |= Q(**{f"{field}__icontains": search})
            query = query.filter(condition)
        items = [_serialize(item, spec) for item in query[:100]]
        return JsonResponse({"ok": True, "resource": resource, "items": items, "lookups": _lookups()})

    payload = _body(request)
    try:
        with transaction.atomic():
            if request.method == "POST":
                data = _clean_payload(spec, payload.get("data", {}), partial=False)
                instance = spec.model.objects.create(**data)
                return JsonResponse({"ok": True, "item": _serialize(instance, spec)}, status=201)

            record_id = str(payload.get("id", "")).strip()
            if not record_id:
                return JsonResponse({"error": "id الزامی است."}, status=400)
            try:
                instance = spec.model.objects.get(pk=record_id)
            except (spec.model.DoesNotExist, ValueError):
                return JsonResponse({"error": "رکورد پیدا نشد."}, status=404)

            if request.method == "PATCH":
                data = _clean_payload(spec, payload.get("data", {}), partial=True)
                for key, value in data.items():
                    setattr(instance, key, value)
                instance.save()
                return JsonResponse({"ok": True, "item": _serialize(instance, spec)})

            instance.delete()
            return JsonResponse({"ok": True, "deleted": record_id})
    except ValueError as exc:
        return JsonResponse({"error": str(exc)}, status=400)
    except IntegrityError as exc:
        return JsonResponse({"error": "این رکورد با محدودیت یکتا/وابستگی دیتابیس تداخل دارد.", "detail": str(exc)}, status=409)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@csrf_exempt
@require_POST
def ai_assistant(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)
    payload = _body(request)
    question = str(payload.get("question", "")).strip()
    if not question:
        return JsonResponse({"error": "question is required"}, status=400)
    try:
        answer = answer_management_question(question, _dashboard_context())
        return JsonResponse({"answer": answer, "model": os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")})
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@csrf_exempt
@require_POST
def management_import_archive(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)
    call_command("seed_document_news")
    return JsonResponse({"ok": True, "count": NewsArticle.objects.filter(source_system="document_archive").count()})


@csrf_exempt
@require_POST
def management_ingest_news(request):
    if not _authorized(request):
        return JsonResponse({"error": "unauthorized"}, status=401)
    return JsonResponse(
        {
            "error": "ورود خبر با Gemini در این نسخه غیرفعال است. برای جمع‌آوری URLهای سایت استانداری از Collector محلی استفاده کنید.",
            "collector_endpoint": "/api/collector/ingest/",
        },
        status=410,
    )

