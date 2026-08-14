export type PublicMetric = { key: string; label: string; value: string; delta: string; status: string; isDemo: boolean };
export type PublicNews = { id: string; title: string; summary: string; category: string; kind: string; publishedAt: string; sourceLabel: string; importance: number; isDemo: boolean; county?: { name: string } | null };
export type PublicSector = { id: string; code: string; domain: string; label: string; value: string; unit: string; status: "healthy" | "attention" | "critical"; description: string; trendPercent: string; isDemo: boolean };
export type PublicProject = { title: string; status: string; actualProgress: string; plannedProgress: string; county: { name: string }; isDemo: boolean };
export type PublicProcurement = { id: string; title: string; status: string; deadline: string | null; procurementMethod: string; organization: { name: string }; county?: { name: string } | null; isDemo: boolean };
export type PublicCrisis = { id: string; title: string; category: string; severity: string; status: string; impactScore: number; summary: string; county?: { name: string } | null; isDemo: boolean };
export type PublicForecast = { id: string; domain: string; metricLabel: string; horizonLabel: string; currentValue: string; forecastValue: string; unit: string; riskLevel: string; confidence: number; county?: { name: string } | null; isDemo: boolean };
export type PublicData = {
  metrics: PublicMetric[];
  news: PublicNews[];
  sectors: PublicSector[];
  projects: PublicProject[];
  procurements: PublicProcurement[];
  crises: PublicCrisis[];
  forecasts: PublicForecast[];
  source: "graphql" | "demo";
  freshness: string;
};

