from __future__ import annotations

import re
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

from apps.geography.models import County
from apps.intelligence.models import NewsArticle, SpeechInsight

from .models import RawContent


ContentType = Literal[
    "news", "tourism", "notice", "report", "speech", "procurement",
    "project", "crisis", "sector", "culture", "investment", "other",
]


class RoutingResult(BaseModel):
    """Deterministic classification result. No LLM/API call is used here."""

    content_type: ContentType = "news"
    category: str = "عمومی"
    county: str | None = None
    summary: str = ""
    sentiment_score: float = Field(default=0, ge=-1, le=1)
    importance: int = Field(default=3, ge=1, le=5)
    confidence: int = 0  # kept only for backward DB/API compatibility; not shown in UI
    tags: list[str] = Field(default_factory=list)
    suggested_modules: list[str] = Field(default_factory=list)  # deprecated compatibility field
    publish_to_public: bool = True
    speaker: str | None = None
    speaker_role: str | None = None
    speech_topic: str | None = None
    commitment_text: str | None = None
    method: str = "rules"


def _normalize(value: str) -> str:
    value = (value or "").replace("ي", "ی").replace("ك", "ک").replace("ۀ", "ه")
    value = value.replace("\u200c", " ").replace("\u200f", " ").replace("\u200e", " ")
    return re.sub(r"\s+", " ", value).strip().lower()


def _county_name(text: str) -> str | None:
    sample = _normalize(text)
    # Longer/specific names first.
    counties = ["مهدی شهر", "مهدیشهر", "شاهرود", "دامغان", "گرمسار", "میامی", "آرادان", "سرخه", "سمنان"]
    aliases = {
        "مهدی شهر": "مهدی‌شهر",
        "مهدیشهر": "مهدی‌شهر",
    }
    for name in counties:
        if name in sample:
            return aliases.get(name, name)
    return None


def _contains_any(text: str, needles: tuple[str, ...]) -> bool:
    return any(_normalize(needle) in text for needle in needles)


def _score_kind(title: str, body: str, local_hint: str) -> str:
    title_n = _normalize(title)
    body_n = _normalize(body[:5000])
    combined = f"{title_n} {body_n}"

    rules: dict[str, tuple[str, ...]] = {
        "procurement": ("مناقصه", "مزایده", "استعلام بها", "فراخوان خرید", "اسناد مناقصه", "خرید دولتی"),
        "notice": ("اطلاعیه", "آگهی", "استخدام", "ثبت نام", "ثبت‌نام", "فراخوان عمومی", "تمدید مهلت"),
        "crisis": ("بحران", "سیل", "زلزله", "حریق", "آتش سوزی", "آتش‌سوزی", "هشدار هواشناسی", "حادثه", "گرد و غبار"),
        "investment": ("سرمایه گذاری", "سرمایه‌گذاری", "فرصت سرمایه گذاری", "جذب سرمایه", "سرمایه گذار", "سرمایه‌گذار"),
        "project": ("افتتاح پروژه", "پروژه عمرانی", "طرح عمرانی", "پیشرفت فیزیکی", "عملیات اجرایی", "کلنگ زنی", "کلنگ‌زنی", "بهره برداری", "بهره‌برداری"),
        "culture": ("میراث فرهنگی", "بنای تاریخی", "اثر تاریخی", "آرامگاه", "قلعه", "کاروانسرا", "مسجد جامع", "دروازه ارگ", "موزه", "آیین سنتی", "شخصیت تاریخی"),
        "tourism": ("گردشگری", "طبیعت گردی", "طبیعت‌گردی", "جاذبه طبیعی", "جنگل", "چشمه", "کویر", "غار", "آبشار", "منطقه گردشگری", "روستای هدف گردشگری"),
        "speech": ("تأکید کرد", "تاکید کرد", "اظهار داشت", "گفت:", "اعلام کرد", "خواستار شد", "تصریح کرد", "استاندار گفت", "فرماندار گفت", "اولویت استان"),
        "report": ("گزارش", "نشست", "جلسه", "دیدار", "بازدید", "آیین", "مراسم"),
    }

    # Title matches are intentionally much stronger than body matches.
    scores: dict[str, int] = {key: 0 for key in rules}
    for kind, needles in rules.items():
        scores[kind] += sum(5 for needle in needles if _normalize(needle) in title_n)
        scores[kind] += sum(1 for needle in needles if _normalize(needle) in body_n)

    if local_hint in scores and local_hint != "news":
        scores[local_hint] += 3

    best_kind, best_score = max(scores.items(), key=lambda item: item[1])
    if best_score > 0:
        return best_kind

    # Sector content is intentionally conservative so ordinary news is not swallowed by it.
    sector_terms = (
        "شاخص اقتصادی", "آمار اشتغال", "نرخ بیکاری", "مصرف آب", "مصرف برق",
        "تولید صنعتی", "ظرفیت تولید", "عملکرد بخش", "گزارش آماری",
    )
    if _contains_any(combined, sector_terms):
        return "sector"
    return "news"


