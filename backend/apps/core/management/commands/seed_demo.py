from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.geography.models import County
from apps.intelligence.models import CrisisSignal, ForecastSignal, NewsArticle, PerformanceIndicator, ProcurementNotice, SectorIndicator, SpeechInsight
from apps.operations.models import BudgetRecord, CitizenSignal, Decision, ExecutiveReport, Organization
from apps.projects.models import Project


DEMO_COUNTIES = (
    ("semnan", "سمنان"), ("shahroud", "شاهرود"), ("damghan", "دامغان"), ("garmsar", "گرمسار"),
    ("mahdishahr", "مهدی‌شهر"), ("aradan", "آرادان"), ("sorkheh", "سرخه"), ("meyami", "میامی"),
)

DEMO_PROJECTS = (
    ("آبرسانی پایدار شرق استان", "shahroud", "critical", "58", "41", "دستگاه نمونه آب و زیرساخت"),
    ("تکمیل محور ارتباطی شمال", "semnan", "attention", "76", "69", "دستگاه نمونه راه و حمل‌ونقل"),
    ("توسعه زیرساخت صنعتی", "garmsar", "on_track", "86", "84", "دستگاه نمونه صنعت و سرمایه‌گذاری"),
    ("بهسازی شبکه خدمات روستایی", "damghan", "on_track", "63", "65", "دستگاه نمونه خدمات عمومی"),
    ("پایداری شبکه انرژی شهرک صنعتی", "aradan", "attention", "71", "60", "دستگاه نمونه انرژی"),
    ("احیای ظرفیت گردشگری تاریخی", "semnan", "on_track", "54", "58", "دستگاه نمونه میراث و گردشگری"),
    ("کاهش تنش آبی روستاهای هدف", "meyami", "critical", "62", "43", "دستگاه نمونه آب و زیرساخت"),
    ("ارتقای خدمات دیجیتال فرمانداری", "sorkheh", "on_track", "68", "72", "دستگاه نمونه تحول دیجیتال"),
    ("بهسازی دسترسی گردشگری جنگل ابر", "shahroud", "attention", "49", "44", "دستگاه نمونه میراث و گردشگری"),
    ("پایش فرونشست و خشکسالی", "garmsar", "on_track", "47", "50", "دستگاه نمونه محیط‌زیست"),
    ("بهبود مسیرهای روستایی", "mahdishahr", "attention", "57", "48", "دستگاه نمونه راه و حمل‌ونقل"),
    ("مرکز پاسخ‌گویی یکپارچه شهروندی", "damghan", "complete", "100", "100", "دستگاه نمونه خدمات عمومی"),
)

DEMO_ORGANIZATIONS = (
    ("demo-infra", "دستگاه نمونه آب و زیرساخت", "71"),
    ("demo-economy", "دستگاه نمونه صنعت و سرمایه‌گذاری", "79"),
    ("demo-services", "دستگاه نمونه خدمات عمومی", "84"),
    ("demo-digital", "دستگاه نمونه تحول دیجیتال", "76"),
    ("demo-tourism", "دستگاه نمونه میراث و گردشگری", "82"),
)

DEMO_DECISIONS = (
    ("پایش هفتگی پروژه‌های اولویت‌دار", "demo-services", "semnan", "at_risk", date(2026, 8, 18), "68"),
    ("رفع مانع آبرسانی شرق استان", "demo-infra", "shahroud", "overdue", date(2026, 8, 5), "46"),
    ("تکمیل بسته فرصت‌های سرمایه‌گذاری", "demo-economy", "garmsar", "open", date(2026, 9, 2), "52"),
    ("انتشار داشبورد خدمات عمومی", "demo-digital", "semnan", "completed", date(2026, 8, 8), "100"),
)