const fallback: PublicData = {
  source: "demo",
  freshness: "آخرین به‌روزرسانی محتوای استان: امروز",
  metrics: [
    { key: "counties", label: "شهرستان تحت پایش", value: "۸", delta: "لایه جغرافیایی استان", status: "healthy", isDemo: true },
    { key: "projects", label: "پروژه تحت پایش", value: "۱۲", delta: "پایش پیشرفت و ریسک", status: "healthy", isDemo: true },
    { key: "sector-risk", label: "محور پرریسک", value: "۲", delta: "آب و محیط‌زیست", status: "critical", isDemo: true },
    { key: "news", label: "محتوای مستند", value: "۱۱", delta: "خبر، اطلاعیه و گردشگری", status: "healthy", isDemo: true },
    { key: "procurement", label: "فرایند خرید", value: "۴", delta: "شفافیت مناقصات", status: "attention", isDemo: true }
  ],
  news: [
    { id: "n1", title: "جاذبه‌های طبیعی استان سمنان", summary: "نمایی از ظرفیت‌های طبیعی استان برای معرفی عمومی و تحلیل گردشگری.", category: "گردشگری", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 76, isDemo: true },
    { id: "n2", title: "جاذبه‌های فرهنگی و هنری استان سمنان", summary: "محتوای فرهنگی و هنری قابل استفاده در پرتال عمومی و هوشمندی محتوا.", category: "فرهنگ", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 70, isDemo: true },
    { id: "n3", title: "آگهی ثبت‌نام تکمیل ظرفیت آزمون استخدامی دستگاه‌های اجرایی", summary: "اطلاعیه رسمی قابل دسترس در مرکز اطلاع‌رسانی و جست‌وجوی پرتال.", category: "اطلاعیه", kind: "notice", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 92, isDemo: true },
    { id: "n4", title: "جنگل ابر شاهرود", summary: "ظرفیت شاخص طبیعت‌گردی در شهرستان شاهرود.", category: "گردشگری", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 86, county: { name: "شاهرود" }, isDemo: true },
    { id: "n5", title: "چشمه علی دامغان", summary: "مقصد تاریخی و طبیعی استان و ورودی مناسب برای لایه گردشگری شهرستانی.", category: "گردشگری", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 82, county: { name: "دامغان" }, isDemo: true },
    { id: "n6", title: "دروازه ارگ سمنان", summary: "میراث شهری سمنان برای روایت عمومی استان.", category: "میراث", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 79, county: { name: "سمنان" }, isDemo: true },
    { id: "n7", title: "شیخ ابوالحسن خرقانی", summary: "معرفی یکی از مفاخر عرفانی منطقه خرقان و ظرفیت فرهنگی شهرستان شاهرود.", category: "مفاخر", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 78, county: { name: "شاهرود" }, isDemo: true },
    { id: "n8", title: "قلعه سارو", summary: "اثر تاریخی پیرامون سمنان و یک نقطه قابل اتصال به لایه GIS میراث.", category: "میراث", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 76, county: { name: "سمنان" }, isDemo: true },
    { id: "n9", title: "اُپرت", summary: "مقصد طبیعت‌گردی در مرز اقلیمی کوهستان و جنگل در شمال استان.", category: "طبیعت", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 74, county: { name: "مهدی‌شهر" }, isDemo: true },
    { id: "n10", title: "آرامگاه شیخ ابوالحسن خرقانی", summary: "یکی از نقاط مهم گردشگری مذهبی و عرفانی استان در خرقان.", category: "میراث فرهنگی", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 72, county: { name: "شاهرود" }, isDemo: true },
    { id: "n11", title: "کوه اژدها گرمسار", summary: "ساختار زمین‌شناسی شاخص و ظرفیت ژئوتوریسم در محدوده گرمسار.", category: "زمین‌گردشگری", kind: "tourism", publishedAt: "2026-08-01", sourceLabel: "آرشیو semnan.moi.ir", importance: 70, county: { name: "گرمسار" }, isDemo: true }
  ],
  sectors: [
    { id: "s1", code: "water-security", domain: "آب", label: "پایداری منابع آب", value: "58", unit: "امتیاز", status: "critical", description: "محور راهبردی پیشنهادی سند برای پایش کم‌آبی، مصرف و تاب‌آوری.", trendPercent: "-4.2", isDemo: true },
    { id: "s2", code: "energy", domain: "انرژی", label: "تاب‌آوری انرژی", value: "74", unit: "امتیاز", status: "attention", description: "پایش مصرف، ناترازی، بار و رخدادهای انرژی.", trendPercent: "1.5", isDemo: true },
    { id: "s3", code: "industry", domain: "صنعت", label: "ظرفیت تولید و معدن", value: "77", unit: "امتیاز", status: "attention", description: "رصد ظرفیت صنعتی، معدنی و محدودیت‌های زیرساختی.", trendPercent: "2.4", isDemo: true },
    { id: "s4", code: "investment", domain: "سرمایه‌گذاری", label: "جریان سرمایه‌گذاری", value: "73", unit: "امتیاز", status: "attention", description: "فرصت، مانع، زمان تصمیم و تبدیل فرصت به پروژه.", trendPercent: "3.1", isDemo: true },
    { id: "s5", code: "environment", domain: "محیط‌زیست", label: "پایداری محیطی", value: "55", unit: "امتیاز", status: "critical", description: "آب، خاک، هوا، مناطق حساس و رخدادهای محیطی.", trendPercent: "-2.0", isDemo: true },
    { id: "s6", code: "tourism", domain: "گردشگری", label: "ظرفیت گردشگری", value: "86", unit: "امتیاز", status: "healthy", description: "پیوند جاذبه‌ها، شهرستان‌ها، خبر و فرصت سرمایه‌گذاری.", trendPercent: "5.0", isDemo: true }
  ],
  projects: [
    { title: "آبرسانی پایدار شرق استان", status: "critical", actualProgress: "41", plannedProgress: "58", county: { name: "شاهرود" }, isDemo: true },
    { title: "توسعه زیرساخت شهرک صنعتی", status: "attention", actualProgress: "64", plannedProgress: "72", county: { name: "گرمسار" }, isDemo: true },
    { title: "توسعه خدمات هوشمند استانی", status: "on_track", actualProgress: "81", plannedProgress: "80", county: { name: "سمنان" }, isDemo: true }
  ],
  procurements: [
    { id: "p1", title: "تأمین تجهیزات پایش زیرساخت", status: "open", deadline: "2026-08-24", procurementMethod: "مناقصه عمومی", organization: { name: "شرکت آب منطقه‌ای سمنان" }, county: { name: "سمنان" }, isDemo: true },
    { id: "p2", title: "خدمات توسعه داشبورد داده", status: "evaluation", deadline: "2026-08-16", procurementMethod: "مناقصه عمومی", organization: { name: "اداره کل ارتباطات و فناوری اطلاعات" }, county: { name: "سمنان" }, isDemo: true }
  ],
  crises: [
    { id: "c1", title: "تنش آبی شرق استان", category: "آب", severity: "critical", status: "monitoring", impactScore: 88, summary: "پیوند وضعیت منابع آب، پروژه‌ها و پیام‌های مردمی ضرورت اقدام هماهنگ را نشان می‌دهد.", county: { name: "شاهرود" }, isDemo: true },
    { id: "c2", title: "ریسک محدودیت انرژی صنایع", category: "انرژی", severity: "high", status: "monitoring", impactScore: 73, summary: "محدودیت انرژی بر ظرفیت صنعت و تولید اثر مستقیم دارد.", county: { name: "گرمسار" }, isDemo: true }
  ],
  forecasts: [
    { id: "f1", domain: "آب", metricLabel: "شاخص تنش آبی", horizonLabel: "۳۰ روز", currentValue: "58", forecastValue: "51", unit: "امتیاز", riskLevel: "critical", confidence: 72, county: { name: "شاهرود" }, isDemo: true },
    { id: "f2", domain: "صدای مردم", metricLabel: "نرخ پاسخ‌گویی", horizonLabel: "۳۰ روز", currentValue: "78", forecastValue: "84", unit: "درصد", riskLevel: "healthy", confidence: 81, county: null, isDemo: true }
  ]
};

