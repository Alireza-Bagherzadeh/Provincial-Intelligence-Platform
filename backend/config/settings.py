from __future__ import annotations

import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv


# =========================================================
# Base
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Local development only.
# On Vercel the environment variables are injected directly.
load_dotenv(BASE_DIR / ".env")

IS_VERCEL = os.environ.get("VERCEL") == "1"


# =========================================================
# Local Windows GIS
# =========================================================

def configure_windows_gis_libraries() -> None:
    """
    Detect local GDAL / GEOS libraries on Windows.

    This is only for local Windows development.
    On Linux / Vercel it does nothing.
    """
    if os.name != "nt":
        return

    roots = [
        Path(r"C:\OSGeo4W\bin"),
        Path(r"C:\Program Files\GDAL"),
        Path(r"D:\GDAL\PFiles\GDAL"),
    ]

    program_files = Path(
        os.environ.get("ProgramW6432", r"C:\Program Files")
    )

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
            for name in (
                "gdal.dll",
                "gdal310.dll",
                "gdal309.dll",
                "gdal308.dll",
                "gdal307.dll",
            )
            if (selected_root / name).exists()
        ),
        None,
    )

    if gdal_library:
        os.environ.setdefault(
            "GDAL_LIBRARY_PATH",
            str(gdal_library),
        )

    os.environ.setdefault(
        "GEOS_LIBRARY_PATH",
        str(selected_root / "geos_c.dll"),
    )

    os.environ["PATH"] = (
        f"{selected_root}"
        f"{os.pathsep}"
        f"{os.environ.get('PATH', '')}"
    )


configure_windows_gis_libraries()

GDAL_LIBRARY_PATH = os.environ.get("GDAL_LIBRARY_PATH")
GEOS_LIBRARY_PATH = os.environ.get("GEOS_LIBRARY_PATH")


# =========================================================
# Security
# =========================================================

DJANGO_SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

if IS_VERCEL and not DJANGO_SECRET_KEY:
    raise RuntimeError(
        "DJANGO_SECRET_KEY must be configured in Vercel."
    )

SECRET_KEY = DJANGO_SECRET_KEY or "unsafe-development-key"


# Local = True by default
# Vercel = False by default
DEBUG = os.environ.get(
    "DJANGO_DEBUG",
    "false" if IS_VERCEL else "true",
).lower() == "true"


# =========================================================
# Hosts
# =========================================================

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "ALLOWED_HOSTS",
        "localhost,127.0.0.1",
    ).split(",")
    if host.strip()
]

# Allow Vercel preview/production domains.
if IS_VERCEL and ".vercel.app" not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(".vercel.app")


# =========================================================
# Applications
# =========================================================

INSTALLED_APPS = [
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


# =========================================================
# Middleware
# =========================================================

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


# =========================================================
# Django
# =========================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


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


# =========================================================
# Database
# =========================================================

DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # Production / Neon / Vercel
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=0,
        )
    }

    # Keep GeoDjango + PostGIS
    DATABASES["default"]["ENGINE"] = (
        "django.contrib.gis.db.backends.postgis"
    )

    # Recommended when using a PgBouncer / pooled URL.
    DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True

else:
    # Local PostgreSQL
    DATABASES = {
        "default": {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": os.environ.get(
                "POSTGRES_DB",
                "semnan",
            ),
            "USER": os.environ.get(
                "POSTGRES_USER",
                "semnan",
            ),
            "PASSWORD": os.environ.get(
                "POSTGRES_PASSWORD",
                "semnan",
            ),
            "HOST": os.environ.get(
                "POSTGRES_HOST",
                "localhost",
            ),
            "PORT": os.environ.get(
                "POSTGRES_PORT",
                "5434",
            ),
        }
    }


# =========================================================
# Localization
# =========================================================

LANGUAGE_CODE = "fa"
TIME_ZONE = "Asia/Tehran"

USE_I18N = True
USE_TZ = True


# =========================================================
# Static files
# =========================================================

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"


# =========================================================
# Media
# =========================================================

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# =========================================================
# Model IDs
# =========================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# =========================================================
# Redis
# =========================================================

REDIS_URL = os.environ.get(
    "REDIS_URL",
    "redis://localhost:6379/0",
)

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}


# =========================================================
# Channels
# =========================================================
#
# فعلاً اختیاری.
# در پروژه فعلی WebSocket ضروری نیست.
#

ENABLE_CHANNELS = (
    os.environ.get("ENABLE_CHANNELS", "false").lower()
    == "true"
)

if ENABLE_CHANNELS:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": (
                "channels_redis.core.RedisChannelLayer"
            ),
            "CONFIG": {
                "hosts": [REDIS_URL],
            },
        }
    }


# =========================================================
# Celery
# =========================================================

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL


# =========================================================
# CORS
# =========================================================

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "",
    ).split(",")
    if origin.strip()
]


# =========================================================
# CSRF
# =========================================================

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CSRF_TRUSTED_ORIGINS",
        "",
    ).split(",")
    if origin.strip()
]

if IS_VERCEL:
    vercel_origin = "https://*.vercel.app"

    if vercel_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(vercel_origin)


# =========================================================
# HTTPS / reverse proxy
# =========================================================

SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

SECURE_CONTENT_TYPE_NOSNIFF = True

X_FRAME_OPTIONS = "DENY"