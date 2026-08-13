# Feature Gap و Roadmap پیشنهادی

## آنچه در V3 اضافه شده

- در V4 ساختار اجرا ساده شده است: یک `frontend` واحد برای Landing و Command Center و یک `backend` برای Django/API؛ Design Tokens نیز داخل خود Frontend قرار گرفته‌اند.
- حفظ کد قبلی و توسعه افزایشی به جای بازنویسی کامل.
- GraphQL مشترک برای Portal و Command.
- News Intelligence، Speech Intelligence، Sector Intelligence، County Benchmarking، Procurement، Performance Management و Data Governance.
- Crisis & Resilience Center و Forecast / Early Warning بر پایه مدل‌های Backend و GraphQL.
- جست‌وجوی واقعی داخل داده فعلی Portal برای خبر، پروژه، شاخص، مناقصه، بحران و Forecast.
- داشبورد مدیریتی با نمودارهای متنوع: Line/Area، Donut، Horizontal Benchmark Bar، Radar، Heatmap، Spark Bars، Sentiment Stack، Gauge، Forecast Band، Scatter و Waterfall.
- Landing عمومی داده‌محور با Province Pulse، خبر/گردشگری، پروژه‌های منتخب، شفافیت مناقصات و چرخه Decision Intelligence.
- Seed مستندمحور با برچسب صریح Demo.
- اصلاح وابستگی Design System که در ZIPهای قبلی به workspace گمشده اشاره می‌کرد.
- هماهنگ‌سازی نمونه `.env` با PostgreSQL/PostGIS و GraphQL.

## هنوز Production-ready نیست

### ۱. GIS واقعی
Backend برای PostGIS آماده است اما Frontend هنوز Geometry واقعی شهرستان‌ها را دریافت نمی‌کند. گام بعد:

`PostGIS → GeoJSON GraphQL/REST → MapLibre/Leaflet/OpenLayers → Layer Control + Drill-down`

### ۲. Live News Crawler
آرشیو فعلی از اسناد ارسالی Seed شده است. برای News Intelligence واقعی باید Crawler/Scheduler، Deduplication، Entity Extraction، Topic Modeling و Event Clustering اضافه شود.

### ۳. RAG واقعی
UI و معماری RAG نمایش داده می‌شود ولی LLM متصل نشده است. فاز بعد باید شامل ingestion اسناد، chunking، metadata، hybrid retrieval، reranking، citation و policy دسترسی باشد.

### ۴. Authentication/RBAC
برای Command Center باید نقش‌هایی مانند Governor, Deputy, County Governor, Organization Manager, Analyst و Viewer تعریف شوند.

### ۵. Data Contracts رسمی
قبل از اتصال دستگاه‌ها باید برای هر KPI تعریف، واحد، دوره، منبع، صاحب داده، کیفیت، Target و قواعد Revision مشخص شود.

### ۶. Forecast / Anomaly / Project Risk
مدل داده، GraphQL و UI سناریویی Forecast/Early Warning در V3 اضافه شده، اما **مدل پیش‌بینی واقعی** هنوز پیاده نشده است. مقادیر Seed نمایشی هستند. برای Production ابتدا باید تاریخچه قابل اتکا، Feature Pipeline، Backtesting، Calibration و Monitoring مدل ایجاد شود.

## اولویت پیشنهادی اجرایی

1. تثبیت Data Dictionary و KPI Registry.
2. اتصال داده واقعی ۲ تا ۳ حوزه با ارزش بالا: پروژه‌ها، صدای مردم و بودجه/اعتبار.
3. GIS واقعی و County Drill-down.
4. News + Speech ingestion.
5. Authentication/RBAC/Audit enforcement.
6. Executive Brief با RAG و Citation.
7. Forecast، Anomaly Detection و Project Risk پس از ایجاد تاریخچه داده.