const query = `query PublicPortal {
  dashboardSummary { dataFreshnessLabel metrics { key label value delta status isDemo } }
  newsArticles { id title summary category kind publishedAt sourceLabel importance isDemo county { name } }
  sectorIndicators { id code domain label value unit status description trendPercent isDemo county { name } }
  projects { title status actualProgress plannedProgress isDemo county { name } }
  procurementNotices { id title status deadline procurementMethod isDemo organization { name } county { name } }
  crisisSignals { id title category severity status impactScore summary isDemo county { name } }
  forecastSignals { id domain metricLabel horizonLabel currentValue forecastValue unit riskLevel confidence isDemo county { name } }
}`;

export async function getPublicData(): Promise<PublicData> {
  const endpoint = process.env.SEMNAN_API_URL ?? "http://localhost:9000/graphql/";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(String(response.status));
    const result = await response.json() as { data?: any; errors?: unknown[] };
    if (!result.data?.dashboardSummary) throw new Error("missing dashboard summary");
    return {
      metrics: result.data.dashboardSummary.metrics ?? [],
      news: (result.data.newsArticles ?? []).map((item: any) => ({ ...item, importance: Number(item.importance ?? 0) })),
      sectors: (result.data.sectorIndicators ?? []).filter((item: any) => !item.county),
      projects: result.data.projects ?? [],
      procurements: result.data.procurementNotices ?? [],
      crises: (result.data.crisisSignals ?? []).map((item: any) => ({ ...item, impactScore: Number(item.impactScore ?? 0) })),
      forecasts: (result.data.forecastSignals ?? []).map((item: any) => ({ ...item, confidence: Number(item.confidence ?? 0) })),
      source: "graphql",
      freshness: result.data.dashboardSummary.dataFreshnessLabel
    };
  } catch {
    return fallback;
  }
}
