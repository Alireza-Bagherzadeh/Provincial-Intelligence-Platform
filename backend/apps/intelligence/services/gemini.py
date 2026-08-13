from __future__ import annotations

import os
from datetime import date
from typing import Literal

from google import genai
from google.genai.types import GenerateContentConfig
from pydantic import BaseModel, Field

from apps.geography.models import County
from apps.intelligence.models import NewsArticle


class NewsExtraction(BaseModel):
    title: str = Field(description="عنوان فارسی خبر، کوتاه و دقیق")
    summary: str = Field(description="خلاصه فارسی 2 تا 4 جمله‌ای، بدون افزودن ادعای خارج از منبع")
    category: str = Field(description="موضوع اصلی مانند اقتصادی، اجتماعی، گردشگری، عمرانی، محیط‌زیست، سیاسی، اطلاعیه")
    kind: Literal["news", "tourism", "notice", "report"] = "news"
    published_at: str | None = Field(default=None, description="تاریخ میلادی YYYY-MM-DD اگر از منبع قابل تشخیص بود")
    county: str | None = Field(default=None, description="یکی از سمنان، شاهرود، دامغان، گرمسار، مهدی‌شهر، آرادان، سرخه، میامی یا null")
    sentiment_score: float = Field(default=0, ge=-1, le=1)
    importance: int = Field(default=50, ge=0, le=100)
    tags: list[str] = Field(default_factory=list)


def _client() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY در محیط Backend تنظیم نشده است.")
    return genai.Client(api_key=api_key)


def _model() -> str:
    return os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")


def analyze_news_url(url: str) -> NewsExtraction:
    prompt = f"""
این URL یک منبع خبری/اطلاع‌رسانی مرتبط با استان سمنان است:
{url}

محتوای خود URL را بخوان و فقط بر اساس همان صفحه یک رکورد خبری ساختاریافته بساز.
قواعد:
- متن خروجی فارسی باشد.
- اگر شهرستان صریح یا با اطمینان بالا مشخص نیست county را null بگذار.
- sentiment_score بین -1 و 1 است و باید لحن خبر را توصیف کند، نه نظر شخصی تو.
- importance از 0 تا 100 برای اولویت مدیریتی استان است.
- هیچ نام، عدد، تاریخ یا ادعایی را حدس نزن.
""".strip()

    with _client() as client:
        response = client.models.generate_content(
            model=_model(),
            contents=prompt,
            config=GenerateContentConfig(
                tools=[{"url_context": {}}],
                response_mime_type="application/json",
                response_json_schema=NewsExtraction.model_json_schema(),
             ),
        )
    return NewsExtraction.model_validate_json(response.text)


def save_news_from_url(url: str) -> NewsArticle:
    item = analyze_news_url(url)
    county = None
    if item.county:
        county = County.objects.filter(name=item.county).first()

    published_at = date.today()
    if item.published_at:
        try:
            published_at = date.fromisoformat(item.published_at)
        except ValueError:
            pass

    article, _ = NewsArticle.objects.update_or_create(
        source_url=url,
        defaults={
            "title": item.title,
            "summary": item.summary,
            "category": item.category,
            "kind": item.kind,
            "published_at": published_at,
            "source_label": "ورودی خودکار Gemini / URL Context",
            "county": county,
            "sentiment_score": item.sentiment_score,
            "importance": item.importance,
            "tags": item.tags,
            "source_system": "gemini_url_ingestion",
            "source_record_id": url,
            "is_demo": False,
        },
    )
    return article


def answer_management_question(question: str, context: str) -> str:
    prompt = f"""
تو دستیار تصمیم‌یار مرکز فرماندهی استان سمنان هستی.
فقط بر اساس DATA CONTEXT زیر پاسخ بده. اگر داده کافی نیست صریح بگو «داده کافی ثبت نشده است».
هیچ عدد، رخداد، خبر، پیش‌بینی یا منبعی را نساز.
بین «داده نمایشی» و «داده واقعی» تفاوت بگذار.
پاسخ فارسی، مدیریتی، کوتاه و اقدام‌محور باشد. در صورت امکان 3 تا 6 نکته اولویت‌بندی‌شده ارائه کن.

DATA CONTEXT:
{context}

QUESTION:
{question}
""".strip()
    with _client() as client:
        response = client.models.generate_content(
            model=_model(),
            contents=prompt,
    )
    return response.text.strip()