def _category(title: str, body: str, kind: str) -> str:
    sample = _normalize(f"{title} {body[:5000]}")
    category_rules: list[tuple[str, tuple[str, ...]]] = [
        ("آب و فاضلاب", ("آبرسانی", "فاضلاب", "منابع آب", "آب شرب", "تنش آبی")),
        ("انرژی", ("برق", "انرژی", "گاز", "نیروگاه", "سوخت")),
        ("کشاورزی و دامداری", ("کشاورزی", "کشاورز", "دامدار", "عشایر", "پسته", "دام و طیور")),
        ("صنعت و تولید", ("صنعت", "صنایع", "تولید", "واحد تولیدی", "معدن", "شهرک صنعتی")),
        ("اقتصاد و معیشت", ("اقتصاد", "اقتصادی", "معیشت", "بازار", "قیمت", "تورم", "کالابرگ")),
        ("محیط زیست", ("محیط زیست", "یوزپلنگ", "حیات وحش", "گونه جانوری", "منطقه حفاظت شده", "آلودگی")),
        ("راه و حمل‌ونقل", ("راه", "جاده", "راه آهن", "راه‌آهن", "حمل و نقل", "حمل‌ونقل", "فرودگاه")),
        ("سلامت", ("سلامت", "بهداشت", "درمان", "بیمارستان", "پزشکی")),
        ("اجتماعی", ("مردم", "شهروند", "اجتماعی", "جوانان", "خانواده", "آسیب اجتماعی")),
        ("اداری و حکمرانی", ("فرمانداری", "استانداری", "مدیران", "دستگاه اجرایی", "مصوبه", "شورای اداری")),
    ]
    for label, needles in category_rules:
        if _contains_any(sample, needles):
            return label

    if kind == "tourism":
        return "گردشگری"
    if kind == "culture":
        return "فرهنگ و میراث"
    if kind == "notice":
        return "اطلاعیه"
    if kind == "procurement":
        return "مناقصه و خرید"
    if kind == "crisis":
        return "بحران و ایمنی"
    if kind == "investment":
        return "سرمایه‌گذاری"
    if kind == "project":
        return "پروژه و عمران"
    if kind == "speech":
        return "سخنان مسئولان"
    return "اخبار استان"


def _summary(raw: RawContent) -> str:
    description = re.sub(r"\s+", " ", (raw.description or "")).strip()
    if description and len(description) >= 60 and description != raw.title:
        return description[:700]

    text = (raw.clean_text or "").strip()
    paragraphs = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n{2,}|\n", text) if p.strip()]
    useful = [p for p in paragraphs if len(p) >= 45 and p != raw.title]
    candidate = " ".join(useful[:2]) if useful else re.sub(r"\s+", " ", text)
    if len(candidate) <= 520:
        return candidate
    cut = candidate[:520]
    stop = max(cut.rfind("."), cut.rfind("؟"), cut.rfind("!"), cut.rfind("؛"))
    return (cut[: stop + 1] if stop > 250 else cut.rstrip() + "…").strip()


def _tags(title: str, body: str, kind: str, category: str, county: str | None) -> list[str]:
    sample = _normalize(f"{title} {body[:4000]}")
    tags: list[str] = []
    for value in (county, category):
        if value and value not in tags:
            tags.append(value)

    keyword_tags = (
        "استانداری سمنان", "گردشگری", "میراث فرهنگی", "محیط زیست", "کشاورزی",
        "صنعت", "تولید", "آب", "برق", "سرمایه‌گذاری", "پروژه عمرانی",
        "مناقصه", "اطلاعیه", "اشتغال", "اقتصاد", "حمل‌ونقل",
    )
    for keyword in keyword_tags:
        if _normalize(keyword) in sample and keyword not in tags:
            tags.append(keyword)
        if len(tags) >= 6:
            break

    if kind not in {"news", "other"}:
        kind_fa = {
            "tourism": "گردشگری", "culture": "فرهنگ و میراث", "notice": "اطلاعیه",
            "speech": "سخنان مسئولان", "procurement": "مناقصه", "project": "پروژه",
            "crisis": "بحران", "sector": "شاخص بخشی", "investment": "سرمایه‌گذاری",
            "report": "گزارش",
        }.get(kind)
        if kind_fa and kind_fa not in tags:
            tags.append(kind_fa)
    return tags[:8]


