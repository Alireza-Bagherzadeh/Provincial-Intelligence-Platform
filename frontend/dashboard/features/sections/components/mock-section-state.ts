import type { CommandCenterData } from "../../command/types";

/**
 * Local-only presentation state for sections that should stay populated
 * without GraphQL / PostgreSQL / Redis. Nothing in this file is fetched.
 */
export const MOCK_SECTOR_INDICATORS: CommandCenterData["sectorIndicators"] = [
  { id: "sector-water", code: "WATER", domain: "آب", label: "پایداری منابع آب", value: "74", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "-2.4", benchmarkValue: "78", status: "attention", description: "ترکیب وضعیت پایداری تامین، مصرف و تنش آبی استان.", county: null, isDemo: true },
  { id: "sector-energy", code: "ENERGY", domain: "انرژی", label: "پایداری شبکه انرژی", value: "83", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "1.8", benchmarkValue: "80", status: "healthy", description: "پایداری شبکه و مدیریت بار در سطح استان.", county: null, isDemo: true },
  { id: "sector-industry", code: "INDUSTRY", domain: "صنعت", label: "پویایی فعالیت صنعتی", value: "76", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "2.1", benchmarkValue: "75", status: "attention", description: "ترکیب ظرفیت فعال، تولید و وضعیت واحدهای صنعتی.", county: null, isDemo: true },
  { id: "sector-jobs", code: "JOBS", domain: "اشتغال", label: "پویایی بازار کار", value: "69", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "-1.2", benchmarkValue: "72", status: "attention", description: "روند اشتغال، فرصت‌های جدید و پایداری بازار کار.", county: null, isDemo: true },
  { id: "sector-invest", code: "INVEST", domain: "سرمایه‌گذاری", label: "جذب و تحقق سرمایه‌گذاری", value: "64", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "-3.6", benchmarkValue: "70", status: "critical", description: "وضعیت پرونده‌های سرمایه‌گذاری، تحقق تعهد و زمان صدور مجوز.", county: null, isDemo: true },
  { id: "sector-env", code: "ENV", domain: "محیط‌زیست", label: "تاب‌آوری محیط‌زیستی", value: "81", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "1.4", benchmarkValue: "78", status: "healthy", description: "کیفیت محیط، فشار منابع و اقدامات حفاظتی.", county: null, isDemo: true },
  { id: "sector-tourism", code: "TOURISM", domain: "گردشگری", label: "رشد و ظرفیت گردشگری", value: "88", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "4.7", benchmarkValue: "82", status: "healthy", description: "روند بازدید، اقامت و فعال‌شدن ظرفیت‌های گردشگری استان.", county: null, isDemo: true },
  { id: "sector-digital", code: "DIGITAL", domain: "حکمرانی دیجیتال", label: "بلوغ خدمات هوشمند", value: "79", unit: "امتیاز", periodLabel: "مرداد ۱۴۰۵", trendPercent: "3.2", benchmarkValue: "80", status: "attention", description: "بلوغ خدمات برخط، تبادل داده و تجربه دیجیتال شهروندان.", county: null, isDemo: true },
];

