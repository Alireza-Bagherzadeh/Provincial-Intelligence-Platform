from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

def configure_windows_gis_libraries() -> None:
    """Find common local GDAL/GEOS installs once, before Django imports GIS models."""
    if os.name != "nt":
        return

    roots = [
        Path(r"C:\OSGeo4W\bin"),
        Path(r"C:\Program Files\GDAL"),
        # The local development installer is extracted here to keep the system
        # drive free; this is intentionally discovered automatically.
        Path(r"D:\GDAL\PFiles\GDAL"),
    ]
    program_files = Path(os.environ.get("ProgramW6432", r"C:\Program Files"))
    roots.extend(program_files.glob("QGIS*/bin"))

    selected_root: Path | None = None
    for root in roots:
        if root.exists() and (root / "geos_c.dll").exists():
            selected_root = root
            break

    if selected_root is None:
        return

    gdal_library = next(
        (
            selected_root / name
            for name in ("gdal.dll", "gdal310.dll", "gdal309.dll", "gdal308.dll", "gdal307.dll")
            if (selected_root / name).exists()
        ),
        None,
    )
    if gdal_library:
        os.environ.setdefault("GDAL_LIBRARY_PATH", str(gdal_library))
    os.environ.setdefault("GEOS_LIBRARY_PATH", str(selected_root / "geos_c.dll"))
    os.environ["PATH"] = f"{selected_root}{os.pathsep}{os.environ.get('PATH', '')}"


configure_windows_gis_libraries()

# GeoDjango reads these as Django settings (not merely environment variables).
# configure_windows_gis_libraries() supplies their values automatically on Windows.
GDAL_LIBRARY_PATH = os.environ.get("GDAL_LIBRARY_PATH")
GEOS_LIBRARY_PATH = os.environ.get("GEOS_LIBRARY_PATH")

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "unsafe-development-key")
DEBUG = os.environ.get("DJANGO_DEBUG", "true").lower() == "true"
ALLOWED_HOSTS = [host for host in os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if host]

INSTALLED_APPS = [
    #"daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
    "corsheaders",
    "strawberry.django",
    "apps.core",
    "apps.geography",
    "apps.projects",
    "apps.operations",
    "apps.intelligence",
    "apps.audit",
    "apps.ingestion",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "config.urls"
ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": os.environ.get("POSTGRES_DB", "semnan"),
        "USER": os.environ.get("POSTGRES_USER", "semnan"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "semnan"),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5434"),
    }
}

LANGUAGE_CODE = "fa"
TIME_ZONE = "Asia/Tehran"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
CACHES = {"default": {"BACKEND": "django_redis.cache.RedisCache", "LOCATION": REDIS_URL}}
CHANNEL_LAYERS = {"default": {"BACKEND": "channels_redis.core.RedisChannelLayer", "CONFIG": {"hosts": [REDIS_URL]}}}
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CORS_ALLOWED_ORIGINS = [item for item in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",") if item]

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