DEMO_BUDGETS = (
    ("semnan", "عمرانی", "1405", 145_000_000_000, 102_000_000_000),
    ("shahroud", "آب و زیرساخت", "1405", 178_000_000_000, 91_000_000_000),
    ("damghan", "خدمات عمومی", "1405", 96_000_000_000, 67_000_000_000),
    ("garmsar", "صنعت و سرمایه‌گذاری", "1405", 132_000_000_000, 104_000_000_000),
    ("mahdishahr", "راه روستایی", "1405", 71_000_000_000, 39_000_000_000),
    ("aradan", "انرژی", "1405", 64_000_000_000, 35_000_000_000),
    ("sorkheh", "تحول دیجیتال", "1405", 38_000_000_000, 26_000_000_000),
    ("meyami", "آب روستایی", "1405", 88_000_000_000, 37_000_000_000),
)

DEMO_CITIZEN_SIGNALS = (
    ("semnan", "خدمات اداری", 188, 169, "27", "-4"), ("shahroud", "آب و زیرساخت", 214, 146, "51", "13"),
    ("damghan", "خدمات عمومی", 132, 116, "31", "2"), ("garmsar", "محیط کسب‌وکار", 107, 91, "36", "-2"),
    ("mahdishahr", "راه و حمل‌ونقل", 88, 66, "43", "7"), ("aradan", "انرژی", 73, 57, "48", "9"),
    ("sorkheh", "خدمات دیجیتال", 61, 57, "19", "-8"), ("meyami", "آب و روستا", 119, 72, "63", "15"),
)

DEMO_REPORTS = (
    ("گزارش صبحگاهی استان", "morning_brief", "امروز", "ready", "demo-services"),
    ("گزارش عملکرد شهرستان‌ها", "county", "ماه جاری", "review", "demo-services"),
    ("گزارش ریسک پروژه‌ها", "projects", "هفته جاری", "ready", "demo-infra"),
    ("گزارش هوشمندی خبر و افکار عمومی", "news_intelligence", "۷ روز اخیر", "ready", "demo-digital"),
    ("گزارش فرصت‌های سرمایه‌گذاری", "investment", "فصل جاری", "draft", "demo-economy"),
)

# عناوین از PDFهای ارسالی استخراج شده‌اند؛ خلاصه‌ها بازنویسی کوتاه برای نمایش پرتال هستند.
DOCUMENT_NEWS = (
    ("جاذبه‌های طبیعی استان سمنان", "گردشگری", "tourism", "تنوع طبیعی استان از کویر و مناطق خشک تا جنگل‌های هیرکانی، ارتفاعات و چشمه‌ها، ظرفیت کم‌نظیری برای گردشگری طبیعت ایجاد کرده است.", None),
    ("جاذبه‌های فرهنگی و هنری استان سمنان", "میراث فرهنگی", "tourism", "میراث معماری، صنایع دستی، بافت‌های تاریخی و آیین‌های محلی، بخش مهمی از هویت فرهنگی و ظرفیت گردشگری استان را شکل می‌دهند.", "semnan"),
    ("آگهی ثبت‌نام تکمیل ظرفیت آزمون استخدامی دستگاه‌های اجرایی", "اطلاعیه", "notice", "اطلاعیه آرشیوی درباره ثبت‌نام تکمیل ظرفیت آزمون استخدامی دستگاه‌های اجرایی که در اسناد سایت استانداری دیده می‌شود.", None),
    ("شیخ ابوالحسن خرقانی", "میراث و مفاخر", "tourism", "معرفی شیخ ابوالحسن خرقانی و جایگاه فرهنگی و عرفانی او در منطقه خرقان و استان سمنان.", "shahroud"),
    ("دروازه ارگ سمنان", "میراث تاریخی", "tourism", "دروازه ارگ از شاخص‌ترین نمادهای تاریخی شهر سمنان و از عناصر مهم هویت شهری و گردشگری مرکز استان است.", "semnan"),
    ("قلعه سارو", "میراث تاریخی", "tourism", "قلعه‌های سارو در پیرامون سمنان از آثار تاریخی مهم منطقه‌اند و قابلیت نمایش در نقشه میراث و گردشگری استان را دارند.", "semnan"),
    ("جنگل ابر شاهرود", "طبیعت", "tourism", "جنگل ابر شاهرود با چشم‌انداز اقیانوس ابر و پیوند با جنگل‌های هیرکانی، یکی از مهم‌ترین جاذبه‌های طبیعی شرق استان است.", "shahroud"),
    ("اُپرت", "طبیعت", "tourism", "اُپرت در مرز اقلیمی جنگل و کوهستان، یکی از نقاط شاخص طبیعت‌گردی شمال استان و مناسب برای نمایش در لایه GIS گردشگری است.", "mahdishahr"),
    ("چشمه علی دامغان", "میراث و طبیعت", "tourism", "مجموعه چشمه علی دامغان ترکیبی از چشم‌انداز طبیعی، آب، باغ و معماری تاریخی است و از جاذبه‌های شناخته‌شده شهرستان دامغان به شمار می‌آید.", "damghan"),
    ("آرامگاه شیخ ابوالحسن خرقانی", "میراث فرهنگی", "tourism", "آرامگاه شیخ ابوالحسن خرقانی در خرقان، یکی از نقاط مهم گردشگری مذهبی و عرفانی استان است.", "shahroud"),
    ("کوه اژدها گرمسار", "زمین‌گردشگری", "tourism", "کوه اژدها در محدوده گرمسار با ساختار زمین‌شناسی متمایز، ظرفیت ویژه‌ای برای ژئوتوریسم و آموزش زمین‌شناسی دارد.", "garmsar"),
)

