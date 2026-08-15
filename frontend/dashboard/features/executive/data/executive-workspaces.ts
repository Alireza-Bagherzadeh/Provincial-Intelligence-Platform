import type { CommandSectionId } from "../../../components/sidebar";

export type ExecutiveWorkspaceId =
  | "executive-governor"
  | "executive-civil"
  | "executive-economic"
  | "executive-political"
  | "executive-resources";

export type ExecutiveStatus = "healthy" | "attention" | "critical";

type Metric = { label: string; value: string; change: string; status: ExecutiveStatus };
type Horizon = { label: string; headline: string; value: string; status: ExecutiveStatus };
type Trend = { label: string; values: number[]; status: ExecutiveStatus };
type Domain = { title: string; description: string; score: number; status: ExecutiveStatus; signal: string; relatedSection: CommandSectionId };
type Risk = { title: string; area: string; owner: string; deadline: string; status: ExecutiveStatus };
type Action = { title: string; owner: string; due: string; progress: number; status: ExecutiveStatus };

export type ExecutiveWorkspace = {
  id: ExecutiveWorkspaceId;
  person: { name: string; honorific: string; role: string; initials: string };
  eyebrow: string;
  title: string;
  subtitle: string;
  brief: string;
  confidentialityNote?: string;
  metrics: Metric[];
  horizons: Horizon[];
  periods: string[];
  trends: Trend[];
  domains: Domain[];
  risks: Risk[];
  actions: Action[];
};

const periods = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];

