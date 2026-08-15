"use client";

import { useState } from "react";

import type { CommandSectionId } from "../../../components/sidebar";
import type { ExecutiveStatus, ExecutiveWorkspace as ExecutiveWorkspaceData } from "../data/executive-workspaces";
import { ExecutiveCountyComparison } from "./executive-county-comparison";
import { toPersianDigits } from "../../../../lib/persian-numbers";

const statusLabels: Record<ExecutiveStatus, string> = {
  healthy: "مطلوب",
  attention: "نیازمند توجه",
  critical: "فوری",
};

function TrendChart({ workspace }: { workspace: ExecutiveWorkspaceData }) {
  const width = 720;
  const height = 220;
  const insetX = 34;
  const insetY = 24;
  const usableWidth = width - insetX * 2;
  const usableHeight = height - insetY * 2;
  const point = (value: number, index: number, length: number) => ({
    x: insetX + (index * usableWidth) / Math.max(1, length - 1),
    y: insetY + usableHeight - (Math.max(0, Math.min(100, value)) / 100) * usableHeight,
  });

  return <div className="executive-trend-chart">
    <div className="executive-chart-legend">
      {workspace.trends.map((series) => <span key={series.label}><i className={`tone-${series.status}`} />{series.label}</span>)}
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="روند شش‌ماهه شاخص‌های مدیریتی">
      {[0, 25, 50, 75, 100].map((value) => {
        const y = insetY + usableHeight - value / 100 * usableHeight;
        return <g key={value}><line className="executive-chart-grid" x1={insetX} x2={width - insetX} y1={y} y2={y} /><text x={width - 4} y={y + 3}>{value}</text></g>;
      })}
      {workspace.trends.map((series) => {
        const points = series.values.map((value, index) => point(value, index, series.values.length));
        return <g key={series.label} className={`executive-series tone-${series.status}`}>
          <polyline points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
          {points.map(({ x, y }, index) => <circle key={`${series.label}-${index}`} cx={x} cy={y} r="4"><title>{`${series.label}: ${series.values[index]}`}</title></circle>)}
        </g>;
      })}
    </svg>
    <div className="executive-chart-periods">{workspace.periods.map((period) => <span key={period}>{period}</span>)}</div>
  </div>;
}

