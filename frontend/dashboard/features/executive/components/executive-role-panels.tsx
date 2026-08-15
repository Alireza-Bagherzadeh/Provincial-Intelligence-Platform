"use client";

import { toPersianDigits } from "../../../../lib/persian-numbers";
import type { ExecutiveStatus, ExecutiveWorkspace } from "../data/executive-workspaces";

const statusLabels: Record<ExecutiveStatus, string> = {
  healthy: "در مسیر اجرا",
  attention: "نیازمند پیگیری",
  critical: "فوری",
};

function RolePanelHeader({ workspace, eyebrow, month }: { workspace: ExecutiveWorkspace; eyebrow: string; month: string }) {
  return <header className="role-panel-hero">
    <div className="role-panel-person"><span>{workspace.person.initials}</span><div><small>{eyebrow}</small><h2>{workspace.person.name}</h2><p>{workspace.person.role}</p></div></div>
    <div className="role-panel-period"><small>دوره گزارش</small><strong>{month}</strong></div>
  </header>;
}

export function ExecutiveDecisionsPanel({ workspace, month }: { workspace: ExecutiveWorkspace; month: string }) {
  const urgent = workspace.actions.filter((action) => action.status === "critical").length;
  const averageProgress = Math.round(workspace.actions.reduce((sum, action) => sum + action.progress, 0) / Math.max(1, workspace.actions.length));

  return <section className="role-panel-page">
    <RolePanelHeader workspace={workspace} eyebrow="کارتابل اختصاصی مصوبات" month={month} />
    <div className="role-panel-summary">
      <article><span>کل مصوبات حوزه</span><strong>{toPersianDigits(workspace.actions.length)}</strong><small>فقط مصوبات این مدیر</small></article>
      <article><span>مصوبات فوری</span><strong>{toPersianDigits(urgent)}</strong><small>نیازمند تصمیم نزدیک</small></article>
      <article><span>میانگین پیشرفت</span><strong>{toPersianDigits(averageProgress)}٪</strong><small>در دوره انتخاب‌شده</small></article>
    </div>
    <article className="card role-decisions-card">
      <div className="card-header"><div><h2>مصوبات و اقدام‌های {workspace.person.role}</h2><p className="muted">این فهرست بر اساس مالکیت حوزه‌ای محدود شده و مصوبات سایر معاونت‌ها را نمایش نمی‌دهد.</p></div><span className="role-access-badge">دسترسی اختصاصی</span></div>
      <div className="role-decision-table">
        <div className="role-decision-row role-decision-head"><span>عنوان مصوبه</span><span>مسئول پیگیری</span><span>موعد</span><span>وضعیت</span><span>پیشرفت</span></div>
        {workspace.actions.map((action, index) => <div className={`role-decision-row tone-${action.status}`} key={action.title}>
          <span><i>{toPersianDigits(index + 1)}</i><b>{action.title}</b></span>
          <span>{action.owner}</span>
          <span>{action.due}</span>
          <span><em>{statusLabels[action.status]}</em></span>
          <span><small><i style={{ width: `${action.progress}%` }} /></small><b>{toPersianDigits(action.progress)}٪</b></span>
        </div>)}
      </div>
    </article>
  </section>;
}

export function ExecutiveReportsPanel({ workspace, month, selectedCountyName }: { workspace: ExecutiveWorkspace; month: string; selectedCountyName: string }) {
  return <section className="role-panel-page">
    <RolePanelHeader workspace={workspace} eyebrow="گزارش تحلیلی اختصاصی" month={month} />
    <article className="card role-report-overview">
      <div className="card-header"><div><h2>تصویر عملکرد {selectedCountyName}</h2><p className="muted">شاخص‌های مجاز حوزه {workspace.person.role} در {month}</p></div><span className="role-access-badge">گزارش حوزه‌ای</span></div>
      <div className="role-report-metrics">{workspace.metrics.map((metric) => <div className={`tone-${metric.status}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.change}</small></div>)}</div>
    </article>
    <div className="role-report-grid">
      <article className="card role-domain-chart"><div className="card-header"><div><h2>امتیاز حوزه‌های تحت مسئولیت</h2><p className="muted">مقایسه بر مبنای شاخص ترکیبی از ۱۰۰</p></div></div><div>{workspace.domains.map((domain) => <div key={domain.title}><span>{domain.title}<b>{toPersianDigits(domain.score)}</b></span><i><em className={`tone-${domain.status}`} style={{ width: `${domain.score}%` }} /></i></div>)}</div></article>
      <article className="card role-trend-table"><div className="card-header"><div><h2>روند شش‌ماهه</h2><p className="muted">آخرین مقدار ثبت‌شده برای هر شاخص</p></div></div><div>{workspace.trends.map((trend) => <div key={trend.label}><span><i className={`tone-${trend.status}`} />{trend.label}</span>{trend.values.map((value, index) => <b key={`${trend.label}-${index}`} style={{ height: `${Math.max(18, value)}%` }} title={`${workspace.periods[index]}: ${toPersianDigits(value)}`} />)}<strong>{toPersianDigits(trend.values.at(-1) ?? 0)}</strong></div>)}</div><footer>{workspace.periods.map((period) => <span key={period}>{period}</span>)}</footer></article>
    </div>
  </section>;
}
