from __future__ import annotations

import hashlib
import json
import re
from urllib.parse import urljoin, urlparse, urlunparse

from bs4 import BeautifulSoup, Tag
from dateutil import parser as date_parser

from .models import ExtractedPage


CONTENT_SELECTORS = (
    "article",
    ".news-detail",
    ".news_detail",
    ".news-show",
    ".news-content",
    ".news_content",
    ".news-body",
    ".article-content",
    ".article-body",
    ".entry-content",
    ".content-body",
    ".detail-content",
    ".main-content",
    "[itemprop='articleBody']",
    "main",
    "[role='main']",
    "#content",
)

REMOVE_SELECTORS = (
    "script", "style", "noscript", "svg", "iframe", "nav", "footer", "header", "form",
    ".menu", ".navbar", ".breadcrumb", ".breadcrumbs", ".sidebar", ".share", ".social",
    ".comments", ".related", ".related-news", ".recommended", ".pagination", ".advertisement",
    ".ads", ".toolbar", ".topbar", ".footer", ".header", ".print", ".rating",
    ".latest-news", ".other-news", ".news-list", ".news-related", ".tags-box", ".poll",
)

IMAGE_BAD_WORDS = (
    "logo", "favicon", "icon", "sprite", "avatar", "loading", "placeholder", "default-image",
    "social", "telegram", "whatsapp", "instagram", "aparat", "rss", "weather", "captcha",
    "header", "footer", "banner", "brand",
)

BOILERPLATE_PATTERNS = (
    re.compile(r"^نسخه\s*(آزمایشی|آزمايشی)?$", re.I),
    re.compile(r"^[x×]$", re.I),
    re.compile(r"^مشاهده\s+پایگاه$", re.I),
    re.compile(r"^پایگاه\s+مرکزی$", re.I),
    re.compile(r"^شهرستان\s*ها$", re.I),
    re.compile(r"^استانداری\s+سمنان$", re.I),
    re.compile(r"^فرمانداری\s+شهرستان", re.I),
    re.compile(r"^وضعیت\s*[:：]", re.I),
    re.compile(r"^پیشرفت\s*[:：]", re.I),
    re.compile(r"^در\s+انتظار\s+راه\s*اندازی$", re.I),
    re.compile(r"^تکمیل$", re.I),
)

PERSIAN_DATE_RE = re.compile(r"(13|14)\d{2}[/-](0?[1-9]|1[0-2])[/-]([0-2]?\d|3[01])")
GREGORIAN_DATE_RE = re.compile(r"20\d{2}[/-](0?[1-9]|1[0-2])[/-]([0-2]?\d|3[01])")


def normalize_url(url: str) -> str:
    p = urlparse(url)
    p = p._replace(fragment="")
    query = "&".join(
        item for item in p.query.split("&")
        if item and not item.lower().startswith(("utm_", "fbclid=", "gclid="))
    )
    return urlunparse(p._replace(query=query))


def same_host(url: str, base_url: str) -> bool:
    return (urlparse(url).hostname or "").lower() == (urlparse(base_url).hostname or "").lower()


def _meta(soup: BeautifulSoup, *keys: str) -> str:
    for key in keys:
        node = soup.find("meta", attrs={"property": key}) or soup.find("meta", attrs={"name": key})
        if node and node.get("content"):
            return str(node["content"]).strip()
    return ""


def _jsonld(soup: BeautifulSoup) -> list[dict]:
    out: list[dict] = []
    for node in soup.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            data = json.loads(node.string or node.get_text() or "null")
        except Exception:
            continue
        if isinstance(data, dict):
            out.append(data)
        elif isinstance(data, list):
            out.extend(x for x in data if isinstance(x, dict))
    return out


