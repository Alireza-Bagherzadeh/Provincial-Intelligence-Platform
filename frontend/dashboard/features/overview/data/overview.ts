import type { CommandCenterData } from "../../command/types";
import { demoCounties } from "../../gis/data/demo-counties";

export type { ExecutiveBriefItem, ExecutiveMetric } from "../../command/types";

const fallbackNews: CommandCenterData["newsArticles"] = [
  { id: "n1", title: "جاذبه‌های طبیعی استان سمنان", summary: "تنوع طبیعی استان از کویر تا جنگل‌های هیرکانی و ارتفاعات، ظرفیت مهم گردشگری و پایش محیطی ایجاد کرده است.", category: "گردشگری", kind: "tourism", publishedAt: "2026-08-10", sourceUrl: "", sourceLabel: "آرشیو اسناد استانداری", sentimentScore: "0.15", importance: 92, county: null, isDemo: true },
  { id: "n2", title: "جاذبه‌های فرهنگی و هنری استان سمنان", summary: "میراث معماری، صنایع دستی و آیین‌های محلی بخشی از هویت فرهنگی استان هستند.", category: "میراث فرهنگی", kind: "tourism", publishedAt: "2026-08-10", sourceUrl: "", sourceLabel: "آرشیو اسناد استانداری", sentimentScore: "0.18", importance: 92, county: { code: "semnan", name: "سمنان" }, isDemo: true },
  { id: "n3", title: "آگهی ثبت‌نام تکمیل ظرفیت آزمون استخدامی دستگاه‌های اجرایی", summary: "اطلاعیه خدماتی و استخدامی منتشرشده در آرشیو سایت استانداری.", category: "اطلاعیه", kind: "notice", publishedAt: "2026-08-09", sourceUrl: "", sourceLabel: "آرشیو اسناد استانداری", sentimentScore: "0", importance: 88, county: null, isDemo: true },
  { id: "n4", title: "جنگل ابر شاهرود", summary: "جنگل ابر یکی از نقاط شاخص طبیعت‌گردی شرق استان و مناسب برای لایه GIS گردشگری است.", category: "طبیعت", kind: "tourism", publishedAt: "2026-08-08", sourceUrl: "", sourceLabel: "آرشیو اسناد استانداری", sentimentScore: "0.35", importance: 82, county: { code: "shahroud", name: "شاهرود" }, isDemo: true },
  { id: "n5", title: "کوه اژدها گرمسار", summary: "ساختار زمین‌شناسی شاخص این منطقه ظرفیت ژئوتوریسم و آموزش زمین‌شناسی دارد.", category: "زمین‌گردشگری", kind: "tourism", publishedAt: "2026-08-07", sourceUrl: "", sourceLabel: "آرشیو اسناد استانداری", sentimentScore: "0.25", importance: 82, county: { code: "garmsar", name: "گرمسار" }, isDemo: true }
];

const fallbackSectors: CommandCenterData["sectorIndicators"] = [
  ["water-security", "آب و کشاورزی", "پایداری منابع آب", 58, -6.2, 72, "critical"],
  ["energy-resilience", "انرژی", "پایداری تامین انرژی", 74, 2.4, 80, "attention"],
  ["industry-capacity", "صنعت و معدن", "ظرفیت تولید صنعتی", 77, 4.1, 82, "attention"],
  ["employment", "اشتغال", "روند اشتغال", 69, 1.8, 75, "attention"],
  ["investment", "سرمایه‌گذاری", "جذابیت سرمایه‌گذاری", 73, 5.3, 78, "attention"],
  ["transport", "راه و حمل‌ونقل", "پایداری محورهای ارتباطی", 82, 3.6, 80, "healthy"],
  ["environment", "محیط‌زیست", "ریسک خشکسالی و فرونشست", 55, -7.4, 70, "critical"],
  ["tourism", "گردشگری", "ظرفیت گردشگری و میراث", 86, 6.8, 78, "healthy"],
  ["digital", "حکمرانی دیجیتال", "بلوغ خدمات الکترونیک", 79, 7.1, 82, "attention"],
  ["citizen", "سرمایه اجتماعی", "پاسخ‌گویی به شهروندان", 76, 3.2, 80, "attention"]
].map(([code, domain, label, value, trend, benchmark, status], index) => ({
  id: `s${index + 1}`, code: String(code), domain: String(domain), label: String(label), value: String(value), unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: String(trend), benchmarkValue: String(benchmark), status: status as "healthy" | "attention" | "critical", description: "جمع‌بندی وضعیت جاری، روند تغییر و فاصله تا هدف تعیین‌شده.", county: null, isDemo: true
}));

