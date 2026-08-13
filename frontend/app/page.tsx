import Link from "next/link";
import { ProvinceMapPreview } from "../components/province-map-preview";
import { PublicHeader } from "../components/public-header";
import { PublicSearch } from "../components/public-search";
import { getPublicData } from "../lib/public-data";

const statusLabel: Record<string, string> = { healthy: "پایدار", attention: "نیازمند توجه", critical: "پرریسک" };
const projectStatus: Record<string, string> = { on_track: "مطابق برنامه", attention: "نیازمند توجه", critical: "بحرانی", complete: "تکمیل" };
const procurementStatus: Record<string, string> = { planned: "برنامه‌ریزی", open: "باز", evaluation: "ارزیابی", awarded: "واگذار شده" };

export default async function PublicHome() {
  const data = await getPublicData();
  const topNews = data.news.slice(0, 6);
  const tourism = data.news.filter((item) => item.kind === "tourism").slice(0, 4);
  const sectorAverage = data.sectors.length ? data.sectors.reduce((sum, item) => sum + Number(item.value), 0) / data.sectors.length : 0;
  const atRisk = data.sectors.filter((item) => item.status === "critical").length;
  const searchItems = [
    ...data.news.map((item) => ({ id: `news-${item.id}`, type: "خبر و محتوا", title: item.title, meta: `${item.category}${item.county ? ` · ${item.county.name}` : ""}`, anchor: "#news" })),
    ...data.sectors.map((item) => ({ id: `sector-${item.id}`, type: "شاخص راهبردی", title: item.label, meta: `${item.domain} · ${statusLabel[item.status]}`, anchor: "#intelligence" })),
    ...data.projects.map((item, index) => ({ id: `project-${index}`, type: "پروژه", title: item.title, meta: `${item.county.name} · ${projectStatus[item.status] ?? item.status}`, anchor: "#transparency" })),
    ...data.procurements.map((item) => ({ id: `procurement-${item.id}`, type: "مناقصه", title: item.title, meta: `${item.organization.name} · ${procurementStatus[item.status] ?? item.status}`, anchor: "#services" })),
    ...data.crises.map((item) => ({ id: `crisis-${item.id}`, type: "تاب‌آوری", title: item.title, meta: `${item.category} · ${item.county?.name ?? "استانی"}`, anchor: "#resilience" })),
    ...data.forecasts.map((item) => ({ id: `forecast-${item.id}`, type: "پیش‌بینی", title: item.metricLabel, meta: `${item.domain} · ${item.horizonLabel}`, anchor: "#resilience" }))
  ];

  return <main className="portal-shell">
    <section className="hero">
      <PublicHeader />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="live-badge"><i className={data.source === "graphql" ? "live" : "demo"} />{data.source === "graphql" ? "متصل به داده استانی" : "نسخه نمایشی مستندمحور"}</div>
          <span className="eyebrow">Provincial Intelligence & Decision Support</span>
          <h1>سمنان را با <em>داده، شفافیت و تصمیم هوشمند</em> یکپارچه ببینید.</h1>
          <p>یک درگاه عمومی برای شهروندان و سرمایه‌گذاران، و یک لایه هوشمندی برای رصد پروژه، خبر، شهرستان، بودجه، مناقصه، عملکرد و مسائل راهبردی استان.</p>
          <div className="hero-actions"><a className="primary-action" href="#province">مشاهده نبض استان</a><Link className="secondary-action" href="/command">ورود مدیران به Command Center</Link></div>
          <div className="hero-proof"><span><b>Observe</b> رصد</span><span><b>Understand</b> تحلیل</span><span><b>Compare</b> مقایسه</span><span><b>Decide</b> تصمیم</span></div>
        </div>
        <ProvinceMapPreview />
      </div>
    </section>

    <section id="province" className="section province-overview">
      <div className="section-head"><div><span className="section-label">نمای عمومی استان</span><h2 className="section-title">یک تصویر کوتاه، قابل پیگیری و قابل توضیح</h2></div><p>{data.freshness}</p></div>
      <div className="metric-grid">{data.metrics.slice(0, 5).map((metric) => <article className={`metric metric-${metric.status}`} key={metric.key}><div className="metric-head"><span>{metric.label}</span><i /></div><strong>{metric.value}</strong><small>{metric.delta}</small>{metric.isDemo ? <em>Demo</em> : null}</article>)}</div>
      <div className="public-insight-strip"><div><span>امتیاز ترکیبی حوزه‌ها</span><strong>{sectorAverage.toFixed(0)}<small>/100</small></strong></div><div><span>ریسک‌های راهبردی</span><strong>{atRisk}</strong></div><p>این لایه همان ایده سند «Smart Governorship» است: مسئله استان فقط با یک عدد دیده نمی‌شود؛ خبر، پروژه، KPI، جغرافیا و روند باید کنار هم قرار بگیرند.</p><Link href="/command">نمای مدیریتی کامل ←</Link></div>
    </section>

    <section className="section search-section"><PublicSearch items={searchItems} /></section>

    <section id="intelligence" className="section intelligence-section">
      <div className="section-head"><div><span className="section-label">نبض راهبردی</span><h2 className="section-title">محورهایی که استانداری باید هر روز ببیند</h2></div><p>آب، انرژی، صنعت، سرمایه‌گذاری، محیط‌زیست و گردشگری؛ با امکان توسعه به اشتغال، سلامت، راه و کشاورزی.</p></div>
      <div className="sector-public-grid">{data.sectors.slice(0, 6).map((sector) => <article className={`public-sector ${sector.status}`} key={sector.id}><header><div><span>{sector.domain}</span><h3>{sector.label}</h3></div><strong>{Number(sector.value).toFixed(0)}</strong></header><div className="public-progress"><i style={{ width: `${Math.min(Number(sector.value), 100)}%` }} /></div><div className="sector-foot"><span>{statusLabel[sector.status]}</span><b className={Number(sector.trendPercent) < 0 ? "down" : "up"}>{Number(sector.trendPercent) > 0 ? "+" : ""}{Number(sector.trendPercent).toFixed(1)}٪</b></div><p>{sector.description}</p></article>)}</div>
    </section>

    <section id="resilience" className="section resilience-section">
      <div className="section-head"><div><span className="section-label">Resilience & Early Warning</span><h2 className="section-title">رخدادهای مهم و نگاه رو به جلو</h2></div><p>در پرتال عمومی فقط نمای خلاصه و قابل فهم نمایش داده می‌شود؛ جزئیات عملیاتی و حساس در Command Center باقی می‌ماند.</p></div>
      <div className="resilience-public-grid">
        <article className="resilience-public-card"><header><div><span>سیگنال‌های تاب‌آوری</span><h3>رخدادهای نیازمند توجه</h3></div><b>{data.crises.filter((item) => item.status !== "resolved").length}</b></header><div className="public-crisis-list">{data.crises.slice(0, 3).map((item) => <div key={item.id}><i className={item.severity} /><div><b>{item.title}</b><span>{item.category} · {item.county?.name ?? "استانی"}</span></div><strong>{item.impactScore}/100</strong></div>)}</div><small>موارد دارای برچسب Demo سناریوی طراحی هستند.</small></article>
        <article className="resilience-public-card forecast-public"><header><div><span>Early Warning</span><h3>پیش‌بینی شاخص‌های منتخب</h3></div><b>{data.forecasts.length}</b></header><div className="public-forecast-list">{data.forecasts.slice(0, 4).map((item) => { const current = Number(item.currentValue); const forecast = Number(item.forecastValue); const max = Math.max(current, forecast, 100); return <div key={item.id}><div className="public-forecast-title"><span>{item.metricLabel}</span><b>{current.toFixed(0)} → {forecast.toFixed(0)} {item.unit}</b></div><div className="public-forecast-track"><i style={{ width: `${Math.min(current / max * 100, 100)}%` }} /><em className={item.riskLevel} style={{ right: `${Math.min(forecast / max * 100, 100)}%` }} /></div><small>{item.horizonLabel} · اعتماد {item.confidence}٪</small></div>; })}</div><Link href="/command#forecast">مشاهده تحلیل مدیریتی ←</Link></article>
      </div>
    </section>

    <section id="news" className="section news-section">
      <div className="section-head"><div><span className="section-label">News Intelligence + Public Archive</span><h2 className="section-title">اخبار، اطلاعیه‌ها و روایت استان در یک مرکز</h2></div><p>در نسخه مدیریتی همین محتوا می‌تواند Topic، County، Importance، Sentiment و Event استخراج کند.</p></div>
      <div className="news-layout">
        <article className="featured-story"><div className="story-index">01</div><span>{topNews[0]?.category ?? "استان"}</span><h3>{topNews[0]?.title ?? "آرشیو خبر استان"}</h3><p>{topNews[0]?.summary}</p><div className="story-meta"><span>{topNews[0]?.sourceLabel}</span><b>اهمیت {topNews[0]?.importance ?? 0}/100</b></div></article>
        <div className="story-list">{topNews.slice(1, 6).map((article, index) => <article key={article.id}><b>{String(index + 2).padStart(2, "0")}</b><div><span>{article.category}{article.county ? ` · ${article.county.name}` : ""}</span><h3>{article.title}</h3><p>{article.summary}</p></div><em>{article.importance}</em></article>)}</div>
      </div>
      <div className="document-news-archive"><div className="archive-head"><div><span>آرشیو مستند ارسالی</span><h3>همه موضوعات شناسایی‌شده از صفحات استان</h3></div><b>{data.news.length.toLocaleString("fa-IR")} مورد</b></div><div className="archive-chips">{data.news.map((article) => <div key={`archive-${article.id}`}><span>{article.category}</span><b>{article.title}</b><small>{article.county?.name ?? "استانی"}</small></div>)}</div><p>این فهرست از اسناد ارسالی Seed شده است؛ برای نسخه عملیاتی، آرشیو چندساله خبر باید با Crawler و Deduplication به‌صورت خودکار وارد شود.</p></div>
    </section>

    <section className="section tourism-section">
      <div className="section-head"><div><span className="section-label">هویت، گردشگری و سرمایه مکانی</span><h2 className="section-title">محتوای آرشیوی، بخشی از هوشمندی استان است</h2></div><p>جاذبه‌ها فقط محتوای سایت نیستند؛ می‌توان آن‌ها را به شهرستان، سرمایه‌گذاری، مسیر، آمار بازدید و پروژه‌های گردشگری متصل کرد.</p></div>
      <div className="tourism-grid">{tourism.map((item, index) => <article key={item.id}><span>0{index + 1}</span><div><small>{item.county?.name ?? "استان سمنان"}</small><h3>{item.title}</h3></div><i>↗</i></article>)}</div>
    </section>

    <section id="transparency" className="section transparency-section">
      <div className="transparency-shell">
        <div className="transparency-copy"><span className="section-label">شفافیت اجرایی</span><h2>از پروژه تا مناقصه؛ هر تصمیم باید ردپای داده داشته باشد.</h2><p>اسناد ارسالی علاوه بر خبر و گردشگری، روی ارزیابی عملکرد، فرایندهای اداری و قانون مناقصات تأکید دارند. بنابراین Portal باید «نمای عمومی قابل فهم» بدهد و Command Center جزئیات اجرایی را نگه دارد.</p><div className="transparency-tags"><span>Data Lineage</span><span>Performance KPI</span><span>Procurement</span><span>Project Tracking</span><span>Citizen SLA</span></div></div>
        <div className="transparency-data">
          <h3>پروژه‌های منتخب</h3>{data.projects.slice(0, 4).map((project) => { const actual = Number(project.actualProgress); const planned = Number(project.plannedProgress); return <div className="public-project" key={project.title}><div><b>{project.title}</b><span>{project.county.name} · {projectStatus[project.status] ?? project.status}</span></div><strong>{actual.toFixed(0)}٪</strong><div className="dual-public-progress"><i style={{ width: `${actual}%` }} /><em style={{ right: `${planned}%` }} /></div></div>; })}
        </div>
      </div>
    </section>

    <section id="services" className="section civic-section">
      <div className="section-head"><div><span className="section-label">خدمات و فرصت‌ها</span><h2 className="section-title">اطلاعیه، خدمت، مناقصه و سرمایه‌گذاری؛ قابل جست‌وجو و دسته‌بندی</h2></div><p>ساختار آماده است تا بعداً به سرویس‌های واقعی استانداری متصل شود.</p></div>
      <div className="civic-grid"><article className="civic-card accent"><span>01</span><h3>میز خدمت یکپارچه</h3><p>پیگیری درخواست، راهنمای خدمت، فرم‌ها، SLA و وضعیت پاسخ در یک مسیر.</p><a href="#services">خدمات عمومی ←</a></article><article className="civic-card"><span>02</span><h3>اطلاعیه و استخدام</h3><p>آگهی‌ها و اطلاعیه‌های رسمی با تاریخ، دستگاه، موضوع و قابلیت جست‌وجو.</p><a href="#news">مرکز اطلاع‌رسانی ←</a></article><article className="civic-card"><span>03</span><h3>فرصت سرمایه‌گذاری</h3><p>اتصال فرصت‌ها به شهرستان، زیرساخت، مانع، دستگاه مسئول و وضعیت پیگیری.</p><a href="#intelligence">نمای اقتصادی ←</a></article></div>
      <div className="procurement-public"><div className="procurement-title"><span>فرایندهای خرید نمونه</span><b>Procurement Transparency</b></div>{data.procurements.slice(0, 4).map((item) => <article key={item.id}><div><span className={`proc-dot ${item.status}`} /><div><h3>{item.title}</h3><p>{item.organization.name} · {item.county?.name ?? "استانی"}</p></div></div><div><span>{procurementStatus[item.status] ?? item.status}</span><small>{item.procurementMethod}</small></div></article>)}</div>
    </section>

    <section className="section decision-section"><div className="decision-loop"><div><span className="section-label">Decision Intelligence</span><h2>چرخه‌ای که سایت باید در نهایت پشتیبانی کند</h2><p>رصد → فهم → مقایسه → پیش‌بینی → تصمیم → پایش. Portal بخش عمومی و Command Center بخش مدیریتی همین چرخه است.</p></div><ol><li><b>01</b><span>Observe<small>خبر، داده، درخواست و GIS</small></span></li><li><b>02</b><span>Understand<small>KPI، روند و علت</small></span></li><li><b>03</b><span>Compare<small>شهرستان و Benchmark</small></span></li><li><b>04</b><span>Predict<small>ریسک و Forecast</small></span></li><li><b>05</b><span>Decide<small>مصوبه و اقدام</small></span></li><li><b>06</b><span>Monitor<small>تعهد، نتیجه و پاسخ‌گویی</small></span></li></ol></div></section>

    <footer className="footer"><div className="footer-inner"><div><div className="brand"><span className="brand-mark">س</span><span><b>استانداری سمنان</b><small>پرتال حکمرانی هوشمند</small></span></div><p>نسخه توسعه‌یافته بر پایه کد موجود و محتوای اسناد ارسالی.</p></div><div className="footer-links"><a href="#province">نمای استان</a><a href="#news">اخبار</a><a href="#transparency">شفافیت</a><Link href="/command">مرکز فرماندهی</Link></div><p>هشدار: داده‌های دارای برچسب Demo برای نمونه‌سازی محصول هستند و آمار رسمی استان محسوب نمی‌شوند.</p></div></footer>
  </main>;
}