def extract_date(soup: BeautifulSoup, text: str) -> str | None:
    candidates = [_meta(soup, "article:published_time", "date", "publish_date", "pubdate")]
    for item in _jsonld(soup):
        for key in ("datePublished", "dateCreated", "uploadDate"):
            if item.get(key):
                candidates.append(str(item[key]))
    for node in soup.find_all("time"):
        candidates.append(str(node.get("datetime") or node.get_text(" ", strip=True)))

    for value in candidates:
        if not value:
            continue
        try:
            return date_parser.parse(value).date().isoformat()
        except Exception:
            pass

    m = GREGORIAN_DATE_RE.search(text[:3000])
    if m:
        try:
            return date_parser.parse(m.group(0)).date().isoformat()
        except Exception:
            pass
    return None


def local_hint(title: str, text: str) -> str:
    title_sample = title.lower().strip()
    body_sample = text[:3500].lower()
    title_rules = [
        ("procurement", ("مناقصه", "مزایده", "استعلام بها", "فراخوان خرید")),
        ("notice", ("اطلاعیه", "آگهی", "ثبت نام", "ثبت‌نام", "استخدام")),
        ("crisis", ("بحران", "سیل", "زلزله", "حریق", "آتش سوزی", "آتش‌سوزی", "هشدار هواشناسی", "حادثه")),
        ("investment", ("سرمایه گذاری", "سرمایه‌گذاری", "فرصت سرمایه گذاری", "جذب سرمایه")),
        ("project", ("افتتاح پروژه", "پروژه عمرانی", "طرح عمرانی", "پیشرفت فیزیکی", "عملیات اجرایی")),
        ("culture", ("آرامگاه", "قلعه", "کاروانسرا", "مسجد جامع", "دروازه ارگ", "میراث فرهنگی", "بنای تاریخی", "موزه")),
        ("tourism", ("جنگل", "چشمه", "روستا", "منطقه گردشگری", "جاذبه طبیعی", "کویر", "غار", "آبشار")),
        ("speech", ("تأکید کرد", "اظهار داشت", "اعلام کرد", "خواستار شد", "اولویت استان")),
        ("report", ("گزارش", "نشست", "جلسه", "دیدار", "بازدید")),
    ]
    for label, needles in title_rules:
        if any(needle in title_sample for needle in needles):
            return label

    if any(x in body_sample for x in ("گردشگری", "جاذبه طبیعی", "طبیعت‌گردی")):
        return "tourism"
    if any(x in body_sample for x in ("میراث فرهنگی", "اثر تاریخی", "بنای تاریخی")):
        return "culture"
    if sum(1 for x in ("مناقصه", "مزایده", "استعلام بها", "اسناد مناقصه") if x in body_sample) >= 2:
        return "procurement"
    if any(x in body_sample for x in ("استاندار گفت", "فرماندار گفت", "تأکید کرد", "اظهار داشت")):
        return "speech"
    return "news"


def _candidate_score(node: Tag) -> int:
    text_len = len(node.get_text(" ", strip=True))
    paragraph_count = len(node.find_all("p"))
    image_count = len(node.find_all("img"))
    link_count = len(node.find_all("a"))
    penalty = link_count * 28
    if node.name in {"body", "html"}:
        penalty += 3500
    classes = " ".join(node.get("class", [])) if node.get("class") else ""
    node_id = str(node.get("id") or "")
    marker = f"{classes} {node_id}".lower()
    if any(word in marker for word in ("sidebar", "footer", "header", "menu", "related", "archive", "list")):
        penalty += 5000
    # Dense article text with several paragraphs is strongly preferred.
    return text_len + paragraph_count * 180 + image_count * 30 - penalty


def _title_root(soup: BeautifulSoup, title: str) -> Tag | None:
    title_key = re.sub(r"\s+", " ", title).strip()
    if not title_key:
        return None

    anchors: list[Tag] = []
    for node in soup.find_all(["h1", "h2", "h3"]):
        text = re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip()
        if not text:
            continue
        if text == title_key or title_key in text or text in title_key:
            anchors.append(node)

    candidates: list[Tag] = []
    for anchor in anchors:
        parent = anchor.parent
        hops = 0
        while isinstance(parent, Tag) and hops < 6:
            text_len = len(parent.get_text(" ", strip=True))
            p_count = len(parent.find_all("p"))
            if 180 <= text_len <= 30000 and p_count >= 1:
                candidates.append(parent)
            parent = parent.parent
            hops += 1

    return max(candidates, key=_candidate_score) if candidates else None


