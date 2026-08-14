import { ExecutiveBrief } from "../../../components/executive-brief";
import { DonutChart, ForecastBandChart, GaugeChart, HorizontalBarChart, LineAreaChart, RadarChart, SentimentStack, SparkBars } from "../../../components/charts";
import { ProvinceMap } from "../../../components/province-map";
import type { CommandSectionId } from "../../../components/sidebar";
import type { CommandCenterData } from "../../command/types";
import { GovernancePanel } from "../../governance/components/governance-panel";
import { CountyPortfolioCard } from "./county-portfolio-card";

const statusLabel = { on_track: "مطابق برنامه", attention: "نیازمند توجه", critical: "بحرانی", complete: "تکمیل‌شده" };

export function OverviewSection({ data, onNavigate }: { data: CommandCenterData; onNavigate: (section: CommandSectionId) => void }) {
  const projectCounts = {
    on_track: data.projects.filter((item) => item.status === "on_track").length,
    attention: data.projects.filter((item) => item.status === "attention").length,
    critical: data.projects.filter((item) => item.status === "critical").length,
    complete: data.projects.filter((item) => item.status === "complete").length
  };
  const provinceSectors = data.sectorIndicators.filter((item) => !item.county).slice(0, 8);
  const citizenRates = data.citizenSignals.map((item) => item.requestCount ? item.resolvedCount / item.requestCount * 100 : 0);
  const citizenLabels = data.citizenSignals.map((item) => item.county.name);
  const topOrg = data.organizations[0];
  const orgKpis = topOrg ? data.performanceIndicators.filter((item) => item.organization.code === topOrg.code).slice(0, 6) : [];
  const positive = data.newsArticles.filter((item) => Number(item.sentimentScore) > .1).length;
  const negative = data.newsArticles.filter((item) => Number(item.sentimentScore) < -.1).length;
  const neutral = data.newsArticles.length - positive - negative;
  const tracked = data.projects.filter((item) => item.status !== "complete");
  const activeCrises = data.crisisSignals.filter((item) => item.status !== "resolved");
  const crisisImpact = activeCrises.length ? activeCrises.reduce((sum, item) => sum + item.impactScore, 0) / activeCrises.length : 0;
  const forecastRows = data.forecastSignals.slice(0, 5).map((item) => ({ label: item.metricLabel, current: Number(item.currentValue), forecast: Number(item.forecastValue), low: item.lowerBound == null ? null : Number(item.lowerBound), high: item.upperBound == null ? null : Number(item.upperBound), risk: item.riskLevel }));

  return <>
    <section className="kpis executive-kpis">{data.metrics.map((metric) => <article className={`kpi kpi-${metric.status}`} key={metric.key}><div className="kpi-top"><label>{metric.label}</label><i /></div><strong>{metric.value}</strong><span className={`delta ${metric.status === "critical" ? "danger" : metric.status === "attention" ? "warn" : ""}`}>{metric.delta}</span></article>)}</section>

    <GovernancePanel />

    <section className="analytics-grid equal overview-analytics">
      <article className="card analytics-card"><div className="card-header"><div><h2>نرخ پاسخ‌گویی شهرستانی</h2><p className="muted">Resolved / Requests در داده فعلی صدای مردم</p></div><button type="button" className="text-button" onClick={() => onNavigate("citizen")}>جزئیات</button></div><LineAreaChart values={citizenRates.length ? citizenRates : [0, 0]} labels={citizenLabels} /></article>
      <article className="card analytics-card"><div className="card-header"><div><h2>ترکیب وضعیت پروژه‌ها</h2><p className="muted">نمای سریع Portfolio</p></div><button type="button" className="text-button" onClick={() => onNavigate("projects")}>پروژه‌ها</button></div><DonutChart centerLabel="پروژه" segments={[{ label: "مطابق برنامه", value: projectCounts.on_track, tone: "success" }, { label: "نیازمند توجه", value: projectCounts.attention, tone: "warning" }, { label: "بحرانی", value: projectCounts.critical, tone: "danger" }, { label: "تکمیل", value: projectCounts.complete, tone: "cyan" }]} /></article>
    </section>

    <section className="analytics-grid two-one overview-analytics">
      <article className="card analytics-card"><div className="card-header"><div><h2>نبض محورهای راهبردی استان</h2><p className="muted">مقدار فعلی در برابر Benchmark</p></div><button type="button" className="text-button" onClick={() => onNavigate("sectors")}>هوشمندی بخشی</button></div><HorizontalBarChart rows={provinceSectors.map((item) => ({ label: item.domain, value: Number(item.value), benchmark: item.benchmarkValue ? Number(item.benchmarkValue) : undefined, status: item.status }))} /></article>
      <article className="card analytics-card"><div className="card-header"><div><h2>پروفایل عملکرد دستگاه</h2><p className="muted">{topOrg?.name ?? "بدون داده"}</p></div><button type="button" className="text-button" onClick={() => onNavigate("performance")}>ارزیابی عملکرد</button></div>{orgKpis.length >= 3 ? <RadarChart values={orgKpis.map((item) => Number(item.score))} labels={orgKpis.map((item) => item.label)} /> : <div className="empty-state">KPI جزئی کافی وجود ندارد.</div>}</article>
    </section>

    <section className="analytics-grid two-one overview-analytics">
      <article className="card analytics-card"><div className="card-header"><div><h2>پیش‌بینی و هشدار زودهنگام</h2><p className="muted">Current → Forecast همراه با بازه عدم‌قطعیت</p></div><button type="button" className="text-button" onClick={() => onNavigate("forecast")}>Forecast Center</button></div><ForecastBandChart rows={forecastRows} /></article>
      <article className="card analytics-card"><div className="card-header"><div><h2>فشار رخدادهای فعال</h2><p className="muted">میانگین Impact Score بحران‌های باز/در حال پایش</p></div><button type="button" className="text-button" onClick={() => onNavigate("crisis")}>مرکز بحران</button></div><GaugeChart value={crisisImpact} label="اثر بحران" /></article>
    </section>

    <section className="analytics-grid equal overview-analytics">
      <CountyPortfolioCard counties={data.counties} onOpenComparison={() => onNavigate("benchmark")} />
      <article className="card analytics-card"><div className="card-header"><div><h2>Top Early Warnings</h2><p className="muted">ترکیب رخداد و پیش‌بینی برای توجه مدیریتی</p></div></div><div className="alert-list">{activeCrises.slice(0, 4).map((crisis) => <div className={`alert-row ${crisis.severity === "critical" ? "critical" : "attention"}`} key={crisis.id}><i /><div><h3>{crisis.title}</h3><p>{crisis.county?.name ?? "استانی"} · اثر {crisis.impactScore}/100</p></div><span>{crisis.status === "open" ? "باز" : "پایش"}</span></div>)}</div></article>
    </section>

    <section className="grid overview-grid">
      <ExecutiveBrief entries={data.brief} />
      <article className="card news-pulse"><div className="card-header"><div><h2>خبر و افکار عمومی</h2><p className="muted">آرشیو مستند + لایه هوشمندی خبر</p></div><button type="button" className="text-button" onClick={() => onNavigate("news")}>رصد خبر</button></div><div className="news-pulse-top"><strong>{data.newsArticles.length}</strong><span>محتوای رصدشده</span></div><SentimentStack positive={positive} neutral={neutral} negative={negative} /><div className="sentiment-key"><span><i className="positive" />مثبت {positive}</span><span><i className="neutral" />خنثی {neutral}</span><span><i className="negative" />منفی {negative}</span></div><div className="importance-row"><span>اهمیت محتوای اخیر</span><SparkBars values={data.newsArticles.slice(0, 10).map((item) => item.importance)} /></div></article>
      <ProvinceMap counties={data.counties} />
      <article className="card"><div className="card-header"><div><h2>پروژه‌های نیازمند پیگیری</h2><p className="muted">انحراف برنامه و عملکرد</p></div><button type="button" className="text-button" onClick={() => onNavigate("projects")}>مرکز پروژه‌ها</button></div><div className="table-scroll"><table className="table"><thead><tr><th>پروژه</th><th>شهرستان</th><th>واقعی / برنامه</th><th>وضعیت</th></tr></thead><tbody>{tracked.slice(0, 7).map((project) => <tr key={project.title}><td>{project.title}</td><td>{project.county.name}</td><td>{Number(project.actualProgress).toFixed(0)}٪ / {Number(project.plannedProgress).toFixed(0)}٪</td><td><span className={`status ${project.status === "on_track" ? "ok" : project.status === "critical" ? "risk" : "attention"}`}>{statusLabel[project.status]}</span></td></tr>)}</tbody></table></div></article>
    </section>

    <section className="ai-card enhanced-ai-card"><div><span className="section-kicker">دستیار هوشمند</span><h2>خلاصه‌ساز اجرایی</h2><p>خلاصه مدیریتی، مشکلات مهم، ریسک پروژه، صدای مردم، سخنان و تعهدات در یک سطح تصمیم‌گیری جمع می‌شوند.</p></div><button type="button" onClick={() => onNavigate("ai")}>باز کردن دستیار</button></section>
  </>;
}
