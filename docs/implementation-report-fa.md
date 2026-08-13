# گزارش پیاده‌سازی نسخه V3 پلتفرم حکمرانی هوشمند استان سمنان

## هدف

این نسخه بازنویسی از صفر نیست. سه پروژه قبلی `portal`، `command` و `api` حفظ شده‌اند و به‌صورت افزایشی ارتقا یافته‌اند. هدف این بود که نیازهای مستندشده در آرشیو استانداری و سند `Smart Governorship` از حالت ایده به مدل داده، GraphQL و رابط کاربری قابل مشاهده تبدیل شوند.

## دامنه تحلیل اسناد

- ۳۸ فایل از آرشیو چندپارتی بررسی شد.
- ۳۳ PDF تصویری/اسکرین‌شات از صفحات پرتال استانداری، ۲ PNG و ۴ PDF رسمی/حقوقی در آرشیو وجود داشت.
- سند ۱۸ صفحه‌ای `Smart Governorship.pdf` به عنوان سند اصلی معماری محصول بررسی شد.
- در مجموع ۲۶۱ صفحه PDF رندر و مرور شد.
- برای PDFهای تصویرمحور، فقط محتوایی که از مشاهده صفحه قابل اتکا بود وارد تحلیل شد و از ساخت ادعاهای ریزِ غیرقابل خواندن خودداری شد.

## محتوای شناسایی‌شده از آرشیو پرتال

این ۱۱ عنوان در Seed مستندمحور وارد شده‌اند تا Landing و News Intelligence فقط Placeholder نباشند:

1. جاذبه‌های طبیعی استان سمنان
2. جاذبه‌های فرهنگی و هنری استان سمنان
3. آگهی ثبت‌نام تکمیل ظرفیت آزمون استخدامی دستگاه‌های اجرایی
4. شیخ ابوالحسن خرقانی
5. دروازه ارگ سمنان
6. قلعه سارو
7. جنگل ابر شاهرود
8. اُپرت
9. چشمه علی دامغان
10. آرامگاه شیخ ابوالحسن خرقانی
11. کوه اژدها گرمسار

تمام Summaryها و اعداد تحلیلی Seed با ماهیت Demo نگه داشته شده‌اند؛ این داده‌ها آمار رسمی استان نیستند.

## تغییرات Landing / Portal

Landing قبلی از حالت Static صرف خارج شده و اکنون از همان GraphQL Backend داده می‌گیرد و در صورت عدم دسترسی API به داده مستندمحور Demo برمی‌گردد.

بخش‌های اصلی V3:

- Hero و توضیح چرخه `Observe → Understand → Compare → Predict → Decide → Monitor`.
- Province Pulse و KPIهای عمومی.
- جست‌وجوی یکپارچه واقعی روی داده فعلی برای خبر، پروژه، حوزه، مناقصه، بحران و پیش‌بینی.
- Strategic Sector Pulse برای آب، انرژی، صنعت، سرمایه‌گذاری، محیط‌زیست و گردشگری.
- Resilience & Early Warning برای رخدادهای تاب‌آوری و Forecastهای منتخب.
- News Intelligence/Public Archive با نمایش همه عناوین شناسایی‌شده از اسناد.
- Tourism & Place Intelligence برای محتوای گردشگری و اتصال آن به شهرستان.
- Transparency Layer برای پروژه و Procurement.
- خدمات، اطلاعیه‌ها و فرصت‌های سرمایه‌گذاری به عنوان مسیر توسعه Public Portal.
- هشدار شفاف در Footer و UI که داده‌های Demo آمار رسمی نیستند.

## تغییرات Command Center

Sidebar مدیریتی توسعه داده شده و اکنون حوزه‌های زیر را پوشش می‌دهد:

- نمای کلی
- رصد استان
- نقشه هوشمند
- Benchmark شهرستان‌ها
- پروژه‌ها
- شهرستان‌ها
- دستگاه‌های اجرایی
- ارزیابی عملکرد
- مصوبات
- بودجه و سرمایه‌گذاری
- مناقصات و خرید
- هوشمندی بخشی
- News Intelligence
- Speech Intelligence
- صدای مردم
- هشدارها
- بحران و تاب‌آوری
- پیش‌بینی و هشدار زودهنگام
- گزارش‌ها
- حاکمیت داده
- دستیار هوشمند

### نمودارهای اضافه‌شده/استفاده‌شده

برای جلوگیری از یکنواختی Dashboard، نمودارها با یک نوع Chart محدود نشده‌اند:

- Line / Area Chart
- Donut Chart
- Horizontal Benchmark Bar
- Radar Chart
- Heatmap
- Spark Bars
- Sentiment Stack
- Gauge Chart
- Forecast Band Chart
- Scatter Plot
- Waterfall Chart

در Overview از چند فرم مختلف کنار هم استفاده شده: وضعیت Portfolio پروژه، روند پاسخ‌گویی، Benchmark حوزه‌ها، Radar عملکرد، Sentiment خبر، Gauge فشار بحران، Forecast Band و Scatter شهرستان‌ها.

## تغییرات Backend/API

