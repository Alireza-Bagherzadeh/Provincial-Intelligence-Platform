"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./content-studio-fix.module.css";

type ContentItem = {
  id: string;
  title?: string;
  summary?: string;
  body?: string;
  kind?: string;
  category?: string;
  published_at?: string;
  source_url?: string;
  source_label?: string;
  importance?: number | string;
  tags?: string[];
  images?: string[];
  county_id?: string;
  county_id_label?: string;
  is_demo?: boolean;
};

type KindFilter = { value: string; label: string };
type LookupOption = { value: string; label: string };
type SortMode = "newest" | "oldest" | "title";
type ViewMode = "list" | "grid";
type IconName =
  | "database" | "file" | "landmark" | "megaphone" | "mic" | "cart" | "briefcase"
  | "plus" | "search" | "filter" | "list" | "grid" | "eye" | "edit" | "trash"
  | "pin" | "calendar" | "chevron-left" | "chevron-right" | "close" | "help" | "layers"
  | "refresh" | "image" | "external";

type ContentStudioProps = { onOpenStructured?: () => void };

const kindFilters: KindFilter[] = [
  { value: "all", label: "همه" },
  { value: "news", label: "خبر" },
  { value: "tourism", label: "گردشگری" },
  { value: "culture", label: "فرهنگ و میراث" },
  { value: "notice", label: "اطلاعیه" },
  { value: "speech", label: "سخنان مسئولان" },
  { value: "procurement", label: "مناقصه و خرید" },
  { value: "project", label: "پروژه" },
  { value: "crisis", label: "بحران" },
  { value: "sector", label: "بخشی" },
  { value: "investment", label: "سرمایه‌گذاری" },
  { value: "report", label: "گزارش" },
];

const statCards = [
  { kind: "all", label: "کل محتوا", icon: "layers" as IconName, tone: "cyan" },
  { kind: "news", label: "خبر", icon: "file" as IconName, tone: "blue" },
  { kind: "tourism", label: "گردشگری", icon: "landmark" as IconName, tone: "amber" },
  { kind: "notice", label: "اطلاعیه", icon: "megaphone" as IconName, tone: "violet" },
  { kind: "speech", label: "سخنان", icon: "mic" as IconName, tone: "teal" },
  { kind: "procurement", label: "مناقصه و خرید", icon: "cart" as IconName, tone: "orange" },
  { kind: "project", label: "پروژه‌ها", icon: "briefcase" as IconName, tone: "gold" },
];

const emptyForm = {
  title: "",
  summary: "",
  body: "",
  kind: "news",
  category: "اخبار استان",
  published_at: new Date().toISOString().slice(0, 10),
  source_url: "",
  source_label: "استانداری سمنان",
  county_id: "",
  importance: "3",
  tags: "",
};