export const executiveWorkspaces: Record<ExecutiveWorkspaceId, ExecutiveWorkspace> = {
  "executive-governor": {
    id: "executive-governor",
    person: { name: "محمدجواد کولیوند", honorific: "دکتر", role: "استاندار سمنان", initials: "م‌ک" },
    eyebrow: "میز فرماندهی استاندار",
    title: "تصویر ۳۶۰ درجه مدیریت استان",
    subtitle: "تجمیع وضعیت معاونت‌ها، ریسک‌های اولویت‌دار و تصمیم‌های موردنیاز در یک نمای مدیریتی",
    brief: "در ۴۸ ساعت آینده، پایداری آب شاهرود، تأمین برق شهرک صنعتی گرمسار و تعیین تکلیف دو پروژه عمرانی بیشترین نیاز به مداخله مدیریتی را دارند. روند سرمایه‌گذاری خورشیدی و احیای واحدهای تولیدی مثبت ارزیابی می‌شود.",
    metrics: [
      { label: "شاخص کل عملکرد استان", value: "۷۸ از ۱۰۰", change: "۴ واحد بهبود", status: "healthy" },
      { label: "موضوعات نیازمند تصمیم", value: "۱۴", change: "۳ مورد فوری", status: "critical" },
      { label: "پیشرفت مصوبات", value: "۸۴٪", change: "۶٪ بهتر از ماه قبل", status: "healthy" },
      { label: "پروژه‌های پرریسک", value: "۶", change: "۲ پروژه با تأخیر", status: "attention" },
      { label: "پوشش گزارش معاونت‌ها", value: "۱۰۰٪", change: "۴ گزارش دریافت‌شده", status: "healthy" },
    ],
    horizons: [
      { label: "۱ ماه", headline: "ریسک اوج مصرف برق", value: "زیاد", status: "critical" },
      { label: "۳ ماه", headline: "تنش آبی شرق استان", value: "متوسط رو به زیاد", status: "attention" },
      { label: "۶ ماه", headline: "بهبود ظرفیت تولید", value: "+۹٪", status: "healthy" },
    ],
    periods,
    trends: [
      { label: "عملکرد کل استان", values: [66, 69, 71, 70, 75, 78], status: "healthy" },
      { label: "پیشرفت مصوبات", values: [59, 64, 68, 74, 79, 84], status: "attention" },
    ],
    domains: [
      { title: "آب و محیط‌زیست", description: "ذخایر، مصرف، کسری و نقاط دارای تنش", score: 58, status: "critical", signal: "۴ شهرستان نیازمند پایش", relatedSection: "forecast" },
      { title: "انرژی", description: "مصرف برق، اوج بار، محدودیت صنایع و خورشیدی", score: 64, status: "attention", signal: "اوج بار در گرمسار", relatedSection: "sectors" },
      { title: "اقتصاد و سرمایه‌گذاری", description: "سرمایه‌گذاری، تولید، اشتغال و واحدهای راکد", score: 77, status: "healthy", signal: "۲۳ واحد در مسیر احیا", relatedSection: "finance" },
      { title: "عمران و زیرساخت", description: "پروژه‌ها، مسکن، راه و خدمات زیربنایی", score: 69, status: "attention", signal: "۶ پروژه دارای انحراف", relatedSection: "projects" },
      { title: "اجتماعی و امنیتی", description: "نمای تجمیعی جمعیت، مهاجرت و ریسک منطقه‌ای", score: 73, status: "healthy", signal: "پایش مستمر ۸ شهرستان", relatedSection: "crisis" },
      { title: "عملکرد دستگاه‌ها", description: "پاسخ‌گویی، مصوبات و بهره‌وری دستگاه‌های اجرایی", score: 82, status: "healthy", signal: "۳ دستگاه نیازمند پیگیری", relatedSection: "performance" },
    ],
    risks: [
      { title: "افزایش تنش آب شرب در شرق استان", area: "آب", owner: "معاونت عمرانی", deadline: "امروز", status: "critical" },
      { title: "اوج مصرف برق شهرک صنعتی گرمسار", area: "انرژی", owner: "معاونت اقتصادی", deadline: "امروز", status: "critical" },
      { title: "عقب‌ماندگی پروژه آبرسانی شاهرود", area: "عمران", owner: "معاونت عمرانی", deadline: "فردا", status: "critical" },
      { title: "نقدینگی واحدهای تولیدی نیمه‌فعال", area: "صنعت", owner: "معاونت اقتصادی", deadline: "۲ روز", status: "attention" },
      { title: "افزایش تصادفات محور تهران–مشهد", area: "راه", owner: "معاونت عمرانی", deadline: "۳ روز", status: "attention" },
      { title: "تأخیر در تکمیل زیرساخت مسکن ملی", area: "مسکن", owner: "معاونت عمرانی", deadline: "این هفته", status: "attention" },
      { title: "کاهش نرخ پاسخ‌گویی دو دستگاه", area: "عملکرد", owner: "معاونت منابع", deadline: "این هفته", status: "attention" },
      { title: "روند مهاجرت جوانان از شرق استان", area: "اجتماعی", owner: "معاونت سیاسی", deadline: "۱۰ روز", status: "attention" },
      { title: "آمادگی مقابله با حریق مراتع", area: "بحران", owner: "مدیریت بحران", deadline: "مستمر", status: "attention" },
      { title: "کندی صدور مجوز دو طرح سرمایه‌گذاری", area: "سرمایه‌گذاری", owner: "معاونت اقتصادی", deadline: "۷ روز", status: "healthy" },
    ],
    actions: [
      { title: "تصمیم درباره تأمین برق شهرک صنعتی گرمسار", owner: "معاون اقتصادی", due: "امروز، ۱۰:۰۰", progress: 72, status: "critical" },
      { title: "ابلاغ برنامه تسریع آبرسانی شاهرود", owner: "معاون عمرانی", due: "امروز، ۱۴:۰۰", progress: 58, status: "critical" },
      { title: "تأیید بسته مشوق اطلس سرمایه‌گذاری", owner: "معاون اقتصادی", due: "فردا", progress: 81, status: "attention" },
      { title: "جمع‌بندی ارزیابی عملکرد دستگاه‌ها", owner: "معاون توسعه مدیریت", due: "۳ روز دیگر", progress: 88, status: "healthy" },
    ],
  },
  "executive-civil": {
    id: "executive-civil",
    person: { name: "فرج‌الله ایلیات", honorific: "مهندس", role: "معاون هماهنگی امور عمرانی", initials: "ف‌ا" },
    eyebrow: "پنل اختصاصی معاونت عمرانی",
    title: "پایش هوشمند زیرساخت و تاب‌آوری استان",
    subtitle: "آب، انرژی، مسکن، راه و مدیریت بحران با تمرکز بر پیش‌بینی مکانی و زمانی",
    brief: "تنش آب شرب شاهرود و میامی و همچنین ریسک اوج بار برق در گرمسار در اولویت امروز قرار دارند. دو پروژه مسکن ملی از برنامه عقب هستند و سه نقطه حادثه‌خیز محور تهران–مشهد نیازمند اقدام مشترک است.",
    metrics: [
      { label: "جمعیت در معرض تنش آبی", value: "۹۶ هزار", change: "افزایش ۷٪", status: "critical" },
      { label: "پایداری شبکه برق", value: "۹۲٫۴٪", change: "ریسک اوج بار", status: "attention" },
      { label: "پیشرفت مسکن حمایتی", value: "۶۸٪", change: "۵٪ انحراف برنامه", status: "attention" },
      { label: "نقاط حادثه‌خیز فعال", value: "۱۱", change: "۳ نقطه فوری", status: "critical" },
      { label: "آمادگی مدیریت بحران", value: "۸۱٪", change: "۴٪ بهبود", status: "healthy" },
    ],
    horizons: [
      { label: "۱ ماه", headline: "تنش آب شرب شاهرود", value: "زیاد", status: "critical" },
      { label: "۳ ماه", headline: "پایداری برق صنایع", value: "متوسط", status: "attention" },
      { label: "۶ ماه", headline: "تکمیل واحدهای مسکن", value: "۷۶٪", status: "healthy" },
    ],
    periods,
    trends: [
      { label: "آمادگی زیرساخت", values: [69, 72, 76, 74, 78, 81], status: "healthy" },
      { label: "فشار منابع آب", values: [52, 57, 61, 68, 74, 79], status: "critical" },
    ],
    domains: [
      { title: "آب و فاضلاب", description: "منابع و مصارف، روستاهای دارای تنش، افت آب زیرزمینی و کیفیت", score: 58, status: "critical", signal: "پیش‌بینی تنش ۱، ۳ و ۶ ماهه", relatedSection: "forecast" },
      { title: "برق و انرژی", description: "اوج بار، خاموشی، مصرف صنایع و ظرفیت خورشیدی", score: 72, status: "attention", signal: "ریسک محدودیت صنایع", relatedSection: "sectors" },
      { title: "مسکن و شهرسازی", description: "پیشرفت، انحراف زمان، تسهیلات و آماده‌سازی زیرساخت", score: 68, status: "attention", signal: "۲ پیمانکار پرریسک", relatedSection: "projects" },
      { title: "راه و ایمنی", description: "ترافیک، تصادف، نقاط پرخطر و زمان پاسخ امدادی", score: 63, status: "critical", signal: "۱۱ نقطه حادثه‌خیز", relatedSection: "map" },
      { title: "بحران و تاب‌آوری", description: "سیل، زلزله، حریق، خشکسالی و گردوغبار", score: 81, status: "healthy", signal: "آمادگی عملیاتی مطلوب", relatedSection: "crisis" },
    ],
    risks: [
      { title: "افت ذخیره آب شرب شاهرود", area: "آب", owner: "آبفا", deadline: "امروز", status: "critical" },
      { title: "پیش‌بینی اوج بار در گرمسار", area: "برق", owner: "توزیع برق", deadline: "فردا", status: "critical" },
      { title: "انحراف برنامه مسکن ملی دامغان", area: "مسکن", owner: "راه و شهرسازی", deadline: "۳ روز", status: "attention" },
      { title: "نقطه حادثه‌خیز محور میامی", area: "راه", owner: "راهداری", deadline: "این هفته", status: "attention" },
      { title: "ریسک حریق مراتع جنوبی", area: "بحران", owner: "مدیریت بحران", deadline: "مستمر", status: "attention" },
    ],
    actions: [
      { title: "تصویب برنامه کاهش هدررفت شبکه آب", owner: "آبفا استان", due: "امروز", progress: 61, status: "critical" },
      { title: "رفع سه نقطه حادثه‌خیز اولویت‌دار", owner: "راهداری", due: "۷ روز", progress: 47, status: "attention" },
      { title: "جلسه تعیین تکلیف پیمانکار مسکن دامغان", owner: "راه و شهرسازی", due: "فردا", progress: 70, status: "attention" },
      { title: "به‌روزرسانی سناریوی حریق مراتع", owner: "مدیریت بحران", due: "۵ روز", progress: 86, status: "healthy" },
    ],
  },
  "executive-economic": {
    id: "executive-economic",
    person: { name: "حمید دهرویه", honorific: "دکتر", role: "معاون هماهنگی امور اقتصادی", initials: "ح‌د" },
    eyebrow: "پنل اختصاصی معاونت اقتصادی",
    title: "فرماندهی تولید، سرمایه‌گذاری و اشتغال",
    subtitle: "سلامت بنگاه‌ها، مسیر سرمایه‌گذاری، تأمین مالی و زنجیره ارزش معدن",
    brief: "هفت واحد صنعتی به دلیل کمبود سرمایه در گردش در محدوده هشدار قرار دارند. پرونده دو سرمایه‌گذار به علت تأخیر مجوز متوقف شده، در مقابل ظرفیت توسعه خورشیدی در گرمسار و آرادان فرصت فوری این هفته است.",
    metrics: [
      { label: "امتیاز سلامت صنایع", value: "۷۴ از ۱۰۰", change: "۲ واحد بهبود", status: "healthy" },
      { label: "واحدهای در معرض توقف", value: "۷", change: "۳ مورد بحرانی", status: "critical" },
      { label: "سرمایه‌گذاری در جریان", value: "۱۸٫۶ همت", change: "۱۲٪ رشد", status: "healthy" },
      { label: "اشتغال پیش‌بینی‌شده", value: "۴٬۸۵۰", change: "۸۶٪ تعهد سال", status: "attention" },
      { label: "زمان متوسط مجوز", value: "۲۱ روز", change: "۴ روز کاهش", status: "healthy" },
      { label: "شاخص معدن و صنایع معدنی", value: "۶۷ از ۱۰۰", change: "۵ فرصت زنجیره ارزش", status: "attention" },
    ],
    horizons: [
      { label: "۱ ماه", headline: "ریسک نقدینگی صنایع", value: "زیاد", status: "critical" },
      { label: "۳ ماه", headline: "ورود سرمایه جدید", value: "+۱٫۸ همت", status: "healthy" },
      { label: "۶ ماه", headline: "احیای واحدهای راکد", value: "۲۳ واحد", status: "healthy" },
    ],
    periods,
    trends: [
      { label: "سلامت بنگاه‌ها", values: [65, 67, 66, 70, 72, 74], status: "healthy" },
      { label: "تحقق سرمایه‌گذاری", values: [44, 51, 56, 62, 69, 76], status: "attention" },
    ],
    domains: [
      { title: "سلامت بنگاه‌ها", description: "ظرفیت واقعی، نقدینگی، بدهی بانکی، مالیات و انرژی", score: 74, status: "attention", signal: "۷ واحد در معرض توقف", relatedSection: "organizations" },
      { title: "سرمایه‌گذاری", description: "درخواست‌ها، زمان مجوز، ارزش طرح، اشتغال و دستگاه مانع", score: 79, status: "healthy", signal: "۱۶ طرح آماده تصمیم", relatedSection: "finance" },
      { title: "اشتغال", description: "تعهد و تحقق اشتغال، نرخ بیکاری و توزیع شهرستانی", score: 71, status: "attention", signal: "تحقق ۸۶٪ برنامه", relatedSection: "benchmark" },
      { title: "شاخص معدن و زنجیره ارزش", description: "استخراج، ذخایر فعال، ارزش افزوده، زیرساخت و صنایع پایین‌دستی", score: 67, status: "attention", signal: "۵ فرصت پایین‌دستی", relatedSection: "sectors" },
      { title: "تسهیلات و موانع", description: "تسهیلات درخواستی و پرداختی و زمان رسیدگی پرونده‌ها", score: 62, status: "critical", signal: "۹ پرونده معطل بانک", relatedSection: "decisions" },
    ],
    risks: [
      { title: "کمبود سرمایه در گردش سه واحد قطعه‌سازی", area: "صنعت", owner: "صمت", deadline: "امروز", status: "critical" },
      { title: "توقف پرونده نیروگاه خورشیدی", area: "سرمایه‌گذاری", owner: "اقتصادی", deadline: "فردا", status: "critical" },
      { title: "تأخیر پرداخت تسهیلات تبصره ۱۸", area: "بانکی", owner: "شبکه بانکی", deadline: "۳ روز", status: "attention" },
      { title: "کاهش ظرفیت واقعی واحد نساجی", area: "تولید", owner: "صمت", deadline: "این هفته", status: "attention" },
      { title: "خام‌فروشی در زنجیره معدنی", area: "معدن", owner: "صمت", deadline: "۱۵ روز", status: "attention" },
    ],
    actions: [
      { title: "تعیین تکلیف تسهیلات هفت واحد صنعتی", owner: "کارگروه تسهیل", due: "امروز", progress: 54, status: "critical" },
      { title: "صدور مجوز دو نیروگاه خورشیدی", owner: "پنجره سرمایه‌گذاری", due: "۳ روز", progress: 76, status: "attention" },
      { title: "نهایی‌سازی بسته احیای واحدهای راکد", owner: "صمت", due: "این هفته", progress: 82, status: "healthy" },
      { title: "ارائه نقشه فرصت زنجیره معدن", owner: "صمت", due: "۱۰ روز", progress: 63, status: "attention" },
    ],
  },
  "executive-political": {
    id: "executive-political",
    person: { name: "مهدی آقابراری", honorific: "", role: "معاون سیاسی، امنیتی و اجتماعی", initials: "م‌آ" },
    eyebrow: "پنل اختصاصی معاونت سیاسی، امنیتی و اجتماعی",
    title: "فرماندهی امنیت، مدیریت بحران و تاب‌آوری اجتماعی",
    subtitle: "آمادگی بحران و جنگ، زیرساخت‌های حیاتی، پناهگاه‌ها و امنیت سایبری در کنار شاخص‌های اجتماعی",
    brief: "آزمون برق اضطراری مراکز حیاتی، تکمیل اطلس خطوط نفت، گاز، مخابرات و برق و ارزیابی پناهگاه‌های شهری سه اولویت فوری حوزه است. برنامه آموزش دستگاه‌های اجرایی و پایش امنیت سایبری شبکه دولت نیز در چرخه اقدام این هفته قرار دارد.",
    confidentialityNote: "این پنل فقط داده‌های تجمیعی و شهرستانی را نمایش می‌دهد؛ هیچ فردی امتیازدهی، طبقه‌بندی یا تحلیل نمی‌شود.",
    metrics: [
      { label: "آمادگی مدیریت بحران", value: "۸۲ از ۱۰۰", change: "۴ واحد بهبود", status: "healthy" },
      { label: "پوشش برق اضطراری", value: "۷۱٪", change: "۶ مرکز نیازمند اقدام", status: "attention" },
      { label: "تاب‌آوری زیرساخت‌های حیاتی", value: "۶۸ از ۱۰۰", change: "۳ گلوگاه پرریسک", status: "attention" },
      { label: "پناهگاه‌های ارزیابی‌شده", value: "۳۴", change: "۱۲ مورد نیازمند تجهیز", status: "critical" },
      { label: "آمادگی سایبری شبکه دولت", value: "۸۷٪", change: "۲ رخداد مهارشده", status: "healthy" },
    ],
    horizons: [
      { label: "۱ ماه", headline: "آمادگی مدیریت بحران", value: "۸۶٪", status: "healthy" },
      { label: "۳ ماه", headline: "کاهش آسیب‌پذیری دوران جنگ", value: "۱۲٪", status: "attention" },
      { label: "۶ ماه", headline: "پوشش امنیت سایبری", value: "۹۴٪", status: "healthy" },
    ],
    periods,
    trends: [
      { label: "آمادگی بحران و زیرساخت", values: [65, 69, 72, 74, 78, 82], status: "healthy" },
      { label: "پوشش اقدامات پدافندی", values: [42, 49, 53, 58, 63, 68], status: "attention" },
      { label: "امنیت سایبری شبکه دولت", values: [71, 74, 78, 81, 84, 87], status: "healthy" },
    ],
    domains: [
      { title: "مدیریت بحران", description: "آمادگی فرماندهی، سناریوهای واکنش، لجستیک و زمان پاسخ دستگاه‌ها", score: 82, status: "healthy", signal: "رزمایش هماهنگی در این ماه", relatedSection: "crisis" },
      { title: "آسیب‌پذیری دوران جنگ", description: "ارزیابی مراکز حساس، تداوم خدمت و اولویت‌های کاهش آسیب‌پذیری", score: 64, status: "attention", signal: "۴ مرکز نیازمند اصلاح", relatedSection: "alerts" },
      { title: "کنترل برق اضطراری", description: "مولدهای پشتیبان، ذخیره سوخت، زمان راه‌اندازی و آزمون دوره‌ای مراکز حیاتی", score: 71, status: "attention", signal: "۶ مرکز فاقد پوشش کامل", relatedSection: "crisis" },
      { title: "تاب‌آوری زیرساخت‌ها", description: "تداوم آب، انرژی، ارتباطات، حمل‌ونقل و خدمات حیاتی در سناریوهای بحران", score: 68, status: "attention", signal: "۳ گلوگاه زیرساختی", relatedSection: "forecast" },
      { title: "آموزش دستگاه‌های اجرایی", description: "برنامه آموزشی مدیریت شرایط اضطراری، مانور و ارزیابی آمادگی کارکنان", score: 76, status: "healthy", signal: "۱۸ دستگاه آموزش‌دیده", relatedSection: "organizations" },
      { title: "پناهگاه‌های شهری", description: "مکان‌یابی، ظرفیت، دسترسی، تجهیزات و آمادگی بهره‌برداری پناهگاه‌ها", score: 59, status: "critical", signal: "۱۲ پناهگاه نیازمند تجهیز", relatedSection: "map" },
      { title: "خطوط حیاتی نفت، گاز، مخابرات و برق", description: "نقشه یکپارچه مسیر خطوط، نقاط تقاطع حساس و تیم‌های واکنش سریع", score: 73, status: "attention", signal: "اطلس ۸۷٪ تکمیل شده", relatedSection: "map" },
      { title: "امنیت سایبری شبکه دولت", description: "پایش شبکه دولت، زیرساخت‌های نفت و انرژی، رخدادها و برنامه بازیابی خدمت", score: 87, status: "healthy", signal: "۲ رخداد مهارشده", relatedSection: "alerts" },
      { title: "پایداری اجتماعی و افکار عمومی", description: "آسیب‌های اجتماعی، جمعیت، مهاجرت و مدیریت روایت در سطح تجمیعی", score: 76, status: "healthy", signal: "وضعیت عمومی پایدار", relatedSection: "news" },
    ],
    risks: [
      { title: "آماده‌به‌کاری ناقص برق اضطراری شش مرکز حیاتی", area: "برق اضطراری", owner: "کارگروه زیرساخت", deadline: "امروز", status: "critical" },
      { title: "تجهیز ناکافی دوازده پناهگاه شهری", area: "پدافند شهری", owner: "شهرداری‌ها", deadline: "۳ روز", status: "critical" },
      { title: "ناهماهنگی بخشی از نقشه خطوط نفت و گاز با مخابرات", area: "خطوط حیاتی", owner: "دفتر فنی امنیتی", deadline: "۷ روز", status: "attention" },
      { title: "نیاز به آزمون بازیابی شبکه دولت", area: "امنیت سایبری", owner: "فناوری اطلاعات", deadline: "این هفته", status: "attention" },
      { title: "تکمیل‌نشدن آموزش مدیریت بحران شش دستگاه", area: "آموزش", owner: "مدیریت بحران", deadline: "۱۰ روز", status: "attention" },
      { title: "افزایش مهاجرت جوانان از شرق استان", area: "اجتماعی", owner: "دفتر اجتماعی", deadline: "این ماه", status: "attention" },
    ],
    actions: [
      { title: "ابلاغ برنامه آزمون برق اضطراری مراکز حیاتی", owner: "کارگروه زیرساخت", due: "امروز", progress: 61, status: "critical" },
      { title: "تصویب برنامه تجهیز پناهگاه‌های اولویت‌دار", owner: "شهرداری‌ها", due: "۳ روز", progress: 48, status: "critical" },
      { title: "تکمیل اطلس خطوط نفت، گاز، مخابرات و برق", owner: "دفتر فنی امنیتی", due: "۷ روز", progress: 87, status: "attention" },
      { title: "اجرای مانور امنیت سایبری شبکه دولت و نفت", owner: "فناوری اطلاعات", due: "این هفته", progress: 74, status: "attention" },
      { title: "برگزاری دوره بحران برای دستگاه‌های اجرایی", owner: "مدیریت بحران", due: "۱۰ روز", progress: 69, status: "attention" },
    ],
  },
  "executive-resources": {
    id: "executive-resources",
    person: { name: "رضا عبدالله‌زاده", honorific: "دکتر", role: "معاون توسعه مدیریت و منابع", initials: "ر‌ع" },
    eyebrow: "پنل اختصاصی معاونت توسعه مدیریت و منابع",
    title: "فرماندهی سرمایه انسانی و بهره‌وری دستگاه‌ها",
    subtitle: "نیروی انسانی، ساختار سازمانی، بهره‌وری، دولت هوشمند و کیفیت تبادل داده",
    brief: "در سه سال آینده کمبود نیروی تخصصی فناوری اطلاعات و مالی در چند دستگاه محتمل است. نرخ تکمیل داده‌های ماهانه به ۹۱ درصد رسیده، اما دو دستگاه در پاسخ‌گویی و اجرای مصوبات پایین‌تر از حد انتظار هستند.",
    metrics: [
      { label: "بهره‌وری دستگاه‌ها", value: "۸۰ از ۱۰۰", change: "۳ واحد بهبود", status: "healthy" },
      { label: "پست‌های کلیدی خالی", value: "۲۸", change: "۸ مورد فوری", status: "critical" },
      { label: "بازنشستگی سه‌ساله", value: "۴۱۲ نفر", change: "۱۲٪ نیروی فعلی", status: "attention" },
      { label: "تکمیل داده ماهانه", value: "۹۱٪", change: "۶٪ رشد", status: "healthy" },
      { label: "خدمات هوشمند", value: "۷۴٪", change: "۹ خدمت در حال تکمیل", status: "attention" },
    ],
    horizons: [
      { label: "۱ سال", headline: "کمبود تخصص فناوری", value: "۱۲ پست", status: "attention" },
      { label: "۳ سال", headline: "خروج ناشی از بازنشستگی", value: "۴۱۲ نفر", status: "critical" },
      { label: "هدف سال", headline: "بلوغ دولت هوشمند", value: "۸۵٪", status: "healthy" },
    ],
    periods,
    trends: [
      { label: "بهره‌وری دستگاه‌ها", values: [69, 71, 73, 76, 78, 80], status: "healthy" },
      { label: "بلوغ داده", values: [62, 68, 72, 79, 86, 91], status: "attention" },
    ],
    domains: [
      { title: "سرمایه انسانی", description: "تعداد، سن، سابقه، تخصص، آموزش، اضافه‌کار و رضایت", score: 76, status: "healthy", signal: "برنامه‌ریزی نیروی سه‌ساله", relatedSection: "performance" },
      { title: "ساختار و جانشین‌پروری", description: "پست‌های سازمانی، پست خالی، بازنشستگی و کمبود تخصص", score: 64, status: "critical", signal: "۲۸ پست کلیدی خالی", relatedSection: "organizations" },
      { title: "بهره‌وری دستگاه‌ها", description: "عملکرد، بودجه، پاسخ‌گویی و پیشرفت پروژه‌های دستگاه", score: 80, status: "healthy", signal: "رتبه‌بندی ۲۴ دستگاه", relatedSection: "performance" },
      { title: "دولت هوشمند", description: "خدمات الکترونیک، تبادل داده و حذف فرآیندهای زائد", score: 74, status: "attention", signal: "۹ خدمت در حال تکمیل", relatedSection: "manage" },
      { title: "کیفیت و یکپارچگی داده", description: "کامل‌بودن، تازگی و هماهنگی داده دستگاه‌ها و شهرستان‌ها", score: 91, status: "healthy", signal: "پوشش ماهانه مطلوب", relatedSection: "reports" },
    ],
    risks: [
      { title: "کمبود نیروی متخصص فناوری اطلاعات", area: "منابع انسانی", owner: "دفتر منابع انسانی", deadline: "۱۵ روز", status: "critical" },
      { title: "موج بازنشستگی در حوزه مالی", area: "جانشین‌پروری", owner: "دستگاه‌ها", deadline: "این ماه", status: "attention" },
      { title: "کاهش پاسخ‌گویی دو دستگاه اجرایی", area: "بهره‌وری", owner: "دفتر ارزیابی", deadline: "۷ روز", status: "attention" },
      { title: "ناقص بودن داده یک دستگاه خدماتی", area: "داده", owner: "فناوری اطلاعات", deadline: "۳ روز", status: "attention" },
      { title: "تأخیر هوشمندسازی سه خدمت پرتکرار", area: "دولت هوشمند", owner: "تحول اداری", deadline: "۱۰ روز", status: "attention" },
    ],
    actions: [
      { title: "تصویب برنامه جانشین‌پروری مشاغل کلیدی", owner: "منابع انسانی", due: "این هفته", progress: 58, status: "critical" },
      { title: "ابلاغ برنامه بهبود دو دستگاه کم‌امتیاز", owner: "دفتر ارزیابی", due: "۳ روز", progress: 72, status: "attention" },
      { title: "تکمیل تبادل داده دستگاه خدماتی", owner: "فناوری اطلاعات", due: "۷ روز", progress: 83, status: "healthy" },
      { title: "نهایی‌سازی رتبه‌بندی بهره‌وری", owner: "تحول اداری", due: "۱۰ روز", progress: 89, status: "healthy" },
    ],
  },
};

export function isExecutiveWorkspaceId(value: string): value is ExecutiveWorkspaceId {
  return value in executiveWorkspaces;
}
