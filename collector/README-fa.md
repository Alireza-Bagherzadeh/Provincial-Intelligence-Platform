# Semnan Collector — اجرای محلی روی ویندوز

این Collector روی سیستم داخل ایران اجرا می‌شود، صفحات `semnan.moi.ir` را می‌خواند، متن/لینک/تصاویر/عنوان/تاریخ را استخراج می‌کند و فقط محتوای جدید یا تغییرکرده را به API پروژه می‌فرستد.

## نصب

در CMD/PowerShell داخل پوشه `collector`:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
```

فایل `.env` را باز کن و حداقل این دو مقدار را درست کن:

```env
INGEST_URL=http://localhost:9000/api/collector/ingest/
COLLECTOR_API_KEY=یک-رشته-طولانی-یکسان-با-بک‌اند
```

## تست یک صفحه

```powershell
python main.py one "https://semnan.moi.ir/..." --upload
```

اگر نتیجه خوب بود:

```powershell
python main.py crawl --upload --limit 50
```

وضعیت صف محلی:

```powershell
python main.py stats
```

`collector.db` باعث می‌شود صفحات بدون تغییر دوباره ارسال نشوند. اگر اینترنت/Backend قطع شود، رکورد failed باقی می‌ماند و اجرای بعدی دوباره قابل تلاش است.

## Production بدون VPS ایرانی

Collector همچنان روی کامپیوتر خودت اجرا می‌شود. فقط `INGEST_URL` را از localhost به API عمومی Production تغییر بده:

```env
INGEST_URL=https://YOUR-BACKEND-DOMAIN/api/collector/ingest/
```

Frontend می‌تواند روی Vercel باشد؛ Collector مستقیماً به Backend ingestion API وصل می‌شود و به مرورگر یا Frontend وابسته نیست.

## اجرای خودکار روی ویندوز

ساده‌ترین روش: Task Scheduler ویندوز.

1. Task Scheduler → Create Task
2. Trigger: Daily → Repeat task every 15 minutes
3. Action → Start a program
4. Program: مسیر `python.exe` داخل `.venv`
5. Arguments: `main.py crawl --upload --limit 80`
6. Start in: مسیر پوشه `collector`

تا زمانی که سیستم روشن و اینترنت متصل باشد، اخبار جدید ارسال می‌شوند.
