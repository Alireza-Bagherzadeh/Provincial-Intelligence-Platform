import type { MapCounty } from "../maps/semnan-map-graphic";

export const landmarkSlides = [
  { src: "/images/darvaze-arg.jpg", title: "دروازه ارگ سمنان", eyebrow: "میراث شهری · سمنان", description: "دروازه‌ای به حافظه تاریخی و هویت شهری استان" },
  { src: "/images/abshar-mojn.jpg", title: "آبشار مجن", eyebrow: "طبیعت کوهستانی · شاهرود", description: "پیوند اقلیم کوهستانی با ظرفیت‌های گردشگری شرق استان" },
  { src: "/images/jangale-abr.jpg", title: "جنگل ابر", eyebrow: "ذخیره‌گاه طبیعی · شاهرود", description: "یکی از شاخص‌ترین پهنه‌های طبیعی ایران در مرز جنگل و کویر" },
  { src: "/images/karkhone-panbe.webp", title: "کارخانه پنبه", eyebrow: "میراث صنعتی · استان سمنان", description: "روایتی از پیشینه تولید، کارآفرینی و توسعه صنعتی استان" },
  { src: "/images/kavir-rig-jen.jpg", title: "کویر ریگ جن", eyebrow: "طبیعت کویری · جنوب استان", description: "پهنه‌ای منحصربه‌فرد برای پژوهش، حفاظت و گردشگری مسئولانه" },
  { src: "/images/khane-kalantar.jpg", title: "خانه کلانتر", eyebrow: "معماری تاریخی · سمنان", description: "نمونه‌ای ارزشمند از معماری بومی و زیست شهری سمنان" },
  { src: "/images/shahrood-musuem.jpg", title: "موزه شاهرود", eyebrow: "فرهنگ و تاریخ · شاهرود", description: "مقصدی برای شناخت تاریخ، مردم و میراث فرهنگی شرق استان" },
  { src: "/images/tange-zolomat.webp", title: "تنگه ظلمات", eyebrow: "منطقه توران · میامی", description: "چشم‌اندازی کم‌نظیر در زیست‌بوم حفاظت‌شده توران" },
  { src: "/images/bayazid-bastami.jpg", title: "آرامگاه بایزید بسطامی", eyebrow: "میراث عرفانی · بسطام، شاهرود", description: "یکی از شاخص‌ترین یادمان‌های عرفانی و تاریخی بسطام؛ جایی که میراث معنوی و معماری تاریخی استان سمنان در کنار هم روایت می‌شوند" }
] as const;

export const publicCounties: MapCounty[] = [
  { code: "garmsar", name: "گرمسار", projectCount: 14, criticalProjectCount: 1, averageProgress: 72 },
  { code: "aradan", name: "آرادان", projectCount: 8, criticalProjectCount: 0, averageProgress: 68 },
  { code: "sorkheh", name: "سرخه", projectCount: 7, criticalProjectCount: 0, averageProgress: 76 },
  { code: "semnan", name: "سمنان", projectCount: 24, criticalProjectCount: 1, averageProgress: 81 },
  { code: "mahdishahr", name: "مهدی‌شهر", projectCount: 11, criticalProjectCount: 0, averageProgress: 74 },
  { code: "damghan", name: "دامغان", projectCount: 16, criticalProjectCount: 1, averageProgress: 65 },
  { code: "shahroud", name: "شاهرود", projectCount: 22, criticalProjectCount: 2, averageProgress: 61 },
  { code: "meyami", name: "میامی", projectCount: 9, criticalProjectCount: 1, averageProgress: 57 }
];

export const publicServices = [
  { icon: "grid", title: "میز خدمت هوشمند", text: "دسترسی یکپارچه به خدمات و درگاه‌های دستگاه‌های اجرایی" },
  { icon: "chart", title: "شفافیت و عملکرد", text: "مرور شاخص‌ها، برنامه‌ها و پیشرفت طرح‌های اولویت‌دار استان" },
  { icon: "briefcase", title: "فرصت‌های سرمایه‌گذاری", text: "کشف ظرفیت‌های شهرستانی و مسیرهای ارتباط با دستگاه‌های مسئول" },
  { icon: "users", title: "صدای مردم", text: "ثبت، پیگیری و تحلیل نظام‌مند مسائل و پیشنهادهای شهروندی" }
] as const;