const fallbackData: Omit<CommandCenterData, "endpoint" | "connectionMessage"> = {
  source: "demo",
  freshness: "آخرین به‌روزرسانی تحلیلی: امروز",
  metrics: [
    { key: "counties", label: "شهرستان‌های تحت پایش", value: "۸", delta: "لایه جغرافیایی استان", status: "healthy", isDemo: true },
    { key: "projects", label: "پروژه‌های ثبت‌شده", value: "۱۲", delta: "مرکز کنترل پروژه", status: "healthy", isDemo: true },
    { key: "critical", label: "پروژه‌های بحرانی", value: "۲", delta: "نیازمند اقدام فوری", status: "critical", isDemo: true },
    { key: "progress", label: "میانگین پیشرفت واقعی", value: "۶۲٪", delta: "تحلیل روند پروژه‌ها", status: "attention", isDemo: true },
    { key: "sector-risk", label: "ریسک‌های بخشی", value: "۲", delta: "آب و محیط‌زیست", status: "critical", isDemo: true },
    { key: "news", label: "محتوای رصدشده", value: "۱۱", delta: "آرشیو مستند ارسالی", status: "healthy", isDemo: true },
    { key: "procurement", label: "فرایندهای خرید باز", value: "۳", delta: "پایش شفافیت", status: "attention", isDemo: true },
    { key: "crisis", label: "سیگنال‌های بحران فعال", value: "۳", delta: "تاب‌آوری و پاسخ", status: "critical", isDemo: true },
    { key: "forecast", label: "هشدارهای پیش‌بینی", value: "۲", delta: "Early Warning", status: "critical", isDemo: true }
  ],
  brief: [
    { kind: "crisis", title: "تنش آبی شرق استان بالاترین سیگنال تاب‌آوری را دارد.", detail: "شدت اثر ۸۸ از ۱۰۰ است و پیگیری اقدامات آب، هواشناسی و پروژه‌های مرتبط در اولویت قرار دارد.", actionLabel: "مرکز بحران", isDemo: true },
    { kind: "forecast", title: "برآورد تنش آبی در افق ۳۰ روز نزولی است.", detail: "شاخص از ۵۸ به ۵۱ می‌رسد و دامنه تغییرات نیز در تحلیل لحاظ شده است.", actionLabel: "هشدار زودهنگام", isDemo: true },
    { kind: "sector", title: "ریسک آب و محیط‌زیست در بالاترین سطح توجه است.", detail: "روندهای زمانی و وضعیت شهرستان‌ها ضرورت اقدام هماهنگ را نشان می‌دهند.", actionLabel: "بخش‌بندی هوشمند", isDemo: true },
    { kind: "risk", title: "دو پروژه از برنامه عقب هستند.", detail: "انحراف برنامه و عملکرد به مرکز هشدار و خلاصه اجرایی متصل شده است.", actionLabel: "مرکز پروژه‌ها", isDemo: true }
  ],
  counties: demoCounties,
  projects: [
    { title: "آبرسانی پایدار شرق استان", status: "critical", plannedProgress: "58", actualProgress: "41", responsibleOrganization: "شرکت آب منطقه‌ای سمنان", isDemo: true, county: { code: "shahroud", name: "شاهرود" } },
    { title: "تکمیل محور ارتباطی شمال", status: "attention", plannedProgress: "76", actualProgress: "69", responsibleOrganization: "اداره کل راه و شهرسازی", isDemo: true, county: { code: "semnan", name: "سمنان" } },
    { title: "توسعه زیرساخت صنعتی", status: "on_track", plannedProgress: "86", actualProgress: "84", responsibleOrganization: "اداره کل صنعت، معدن و تجارت", isDemo: true, county: { code: "garmsar", name: "گرمسار" } },
    { title: "کاهش تنش آبی روستاهای هدف", status: "critical", plannedProgress: "62", actualProgress: "43", responsibleOrganization: "شرکت آب و فاضلاب استان", isDemo: true, county: { code: "meyami", name: "میامی" } },
    { title: "ارتقای خدمات دیجیتال فرمانداری", status: "on_track", plannedProgress: "68", actualProgress: "72", responsibleOrganization: "اداره کل ارتباطات و فناوری اطلاعات", isDemo: true, county: { code: "sorkheh", name: "سرخه" } },
    { title: "بهبود مسیرهای روستایی", status: "attention", plannedProgress: "57", actualProgress: "48", responsibleOrganization: "اداره کل راهداری و حمل‌ونقل جاده‌ای", isDemo: true, county: { code: "mahdishahr", name: "مهدی‌شهر" } }
  ],
  alerts: [
    { id: "a1", title: "انحراف پیشرفت پروژه از برنامه", severity: "critical", entityLabel: "آبرسانی پایدار شرق استان · شاهرود", status: "open", isDemo: true },
    { id: "a2", title: "ریسک بخشی: پایداری منابع آب", severity: "critical", entityLabel: "آب و کشاورزی", status: "open", isDemo: true }
  ],
  organizations: [
    { name: "شرکت آب منطقه‌ای سمنان", code: "demo-infra", performanceScore: "71", isDemo: true },
    { name: "اداره کل صنعت، معدن و تجارت", code: "demo-economy", performanceScore: "79", isDemo: true },
    { name: "استانداری سمنان", code: "demo-services", performanceScore: "84", isDemo: true },
    { name: "اداره کل ارتباطات و فناوری اطلاعات", code: "demo-digital", performanceScore: "76", isDemo: true }
  ],
  decisions: [
    { title: "رفع مانع آبرسانی شرق استان", status: "overdue", dueDate: "2026-08-05", progress: "46", isDemo: true, owner: { name: "شرکت آب منطقه‌ای سمنان" }, county: { name: "شاهرود" } },
    { title: "تکمیل بسته فرصت‌های سرمایه‌گذاری", status: "open", dueDate: "2026-09-02", progress: "52", isDemo: true, owner: { name: "اداره کل صنعت، معدن و تجارت" }, county: { name: "گرمسار" } }
  ],
  budgetRecords: [
    { category: "عمرانی", fiscalYear: "1405", allocatedAmount: "145000000000", actualSpending: "102000000000", isDemo: true, county: { name: "سمنان" } },
    { category: "آب و زیرساخت", fiscalYear: "1405", allocatedAmount: "178000000000", actualSpending: "91000000000", isDemo: true, county: { name: "شاهرود" } },
    { category: "صنعت و سرمایه‌گذاری", fiscalYear: "1405", allocatedAmount: "132000000000", actualSpending: "104000000000", isDemo: true, county: { name: "گرمسار" } }
  ],
  citizenSignals: [
    { category: "خدمات اداری", requestCount: 188, resolvedCount: 169, averageResponseHours: "27", changePercent: "-4", isDemo: true, county: { name: "سمنان" } },
    { category: "آب و زیرساخت", requestCount: 214, resolvedCount: 146, averageResponseHours: "51", changePercent: "13", isDemo: true, county: { name: "شاهرود" } },
    { category: "آب و روستا", requestCount: 119, resolvedCount: 72, averageResponseHours: "63", changePercent: "15", isDemo: true, county: { name: "میامی" } }
  ],
  reports: [
    { title: "گزارش صبحگاهی استان", reportType: "morning_brief", periodLabel: "امروز", status: "ready", isDemo: true, organization: { name: "استانداری سمنان" } },
    { title: "گزارش خبرگزاری هوشمند و افکار عمومی", reportType: "news_intelligence", periodLabel: "۷ روز اخیر", status: "ready", isDemo: true, organization: { name: "اداره کل ارتباطات و فناوری اطلاعات" } }
  ],
  newsArticles: fallbackNews,
  sectorIndicators: fallbackSectors,
  procurementNotices: [
    { id: "p1", title: "تأمین تجهیزات پایش زیرساخت", status: "open", publishedAt: "2026-08-10", deadline: "2026-08-24", estimatedAmount: "21000000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-01", organization: { name: "شرکت آب منطقه‌ای سمنان", code: "demo-infra" }, county: { name: "سمنان" }, isDemo: true },
    { id: "p2", title: "خدمات توسعه داشبورد داده", status: "evaluation", publishedAt: "2026-08-05", deadline: "2026-08-16", estimatedAmount: "8500000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-02", organization: { name: "اداره کل ارتباطات و فناوری اطلاعات", code: "demo-digital" }, county: { name: "سمنان" }, isDemo: true },
    { id: "p3", title: "بهسازی دسترسی جاذبه‌های گردشگری", status: "planned", publishedAt: "2026-08-10", deadline: "2026-09-04", estimatedAmount: "14000000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-03", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "demo-tourism" }, county: { name: "شاهرود" }, isDemo: true }
  ],
  speechInsights: [
    { id: "sp1", speaker: "محمدجواد کولیوند", role: "استاندار سمنان", spokenAt: "2026-08-10", topic: "آب", summary: "تبدیل مسئله کمبود آب به برنامه قابل سنجش و شهرستان‌محور.", commitmentText: "گزارش هفتگی ریسک آب و پیشرفت اقدامات آماده شود.", commitmentStatus: "at_risk", county: { name: "سمنان" }, sourceUrl: "", isDemo: true },
    { id: "sp2", speaker: "محمدجواد کولیوند", role: "استاندار سمنان", spokenAt: "2026-08-02", topic: "سرمایه‌گذاری", summary: "تمرکز بر رفع موانع و کوتاه شدن زمان تبدیل فرصت به پروژه.", commitmentText: "بسته موانع سرمایه‌گذاری با مسئول و موعد مشخص پیگیری شود.", commitmentStatus: "in_progress", county: { name: "گرمسار" }, sourceUrl: "", isDemo: true },
    { id: "sp3", speaker: "محمدجواد کولیوند", role: "استاندار سمنان", spokenAt: "2026-07-28", topic: "پروژه‌های عمرانی", summary: "پروژه‌های نیمه‌تمام باید بر پایه اثرگذاری، پیشرفت و نیاز شهرستان اولویت‌بندی شوند.", commitmentText: "فهرست پروژه‌های اولویت‌دار هر شهرستان با زمان‌بندی تکمیل ارائه شود.", commitmentStatus: "in_progress", county: { name: "شاهرود" }, sourceUrl: "", isDemo: true },
    { id: "sp4", speaker: "محمدجواد کولیوند", role: "استاندار سمنان", spokenAt: "2026-07-22", topic: "اشتغال", summary: "پیوند آموزش مهارتی با نیاز واقعی صنایع، محور اصلی افزایش اشتغال پایدار است.", commitmentText: "ظرفیت‌های استخدامی صنایع و برنامه مهارت‌آموزی شهرستان‌ها تطبیق داده شود.", commitmentStatus: "open", county: { name: "دامغان" }, sourceUrl: "", isDemo: true },
    { id: "sp5", speaker: "محمدجواد کولیوند", role: "استاندار سمنان", spokenAt: "2026-07-15", topic: "انرژی خورشیدی", summary: "توسعه نیروگاه‌های خورشیدی کوچک‌مقیاس باید با مشارکت بخش خصوصی شتاب بگیرد.", commitmentText: "زمین‌های مستعد و مجوزهای معطل طرح‌های خورشیدی تعیین تکلیف شوند.", commitmentStatus: "completed", county: { name: "آرادان" }, sourceUrl: "", isDemo: true },
    { id: "sp6", speaker: "فرج‌الله ایلیات", role: "معاون هماهنگی امور عمرانی", spokenAt: "2026-07-09", topic: "ایمنی راه", summary: "کاهش نقاط حادثه‌خیز و ایمن‌سازی محورهای پرتردد باید با گزارش ماهانه سنجیده شود.", commitmentText: "سه نقطه پرخطر در اولویت اصلاح فوری قرار گیرد.", commitmentStatus: "at_risk", county: { name: "میامی" }, sourceUrl: "", isDemo: true },
    { id: "sp7", speaker: "حمید دهرویه", role: "معاون هماهنگی امور اقتصادی", spokenAt: "2026-07-03", topic: "تولید", summary: "رفع موانع واحدهای تولیدی باید نتیجه‌محور و همراه با اعلام اثر بر ظرفیت تولید باشد.", commitmentText: "مصوبات کارگروه تسهیل تا حصول نتیجه در هر شهرستان پیگیری شود.", commitmentStatus: "in_progress", county: { name: "گرمسار" }, sourceUrl: "", isDemo: true },
    { id: "sp8", speaker: "مهدی آقابراری", role: "معاون سیاسی، امنیتی و اجتماعی", spokenAt: "2026-06-27", topic: "پاسخ‌گویی", summary: "رضایت عمومی با پاسخ روشن، به‌موقع و قابل پیگیری دستگاه‌های اجرایی افزایش می‌یابد.", commitmentText: "گزارش درخواست‌های بدون پاسخ دستگاه‌ها هفتگی ارائه شود.", commitmentStatus: "completed", county: { name: "سمنان" }, sourceUrl: "", isDemo: true }
  ],
  performanceIndicators: [
    { id: "k1", category: "اثربخشی", label: "تحقق برنامه", score: "66", target: "85", periodLabel: "مرداد ۱۴۰۵", weight: "1", organization: { name: "دستگاه نمونه آب و زیرساخت", code: "demo-infra" }, isDemo: true },
    { id: "k2", category: "زمان", label: "به‌موقع بودن", score: "58", target: "80", periodLabel: "مرداد ۱۴۰۵", weight: "1", organization: { name: "دستگاه نمونه آب و زیرساخت", code: "demo-infra" }, isDemo: true },
    { id: "k3", category: "داده", label: "کیفیت گزارش‌دهی", score: "77", target: "85", periodLabel: "مرداد ۱۴۰۵", weight: "1", organization: { name: "دستگاه نمونه آب و زیرساخت", code: "demo-infra" }, isDemo: true },
    { id: "k4", category: "خدمت", label: "پاسخ‌گویی در SLA", score: "88", target: "90", periodLabel: "مرداد ۱۴۰۵", weight: "1", organization: { name: "دستگاه نمونه خدمات عمومی", code: "demo-services" }, isDemo: true }
  ],
  crisisSignals: [
    { id: "c1", title: "تنش آبی شرق استان", category: "آب", severity: "critical", status: "monitoring", occurredAt: "2026-08-10", impactScore: 88, summary: "ترکیب وضعیت منابع آب، پروژه‌ها و درخواست‌های مردمی نیازمند پیگیری فوری است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "شاهرود" }, isDemo: true },
    { id: "c2", title: "ریسک محدودیت انرژی صنایع", category: "انرژی", severity: "high", status: "monitoring", occurredAt: "2026-08-09", impactScore: 73, summary: "پایش اثر محدودیت انرژی بر صنعت و تولید.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "گرمسار" }, isDemo: true },
    { id: "c3", title: "هشدار خشکسالی و فرونشست", category: "محیط‌زیست", severity: "high", status: "open", occurredAt: "2026-08-08", impactScore: 79, summary: "روند شاخص‌های محیطی و تصاویر پایشی ضرورت بررسی دقیق‌تر را نشان می‌دهد.", sourceLabel: "مرکز تاب‌آوری استان", county: null, isDemo: true },
    { id: "c4", title: "اختلال خدمات عمومی", category: "خدمات", severity: "medium", status: "resolved", occurredAt: "2026-08-06", impactScore: 42, summary: "رسیدگی انجام شده و چرخه رخداد با ثبت نتیجه خاتمه یافته است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "سمنان" }, isDemo: true }
  ],
  forecastSignals: [
    { id: "f1", domain: "آب", metricLabel: "شاخص تنش آبی", asOf: "2026-08-10", horizonLabel: "۳۰ روز", currentValue: "58", forecastValue: "51", lowerBound: "47", upperBound: "56", unit: "امتیاز", riskLevel: "critical", confidence: 72, methodology: "تحلیل روند و سناریو", county: { name: "شاهرود" }, isDemo: true },
    { id: "f2", domain: "انرژی", metricLabel: "تاب‌آوری تامین انرژی", asOf: "2026-08-10", horizonLabel: "۳۰ روز", currentValue: "74", forecastValue: "69", lowerBound: "65", upperBound: "75", unit: "امتیاز", riskLevel: "attention", confidence: 68, methodology: "تحلیل روند و سناریو", county: { name: "گرمسار" }, isDemo: true },
    { id: "f3", domain: "پروژه", metricLabel: "میانگین پیشرفت پروژه‌های بحرانی", asOf: "2026-08-10", horizonLabel: "۴۵ روز", currentValue: "42", forecastValue: "49", lowerBound: "45", upperBound: "54", unit: "درصد", riskLevel: "attention", confidence: 76, methodology: "تحلیل روند سبد پروژه", county: null, isDemo: true },
    { id: "f4", domain: "صدای مردم", metricLabel: "نرخ پاسخ‌گویی", asOf: "2026-08-10", horizonLabel: "۳۰ روز", currentValue: "78", forecastValue: "84", lowerBound: "80", upperBound: "88", unit: "درصد", riskLevel: "healthy", confidence: 81, methodology: "تحلیل روند زمان پاسخ", county: null, isDemo: true },
    { id: "f5", domain: "محیط‌زیست", metricLabel: "ریسک خشکسالی/فرونشست", asOf: "2026-08-10", horizonLabel: "۶۰ روز", currentValue: "55", forecastValue: "49", lowerBound: "44", upperBound: "56", unit: "امتیاز", riskLevel: "critical", confidence: 64, methodology: "تحلیل پایش از دور", county: null, isDemo: true }
  ]
};

type GraphQLResponse = {
  data?: {
    dashboardSummary?: { metrics: CommandCenterData["metrics"]; dataFreshnessLabel: string; isDemo: boolean };
    executiveBrief?: CommandCenterData["brief"];
    countySnapshots?: CommandCenterData["counties"];
    projects?: CommandCenterData["projects"];
    alerts?: CommandCenterData["alerts"];
    organizations?: CommandCenterData["organizations"];
    decisions?: CommandCenterData["decisions"];
    budgetRecords?: CommandCenterData["budgetRecords"];
    citizenSignals?: CommandCenterData["citizenSignals"];
    reports?: CommandCenterData["reports"];
    newsArticles?: CommandCenterData["newsArticles"];
    sectorIndicators?: CommandCenterData["sectorIndicators"];
    procurementNotices?: CommandCenterData["procurementNotices"];
    speechInsights?: CommandCenterData["speechInsights"];
    performanceIndicators?: CommandCenterData["performanceIndicators"];
    crisisSignals?: CommandCenterData["crisisSignals"];
    forecastSignals?: CommandCenterData["forecastSignals"];
  };
  errors?: Array<{ message: string }>;
};

const commandQuery = `
  query CommandCenter {
    dashboardSummary { dataFreshnessLabel isDemo metrics { key label value delta status isDemo } }
    executiveBrief { kind title detail actionLabel isDemo }
    countySnapshots { code name projectCount criticalProjectCount averageProgress isDemo }
    projects { title status plannedProgress actualProgress responsibleOrganization isDemo county { code name } }
    alerts { id title severity entityLabel status isDemo }
    organizations { name code performanceScore isDemo }
    decisions { title status dueDate progress isDemo owner { name } county { name } }
    budgetRecords { category fiscalYear allocatedAmount actualSpending isDemo county { name } }
    citizenSignals { category requestCount resolvedCount averageResponseHours changePercent isDemo county { name } }
    reports { title reportType periodLabel status isDemo organization { name } }
    newsArticles { id title summary category kind publishedAt sourceUrl sourceLabel sentimentScore importance isDemo county { code name } }
    sectorIndicators { id code domain label value unit periodLabel trendPercent benchmarkValue status description isDemo county { code name } }
    procurementNotices { id title status publishedAt deadline estimatedAmount procurementMethod referenceCode isDemo organization { name code } county { name } }
    speechInsights { id speaker role spokenAt topic summary commitmentText commitmentStatus sourceUrl isDemo county { name } }
    performanceIndicators { id category label score target periodLabel weight isDemo organization { name code } }
    crisisSignals { id title category severity status occurredAt impactScore summary sourceLabel isDemo county { name } }
    forecastSignals { id domain metricLabel asOf horizonLabel currentValue forecastValue lowerBound upperBound unit riskLevel confidence methodology isDemo county { name } }
  }
`;

export async function getCommandCenterData(): Promise<CommandCenterData> {
  const endpoint = process.env.SEMNAN_API_URL ?? "http://localhost:9000/graphql/";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: commandQuery }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = (await response.json()) as GraphQLResponse;
    if (!result.data?.dashboardSummary) throw new Error(result.errors?.map((error) => error.message).join("، ") || "پاسخ سرویس داده فاقد اطلاعات است");

    const isPartial = Boolean(result.errors?.length);
    return {
      metrics: result.data.dashboardSummary.metrics,
      brief: result.data.executiveBrief ?? [],
      counties: result.data.countySnapshots ?? [],
      projects: result.data.projects ?? [],
      alerts: result.data.alerts ?? [],
      organizations: result.data.organizations ?? [],
      decisions: result.data.decisions ?? [],
      budgetRecords: result.data.budgetRecords ?? [],
      citizenSignals: result.data.citizenSignals ?? [],
      reports: result.data.reports ?? [],
      newsArticles: result.data.newsArticles?.length ? result.data.newsArticles : fallbackNews,
      sectorIndicators: result.data.sectorIndicators ?? [],
      procurementNotices: result.data.procurementNotices ?? [],
      speechInsights: result.data.speechInsights ?? [],
      performanceIndicators: result.data.performanceIndicators ?? [],
      crisisSignals: result.data.crisisSignals ?? [],
      forecastSignals: result.data.forecastSignals ?? [],
      freshness: result.data.dashboardSummary.dataFreshnessLabel,
      source: isPartial ? "partial" : "graphql",
      endpoint,
      connectionMessage: isPartial ? result.errors?.map((error) => error.message).join("، ") : undefined
    };
  } catch (error) {
    return { ...fallbackData, endpoint, connectionMessage: error instanceof Error ? error.message : "خطای ناشناخته در دریافت داده" };
  }
}