def _pick_root(soup: BeautifulSoup, title: str) -> Tag:
    anchored = _title_root(soup, title)
    if anchored is not None:
        return anchored

    candidates: list[Tag] = []
    seen: set[int] = set()
    for selector in CONTENT_SELECTORS:
        for node in soup.select(selector):
            if isinstance(node, Tag) and id(node) not in seen:
                seen.add(id(node))
                candidates.append(node)
    if candidates:
        return max(candidates, key=_candidate_score)
    return soup.body or soup


def _looks_like_boilerplate(line: str) -> bool:
    compact = re.sub(r"\s+", " ", line).strip(" -|•\t")
    if not compact:
        return True
    if len(compact) <= 90 and any(pattern.search(compact) for pattern in BOILERPLATE_PATTERNS):
        return True
    if len(compact) <= 120 and compact.count(":") >= 2 and any(word in compact for word in ("وضعیت", "پیشرفت", "پایگاه")):
        return True
    return False


def _clean_text(root: Tag, title: str = "") -> str:
    # Only article-like text blocks are used. We intentionally do NOT read <li>, because
    # navigation/portal lists were the main source of polluted body text in previous versions.
    blocks: list[str] = []
    for node in root.find_all(["p", "blockquote", "h2", "h3"], recursive=True):
        value = re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip()
        if len(value) >= 25:
            blocks.append(value)

    if sum(map(len, blocks)) < 180:
        # Fallback is conservative: use direct text lines, still excluding short UI labels.
        raw = root.get_text("\n", strip=True)
        blocks = [re.sub(r"\s+", " ", line).strip() for line in raw.splitlines() if len(line.strip()) >= 25]

    out: list[str] = []
    seen: set[str] = set()
    normalized_title = re.sub(r"\W+", "", title).lower()
    junk_exact = {"اشتراک گذاری", "چاپ", "بازگشت", "اخبار مرتبط", "لینک کوتاه", "کلمات کلیدی"}
    for line in blocks:
        line = re.sub(r"\s+", " ", line).strip(" -|•\t")
        if len(line) < 20 or line in junk_exact or _looks_like_boilerplate(line):
            continue
        key = re.sub(r"\W+", "", line).lower()
        if not key or key in seen:
            continue
        if normalized_title and key == normalized_title:
            continue
        seen.add(key)
        out.append(line)
    return "\n\n".join(out).strip()


def _src_from_img(img: Tag) -> str:
    for attr in ("data-src", "data-original", "data-lazy-src", "data-original-src", "src"):
        value = img.get(attr)
        if value:
            return str(value).strip()
    for attr in ("data-srcset", "srcset"):
        value = img.get(attr)
        if value:
            choices = [part.strip().split(" ")[0] for part in str(value).split(",") if part.strip()]
            if choices:
                return choices[-1]
    return ""


def _image_is_usable(img_url: str, img: Tag | None = None) -> bool:
    low = img_url.lower()
    if not img_url or any(word in low for word in IMAGE_BAD_WORDS):
        return False
    if low.startswith("data:") or low.endswith(".svg"):
        return False
    if img is not None:
        alt = str(img.get("alt") or "").lower()
        title = str(img.get("title") or "").lower()
        if any(word in f"{alt} {title}" for word in IMAGE_BAD_WORDS):
            return False
        try:
            width = int(str(img.get("width") or "0").replace("px", ""))
            height = int(str(img.get("height") or "0").replace("px", ""))
            if width and height and (width < 260 or height < 150):
                return False
        except ValueError:
            pass
    return True


