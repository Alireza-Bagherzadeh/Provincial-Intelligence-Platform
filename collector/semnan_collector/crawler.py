from __future__ import annotations

import logging
import time
import xml.etree.ElementTree as ET
from collections import deque
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup

from .config import Settings
from .extractor import extract_page, normalize_url, same_host
from .models import ExtractedPage

log = logging.getLogger(__name__)


class Crawler:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = httpx.Client(
            timeout=settings.timeout,
            follow_redirects=True,
            headers={
                "User-Agent": settings.user_agent,
                "Accept-Language": "fa-IR,fa;q=0.9,en;q=0.5",
                "Accept": "text/html,application/xhtml+xml,application/xml,text/xml",
            },
        )

    def close(self) -> None:
        self.client.close()

    def allowed(self, url: str) -> bool:
        if not url.startswith(("http://", "https://")):
            return False
        if not same_host(url, self.settings.base_url):
            return False
        low = url.lower()
        if any(pattern.lower() in low for pattern in self.settings.ignore_patterns):
            return False
        path = urlparse(url).path.lower()
        return not path.endswith((".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".zip", ".rar", ".mp4", ".mp3"))

    def fetch(self, url: str) -> tuple[str | None, str]:
        try:
            response = self.client.get(url)
            response.raise_for_status()
            ctype = response.headers.get("content-type", "").lower()
            return response.text, ctype
        except Exception as exc:
            log.warning("fetch failed %s: %s", url, exc)
            return None, ""

    def _discover_html_links(self, url: str, html: str) -> list[str]:
        soup = BeautifulSoup(html, "lxml")
        links: list[str] = []
        seen: set[str] = set()
        for a in soup.find_all("a", href=True):
            href = normalize_url(urljoin(url, str(a["href"])))
            if href not in seen and self.allowed(href):
                seen.add(href)
                links.append(href)
        return links

    def _sitemap_urls(self) -> list[str]:
        sitemap = urljoin(self.settings.base_url, "/sitemap.xml")
        text, ctype = self.fetch(sitemap)
        if not text or ("xml" not in ctype and not text.lstrip().startswith("<")):
            return []
        try:
            root = ET.fromstring(text)
        except ET.ParseError:
            return []
        urls: list[str] = []
        for loc in root.iter():
            if not loc.tag.lower().endswith("loc") or not loc.text:
                continue
            candidate = normalize_url(loc.text.strip())
            if candidate.endswith(".xml"):
                # Avoid recursively fetching nested sitemaps in V1; start URLs + HTML discovery still cover the site.
                continue
            if self.allowed(candidate):
                urls.append(candidate)
            if len(urls) >= self.settings.max_pages * 3:
                break
        return urls

    def crawl(self, limit: int | None = None):
        cap = limit or self.settings.max_pages
        seeds = [normalize_url(x) for x in self.settings.start_urls if x]
        seeds.extend(self._sitemap_urls())
        queue = deque(seeds)
        queued = set(seeds)
        visited: set[str] = set()

        while queue and len(visited) < cap:
            url = queue.popleft()
            if url in visited or not self.allowed(url):
                continue
            visited.add(url)
            log.info("[%s/%s] GET %s", len(visited), cap, url)
            html, ctype = self.fetch(url)
            if not html or (ctype and "html" not in ctype and "xhtml" not in ctype):
                continue

            # Discovery is independent from article extraction. Archive/home pages can be short
            # and still contribute links to detail pages.
            for link in self._discover_html_links(url, html):
                if link not in visited and link not in queued:
                    queued.add(link)
                    queue.append(link)

            page = extract_page(url, html, self.settings.base_url, self.settings.min_text_chars)
            if page:
                yield page
            time.sleep(self.settings.delay)

    def one(self, url: str) -> ExtractedPage | None:
        html, ctype = self.fetch(url)
        if not html or (ctype and "html" not in ctype and "xhtml" not in ctype):
            return None
        return extract_page(url, html, self.settings.base_url, self.settings.min_text_chars)
