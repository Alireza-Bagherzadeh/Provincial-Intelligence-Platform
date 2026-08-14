import type { CountySnapshot } from "../../command/types";

function toneOf(county: CountySnapshot) {
  if (county.criticalProjectCount) return "critical";
  if (county.averageProgress < 60) return "attention";
  return "healthy";
}

export function CountyPortfolioCard({ counties, onOpenComparison }: { counties: CountySnapshot[]; onOpenComparison: () => void }) {
  const active = counties.filter((county) => county.projectCount > 0);
  const inactive = counties.filter((county) => county.projectCount === 0);
  const maxProjects = Math.max(...active.map((county) => county.projectCount), 1);

  return <article className="card county-portfolio-card">
    <div className="card-header"><div><h2>موقعیت شهرستان‌ها در سبد پروژه‌ها</h2><p className="muted">مقایسه تعداد پروژه، میانگین پیشرفت و موارد نیازمند توجه</p></div><button type="button" className="text-button" onClick={onOpenComparison}>مقایسه تعاملی</button></div>
    <div className="portfolio-legend"><span><i className="healthy" />عملکرد مطلوب</span><span><i className="attention" />نیازمند توجه</span><span><i className="critical" />مورد بحرانی</span></div>
    <div className="portfolio-plot" role="img" aria-label="نمودار موقعیت شهرستان‌ها در سبد پروژه‌ها">
      <div className="portfolio-quadrant-label top">پیشرفت بالا</div><div className="portfolio-quadrant-label bottom">نیازمند پیگیری</div>
      {active.map((county, index) => {
        const baseX = 12 + county.projectCount / maxProjects * 72;
        const spread = ((index % 3) - 1) * 7;
        const left = Math.max(9, Math.min(91, baseX + spread));
        const bottom = Math.max(10, Math.min(88, county.averageProgress));
        const size = 42 + Math.min(county.criticalProjectCount, 3) * 8;
        return <div className={`portfolio-point ${toneOf(county)}`} style={{ left: `${left}%`, bottom: `${bottom}%` }} key={county.code}>
          <span style={{ width: size, height: size }}><b>{county.name.slice(0, 1)}</b><em>{county.projectCount.toLocaleString("fa-IR")}</em></span>
          <strong>{county.name}</strong><small>{Math.round(county.averageProgress).toLocaleString("fa-IR")}٪ پیشرفت</small>
        </div>;
      })}
      <div className="portfolio-x-title">تعداد پروژه‌ها ←</div><div className="portfolio-y-title">میانگین پیشرفت ↑</div>
    </div>
    {inactive.length ? <div className="portfolio-inactive"><span>در انتظار ثبت گزارش پروژه:</span>{inactive.map((county) => <b key={county.code}>{county.name}</b>)}</div> : null}
  </article>;
}
