"use client";

import { LineAreaChart } from "../../../components/charts";
import type { CommandSectionId } from "../../../components/sidebar";
import { countyAnalytics, getCountyAnalytics } from "../data/county-analytics";

export function CountyProfilePanel({ countyCode, month, onNavigate }: { countyCode: string; month: string; onNavigate: (section: CommandSectionId) => void }) {
  const county = getCountyAnalytics(countyCode === "all" ? "semnan" : countyCode);
  const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];

  return <section className="county-profile-panel">
    <article className="county-profile-hero">
      <div><span>پرونده یکپارچه شهرستان</span><h2>شهرستان {county.name}</h2><p>تمام شاخص‌های مدیریتی منتخب در بازه {month}</p></div>
      <div className="county-profile-rank"><span>رتبه استانی</span><strong>{county.rank.toLocaleString("fa-IR")}</strong><small>از {countyAnalytics.length.toLocaleString("fa-IR")} شهرستان</small></div>
    </article>
    <div className="county-profile-kpis">
      <article><span>شاخص کل عملکرد</span><strong>{county.overall.toLocaleString("fa-IR")}</strong><small className={county.change < 0 ? "negative" : "positive"}>{county.change > 0 ? "+" : ""}{county.change.toLocaleString("fa-IR")}٪ نسبت به دوره قبل</small></article>
      <article><span>جمعیت</span><strong>{county.population.toLocaleString("fa-IR")}</strong><small>نفر</small></article>
      <article><span>پروژه‌های فعال</span><strong>{county.projects.toLocaleString("fa-IR")}</strong><small>پرونده در جریان</small></article>
      <article><span>موضوعات فوری</span><strong>{county.urgent.toLocaleString("fa-IR")}</strong><small>نیازمند تصمیم</small></article>
    </div>
    <div className="county-profile-grid">
      <article className="card county-domain-compare"><div className="card-header"><div><h2>مقایسه شاخص‌های شهرستان با استان</h2><p className="muted">امتیاز نرمال‌شده از صد</p></div><button type="button" className="text-button" onClick={() => onNavigate("benchmark")}>مقایسه پیشرفته</button></div>
        <div className="county-grouped-bars">{county.domains.map((domain) => <div key={domain.label}><b>{domain.label}</b><div><span><i style={{ width: `${domain.value}%` }} /><em>{domain.value.toLocaleString("fa-IR")}</em></span><span className="province"><i style={{ width: `${domain.province}%` }} /><em>{domain.province.toLocaleString("fa-IR")}</em></span></div></div>)}</div>
        <div className="county-bars-legend"><span><i />{county.name}</span><span><i className="province" />میانگین استان</span></div>
      </article>
      <article className="card county-trend-summary"><div className="card-header"><div><h2>روند شاخص کل</h2><p className="muted">شش ماه اخیر</p></div></div><LineAreaChart values={county.trend} labels={months} /><div className="county-highlights">{county.highlights.map((item) => <p key={item}><i />{item}</p>)}</div></article>
    </div>
    <article className="card county-all-indicators"><div className="card-header"><div><h2>فهرست شاخص‌های تعیین‌شده</h2><p className="muted">مشاهده وضعیت، فاصله با استان و مسیر اقدام</p></div><span className="source-pill">{month}</span></div><div className="table-scroll"><table className="table"><thead><tr><th>حوزه</th><th>امتیاز شهرستان</th><th>میانگین استان</th><th>فاصله</th><th>وضعیت</th></tr></thead><tbody>{county.domains.map((domain) => { const gap = domain.value - domain.province; return <tr key={domain.label}><td><b>{domain.label}</b></td><td>{domain.value.toLocaleString("fa-IR")}</td><td>{domain.province.toLocaleString("fa-IR")}</td><td className={gap < 0 ? "negative" : "positive"}>{gap > 0 ? "+" : ""}{gap.toLocaleString("fa-IR")}</td><td><span className={`status ${domain.value >= 75 ? "ok" : domain.value >= 60 ? "attention" : "risk"}`}>{domain.value >= 75 ? "مطلوب" : domain.value >= 60 ? "نیازمند توجه" : "فوری"}</span></td></tr>; })}</tbody></table></div></article>
  </section>;
}