def _importance(kind: str, title: str) -> int:
    base = {
        "crisis": 5,
        "procurement": 4,
        "project": 4,
        "notice": 4,
        "investment": 4,
        "speech": 3,
        "report": 3,
        "sector": 4,
        "news": 3,
        "tourism": 2,
        "culture": 2,
        "other": 2,
    }.get(kind, 3)
    important_terms = _normalize(title)
    if any(term in important_terms for term in ("فوری", "هشدار", "بحران", "استاندار", "استان")):
        return min(5, base + 1)
    return base


def _speaker_hint(title: str, body: str) -> tuple[str | None, str | None]:
    sample = _normalize(f"{title} {body[:2500]}")
    roles = (
        "استاندار سمنان", "معاون استاندار", "فرماندار سمنان", "فرماندار شاهرود",
        "فرماندار دامغان", "فرماندار گرمسار", "فرماندار میامی", "فرماندار آرادان",
        "فرماندار سرخه", "فرماندار مهدی شهر", "فرماندار مهدی‌شهر",
    )
    for role in roles:
        if _normalize(role) in sample:
            return role, role
    return None, None


def _county(name: str | None):
    if not name:
        return None
    normalized = name.replace("شهرستان", "").replace("‌", " ").strip()
    return County.objects.filter(name__icontains=normalized).first()


def classify(raw: RawContent) -> RoutingResult:
    """Classify collected content without Gemini or any external AI API."""

    kind = _score_kind(raw.title, raw.clean_text, raw.local_hint)
    county = _county_name(f"{raw.title}\n{raw.clean_text[:6000]}")
    category = _category(raw.title, raw.clean_text, kind)
    speaker, role = _speaker_hint(raw.title, raw.clean_text) if kind == "speech" else (None, None)

    return RoutingResult(
        content_type=kind,  # type: ignore[arg-type]
        category=category,
        county=county,
        summary=_summary(raw),
        sentiment_score=0,
        importance=_importance(kind, raw.title),
        confidence=0,
        tags=_tags(raw.title, raw.clean_text, kind, category, county),
        suggested_modules=[],
        publish_to_public=True,
        speaker=speaker,
        speaker_role=role,
        speech_topic=(category if kind == "speech" else None),
        commitment_text=None,
        method="rules",
    )


def publish(raw: RawContent, result: RoutingResult) -> None:
    county = _county(result.county)
    if result.publish_to_public:
        allowed_kinds = {choice for choice, _ in NewsArticle.Kind.choices}
        kind = result.content_type if result.content_type in allowed_kinds else NewsArticle.Kind.OTHER
        NewsArticle.objects.update_or_create(
            source_system="semnan_collector",
            source_record_id=str(raw.id),
            defaults={
                "title": raw.title[:280],
                "summary": (result.summary or raw.description or raw.clean_text[:700]).strip(),
                "body": raw.clean_text,
                "images": raw.images if isinstance(raw.images, list) else [],
                # These fields are retained only for schema compatibility. The UI no longer shows them.
                "ai_modules": [],
                "ai_confidence": 0,
                "category": result.category[:100] or "عمومی",
                "kind": kind,
                "published_at": raw.published_at or date.today(),
                "source_url": raw.source_url,
                "source_label": raw.source_name[:120],
                "county": county,
                "sentiment_score": 0,
                "importance": result.importance,
                "tags": result.tags,
                "is_demo": False,
            },
        )

    # No LLM extraction is performed. A conservative speech record is created only when
    # a clear official role is directly detectable from the collected text.
    if result.content_type == "speech" and result.speaker and result.speech_topic:
        SpeechInsight.objects.update_or_create(
            source_system="semnan_collector",
            source_record_id=str(raw.id),
            defaults={
                "speaker": result.speaker[:160],
                "role": (result.speaker_role or "").strip()[:160],
                "spoken_at": raw.published_at or date.today(),
                "topic": result.speech_topic[:120],
                "summary": result.summary or raw.clean_text[:700],
                "commitment_text": "",
                "county": county,
                "source_url": raw.source_url,
                "is_demo": False,
            },
        )