مدل‌های قبلی مانند County، Project، Organization، Decision، BudgetRecord، CitizenSignal و ExecutiveReport حفظ شده‌اند. لایه Intelligence به آن اضافه شده است:

- `NewsArticle`
- `SectorIndicator`
- `ProcurementNotice`
- `SpeechInsight`
- `PerformanceIndicator`
- `CrisisSignal`
- `ForecastSignal`

این مدل‌ها از طریق Strawberry GraphQL قابل دریافت‌اند و Portal و Command از یک قرارداد داده مشترک استفاده می‌کنند.

`dashboardSummary` و `executiveBrief` نیز توسعه یافته‌اند تا علاوه بر پروژه و KPI، بحران‌های فعال و هشدارهای Forecast را در سطح مدیریتی لحاظ کنند.

## News Intelligence

مدل خبر فقط Title/Summary نیست. ساختار برای اتصال به این فیلدها آماده شده است:

- Kind و Category
- County/Geography
- Source
- Published Date
- Importance
- Sentiment
- Tags

برای Production باید Crawler چندساله، پاک‌سازی، Deduplication، Entity/Topic/Event extraction و scheduler به آن متصل شود.

## Speech Intelligence

تعهدات و سخنان مدیریتی به یک موجودیت قابل رصد تبدیل شده‌اند تا بعداً بتوان مواردی مانند گوینده، سمت، موضوع، شهرستان، خلاصه، تعهد و وضعیت پیگیری را از متن سخنرانی یا خبر استخراج و ردیابی کرد.

## Performance / Procurement / Governance

اسناد رسمی باعث اضافه شدن سه محور مهم شدند:

- Performance Management برای KPI دستگاه‌ها، Target، Weight و Period.
- Procurement Transparency برای وضعیت فرایند خرید/مناقصه، دستگاه، شهرستان، مهلت، روش و مرجع.
- Data Governance Panel برای نمایش Provenance/Data Lineage و یادآوری اینکه هر KPI باید منبع، زمان مرجع و کیفیت مشخص داشته باشد.

## Crisis & Forecast

در V3، مدل و UI برای Crisis/Resilience و Forecast/Early Warning به هم متصل شده‌اند. این به معنی وجود مدل ML واقعی نیست. Seedهای Forecast سناریویی‌اند و فقط Contract محصول را نشان می‌دهند. برای Production باید مدل پیش‌بینی با تاریخچه واقعی، Backtest، Calibration و Monitoring ساخته شود.

## مواردی که عمداً جعلی کامل نشده‌اند

چند قابلیت فقط زمانی ارزش واقعی دارند که منبع داده یا زیرساخت واقعی فراهم شود؛ بنابراین در V3 ظاهر آن‌ها به‌عنوان «واقعی» جا زده نشده است:

- مرز GIS Frontend هنوز نقشه شماتیک است؛ Backend PostGIS-ready است اما GeoJSON واقعی شهرستان‌ها باید متصل شود.
- LLM/RAG واقعی هنوز متصل نیست و دستیار فعلی تحلیل قطعی/Rule-based روی داده موجود انجام می‌دهد.
- Forecast فعلی Demo است، نه مدل پیش‌بینی آموزش‌دیده.
- Authentication/RBAC عملیاتی هنوز باید اضافه شود.
- اتصال آنلاین به سامانه‌های استانداری، بودجه، ۱۱۱/صدای مردم، پروژه و دستگاه‌ها هنوز نیازمند Connector و Data Contract است.
- Search جدید Portal روی Dataset فعلی کار می‌کند؛ Full-text Search چندساله نیازمند Backend index است.

## اولویت Production پیشنهادی

1. Data Dictionary + KPI Registry رسمی.
2. Authentication/RBAC و Audit Enforcement.
3. اتصال واقعی پروژه، بودجه/اعتبار و صدای مردم.
4. GIS واقعی با Boundaryهای PostGIS و County Drill-down.
5. Crawler چندساله News/Speech + Deduplication/Entity/Event extraction.
6. Full-text Search و Archive API.
7. Executive Brief و Provincial RAG با Citation و سطح دسترسی.
8. Forecast/Anomaly/Project Risk بعد از ایجاد تاریخچه قابل اتکا.
9. Alert Workflow شامل owner، SLA، escalation و resolution.
10. Monitoring داده و مدل برای Freshness/Quality/Drift.

## وضعیت اعتبارسنجی کد

- Syntax تمام فایل‌های Python Backend با `compileall` بررسی شده است.
- تمام فایل‌های TS/TSX با TypeScript parser بررسی شده‌اند.
- Semantic check با Stubهای محیطی React/Next اجرا شده و خطای TypeScript باقی نمانده است.
- `npm install` در محیط تست به علت محدودیت/timeout شبکه کامل نشد؛ بنابراین Build واقعی Next.js با dependencyهای نصب‌شده در این محیط اجرا نشده است.
- اجرای کامل `manage.py check` خارج از Docker به دلیل نبود Django در Python سیستم ممکن نبود؛ Dockerfile/Compose برای اجرای محیط واقعی در پروژه موجود است.

