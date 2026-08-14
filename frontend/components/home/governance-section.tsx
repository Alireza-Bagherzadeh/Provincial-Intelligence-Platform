import type { PublicData } from "../../lib/public-data";
import { Icon } from "./icons";

const fallbackSectors = [
  { domain: "آب و محیط‌زیست", label: "پایداری منابع حیاتی", value: "۵۸", trendPercent: "-۴.۲", status: "critical" },
  { domain: "انرژی", label: "تاب‌آوری شبکه", value: "۷۴", trendPercent: "+۱.۵", status: "attention" },
  { domain: "صنعت و معدن", label: "ظرفیت تولید", value: "۷۷", trendPercent: "+۲.۴", status: "attention" },
  { domain: "سرمایه‌گذاری", label: "جریان فرصت‌ها", value: "۷۳", trendPercent: "+۳.۱", status: "healthy" }
];

export function GovernanceSection({ data }: { data: PublicData }) {
  const sectors = data.source === "graphql" && data.sectors.length ? data.sectors.slice(0, 4) : fallbackSectors;
  return <section className="governance-section section-pad" id="governance">
    <div className="page-shell">
      <div className="section-heading split-heading light-heading">
        <div><span className="kicker">حکمرانی مبتنی بر شواهد</span><h2>از داده تا تصمیم، در مقیاس استان</h2></div>
        <p>یک لایه مشترک برای مدیران، دستگاه‌های اجرایی و شهروندان؛ جایی که داده‌های پراکنده به تصویر قابل فهم از عملکرد و آینده استان تبدیل می‌شوند.</p>
      </div>
      <div className="governance-grid">
        <article className="command-feature">
          <div className="feature-copy"><span className="feature-icon"><Icon name="pulse" /></span><span className="kicker">مرکز فرماندهی</span><h3>دید یکپارچه برای مدیریت لحظه‌ای</h3><p>پایش شاخص‌های کلیدی، هشدارها، پروژه‌ها و کیفیت داده در یک نمای عملیاتی منسجم.</p><a className="button button-outline" href="/command">ورود به مرکز فرماندهی <Icon name="arrow" /></a></div>
          <div className="command-visual" aria-hidden="true">
            <div className="visual-head"><i /><i /><i /><span>مرکز پایش استان</span></div>
            <div className="visual-body"><div className="visual-sidebar">{[1,2,3,4,5].map((i) => <i key={i} />)}</div><div className="visual-main"><div className="mini-kpis"><i/><i/><i/></div><div className="mini-chart">{[42,66,53,81,62,88,71,92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div></div>
          </div>
        </article>
        <div className="sector-grid">
          {sectors.map((sector, index) => <article key={sector.domain} className={`sector-card status-${sector.status}`}>
            <div><span>۰{index + 1}</span><Icon name={index === 0 ? "layers" : index === 1 ? "pulse" : index === 2 ? "building" : "briefcase"} /></div>
            <h3>{sector.domain}</h3><p>{sector.label}</p>
            <div className="sector-value"><b>{sector.value}</b><span>امتیاز</span><em>{sector.trendPercent}٪</em></div>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