PROVINCE_INDICATORS = (
    ("water-security", "آب و کشاورزی", "پایداری منابع آب", 58, "امتیاز", -6.2, 72, "critical", "تنش آبی، افت آب زیرزمینی و خشکسالی باید در سطح شهرستانی و زمانی پایش شوند."),
    ("energy-resilience", "انرژی", "پایداری تامین انرژی", 74, "امتیاز", 2.4, 80, "attention", "پایش ظرفیت، مصرف، محدودیت و اثر آن بر صنعت و خدمات."),
    ("industry-capacity", "صنعت و معدن", "ظرفیت تولید صنعتی", 77, "امتیاز", 4.1, 82, "attention", "ترکیب ظرفیت تولید، وضعیت شهرک‌ها و ریسک محدودیت انرژی."),
    ("employment", "اشتغال", "روند اشتغال", 69, "امتیاز", 1.8, 75, "attention", "پایش اشتغال ایجادشده، فرصت‌های شغلی و ارتباط با سرمایه‌گذاری."),
    ("investment", "سرمایه‌گذاری", "جذابیت سرمایه‌گذاری", 73, "امتیاز", 5.3, 78, "attention", "فرصت، پروژه، مانع و زمان رفع موانع سرمایه‌گذاری."),
    ("transport", "راه و حمل‌ونقل", "پایداری محورهای ارتباطی", 82, "امتیاز", 3.6, 80, "healthy", "ترکیب پروژه‌های راه، رخدادها و دسترسی شهرستانی."),
    ("environment", "محیط‌زیست", "ریسک خشکسالی و فرونشست", 55, "امتیاز", -7.4, 70, "critical", "لایه‌های سنجش از دور، خشکسالی، فرونشست و تغییر کاربری زمین."),
    ("tourism", "گردشگری", "ظرفیت گردشگری و میراث", 86, "امتیاز", 6.8, 78, "healthy", "جاذبه‌های طبیعی و فرهنگی آرشیو استانداری در یک لایه موضوعی."),
    ("digital", "حکمرانی دیجیتال", "بلوغ خدمات الکترونیک", 79, "امتیاز", 7.1, 82, "attention", "میز خدمت، شفافیت، پیگیری درخواست و کیفیت داده."),
    ("citizen", "سرمایه اجتماعی", "پاسخ‌گویی به شهروندان", 76, "امتیاز", 3.2, 80, "attention", "تعداد درخواست، زمان پاسخ، نرخ حل و موضوعات پرتکرار."),
)