def _extract_images(soup: BeautifulSoup, root: Tag, url: str) -> list[str]:
    images: list[str] = []
    seen: set[str] = set()

    def add(candidate: str, img: Tag | None = None) -> None:
        if not candidate:
            return
        absolute = normalize_url(urljoin(url, candidate))
        if absolute in seen or not _image_is_usable(absolute, img):
            return
        seen.add(absolute)
        images.append(absolute)

    # Prefer images that physically live inside the chosen article root. A generic site-wide
    # og:image was responsible for the giant logo seen in older content cards.
    for img in root.find_all("img"):
        add(_src_from_img(img), img)
        if len(images) >= 6:
            break

    if not images:
        og = _meta(soup, "og:image", "twitter:image")
        if og:
            add(og)
    return images[:6]


def is_detail_page(page: ExtractedPage) -> bool:
    path = urlparse(page.canonical_url).path.rstrip("/").lower()
    if path in {"", "/fa", "/fa/news", "/news"}:
        return False
    if page.title.count("عنوان مطلب") >= 2:
        return False
    if "/news/" in path and len(path.split("/news/", 1)[1]) >= 3:
        return True
    if any(marker in path for marker in ("/article/", "/notice/", "/announcement/", "/content/", "/tourism/")):
        return True
    og_type = str(page.metadata.get("og_type") or "").lower()
    if og_type in {"article", "news", "newsarticle"}:
        return True
    return path.count("/") >= 3 and len(page.title) >= 8 and len(page.clean_text) >= 350


def extract_page(url: str, html: str, base_url: str, min_text_chars: int = 220) -> ExtractedPage | None:
    soup = BeautifulSoup(html, "lxml")

    canonical_node = soup.find("link", rel=lambda x: x and "canonical" in x)
    canonical_url = normalize_url(urljoin(url, canonical_node.get("href"))) if canonical_node and canonical_node.get("href") else normalize_url(url)

    title = _meta(soup, "og:title", "twitter:title")
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(" ", strip=True) if h1 else ""
    if not title and soup.title:
        title = soup.title.get_text(" ", strip=True)
    title = re.sub(r"\s+", " ", title).strip(" |-")
    if not title or title.count("عنوان مطلب") >= 2:
        return None

    description = _meta(soup, "description", "og:description", "twitter:description")

    # Global chrome is removed before article-root selection.
    for selector in REMOVE_SELECTORS:
        for node in soup.select(selector):
            node.decompose()

    root = _pick_root(soup, title)
    for selector in REMOVE_SELECTORS:
        for node in root.select(selector):
            node.decompose()

    text = _clean_text(root, title)
    if len(text) < min_text_chars:
        return None

    links: list[str] = []
    seen_links: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = normalize_url(urljoin(url, str(a["href"])))
        if href.startswith(("http://", "https://")) and same_host(href, base_url) and href not in seen_links:
            seen_links.add(href)
            links.append(href)

    images = _extract_images(soup, root, url)

    raw_text_for_date = soup.get_text(" ", strip=True)
    published_at = extract_date(soup, raw_text_for_date)
    hint = local_hint(title, text)
    persian_match = PERSIAN_DATE_RE.search(raw_text_for_date[:4000])

    metadata = {
        "og_type": _meta(soup, "og:type"),
        "author": _meta(soup, "author", "article:author"),
        "persian_date_text": persian_match.group(0) if persian_match else "",
        "source_images": images,
        "extractor_version": "11",
    }

    page = ExtractedPage(
        url=normalize_url(url),
        canonical_url=canonical_url,
        title=title or canonical_url,
        clean_text=text,
        published_at=published_at,
        description=description,
        images=images,
        links=links,
        local_hint=hint,
        metadata=metadata,
    )
    return page if is_detail_page(page) else None


def content_hash(page: ExtractedPage) -> str:
    basis = f"{page.canonical_url}\n{page.title}\n{page.clean_text}".encode("utf-8", errors="ignore")
    return hashlib.sha256(basis).hexdigest()
