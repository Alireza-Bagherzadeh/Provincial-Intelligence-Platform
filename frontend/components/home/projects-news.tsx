import Image from "next/image";
import type { PublicData } from "../../lib/public-data";
import { formatPersianIndex, formatPersianNumber, toPersianDigits } from "../../lib/persian-numbers";
import { Icon } from "./icons";

const fallbackProjects = [
  { title: "توسعه زیرساخت خدمات هوشمند استان", county: { name: "سمنان" }, actualProgress: "۸۱", status: "on_track" },
  { title: "تکمیل شبکه پایدار آبرسانی شرق استان", county: { name: "شاهرود" }, actualProgress: "۴۱", status: "critical" },
  { title: "ارتقای زیرساخت شهرک‌های صنعتی", county: { name: "گرمسار" }, actualProgress: "۶۴", status: "attention" }
];

const newsFallback = [
  { id: "1", title: "جنگل ابر؛ سرمایه طبیعی و راهبردی استان سمنان", summary: "نگاهی به ظرفیت حفاظت، پژوهش و گردشگری مسئولانه در یکی از مهم‌ترین زیست‌بوم‌های استان.", category: "محیط‌زیست", county: { name: "شاهرود" } },
  { id: "2", title: "میراث صنعتی استان در مسیر بازآفرینی", summary: "ظرفیت بناهای صنعتی تاریخی برای تقویت هویت شهری و اقتصاد فرهنگ.", category: "میراث فرهنگی", county: { name: "سمنان" } },
  { id: "3", title: "فرصت‌های تازه گردشگری در پهنه کویری", summary: "روایت مقصدهای کویری استان و ضرورت توسعه زیرساخت‌های سازگار با محیط.", category: "گردشگری", county: { name: "گرمسار" } }
];
const newsImages = ["/images/jangale-abr.jpg", "/images/karkhone-panbe.webp", "/images/kavir-rig-jen.jpg"];

function parseLocalizedNumber(value: string | number) {
  const normalized = String(value)
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  return Number(normalized);
}

export function ProjectsNews({ data }: { data: PublicData }) {
  const projects = data.source === "graphql" && data.projects.length ? data.projects.slice(0, 3) : fallbackProjects;
  const news = data.source === "graphql" && data.news.length ? data.news.slice(0, 3) : newsFallback;
  return <>
    <section className="projects-section section-pad" id="projects">
      <div className="page-shell">
        <div className="section-heading split-heading"><div><span className="kicker">برنامه و اجرا</span><h2>پروژه‌های پیشران استان</h2></div><a className="text-link" href="/command">مشاهده برج کنترل پروژه <Icon name="arrow" /></a></div>
        <div className="project-list">
          {projects.map((project, index) => {
            const progress = Math.max(0, Math.min(100, parseLocalizedNumber(project.actualProgress) || 0));
            return <article className="project-row" key={`${project.title}-${index}`}>
              <span className="project-index">{formatPersianIndex(index + 1)}</span>
              <div className="project-title"><span>{toPersianDigits(project.county?.name ?? "استان سمنان")}</span><h3>{toPersianDigits(project.title)}</h3></div>
              <div className="project-progress"><div><span>پیشرفت اجرایی</span><b>{formatPersianNumber(progress)}٪</b></div><i><em style={{ width: `${progress}%` }} /></i></div>
              <span className={`project-status ${project.status}`}>{project.status === "critical" ? "نیازمند اقدام" : project.status === "attention" ? "در حال پیگیری" : "طبق برنامه"}</span>
              <button className="round-link" aria-label={`مشاهده ${project.title}`}><Icon name="arrow" /></button>
            </article>;
          })}
        </div>
      </div>
    </section>
    <section className="news-section section-pad" id="news">
      <div className="page-shell">
        <div className="section-heading split-heading"><div><span className="kicker">روایت استان</span><h2>تازه‌ترین خبرها و چشم‌اندازها</h2></div><a className="text-link" href="#news">آرشیو اخبار <Icon name="arrow" /></a></div>
        <div className="news-grid">
          {news.map((item, index) => <article className={`news-card ${index === 0 ? "featured" : ""}`} key={item.id}>
            <div className="news-image"><Image src={newsImages[index]} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 100vw, 25vw"} /></div>
            <div className="news-copy"><div><span>{toPersianDigits(item.category)}</span><span><Icon name="calendar" /> ۲۲ مرداد ۱۴۰۵</span></div><h3>{toPersianDigits(item.title)}</h3><p>{toPersianDigits(item.summary)}</p><a aria-label={`مطالعه ${toPersianDigits(item.title)}`} href="#news"><Icon name="arrow" /></a></div>
          </article>)}
        </div>
      </div>
    </section>
  </>;
}
