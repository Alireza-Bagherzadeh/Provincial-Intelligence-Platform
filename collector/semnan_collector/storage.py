from __future__ import annotations

import sqlite3
from datetime import datetime, timezone
from pathlib import Path


SCHEMA = """
CREATE TABLE IF NOT EXISTS pages (
    url TEXT PRIMARY KEY,
    canonical_url TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'discovered',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT NOT NULL DEFAULT '',
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    uploaded_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_pages_hash ON pages(content_hash);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
"""


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


class StateDB:
    def __init__(self, path: Path):
        self.path = path
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(SCHEMA)
        self.conn.commit()

    def has_same_hash(self, url: str, content_hash: str) -> bool:
        row = self.conn.execute("SELECT content_hash, status FROM pages WHERE url=?", (url,)).fetchone()
        return bool(row and row["content_hash"] == content_hash and row["status"] == "uploaded")

    def upsert_extracted(self, *, url: str, canonical_url: str, content_hash: str, title: str) -> None:
        stamp = now()
        self.conn.execute(
            """
            INSERT INTO pages(url, canonical_url, content_hash, title, status, first_seen, last_seen)
            VALUES(?,?,?,?, 'extracted', ?, ?)
            ON CONFLICT(url) DO UPDATE SET
                canonical_url=excluded.canonical_url,
                content_hash=excluded.content_hash,
                title=excluded.title,
                status=CASE WHEN pages.content_hash=excluded.content_hash AND pages.status='uploaded' THEN 'uploaded' ELSE 'extracted' END,
                last_seen=excluded.last_seen
            """,
            (url, canonical_url, content_hash, title, stamp, stamp),
        )
        self.conn.commit()

    def mark_uploaded(self, url: str) -> None:
        self.conn.execute(
            "UPDATE pages SET status='uploaded', uploaded_at=?, last_error='' WHERE url=?",
            (now(), url),
        )
        self.conn.commit()

    def mark_failed(self, url: str, error: str) -> None:
        self.conn.execute(
            "UPDATE pages SET status='failed', attempts=attempts+1, last_error=? WHERE url=?",
            (error[:1000], url),
        )
        self.conn.commit()

    def stats(self) -> dict[str, int]:
        rows = self.conn.execute("SELECT status, COUNT(*) AS c FROM pages GROUP BY status").fetchall()
        return {row["status"]: row["c"] for row in rows}

    def close(self) -> None:
        self.conn.close()