class Command(BaseCommand):
    help = "Seed clearly labeled document-driven demonstration records for the Semnan platform."

    @transaction.atomic
    def handle(self, *args, **options):
        counties: dict[str, County] = {}
        for code, name in DEMO_COUNTIES:
            county, _ = County.objects.update_or_create(code=code, defaults={"name": name, "source_system": "demo_seed", "is_demo": True})
            counties[code] = county

        for title, county_code, status, planned, actual, organization in DEMO_PROJECTS:
            Project.objects.update_or_create(
                title=title, county=counties[county_code],
                defaults={"status": status, "planned_progress": planned, "actual_progress": actual, "responsible_organization": organization, "source_system": "demo_seed", "is_demo": True},
            )

        organizations: dict[str, Organization] = {}
        for code, name, score in DEMO_ORGANIZATIONS:
            org, _ = Organization.objects.update_or_create(code=code, defaults={"name": name, "performance_score": score, "source_system": "demo_seed", "is_demo": True})
            organizations[code] = org

        for title, owner_code, county_code, status, due_date, progress in DEMO_DECISIONS:
            Decision.objects.update_or_create(title=title, defaults={"owner": organizations[owner_code], "county": counties[county_code], "status": status, "due_date": due_date, "progress": progress, "source_system": "demo_seed", "is_demo": True})

        for county_code, category, fiscal_year, allocated, spending in DEMO_BUDGETS:
            BudgetRecord.objects.update_or_create(county=counties[county_code], category=category, fiscal_year=fiscal_year, defaults={"allocated_amount": allocated, "actual_spending": spending, "source_system": "demo_seed", "is_demo": True})

        for county_code, category, requests, resolved, response_hours, change in DEMO_CITIZEN_SIGNALS:
            CitizenSignal.objects.update_or_create(county=counties[county_code], category=category, defaults={"request_count": requests, "resolved_count": resolved, "average_response_hours": response_hours, "change_percent": change, "source_system": "demo_seed", "is_demo": True})

        for title, report_type, period, status, organization_code in DEMO_REPORTS:
            ExecutiveReport.objects.update_or_create(title=title, defaults={"report_type": report_type, "period_label": period, "status": status, "organization": organizations[organization_code], "source_system": "demo_seed", "is_demo": True})

        captured = date(2026, 8, 10)
        for index, (title, category, kind, summary, county_code) in enumerate(DOCUMENT_NEWS):
            NewsArticle.objects.update_or_create(
                title=title,
                defaults={"summary": summary, "category": category, "kind": kind, "published_at": captured - timedelta(days=index % 4), "source_label": "آرشیو اسناد استانداری سمنان", "county": counties.get(county_code) if county_code else None, "sentiment_score": "0.15", "importance": max(68, 92 - index * 2), "tags": [category, "آرشیو"], "source_system": "document_archive", "source_record_id": f"doc-news-{index+1}", "is_demo": True},
            )

        for code, domain, label, value, unit, trend, benchmark, status, description in PROVINCE_INDICATORS:
            SectorIndicator.objects.update_or_create(
                code=code, period_label="مرداد ۱۴۰۵", county=None,
                defaults={"domain": domain, "label": label, "value": value, "unit": unit, "trend_percent": trend, "benchmark_value": benchmark, "status": status, "description": description, "source_system": "demo_seed", "source_record_id": f"sector-{code}", "is_demo": True},
            )

        # County-level benchmark rows: deterministic demo values used by the heatmap, never presented as official statistics.
        county_offsets = {"semnan": 5, "shahroud": 1, "damghan": 2, "garmsar": 4, "mahdishahr": -1, "aradan": -3, "sorkheh": 3, "meyami": -5}
        benchmark_domains = [("water", "آب", 62), ("economy", "اقتصاد", 73), ("services", "خدمات", 78), ("environment", "محیط‌زیست", 64)]
        for county_code, offset in county_offsets.items():
            for code, domain, base in benchmark_domains:
                value = max(35, min(95, base + offset + ((len(county_code) + len(code)) % 5 - 2)))
                SectorIndicator.objects.update_or_create(
                    code=f"county-{code}", period_label="مرداد ۱۴۰۵", county=counties[county_code],
                    defaults={"domain": domain, "label": f"شاخص ترکیبی {domain}", "value": value, "unit": "امتیاز", "trend_percent": offset / 2, "benchmark_value": base + 3, "status": "critical" if value < 60 else "attention" if value < 75 else "healthy", "description": "مقدار نمایشی برای نمایش منطق Benchmark شهرستانی.", "source_system": "demo_seed", "is_demo": True},
                )

        procurement_rows = (
            ("تأمین تجهیزات پایش زیرساخت", "demo-infra", "open", captured, date(2026, 8, 24), 21_000_000_000, "مناقصه عمومی", "semnan", "DEMO-1405-01"),
            ("خدمات توسعه داشبورد داده", "demo-digital", "evaluation", captured - timedelta(days=5), date(2026, 8, 16), 8_500_000_000, "مناقصه عمومی", "semnan", "DEMO-1405-02"),
            ("بهسازی دسترسی جاذبه‌های گردشگری", "demo-tourism", "planned", captured, date(2026, 9, 4), 14_000_000_000, "مناقصه عمومی", "shahroud", "DEMO-1405-03"),
            ("تأمین خدمات پشتیبانی مرکز پاسخ‌گویی", "demo-services", "awarded", captured - timedelta(days=20), None, 5_200_000_000, "استعلام/فرایند رقابتی", "damghan", "DEMO-1405-04"),
        )
        for title, org_code, status, published, deadline, amount, method, county_code, ref in procurement_rows:
            ProcurementNotice.objects.update_or_create(reference_code=ref, defaults={"title": title, "organization": organizations[org_code], "status": status, "published_at": published, "deadline": deadline, "estimated_amount": amount, "procurement_method": method, "county": counties[county_code], "source_system": "demo_seed", "is_demo": True})

        speech_rows = (
            ("استاندار - نمونه تحلیلی", "مقام اجرایی استان", captured, "آب", "تأکید بر تبدیل مسئله کمبود آب به برنامه قابل سنجش و شهرستان‌محور.", "گزارش هفتگی ریسک آب و پیشرفت اقدامات آماده شود.", "at_risk", "semnan"),
            ("استاندار - نمونه تحلیلی", "مقام اجرایی استان", captured - timedelta(days=8), "سرمایه‌گذاری", "تمرکز بر رفع موانع و کوتاه شدن زمان تبدیل فرصت به پروژه.", "بسته موانع سرمایه‌گذاری با مسئول و موعد مشخص پیگیری شود.", "in_progress", "garmsar"),
            ("استاندار - نمونه تحلیلی", "مقام اجرایی استان", captured - timedelta(days=16), "اشتغال", "پیوند ایجاد شغل با پیشرفت واقعی پروژه و بهره‌برداری مورد تأکید قرار گرفته است.", "شاخص شغل ایجادشده کنار پیشرفت فیزیکی پروژه گزارش شود.", "in_progress", "shahroud"),
            ("استاندار - نمونه تحلیلی", "مقام اجرایی استان", captured - timedelta(days=25), "خدمات عمومی", "پاسخ‌گویی و کاهش زمان خدمت به عنوان شاخص اعتماد عمومی دیده می‌شود.", "SLA خدمات پرتقاضا در داشبورد مدیریتی قابل مشاهده باشد.", "completed", "semnan"),
        )
        for speaker, role, spoken_at, topic, summary, commitment, status, county_code in speech_rows:
            SpeechInsight.objects.update_or_create(speaker=speaker, spoken_at=spoken_at, topic=topic, defaults={"role": role, "summary": summary, "commitment_text": commitment, "commitment_status": status, "county": counties[county_code], "source_system": "demo_seed", "is_demo": True})

        crisis_rows = (
            ("تنش آبی شرق استان", "آب", "critical", "monitoring", captured, 88, "پایش ترکیبی افت منابع، پروژه‌های آبرسانی و درخواست‌های مرتبط؛ مقدار نمایشی برای طراحی مرکز بحران.", "shahroud"),
            ("ریسک محدودیت انرژی صنایع", "انرژی", "high", "monitoring", captured - timedelta(days=1), 73, "سیگنال نمایشی برای نمایش اثر محدودیت انرژی بر تولید و پروژه‌های صنعتی.", "garmsar"),
            ("هشدار خشکسالی و فرونشست", "محیط‌زیست", "high", "open", captured - timedelta(days=2), 79, "نیازمند اتصال واقعی به سنجش از دور، هواشناسی و داده‌های آب زیرزمینی.", None),
            ("اختلال خدمات عمومی نمونه", "خدمات", "medium", "resolved", captured - timedelta(days=4), 42, "رخداد آزمایشی برای نمایش چرخه ثبت تا رفع بحران.", "semnan"),
        )
        for title, category, severity, status, occurred, impact, summary, county_code in crisis_rows:
            CrisisSignal.objects.update_or_create(
                title=title, occurred_at=occurred,
                defaults={"category": category, "severity": severity, "status": status, "impact_score": impact, "summary": summary, "source_label": "Seed مرکز تاب‌آوری", "county": counties.get(county_code) if county_code else None, "source_system": "demo_seed", "is_demo": True},
            )

        forecast_rows = (
            ("آب", "شاخص تنش آبی", 58, 51, 47, 56, "امتیاز", "۳۰ روز", "critical", 72, "Trend + scenario demo", "shahroud"),
            ("انرژی", "تاب‌آوری تامین انرژی", 74, 69, 65, 75, "امتیاز", "۳۰ روز", "attention", 68, "Trend + scenario demo", "garmsar"),
            ("پروژه", "میانگین پیشرفت پروژه‌های بحرانی", 42, 49, 45, 54, "درصد", "۴۵ روز", "attention", 76, "Portfolio trend demo", None),
            ("صدای مردم", "نرخ پاسخ‌گویی", 78, 84, 80, 88, "درصد", "۳۰ روز", "healthy", 81, "SLA trend demo", None),
            ("محیط‌زیست", "ریسک خشکسالی/فرونشست", 55, 49, 44, 56, "امتیاز", "۶۰ روز", "critical", 64, "Remote sensing placeholder", None),
        )
        for domain, label, current, forecast, low, high, unit, horizon, risk, confidence, method, county_code in forecast_rows:
            ForecastSignal.objects.update_or_create(
                domain=domain, metric_label=label, as_of=captured, county=counties.get(county_code) if county_code else None,
                defaults={"horizon_label": horizon, "current_value": current, "forecast_value": forecast, "lower_bound": low, "upper_bound": high, "unit": unit, "risk_level": risk, "confidence": confidence, "methodology": method, "source_system": "demo_seed", "is_demo": True},
            )

        kpi_rows = (
            ("demo-infra", "اثربخشی", "تحقق برنامه", 66, 85), ("demo-infra", "زمان", "به‌موقع بودن", 58, 80), ("demo-infra", "داده", "کیفیت گزارش‌دهی", 77, 85),
            ("demo-economy", "اثربخشی", "تحقق برنامه", 81, 85), ("demo-economy", "سرمایه‌گذاری", "رفع مانع", 74, 80), ("demo-economy", "داده", "کیفیت گزارش‌دهی", 79, 85),
            ("demo-services", "خدمت", "پاسخ‌گویی در SLA", 88, 90), ("demo-services", "رضایت", "نرخ حل درخواست", 84, 90), ("demo-services", "داده", "کیفیت گزارش‌دهی", 80, 85),
            ("demo-digital", "دیجیتال", "پوشش خدمت الکترونیک", 82, 90), ("demo-digital", "داده", "کامل بودن داده", 76, 90), ("demo-digital", "امنیت", "انطباق دسترسی", 91, 95),
            ("demo-tourism", "توسعه", "آمادگی مقصد", 83, 88), ("demo-tourism", "محتوا", "پوشش اطلاعات جاذبه‌ها", 86, 90), ("demo-tourism", "پروژه", "تحقق برنامه", 78, 85),
        )
        for org_code, category, label, score, target in kpi_rows:
            PerformanceIndicator.objects.update_or_create(organization=organizations[org_code], label=label, period_label="مرداد ۱۴۰۵", defaults={"category": category, "score": score, "target": target, "weight": 1, "source_system": "demo_seed", "is_demo": True})

        self.stdout.write(self.style.SUCCESS("Seeded expanded document-driven demo data: governance, news, sectors, procurement, speech intelligence and performance KPIs."))