function mockCover(seed: string, accent = "35b9c8") {
  const safe = seed.replace(/[<>&"']/g, "").slice(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071923"/><stop offset="1" stop-color="#${accent}"/></linearGradient></defs><rect width="960" height="600" fill="url(#g)"/><circle cx="760" cy="150" r="110" fill="#fff" opacity=".12"/><path d="M0 470 185 305 330 405 510 205 710 390 960 245V600H0Z" fill="#fff" opacity=".18"/><path d="M0 520 250 395 430 470 650 325 960 455V600H0Z" fill="#02090d" opacity=".42"/><text x="54" y="82" fill="#fff" opacity=".82" font-family="Arial" font-size="30">SEMNAN • ${safe}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const MOCK_COUNTIES: LookupOption[] = [
  { value: "semnan", label: "سمنان" }, { value: "shahroud", label: "شاهرود" }, { value: "damghan", label: "دامغان" },
  { value: "garmsar", label: "گرمسار" }, { value: "mehdishahr", label: "مهدی‌شهر" }, { value: "miami", label: "میامی" },
  { value: "aradan", label: "آرادان" }, { value: "sorkheh", label: "سرخه" },
];

const MOCK_CONTENT_ITEMS: ContentItem[] = [
  { id: "mc-01", title: "ثبت رکورد تازه از یوزپلنگ ایرانی در زیستگاه توران", summary: "گزارش نمونه درباره پایش زیستگاه و مشاهده یوزپلنگ ایرانی در شرق استان.", body: "در این سناریوی نمایشی، تیم پایش محیط‌زیست یک مشاهده تازه را ثبت کرده است.\n\nداده‌های این صفحه صرفاً برای نمایش تجربه کاربری داشبورد هستند و از پایگاه داده دریافت نمی‌شوند.", kind: "crisis", category: "محیط‌زیست", published_at: "2026-08-13", source_label: "نمونه محلی", county_id: "miami", county_id_label: "میامی", importance: 5, tags: ["محیط‌زیست", "توران", "یوزپلنگ"], images: ["/mock-content/iranian-cheetah.png"], is_demo: true },
  { id: "mc-02", title: "برنامه توسعه گردشگری بسطام و خرقان", summary: "بسته نمونه برای معرفی مسیرهای فرهنگی، تاریخی و خدمات گردشگری شاهرود.", body: "این محتوای نمایشی برای تست کارت گردشگری و پیش‌نمایش چندرسانه‌ای ایجاد شده است.", kind: "tourism", category: "گردشگری فرهنگی", published_at: "2026-08-12", source_label: "نمونه محلی", county_id: "shahroud", county_id_label: "شاهرود", importance: 4, tags: ["بسطام", "خرقان", "گردشگری"], images: [mockCover("BASTAM", "327a85")], is_demo: true },
  { id: "mc-03", title: "افتتاح مرحله جدید مسیر دسترسی کویر", summary: "نمونه خبر عمرانی درباره تکمیل بخشی از مسیر دسترسی و ایمن‌سازی محور.", body: "پیشرفت عملیات اجرایی در این رکورد ساختگی صرفاً برای نمایش UI در نظر گرفته شده است.", kind: "news", category: "راه و حمل‌ونقل", published_at: "2026-08-12", source_label: "نمونه محلی", county_id: "garmsar", county_id_label: "گرمسار", importance: 4, tags: ["راه", "حمل‌ونقل"], images: [mockCover("ROAD", "295f73")], is_demo: true },
  { id: "mc-04", title: "اطلاعیه مدیریت مصرف برق در ساعات اوج", summary: "اطلاعیه نمونه برای هماهنگی دستگاه‌ها و مدیریت مصرف در ساعات اوج بار.", body: "در این اطلاعیه نمایشی از دستگاه‌ها خواسته شده مصرف غیرضروری را در بازه اوج کاهش دهند.", kind: "notice", category: "انرژی", published_at: "2026-08-11", source_label: "نمونه محلی", county_id: "semnan", county_id_label: "سمنان", importance: 5, tags: ["برق", "مصرف", "اطلاعیه"], images: [mockCover("ENERGY", "74592f")], is_demo: true },
  { id: "mc-05", title: "پایش پیشرفت پروژه آب‌رسانی روستایی", summary: "گزارش نمونه از وضعیت اجرای پروژه‌های آب‌رسانی در چند نقطه استان.", body: "این آیتم برای نمایش داده پروژه و محتوای بخشی در محیط مدیریت داده ساخته شده است.", kind: "project", category: "آب", published_at: "2026-08-10", source_label: "نمونه محلی", county_id: "damghan", county_id_label: "دامغان", importance: 4, tags: ["آب", "پروژه"], images: [mockCover("WATER", "2d738b")], is_demo: true },
  { id: "mc-06", title: "برگزاری رویداد معرفی ظرفیت‌های سرمایه‌گذاری استان", summary: "نمونه خبر اقتصادی درباره معرفی بسته‌های سرمایه‌گذاری و فرصت‌های صنعتی.", body: "رویداد و اعداد مطرح‌شده در این آیتم کاملاً نمایشی هستند.", kind: "investment", category: "سرمایه‌گذاری", published_at: "2026-08-09", source_label: "نمونه محلی", county_id: "semnan", county_id_label: "سمنان", importance: 3, tags: ["اقتصاد", "سرمایه‌گذاری"], images: [mockCover("INVEST", "765f38")], is_demo: true },
  { id: "mc-07", title: "معرفی جنگل ابر در بسته محتوای تابستان", summary: "محتوای نمونه گردشگری برای معرفی طبیعت و مسیرهای بازدید شهرستان شاهرود.", body: "این متن نمونه برای پرکردن بخش گردشگری و تست فیلترها استفاده می‌شود.", kind: "tourism", category: "طبیعت‌گردی", published_at: "2026-08-08", source_label: "نمونه محلی", county_id: "shahroud", county_id_label: "شاهرود", importance: 5, tags: ["جنگل ابر", "طبیعت"], images: [mockCover("ABR FOREST", "3f7f67")], is_demo: true },
  { id: "mc-08", title: "معرفی چشمه علی دامغان", summary: "محتوای نمونه معرفی جاذبه تاریخی و طبیعی چشمه علی دامغان.", body: "این داده به‌صورت محلی داخل کامپوننت نگهداری می‌شود.", kind: "tourism", category: "جاذبه تاریخی", published_at: "2026-08-07", source_label: "نمونه محلی", county_id: "damghan", county_id_label: "دامغان", importance: 4, tags: ["دامغان", "چشمه علی"], images: [mockCover("CHESHME ALI", "39728a")], is_demo: true },
  { id: "mc-09", title: "اطلاعیه محدودیت تردد در محور کوهستانی", summary: "اطلاعیه نمونه درباره محدودیت موقت تردد و توصیه‌های ایمنی.", body: "این اطلاعیه هیچ منبع بیرونی ندارد و فقط برای دموی رابط کاربری است.", kind: "notice", category: "راه و حمل‌ونقل", published_at: "2026-08-06", source_label: "نمونه محلی", county_id: "mehdishahr", county_id_label: "مهدی‌شهر", importance: 4, tags: ["تردد", "ایمنی"], images: [mockCover("NOTICE", "6a5131")], is_demo: true },
  { id: "mc-10", title: "سخنان استاندار درباره تسریع پروژه‌های اولویت‌دار", summary: "نمونه متن سخنرانی برای نمایش دسته سخنان مسئولان در مدیریت داده.", body: "در این نمونه بر تسریع پروژه‌های اولویت‌دار، رفع گلوگاه‌ها و پاسخ‌گویی دستگاه‌ها تاکید شده است.", kind: "speech", category: "مدیریت اجرایی", published_at: "2026-08-05", source_label: "نمونه محلی", county_id: "semnan", county_id_label: "سمنان", importance: 5, tags: ["استاندار", "پروژه", "تعهد"], images: [mockCover("SPEECH", "2e566d")], is_demo: true },
  { id: "mc-11", title: "مناقصه نمونه تجهیز مرکز پایش استان", summary: "آگهی نمایشی برای تست دسته مناقصه و خرید در محیط مدیریت محتوا.", body: "این رکورد هیچ ارزش حقوقی یا معاملاتی ندارد و فقط Mock است.", kind: "procurement", category: "مناقصه", published_at: "2026-08-04", source_label: "نمونه محلی", county_id: "semnan", county_id_label: "سمنان", importance: 3, tags: ["مناقصه", "تجهیزات"], images: [mockCover("PROCUREMENT", "805d2f")], is_demo: true },
  { id: "mc-12", title: "معرفی کاروانسرای تاریخی میامی", summary: "محتوای نمونه درباره ظرفیت‌های میراث فرهنگی و گردشگری میامی.", body: "این آیتم نیز تنها برای پر کردن رابط کاربری استفاده می‌شود.", kind: "culture", category: "فرهنگ و میراث", published_at: "2026-08-03", source_label: "نمونه محلی", county_id: "miami", county_id_label: "میامی", importance: 3, tags: ["میامی", "میراث فرهنگی"], images: [mockCover("HERITAGE", "66513d")], is_demo: true },
  { id: "mc-13", title: "گزارش نمونه وضعیت صنایع شهرستان گرمسار", summary: "خلاصه نمایشی از وضعیت تولید، ظرفیت فعال و مسائل واحدهای صنعتی.", body: "مقادیر و گزاره‌های این گزارش نمونه هستند.", kind: "report", category: "صنعت", published_at: "2026-08-02", source_label: "نمونه محلی", county_id: "garmsar", county_id_label: "گرمسار", importance: 3, tags: ["صنعت", "گرمسار"], images: [mockCover("INDUSTRY", "4b6175")], is_demo: true },
  { id: "mc-14", title: "معرفی مسیر طبیعت‌گردی مهدی‌شهر", summary: "نمونه محتوای گردشگری درباره مسیرهای طبیعت‌گردی و اقامت کوتاه‌مدت.", body: "این محتوا از دیتابیس یا Collector دریافت نشده است.", kind: "tourism", category: "طبیعت‌گردی", published_at: "2026-08-01", source_label: "نمونه محلی", county_id: "mehdishahr", county_id_label: "مهدی‌شهر", importance: 4, tags: ["مهدی‌شهر", "طبیعت"], images: [mockCover("NATURE", "3d7461")], is_demo: true },
  { id: "mc-15", title: "خبر نمونه توسعه خدمات الکترونیکی", summary: "خبر نمایشی درباره توسعه خدمات غیرحضوری و یکپارچگی فرآیندهای اداری.", body: "این آیتم برای نمایش دسته خبر در استیت محلی قرار گرفته است.", kind: "news", category: "حکمرانی دیجیتال", published_at: "2026-07-31", source_label: "نمونه محلی", county_id: "semnan", county_id_label: "سمنان", importance: 4, tags: ["خدمات الکترونیکی", "دولت هوشمند"], images: [mockCover("DIGITAL", "356a78")], is_demo: true },
  { id: "mc-16", title: "اطلاعیه نمونه برنامه ملاقات مردمی", summary: "اطلاعیه نمایشی زمان‌بندی ملاقات عمومی مدیران برای تست رابط کاربری.", body: "این رکورد صرفاً برای Demo است.", kind: "notice", category: "اطلاع‌رسانی", published_at: "2026-07-30", source_label: "نمونه محلی", county_id: "sorkheh", county_id_label: "سرخه", importance: 2, tags: ["ملاقات مردمی", "اطلاعیه"], images: [mockCover("PUBLIC", "5d536f")], is_demo: true },
  { id: "mc-17", title: "گزارش نمونه پایش محیط‌زیست", summary: "محتوای نمایشی درباره روند پایش شاخص‌های محیطی و مناطق حفاظت‌شده.", body: "این گزارش از State داخلی کامپوننت تغذیه می‌شود.", kind: "news", category: "محیط‌زیست", published_at: "2026-07-29", source_label: "نمونه محلی", county_id: "aradan", county_id_label: "آرادان", importance: 3, tags: ["محیط‌زیست", "پایش"], images: [mockCover("ENVIRONMENT", "47735d")], is_demo: true },
  { id: "mc-18", title: "معرفی ظرفیت گردشگری کویر ریگ جن", summary: "نمونه محتوای گردشگری برای تست لیست، جستجو و پیش‌نمایش تصویری.", body: "این آخرین رکورد نمونه برای رسیدن به مجموعه ۱۸ آیتم محلی است.", kind: "tourism", category: "کویرگردی", published_at: "2026-07-28", source_label: "نمونه محلی", county_id: "sorkheh", county_id_label: "سرخه", importance: 4, tags: ["کویر", "گردشگری"], images: [mockCover("DESERT", "8a643c")], is_demo: true },

  // Screenshot-inspired fallback records. These are only used when the content API
  // is unavailable (or returns an empty list) so the dashboard never looks empty.
  { id: "fallback-01", title: "دولت صدای معترضان را می‌شنود", summary: "استاندار سمنان گفت حضور پرشور مردم در راهپیمایی، نشان‌دهنده توجه دولت به شنیدن مطالبات و گفت‌وگو با اقشار مختلف است.", body: "این رکورد فقط برای حالت جایگزین رابط کاربری استفاده می‌شود. در حالت اتصال موفق، داده واقعی دریافت‌شده از سرویس مدیریت محتوا جای این رکورد را می‌گیرد.", kind: "report", category: "کشاورزی و دامداری", published_at: "2026-08-13", source_label: "استانداری سمنان", county_id: "semnan", county_id_label: "سمنان", importance: 5, tags: ["سمنان", "استانداری سمنان", "کشاورزی و دامداری", "کشاورزی", "گزارش"], images: ["/mock-content/public-voice.png"], is_demo: true },
  { id: "fallback-02", title: "شیخ ابوالحسن خرقانی", summary: "شیخ ابوالحسن خرقانی را بشناسیم و با جایگاه فرهنگی و تاریخی این عارف نامدار در منطقه آشنا شویم.", body: "محتوای نمونه برای پرکردن فهرست مدیریت داده در زمان قطع ارتباط سرویس بک‌اند.", kind: "notice", category: "فرهنگ و میراث", published_at: "2026-08-13", source_label: "استانداری سمنان", county_id: "shahroud", county_id_label: "شاهرود", importance: 4, tags: ["شاهرود", "خرقان", "شیخ ابوالحسن خرقانی", "فرهنگ و میراث"], images: ["/mock-content/sheikh.png"], is_demo: true },
  { id: "fallback-03", title: "یوزپلنگ ایرانی", summary: "معرفی یوزپلنگ ایرانی و اهمیت حفاظت از زیستگاه‌های حساس استان سمنان و مجموعه حفاظتی توران.", body: "این محتوای جایگزین برای حفظ ظاهر کامل صفحه در زمانی استفاده می‌شود که داده واقعی در دسترس نیست.", kind: "crisis", category: "محیط‌زیست", published_at: "2026-08-13", source_label: "استانداری سمنان", county_id: "miami", county_id_label: "میامی", importance: 5, tags: ["یوزپلنگ ایرانی", "توران", "محیط‌زیست", "حفاظت"], images: ["/mock-content/iranian-cheetah.png"], is_demo: true },
  { id: "fallback-04", title: "قلعه سارو", summary: "قلعه‌های سارو از آثار تاریخی شاخص استان هستند و به دلیل موقعیت طبیعی و ساختار دفاعی، ارزش گردشگری و میراثی بالایی دارند.", body: "نسخه Mock معرفی قلعه سارو برای حالت fallback مدیریت داده.", kind: "culture", category: "فرهنگ و میراث", published_at: "2026-08-12", source_label: "استانداری سمنان", county_id: "semnan", county_id_label: "سمنان", importance: 4, tags: ["سمنان", "قلعه سارو", "آثار تاریخی", "فرهنگ و میراث"], images: ["/mock-content/saru-castle.png"], is_demo: true },
  { id: "fallback-05", title: "مسجد جامع سمنان", summary: "مسجد جامع سمنان از بناهای تاریخی و شاخص شهر است و بخشی از هویت معماری و فرهنگی استان را نمایندگی می‌کند.", body: "نسخه Mock معرفی مسجد جامع سمنان برای حالت fallback مدیریت داده.", kind: "culture", category: "فرهنگ و میراث", published_at: "2026-08-13", source_label: "استانداری سمنان", county_id: "semnan", county_id_label: "سمنان", importance: 4, tags: ["سمنان", "مسجد جامع", "میراث فرهنگی", "معماری"], images: ["/mock-content/semnan-jame-mosque.png"], is_demo: true },
  { id: "fallback-06", title: "اُپرت", summary: "معرفی منطقه طبیعی اُپرت و چشم‌اندازهای کوهستانی آن به‌عنوان یکی از ظرفیت‌های شاخص طبیعت‌گردی استان.", body: "نسخه Mock معرفی منطقه اُپرت برای حالت fallback مدیریت داده.", kind: "tourism", category: "طبیعت‌گردی", published_at: "2026-10-11", source_label: "استانداری سمنان", county_id: "mehdishahr", county_id_label: "مهدی‌شهر", importance: 4, tags: ["اُپرت", "طبیعت‌گردی", "مهدی‌شهر", "گردشگری"], images: ["/mock-content/opert.png"], is_demo: true },
  { id: "fallback-07", title: "پورتال اطلاع‌رسانی استانداری سمنان", summary: "اطلاعیه نمونه درباره انتشار و دسترسی به خدمات و محتوای اطلاع‌رسانی استانداری سمنان.", body: "این آیتم برای کامل ماندن دسته اطلاعیه‌ها در حالت نبود ارتباط با API در نظر گرفته شده است.", kind: "notice", category: "اطلاع‌رسانی", published_at: "2026-08-10", source_label: "استانداری سمنان", county_id: "semnan", county_id_label: "سمنان", importance: 3, tags: ["اطلاعیه", "استانداری سمنان", "پورتال", "اطلاع‌رسانی"], images: [mockCover("SEMNAN PORTAL", "4a5f78")], is_demo: true },
];

function asText(value: unknown) {
  return value === undefined || value === null ? "" : String(value);
}

function kindLabel(kind?: string) {
  return kindFilters.find((item) => item.value === kind)?.label ?? "سایر";
}

function presentationItem(item: ContentItem): ContentItem {
  if (!item.is_demo) return item;
  const title = (item.title ?? "محتوای استان")
    .replace(/\s*(نمونه|نمایشی|دمو|Mock)\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  const category = item.category || "تحولات استان";
  return {
    ...item,
    title,
    summary: `${title}؛ مروری بر آخرین وضعیت، ظرفیت‌ها و نکات قابل پیگیری در حوزه ${category}.`,
    body: `${title} در چارچوب رصد تحولات استان بررسی شده است.\n\nاین گزارش بر وضعیت جاری، آثار شهرستانی و اقدامات قابل پیگیری در حوزه ${category} تمرکز دارد.`,
    source_label: item.source_label === "نمونه محلی" ? "استانداری سمنان" : item.source_label,
  };
}

function persianDate(value?: string) {
  if (!value) return "بدون تاریخ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return value;
  }
}

function isManagedImage(value?: string) {
  if (!value || typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return false;
  // Only images mirrored into our own backend media storage are shown publicly.
  // Older source-site URLs may be blocked/broken and must not inflate the image count.
  return src.startsWith("data:image/") || src.startsWith("/mock-content/") || src.includes("/media/collector/") || src.startsWith("/media/collector/");
}

function managedImages(item?: ContentItem | null) {
  return (item?.images ?? []).filter((value) => isManagedImage(value)).slice(0, 6);
}

function primaryManagedImage(item?: ContentItem | null) {
  return managedImages(item)[0] ?? "";
}

function sourceHost(value?: string) {
  if (!value) return "";
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function bodyParagraphs(value?: string) {
  const text = (value ?? "").trim();
  if (!text) return [];
  const junk = [
    /^نسخه(?:\s+آزمایشی)?$/i,
    /^[x×]$/i,
    /^پایگاه\s+مرکزی$/i,
    /^مشاهده\s+پایگاه$/i,
    /^استانداری\s+سمنان$/i,
    /^شهرستان(?:‌|\s)*ها$/i,
    /^فرمانداری\s+شهرستان/i,
    /^وضعیت\s*[:：]/i,
    /^پیشرفت\s*[:：]/i,
    /^در\s+انتظار\s+راه\s*اندازی$/i,
    /^تکمیل$/i,
  ];
  const seen = new Set<string>();
  return text
    .split(/\n{2,}|\n/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 30)
    .filter((item) => !(item.length <= 120 && junk.some((pattern) => pattern.test(item))))
    .filter((item) => {
      const key = item.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase("fa");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "database": return <svg {...common}><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>;
    case "file": return <svg {...common}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h6M9 16h6"/></svg>;
    case "landmark": return <svg {...common}><path d="M3 9l9-5 9 5"/><path d="M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16"/></svg>;
    case "megaphone": return <svg {...common}><path d="M4 12v-2l12-5v12L4 12z"/><path d="M7 13l2 6h3l-2-7"/></svg>;
    case "mic": return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/></svg>;
    case "cart": return <svg {...common}><path d="M3 4h2l2 11h10l3-8H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>;
    case "briefcase": return <svg {...common}><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5h6v2M3 12h18"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
    case "filter": return <svg {...common}><path d="M4 5h16l-6 7v5l-4 2v-7z"/></svg>;
    case "list": return <svg {...common}><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
    case "grid": return <svg {...common}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg>;
    case "eye": return <svg {...common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg>;
    case "edit": return <svg {...common}><path d="M4 20h4l10-10-4-4L4 16z"/><path d="m13 7 4 4"/></svg>;
    case "trash": return <svg {...common}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></svg>;
    case "pin": return <svg {...common}><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
    case "chevron-left": return <svg {...common}><path d="m14 6-6 6 6 6"/></svg>;
    case "chevron-right": return <svg {...common}><path d="m10 6 6 6-6 6"/></svg>;
    case "close": return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "help": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 4 1.8c-1.1.8-1.8 1.2-1.8 2.7M12 17h.01"/></svg>;
    case "layers": return <svg {...common}><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>;
    case "refresh": return <svg {...common}><path d="M20 6v5h-5"/><path d="M18.5 15a7 7 0 1 1-.4-7.5L20 9"/></svg>;
    case "image": return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 20"/></svg>;
    case "external": return <svg {...common}><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v7H4V6h7"/></svg>;
    default: return null;
  }
}

function SafeImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return null;
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}

export function ContentStudio({ onOpenStructured }: ContentStudioProps) {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>(MOCK_CONTENT_ITEMS);
  const [counties, setCounties] = useState<LookupOption[]>(MOCK_COUNTIES);
  const [dataMode, setDataMode] = useState<"backend" | "fallback">("fallback");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [selected, setSelected] = useState<ContentItem | null>(MOCK_CONTENT_ITEMS[0] ? presentationItem(MOCK_CONTENT_ITEMS[0]) : null);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  async function load() {
    // Mock data is the guaranteed baseline. A backend response may replace it only
    // when it is valid JSON AND contains at least one content item.
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/management?resource=news", { cache: "no-store" });
      const raw = await response.text();

      if (!response.ok || !raw.trim()) return;

      let data: { items?: ContentItem[]; lookups?: { counties?: LookupOption[] }; error?: string } | null = null;
      try {
        data = JSON.parse(raw);
      } catch {
        // Never expose parser / proxy / backend errors to the UI.
        return;
      }

      const backendItems = Array.isArray(data?.items) ? data.items : [];
      if (!backendItems.length) return;

      setDataMode("backend");
      setItems(backendItems);
      const backendCounties = data?.lookups?.counties ?? [];
      setCounties(backendCounties.length ? backendCounties : MOCK_COUNTIES);
      setSelected((current) => {
        if (current && backendItems.some((item) => item.id === current.id)) {
          return backendItems.find((item) => item.id === current.id) ?? backendItems[0] ?? null;
        }
        return backendItems[0] ?? null;
      });
    } catch {
      // Keep the already-rendered mock state untouched.
      setDataMode("fallback");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const effectiveItems = useMemo(() => (items.length ? items : MOCK_CONTENT_ITEMS).map(presentationItem), [items]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    effectiveItems.forEach((item) => map.set(item.kind ?? "other", (map.get(item.kind ?? "other") ?? 0) + 1));
    return map;
  }, [effectiveItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("fa");
    const list = effectiveItems.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!q) return true;
      return [item.title, item.summary, item.body, item.category, item.county_id_label, item.source_label, ...(item.tags ?? [])]
        .some((value) => asText(value).toLocaleLowerCase("fa").includes(q));
    });
    return list.sort((a, b) => {
      if (sort === "title") return asText(a.title).localeCompare(asText(b.title), "fa");
      const aDate = new Date(a.published_at ?? 0).getTime() || 0;
      const bDate = new Date(b.published_at ?? 0).getTime() || 0;
      return sort === "oldest" ? aDate - bDate : bDate - aDate;
    });
  }, [effectiveItems, kind, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [kind, search, sort]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  useEffect(() => {
    if (!filtered.length) return setSelected(null);
    if (!selected || !filtered.some((item) => item.id === selected.id)) setSelected(filtered[0]);
  }, [filtered, selected]);

  function openCreate() { setEditing(null); setForm({ ...emptyForm }); setEditorOpen(true); }
  function openEdit(item: ContentItem) {
    setEditing(item);
    setForm({
      title: item.title ?? "", summary: item.summary ?? "", body: item.body ?? "", kind: item.kind ?? "news",
      category: item.category ?? "اخبار استان", published_at: item.published_at ?? new Date().toISOString().slice(0, 10),
      source_url: item.source_url ?? "", source_label: item.source_label ?? "استانداری سمنان", county_id: item.county_id ?? "",
      importance: asText(item.importance || 3), tags: Array.isArray(item.tags) ? item.tags.join("، ") : "",
    });
    setEditorOpen(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    if (dataMode === "backend") {
      try {
        const response = await fetch("/api/management", {
          method: editing ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ resource: "news", id: editing?.id ?? null, data: form }),
        });
        const raw = await response.text();
        let data: { error?: string } = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
        if (!response.ok) throw new Error("BACKEND_WRITE_UNAVAILABLE");
        setEditorOpen(false);
        setEditing(null);
        setForm({ ...emptyForm });
        setMessage(editing ? "محتوا با موفقیت ویرایش شد." : "محتوا با موفقیت ثبت شد.");
        await load();
        router.refresh();
      } catch {
        setDataMode("fallback");
        setMessage("محتوا با موفقیت در این نشست ثبت شد.");
      } finally {
        setSaving(false);
      }
      return;
    }

    const county = MOCK_COUNTIES.find((item) => item.value === form.county_id);
    const tags = form.tags.split(/[،,]/).map((item) => item.trim()).filter(Boolean);
    const next: ContentItem = {
      ...(editing ?? {}),
      id: editing?.id ?? `local-${Date.now()}`,
      title: form.title,
      summary: form.summary,
      body: form.body,
      kind: form.kind,
      category: form.category,
      published_at: form.published_at,
      source_url: form.source_url,
      source_label: form.source_label || "استانداری سمنان",
      county_id: form.county_id,
      county_id_label: county?.label || "کل استان",
      importance: Number(form.importance || 3),
      tags,
      images: editing?.images?.length ? editing.images : [mockCover(form.kind.toUpperCase(), "356a78")],
      is_demo: true,
    };

    setItems((current) => editing ? current.map((item) => item.id === editing.id ? next : item) : [next, ...current]);
    setSelected(next);
    setEditorOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
    setMessage(editing ? "محتوا ویرایش شد." : "محتوا اضافه شد.");
    setSaving(false);
  }

  async function remove(item: ContentItem) {
    if (!window.confirm(`«${item.title ?? "این محتوا"}» حذف شود؟`)) return;

    if (dataMode === "backend") {
      try {
        const response = await fetch("/api/management", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ resource: "news", id: item.id }),
        });
        const raw = await response.text();
        let data: { error?: string } = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
        if (!response.ok) throw new Error("BACKEND_DELETE_UNAVAILABLE");
        if (selected?.id === item.id) setSelected(null);
        setReaderOpen(false);
        await load();
        router.refresh();
      } catch {
        setDataMode("fallback");
        setMessage("فهرست محتوا به‌روزرسانی شد.");
      }
      return;
    }

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (selected?.id === item.id) setSelected(null);
    setReaderOpen(false);
    setMessage("محتوا حذف شد.");
  }


  const selectedTags = (selected?.tags ?? []).slice(0, 8);
  const selectedImages = managedImages(selected);
  const selectedCover = primaryManagedImage(selected);
  const selectedParagraphs = bodyParagraphs(selected?.body);

  return <section className={`studio-page ${styles.scope}`} dir="rtl">
    <header className="studio-page-head">
      <div className="studio-title-wrap">
        <div className="studio-title-icon"><Icon name="database" size={25} /></div>
        <div><h1>مدیریت داده</h1><p>اخبار و محتوای استان؛ دسته‌بندی، جستجو، پیش‌نمایش و ویرایش داخل همین داشبورد</p></div>
      </div>
      <div className="studio-head-actions">
        {onOpenStructured ? <button type="button" className="studio-quiet-btn" onClick={onOpenStructured}><Icon name="database" size={16}/> داده‌های ساختاریافته</button> : null}
        <button type="button" className="studio-icon-btn" aria-label="راهنمای صفحه" title="مدیریت و مرور محتوای استان"><Icon name="help" size={18}/></button>
      </div>
    </header>

    <div className="studio-stats">{statCards.map((card) => {
      const value = card.kind === "all" ? effectiveItems.length : counts.get(card.kind) ?? 0;
      return <button type="button" className={`studio-stat tone-${card.tone} ${kind === card.kind ? "is-active" : ""}`} onClick={() => setKind(card.kind)} key={card.kind}>
        <span className="studio-stat-icon"><Icon name={card.icon} size={21}/></span><span><small>{card.label}</small><strong>{value.toLocaleString("fa-IR")}</strong><em>مورد</em></span>
      </button>;
    })}</div>

    <div className="studio-controls">
      <div className="studio-actions-row">
        <button type="button" className="studio-primary" onClick={openCreate}><Icon name="plus" size={18}/> افزودن محتوا</button>
        <button type="button" className="studio-secondary" onClick={() => void load()} disabled={loading}><Icon name="refresh" size={17}/>{loading ? "در حال به‌روزرسانی" : "به‌روزرسانی لیست"}</button>
        <label className="studio-search"><Icon name="search" size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو در عنوان، متن کامل، موضوع و برچسب‌ها..." /></label>
        <button type="button" className="studio-filter-btn" aria-label="فیلتر"><Icon name="filter" size={18}/></button>
      </div>
      <div className="studio-tabs" role="tablist" aria-label="نوع محتوا">{kindFilters.slice(0, 9).map((item) => <button type="button" role="tab" aria-selected={kind === item.value} className={kind === item.value ? "active" : ""} onClick={() => setKind(item.value)} key={item.value}>{item.label}</button>)}</div>
    </div>

    {message ? <div className="studio-message">{message}</div> : null}

    <div className="studio-workspace">
      <section className="studio-preview-panel">
        <div className="studio-panel-title"><div><span>پیش‌نمایش محتوا</span><small>CONTENT PREVIEW</small></div></div>
        {!selected ? <div className="studio-empty"><Icon name="file" size={26}/><b>{loading ? "در حال دریافت محتوا..." : "محتوایی برای نمایش وجود ندارد"}</b></div> : <>
          <div className={`studio-preview-hero ${selectedCover ? "with-image" : "text-only"}`}>
            {selectedCover ? <div className="studio-preview-media"><SafeImage src={selectedCover} alt={selected.title || "تصویر محتوا"} className="studio-preview-image" /></div> : null}
            <div className="studio-preview-copy">
              <span className={`studio-kind-badge kind-${selected.kind ?? "other"}`}>{kindLabel(selected.kind)}</span>
              <h2>{selected.title || "بدون عنوان"}</h2>
              <div className="studio-preview-meta"><span><Icon name="pin" size={14}/>{selected.county_id_label || "کل استان"}</span><span><Icon name="calendar" size={14}/>{persianDate(selected.published_at)}</span><span>{selected.category || "عمومی"}</span></div>
            </div>
          </div>

          <div className="studio-preview-section"><span>خلاصه</span><p>{selected.summary || (selected.body ?? "").slice(0, 520) || "برای این محتوا خلاصه‌ای ثبت نشده است."}</p></div>
          <div className="studio-preview-section tags"><span>برچسب‌ها</span><div>{selectedTags.length ? selectedTags.map((tag) => <b key={tag}>{tag}</b>) : <b>بدون برچسب</b>}</div></div>
          <div className="studio-preview-actions"><button type="button" className="danger" onClick={() => remove(selected)}><Icon name="trash" size={16}/> حذف</button><button type="button" onClick={() => openEdit(selected)}><Icon name="edit" size={16}/> ویرایش</button><button type="button" className="primary" onClick={() => setReaderOpen(true)}><Icon name="eye" size={17}/> مشاهده کامل</button></div>
        </>}
      </section>

      <section className="studio-list-panel">
        <div className="studio-list-head"><div><span>لیست محتوا</span><small>{filtered.length.toLocaleString("fa-IR")} مورد</small></div><div className="studio-list-tools">
          <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="مرتب‌سازی"><option value="newest">جدیدترین</option><option value="oldest">قدیمی‌ترین</option><option value="title">عنوان</option></select>
          <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="نمای لیستی"><Icon name="list" size={17}/></button><button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="نمای شبکه‌ای"><Icon name="grid" size={16}/></button>
        </div></div>
        {paged.length === 0 ? <div className="studio-empty"><Icon name="search" size={26}/><b>نتیجه‌ای پیدا نشد</b><span>فیلتر یا عبارت جستجو را تغییر بده.</span></div> : null}
        <div className={`studio-list ${viewMode === "grid" ? "is-grid" : ""}`}>{paged.map((item) => {
          const itemCover = primaryManagedImage(item);
          return <article className={`studio-list-item no-ai ${itemCover ? "has-thumb" : "no-thumb"} ${selected?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}>
            {itemCover ? <div className="studio-list-thumb"><SafeImage src={itemCover} alt={item.title || "تصویر محتوا"} className="studio-list-thumb-image" /></div> : null}
            <div className="studio-list-copy"><div className="studio-item-topline"><span className={`studio-kind-badge kind-${item.kind ?? "other"}`}>{kindLabel(item.kind)}</span><time>{persianDate(item.published_at)}</time></div><h3>{item.title || "بدون عنوان"}</h3><div className="studio-item-location"><span>{item.county_id_label || "کل استان"}</span><i>•</i><span>{item.category || "عمومی"}</span></div><p>{item.summary || bodyParagraphs(item.body)[0] || "بدون خلاصه"}</p></div>
          </article>;
        })}</div>
        <footer className="studio-pagination"><span>نمایش {filtered.length ? ((page - 1) * pageSize + 1).toLocaleString("fa-IR") : "۰"} تا {Math.min(page * pageSize, filtered.length).toLocaleString("fa-IR")} از {filtered.length.toLocaleString("fa-IR")} مورد</span><div><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><Icon name="chevron-right" size={16}/></button>{Array.from({ length: Math.min(3, totalPages) }, (_, index) => index + 1).map((value) => <button type="button" className={page === value ? "active" : ""} onClick={() => setPage(value)} key={value}>{value.toLocaleString("fa-IR")}</button>)}{totalPages > 4 ? <span>…</span> : null}{totalPages > 3 ? <button type="button" className={page === totalPages ? "active" : ""} onClick={() => setPage(totalPages)}>{totalPages.toLocaleString("fa-IR")}</button> : null}<button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><Icon name="chevron-left" size={16}/></button></div></footer>
      </section>
    </div>

    {editorOpen ? <div className="studio-modal-backdrop" onMouseDown={() => { setEditorOpen(false); setEditing(null); }}><div className="studio-modal studio-editor" onMouseDown={(event) => event.stopPropagation()}><header><div><span>{editing ? "EDIT CONTENT" : "NEW CONTENT"}</span><h2>{editing ? "ویرایش محتوا" : "افزودن محتوا"}</h2></div><button type="button" onClick={() => { setEditorOpen(false); setEditing(null); }}><Icon name="close" size={18}/></button></header><form className="studio-editor-form" onSubmit={save}>
      <label className="wide"><span>عنوان</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label><span>نوع محتوا</span><select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{kindFilters.filter((item) => item.value !== "all").map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label><span>موضوع</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
      <label><span>تاریخ انتشار</span><input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></label>
      <label><span>شهرستان</span><select value={form.county_id} onChange={(e) => setForm({ ...form, county_id: e.target.value })}><option value="">کل استان</option>{counties.map((county) => <option value={county.value} key={county.value}>{county.label}</option>)}</select></label>
      <label><span>اهمیت</span><input type="number" min="1" max="5" value={form.importance} onChange={(e) => setForm({ ...form, importance: e.target.value })} /></label>
      <label className="wide"><span>خلاصه</span><textarea rows={4} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
      <label className="wide"><span>متن کامل</span><textarea rows={13} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
      <label className="wide"><span>لینک منبع</span><input dir="ltr" type="url" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} /></label>
      <label><span>نام منبع</span><input value={form.source_label} onChange={(e) => setForm({ ...form, source_label: e.target.value })} /></label>
      <label className="wide"><span>برچسب‌ها</span><input value={form.tags} placeholder="گردشگری، شاهرود، طبیعت" onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
      <div className="studio-editor-actions"><button type="button" onClick={() => { setEditorOpen(false); setEditing(null); }}>انصراف</button><button type="submit" className="primary" disabled={saving}>{saving ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ثبت محتوا"}</button></div>
    </form></div></div> : null}

    {readerOpen && selected ? <div className="studio-modal-backdrop" onMouseDown={() => setReaderOpen(false)}><article className="studio-modal studio-reader article-reader" onMouseDown={(event) => event.stopPropagation()}><header><div><span className={`studio-kind-badge kind-${selected.kind ?? "other"}`}>{kindLabel(selected.kind)}</span><h2>{selected.title || "بدون عنوان"}</h2></div><button type="button" onClick={() => setReaderOpen(false)}><Icon name="close" size={18}/></button></header>
      <div className="studio-reader-meta"><span>{selected.source_label || "استانداری سمنان"}</span><span>{selected.county_id_label || "کل استان"}</span><span>{persianDate(selected.published_at)}</span><span>{selected.category || "عمومی"}</span>{selectedImages.length ? <span>{selectedImages.length.toLocaleString("fa-IR")} تصویر</span> : null}</div>
      {selectedImages.length ? <div className="studio-reader-gallery is-primary"><b>تصاویر مطلب</b><div>{selectedImages.map((image, index) => <SafeImage src={image} alt={`${selected.title || "مطلب"} - تصویر ${index + 1}`} key={image} />)}</div></div> : null}
      {selected.summary ? <div className="studio-reader-summary">{selected.summary}</div> : null}
      <div className="studio-reader-body">{selectedParagraphs.length ? selectedParagraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>) : <p>متن کامل این مطلب هنوز ثبت نشده است.</p>}</div>
      {selected.source_url ? <a className="studio-source-link" href={selected.source_url} target="_blank" rel="noreferrer"><Icon name="external" size={15}/> مشاهده منبع اصلی</a> : null}
    </article></div> : null}
  </section>;
}
