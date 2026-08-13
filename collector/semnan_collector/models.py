from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class ExtractedPage:
    url: str
    canonical_url: str
    title: str
    clean_text: str
    published_at: str | None = None
    description: str = ""
    images: list[str] = field(default_factory=list)
    links: list[str] = field(default_factory=list)
    source_name: str = "استانداری سمنان"
    local_hint: str = "unknown"
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_payload(self) -> dict[str, Any]:
        return asdict(self)