export const MOCK_ORGANIZATIONS: CommandCenterData["organizations"] = [
  { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD", performanceScore: "86", isDemo: true },
  { name: "شرکت آب منطقه‌ای", code: "ORG-WATER", performanceScore: "82", isDemo: true },
  { name: "اداره کل صنعت، معدن و تجارت", code: "ORG-IND", performanceScore: "78", isDemo: true },
  { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR", performanceScore: "91", isDemo: true },
  { name: "اداره کل محیط‌زیست", code: "ORG-ENV", performanceScore: "74", isDemo: true },
];

export const MOCK_PERFORMANCE_INDICATORS: CommandCenterData["performanceIndicators"] = [
  { id: "p-1", category: "اثربخشی", label: "تحقق برنامه سالانه", score: "88", target: "90", periodLabel: "مرداد ۱۴۰۵", weight: "30", organization: { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD" }, isDemo: true },
  { id: "p-2", category: "خدمت", label: "کیفیت ارائه خدمت", score: "84", target: "85", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD" }, isDemo: true },
  { id: "p-3", category: "بهره‌وری", label: "بهره‌وری منابع", score: "81", target: "83", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD" }, isDemo: true },
  { id: "p-4", category: "شفافیت", label: "شفافیت و پاسخ‌گویی", score: "90", target: "88", periodLabel: "مرداد ۱۴۰۵", weight: "20", organization: { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD" }, isDemo: true },

  { id: "p-5", category: "اثربخشی", label: "تحقق برنامه سالانه", score: "85", target: "88", periodLabel: "مرداد ۱۴۰۵", weight: "30", organization: { name: "شرکت آب منطقه‌ای", code: "ORG-WATER" }, isDemo: true },
  { id: "p-6", category: "خدمت", label: "کیفیت ارائه خدمت", score: "79", target: "84", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "شرکت آب منطقه‌ای", code: "ORG-WATER" }, isDemo: true },
  { id: "p-7", category: "بهره‌وری", label: "بهره‌وری منابع", score: "80", target: "82", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "شرکت آب منطقه‌ای", code: "ORG-WATER" }, isDemo: true },
  { id: "p-8", category: "شفافیت", label: "شفافیت و پاسخ‌گویی", score: "84", target: "86", periodLabel: "مرداد ۱۴۰۵", weight: "20", organization: { name: "شرکت آب منطقه‌ای", code: "ORG-WATER" }, isDemo: true },

  { id: "p-9", category: "اثربخشی", label: "تحقق برنامه سالانه", score: "80", target: "86", periodLabel: "مرداد ۱۴۰۵", weight: "30", organization: { name: "اداره کل صنعت، معدن و تجارت", code: "ORG-IND" }, isDemo: true },
  { id: "p-10", category: "خدمت", label: "کیفیت ارائه خدمت", score: "76", target: "82", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل صنعت، معدن و تجارت", code: "ORG-IND" }, isDemo: true },
  { id: "p-11", category: "بهره‌وری", label: "بهره‌وری منابع", score: "77", target: "82", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل صنعت، معدن و تجارت", code: "ORG-IND" }, isDemo: true },
  { id: "p-12", category: "شفافیت", label: "شفافیت و پاسخ‌گویی", score: "79", target: "84", periodLabel: "مرداد ۱۴۰۵", weight: "20", organization: { name: "اداره کل صنعت، معدن و تجارت", code: "ORG-IND" }, isDemo: true },

  { id: "p-13", category: "اثربخشی", label: "تحقق برنامه سالانه", score: "93", target: "90", periodLabel: "مرداد ۱۴۰۵", weight: "30", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR" }, isDemo: true },
  { id: "p-14", category: "خدمت", label: "کیفیت ارائه خدمت", score: "91", target: "88", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR" }, isDemo: true },
  { id: "p-15", category: "بهره‌وری", label: "بهره‌وری منابع", score: "88", target: "85", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR" }, isDemo: true },
  { id: "p-16", category: "شفافیت", label: "شفافیت و پاسخ‌گویی", score: "92", target: "88", periodLabel: "مرداد ۱۴۰۵", weight: "20", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR" }, isDemo: true },

  { id: "p-17", category: "اثربخشی", label: "تحقق برنامه سالانه", score: "75", target: "82", periodLabel: "مرداد ۱۴۰۵", weight: "30", organization: { name: "اداره کل محیط‌زیست", code: "ORG-ENV" }, isDemo: true },
  { id: "p-18", category: "خدمت", label: "کیفیت ارائه خدمت", score: "73", target: "80", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل محیط‌زیست", code: "ORG-ENV" }, isDemo: true },
  { id: "p-19", category: "بهره‌وری", label: "بهره‌وری منابع", score: "72", target: "80", periodLabel: "مرداد ۱۴۰۵", weight: "25", organization: { name: "اداره کل محیط‌زیست", code: "ORG-ENV" }, isDemo: true },
  { id: "p-20", category: "شفافیت", label: "شفافیت و پاسخ‌گویی", score: "77", target: "82", periodLabel: "مرداد ۱۴۰۵", weight: "20", organization: { name: "اداره کل محیط‌زیست", code: "ORG-ENV" }, isDemo: true },
];

export const MOCK_PROCUREMENT_NOTICES: CommandCenterData["procurementNotices"] = [
  { id: "proc-1", title: "بهسازی محور سمنان ـ مهدی‌شهر", status: "open", publishedAt: "۱۴۰۵/۰۵/۱۸", deadline: "۱۴۰۵/۰۶/۰۵", estimatedAmount: "92000000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-021", organization: { name: "اداره کل راه و شهرسازی", code: "ORG-ROAD" }, county: { name: "سمنان" }, isDemo: true },
  { id: "proc-2", title: "توسعه سامانه پایش هوشمند آب", status: "evaluation", publishedAt: "۱۴۰۵/۰۵/۱۵", deadline: "۱۴۰۵/۰۵/۳۰", estimatedAmount: "58000000000", procurementMethod: "مناقصه دو مرحله‌ای", referenceCode: "SMN-1405-019", organization: { name: "شرکت آب منطقه‌ای", code: "ORG-WATER" }, county: { name: "دامغان" }, isDemo: true },
  { id: "proc-3", title: "تجهیز مرکز داده مدیریت بحران", status: "planned", publishedAt: "۱۴۰۵/۰۵/۲۱", deadline: "۱۴۰۵/۰۶/۱۲", estimatedAmount: "41000000000", procurementMethod: "استعلام و ارزیابی", referenceCode: "SMN-1405-025", organization: { name: "استانداری سمنان", code: "ORG-GOV" }, county: null, isDemo: true },
  { id: "proc-4", title: "مرمت مجموعه تاریخی بسطام", status: "awarded", publishedAt: "۱۴۰۵/۰۴/۲۸", deadline: "۱۴۰۵/۰۵/۱۲", estimatedAmount: "36000000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-014", organization: { name: "اداره کل میراث فرهنگی و گردشگری", code: "ORG-TOUR" }, county: { name: "شاهرود" }, isDemo: true },
  { id: "proc-5", title: "خرید تجهیزات سنجش کیفیت هوا", status: "open", publishedAt: "۱۴۰۵/۰۵/۲۰", deadline: "۱۴۰۵/۰۶/۰۸", estimatedAmount: "27000000000", procurementMethod: "مناقصه عمومی", referenceCode: "SMN-1405-023", organization: { name: "اداره کل محیط‌زیست", code: "ORG-ENV" }, county: { name: "گرمسار" }, isDemo: true },
  { id: "proc-6", title: "تکمیل روشنایی کم‌مصرف معابر", status: "evaluation", publishedAt: "۱۴۰۵/۰۵/۱۷", deadline: "۱۴۰۵/۰۶/۰۲", estimatedAmount: "33000000000", procurementMethod: "مناقصه محدود", referenceCode: "SMN-1405-020", organization: { name: "شرکت توزیع نیروی برق", code: "ORG-POWER" }, county: { name: "سرخه" }, isDemo: true },
];

export const MOCK_REPORTS: CommandCenterData["reports"] = [
  { title: "گزارش هفتگی پیشرفت پروژه‌های اولویت‌دار", reportType: "project", periodLabel: "هفته سوم مرداد ۱۴۰۵", status: "ready", isDemo: true, organization: { name: "دفتر فنی استانداری" } },
  { title: "گزارش صبحگاهی شاخص‌های کلیدی استان", reportType: "executive", periodLabel: "۲۲ مرداد ۱۴۰۵", status: "ready", isDemo: true, organization: { name: "مرکز فرماندهی" } },
  { title: "گزارش مقایسه عملکرد شهرستان‌ها", reportType: "benchmark", periodLabel: "مرداد ۱۴۰۵", status: "review", isDemo: true, organization: { name: "دفتر برنامه‌ریزی" } },
  { title: "گزارش پایش مصوبات و تعهدات دستگاه‌ها", reportType: "commitment", periodLabel: "نیمه اول مرداد ۱۴۰۵", status: "ready", isDemo: true, organization: { name: "معاونت هماهنگی امور عمرانی" } },
  { title: "گزارش تحلیلی ریسک‌های بخشی استان", reportType: "risk", periodLabel: "مرداد ۱۴۰۵", status: "draft", isDemo: true, organization: { name: "مرکز پایش و تصمیم‌سازی" } },
];
