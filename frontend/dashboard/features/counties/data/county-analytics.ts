export const dashboardMonths = ["مرداد ۱۴۰۵", "تیر ۱۴۰۵", "خرداد ۱۴۰۵", "اردیبهشت ۱۴۰۵", "فروردین ۱۴۰۵", "اسفند ۱۴۰۴", "بهمن ۱۴۰۴", "دی ۱۴۰۴"];

export type CountyAnalytics = {
  code: string;
  name: string;
  population: number;
  rank: number;
  overall: number;
  change: number;
  projects: number;
  urgent: number;
  domains: Array<{ label: string; value: number; province: number }>;
  trend: number[];
  highlights: string[];
};

export const countyAnalytics: CountyAnalytics[] = [
  { code: "semnan", name: "سمنان", population: 196521, rank: 1, overall: 82, change: 7, projects: 24, urgent: 2, domains: [{ label: "آب", value: 76, province: 68 }, { label: "انرژی", value: 84, province: 72 }, { label: "اقتصاد", value: 86, province: 70 }, { label: "اشتغال", value: 79, province: 67 }, { label: "عمران", value: 83, province: 69 }, { label: "اجتماعی", value: 81, province: 73 }], trend: [70, 72, 75, 74, 78, 82], highlights: ["پیشرفت مناسب پروژه‌های شهری", "رشد ظرفیت انرژی خورشیدی", "نیاز به کاهش مصرف اوج آب"] },
  { code: "shahroud", name: "شاهرود", population: 218628, rank: 2, overall: 77, change: 4, projects: 21, urgent: 4, domains: [{ label: "آب", value: 54, province: 68 }, { label: "انرژی", value: 75, province: 72 }, { label: "اقتصاد", value: 82, province: 70 }, { label: "اشتغال", value: 74, province: 67 }, { label: "عمران", value: 78, province: 69 }, { label: "اجتماعی", value: 76, province: 73 }], trend: [69, 71, 73, 72, 75, 77], highlights: ["تنش آب شرب نیازمند اقدام فوری", "ظرفیت گردشگری و معدن رو به رشد", "بهبود ایمنی محورهای برون‌شهری"] },
  { code: "damghan", name: "دامغان", population: 94531, rank: 3, overall: 73, change: 3, projects: 16, urgent: 2, domains: [{ label: "آب", value: 62, province: 68 }, { label: "انرژی", value: 72, province: 72 }, { label: "اقتصاد", value: 77, province: 70 }, { label: "اشتغال", value: 68, province: 67 }, { label: "عمران", value: 71, province: 69 }, { label: "اجتماعی", value: 74, province: 73 }], trend: [65, 68, 67, 70, 71, 73], highlights: ["رشد زنجیره ارزش پسته", "تأخیر محدود در مسکن حمایتی", "پایداری نسبی شاخص‌های اجتماعی"] },
  { code: "garmsar", name: "گرمسار", population: 77617, rank: 4, overall: 71, change: 5, projects: 18, urgent: 3, domains: [{ label: "آب", value: 65, province: 68 }, { label: "انرژی", value: 58, province: 72 }, { label: "اقتصاد", value: 84, province: 70 }, { label: "اشتغال", value: 77, province: 67 }, { label: "عمران", value: 69, province: 69 }, { label: "اجتماعی", value: 70, province: 73 }], trend: [61, 64, 66, 68, 70, 71], highlights: ["ریسک اوج مصرف برق صنایع", "جذب سرمایه صنعتی مطلوب", "فرصت توسعه نیروگاه خورشیدی"] },
  { code: "mahdishahr", name: "مهدی‌شهر", population: 54865, rank: 5, overall: 69, change: 2, projects: 12, urgent: 1, domains: [{ label: "آب", value: 72, province: 68 }, { label: "انرژی", value: 70, province: 72 }, { label: "اقتصاد", value: 66, province: 70 }, { label: "اشتغال", value: 64, province: 67 }, { label: "عمران", value: 68, province: 69 }, { label: "اجتماعی", value: 75, province: 73 }], trend: [64, 65, 66, 67, 68, 69], highlights: ["وضعیت منابع آب نسبتاً پایدار", "فرصت توسعه گردشگری طبیعی", "لزوم تقویت اشتغال جوانان"] },
  { code: "aradan", name: "آرادان", population: 15103, rank: 6, overall: 66, change: 4, projects: 9, urgent: 1, domains: [{ label: "آب", value: 61, province: 68 }, { label: "انرژی", value: 74, province: 72 }, { label: "اقتصاد", value: 70, province: 70 }, { label: "اشتغال", value: 65, province: 67 }, { label: "عمران", value: 62, province: 69 }, { label: "اجتماعی", value: 67, province: 73 }], trend: [57, 60, 62, 63, 65, 66], highlights: ["ظرفیت مناسب انرژی خورشیدی", "نیاز به تکمیل زیرساخت سرمایه‌گذاری", "پیشرفت پروژه‌های روستایی"] },
  { code: "sorkheh", name: "سرخه", population: 15746, rank: 7, overall: 64, change: 1, projects: 8, urgent: 2, domains: [{ label: "آب", value: 59, province: 68 }, { label: "انرژی", value: 68, province: 72 }, { label: "اقتصاد", value: 62, province: 70 }, { label: "اشتغال", value: 60, province: 67 }, { label: "عمران", value: 65, province: 69 }, { label: "اجتماعی", value: 71, province: 73 }], trend: [60, 61, 62, 63, 63, 64], highlights: ["لزوم تقویت فرصت‌های اشتغال", "پیشرفت پایدار پروژه‌های محلی", "پایش مستمر منابع آب"] },
  { code: "meyami", name: "میامی", population: 36094, rank: 8, overall: 59, change: -2, projects: 11, urgent: 4, domains: [{ label: "آب", value: 48, province: 68 }, { label: "انرژی", value: 63, province: 72 }, { label: "اقتصاد", value: 55, province: 70 }, { label: "اشتغال", value: 51, province: 67 }, { label: "عمران", value: 60, province: 69 }, { label: "اجتماعی", value: 58, province: 73 }], trend: [62, 61, 61, 60, 60, 59], highlights: ["تنش آب و خشکسالی در اولویت", "مهاجرت جوانان نیازمند مداخله", "فرصت توسعه معدن و صنایع پایین‌دستی"] },
];

export const countyNames = countyAnalytics.map(({ code, name }) => ({ code, name }));

export function getCountyAnalytics(code: string) {
  return countyAnalytics.find((county) => county.code === code) ?? countyAnalytics[0];
}