export function ExecutiveWorkspace({ workspace, onNavigate, month, selectedCountyName }: { workspace: ExecutiveWorkspaceData; onNavigate: (section: CommandSectionId) => void; month: string; selectedCountyName: string }) {
  const [activeHorizon, setActiveHorizon] = useState(0);
  const horizon = workspace.horizons[activeHorizon];
  const isGovernor = workspace.id === "executive-governor";

  return <section className="executive-workspace" aria-labelledby={`${workspace.id}-title`}>
    <article className="executive-identity-card">
      <div className="executive-identity-person">
        <span className="executive-person-avatar">{workspace.person.initials}</span>
        <div>
          <span>{workspace.eyebrow}</span>
          <h2>{workspace.person.honorific ? `${workspace.person.honorific} ` : ""}{workspace.person.name}</h2>
          <p>{workspace.person.role}</p>
        </div>
      </div>
      <div className="executive-identity-copy">
        <span>نمای تصمیم‌یار امروز</span>
        <h2 id={`${workspace.id}-title`}>{workspace.title}</h2>
        <p>{workspace.subtitle}</p>
      </div>
      <div className="executive-timestamp"><i /><span>{selectedCountyName === "همه شهرستان‌ها" ? month : `${selectedCountyName} · ${month}`}</span><b>۰۸:۱۵</b></div>
    </article>

    {workspace.confidentialityNote ? <div className="executive-privacy-note"><span aria-hidden="true">◈</span><p>{workspace.confidentialityNote}</p></div> : null}
    {workspace.id === "executive-governor" ? <div className="executive-governor-tools"><div><span>گزارش رسمی استاندار</span><b>ساخت صورت‌جلسه روزانه یا هفتگی با شاخص‌های هر معاونت</b></div><button type="button" onClick={() => onNavigate("governor-minutes")}>ساخت و چاپ صورت‌جلسه <span>←</span></button></div> : null}

    <div className="executive-metric-grid">
      <button type="button" className="executive-metric executive-metric-link tone-attention" onClick={() => onNavigate("role-decisions")}>
        <div><span>کل مصوبات حوزه</span><i /></div>
        <strong>{toPersianDigits(workspace.actions.length)}</strong>
        <small>مشاهده کارتابل اختصاصی ←</small>
      </button>
      {workspace.metrics.map((metric) => <article className={`executive-metric tone-${metric.status}`} key={metric.label}>
        <div><span>{metric.label}</span><i /></div>
        <strong>{metric.value}</strong>
        <small>{metric.change}</small>
      </article>)}
    </div>

    <div className="executive-primary-grid">
      <article className="card executive-daily-brief">
        <header><div><span>خلاصه هوشمند مدیریتی</span><h2>آنچه امروز باید بدانید</h2></div><b>روزانه</b></header>
        <p>{workspace.brief}</p>
        <div className="executive-brief-priorities">
          {workspace.risks.slice(0, 3).map((risk, index) => <div key={risk.title}><b>{toPersianDigits(String(index + 1).padStart(2, "0"))}</b><span>{risk.title}<small>{risk.owner} · {risk.deadline}</small></span></div>)}
        </div>
        <button type="button" onClick={() => onNavigate("ai")}>گفت‌وگو با دستیار هوشمند <span>←</span></button>
      </article>

      <article className="card executive-outlook-card">
        <header><div><span>پیش‌بینی مدیریتی</span><h2>افق‌های تصمیم‌گیری</h2></div></header>
        <div className="executive-horizon-tabs" role="tablist" aria-label="انتخاب افق پیش‌بینی">
          {workspace.horizons.map((item, index) => <button type="button" role="tab" aria-selected={activeHorizon === index} className={activeHorizon === index ? "active" : ""} key={item.label} onClick={() => setActiveHorizon(index)}>{item.label}</button>)}
        </div>
        <div className={`executive-horizon-result tone-${horizon.status}`}>
          <span>{horizon.headline}</span>
          <strong>{horizon.value}</strong>
          <small>{statusLabels[horizon.status]}</small>
        </div>
        <div className="executive-horizon-meter"><i style={{ width: horizon.status === "critical" ? "84%" : horizon.status === "attention" ? "62%" : "38%" }} /></div>
        <p>این برآورد با تغییر داده‌های روزانه بازتنظیم می‌شود و برای اولویت‌بندی اقدام مدیریتی استفاده خواهد شد.</p>
      </article>
    </div>

    <article className="card executive-trend-card">
      <div className="card-header"><div><h2>روند شاخص‌های کلیدی در شش ماه اخیر</h2><p className="muted">نمای مقایسه‌ای برای تشخیص جهت حرکت حوزه مدیریتی</p></div><button type="button" className="text-button" onClick={() => onNavigate("role-reports")}>گزارش کامل حوزه</button></div>
      <TrendChart workspace={workspace} />
    </article>

    <ExecutiveCountyComparison workspace={workspace} month={month} />

    <div className="executive-section-heading"><div><span>حوزه‌های تحت مسئولیت</span><h2>نمای عملیاتی اختصاصی</h2></div><small>{workspace.domains.length} حوزه فعال</small></div>
    <div className="executive-domain-grid">
      {workspace.domains.map((domain) => <article className={`card executive-domain-card tone-${domain.status}`} key={domain.title}>
        <header><div><span>{statusLabels[domain.status]}</span><h3>{domain.title}</h3></div><strong>{domain.score}<small>/۱۰۰</small></strong></header>
        <p>{domain.description}</p>
        <div className="executive-domain-progress"><i style={{ width: `${domain.score}%` }} /></div>
        <div className="executive-domain-footer"><span>{domain.signal}</span><button type="button" onClick={() => onNavigate(isGovernor ? domain.relatedSection : "role-reports")}>مشاهده جزئیات ←</button></div>
      </article>)}
    </div>

    <div className="executive-secondary-grid">
      <article className="card executive-risks-card">
        <div className="card-header"><div><h2>{workspace.id === "executive-governor" ? "۱۰ مسئله پرریسک امروز" : "مسائل اولویت‌دار حوزه"}</h2><p className="muted">مرتب‌شده بر اساس فوریت تصمیم و اثر استانی</p></div><button type="button" className="text-button" onClick={() => onNavigate(isGovernor ? "alerts" : "role-decisions")}>{isGovernor ? "مرکز هشدار" : "پیگیری حوزه"}</button></div>
        <div className="executive-risk-list">
          {workspace.risks.map((risk, index) => <div className={`tone-${risk.status}`} key={risk.title}>
            <b>{toPersianDigits(String(index + 1).padStart(2, "0"))}</b><i /><span><strong>{risk.title}</strong><small>{risk.area} · {risk.owner}</small></span><em>{risk.deadline}</em>
          </div>)}
        </div>
      </article>

      <article className="card executive-actions-card">
        <div className="card-header"><div><h2>کارتابل اقدام و تصمیم</h2><p className="muted">پیگیری‌های دارای مالک، موعد و درصد پیشرفت</p></div><button type="button" className="text-button" onClick={() => onNavigate("role-decisions")}>همه مصوبات حوزه</button></div>
        <div className="executive-action-list">
          {workspace.actions.map((action) => <div key={action.title} className={`tone-${action.status}`}>
            <header><span><i />{statusLabels[action.status]}</span><small>{action.due}</small></header>
            <h3>{action.title}</h3>
            <p>مسئول پیگیری: {action.owner}</p>
            <div><i style={{ width: `${action.progress}%` }} /><b>{action.progress}٪</b></div>
          </div>)}
        </div>
      </article>
    </div>
  </section>;
}
