import type { CommandCenterData } from "../../command/types";

const statusLabel = { on_track: "مطابق برنامه", attention: "نیازمند توجه", critical: "بحرانی", complete: "تکمیل‌شده" };

export function MonitoringPanel({ data }: { data: CommandCenterData }) {
  const measured = data.counties.filter((county) => county.projectCount > 0);
  const provinceAverage = measured.length ? measured.reduce((total, county) => total + county.averageProgress, 0) / measured.length : 0;
  return <section className="panel-stack">
    <div className="section-heading"><div><span>مقایسه شهرستان‌ها</span><h2>رصد عملکرد استان</h2><p>پیشرفت شهرستان در مقایسه با میانگین استان؛ محاسبه‌شده از پروژه‌های ثبت‌شده.</p></div><strong>{Math.round(provinceAverage)}٪<small>میانگین استان</small></strong></div>
    <div className="comparison-grid">{data.counties.map((county) => <article className="comparison-card" key={county.code}><div><h3>{county.name}</h3><span>{county.projectCount ? `${county.projectCount} پروژه` : "فاقد پروژه ثبت‌شده"}</span></div><b>{county.projectCount ? `${Math.round(county.averageProgress)}٪` : "—"}</b><div className="dual-progress"><i style={{ width: `${county.averageProgress}%` }} /><em style={{ right: `${provinceAverage}%` }} title="میانگین استان" /></div><small>{county.criticalProjectCount ? `${county.criticalProjectCount} مورد بحرانی` : "بدون هشدار بحرانی"}</small></article>)}</div>
  </section>;
}

export function ProjectsPanel({ data }: { data: CommandCenterData }) {
  return <section className="panel-stack"><div className="section-heading"><div><span>پایش برنامه و عملکرد</span><h2>پروژه‌های استان</h2><p>مرور پیشرفت، انحراف از برنامه و وضعیت پروژه‌های اولویت‌دار.</p></div><strong>{data.projects.length}<small>پروژه ثبت‌شده</small></strong></div><article className="card"><div className="table-scroll"><table className="table rich-table"><thead><tr><th>عنوان پروژه</th><th>شهرستان</th><th>دستگاه مسئول</th><th>برنامه</th><th>عملکرد</th><th>انحراف</th><th>وضعیت</th></tr></thead><tbody>{data.projects.map((project) => { const variance = Number(project.actualProgress) - Number(project.plannedProgress); return <tr key={project.title}><td><b>{project.title}</b></td><td>{project.county.name}</td><td>{project.responsibleOrganization}</td><td>{Number(project.plannedProgress).toFixed(0)}٪</td><td>{Number(project.actualProgress).toFixed(0)}٪</td><td className={variance < 0 ? "negative" : "positive"}>{variance > 0 ? "+" : ""}{variance.toFixed(0)}٪</td><td><span className={`status ${project.status === "on_track" ? "ok" : project.status === "critical" ? "risk" : "attention"}`}>{statusLabel[project.status]}</span></td></tr>; })}</tbody></table></div></article></section>;
}

export function CountiesPanel({ data }: { data: CommandCenterData }) {
  return <section className="panel-stack"><div className="section-heading"><div><span>پرونده شهرستان‌ها</span><h2>وضعیت هشت شهرستان استان</h2><p>خلاصه وضعیت پروژه‌ها، میانگین پیشرفت و موارد نیازمند توجه در هر شهرستان.</p></div><strong>{data.counties.length}<small>شهرستان</small></strong></div><div className="county-grid">{data.counties.map((county) => <article className="county-card" key={county.code}><header><div className={`county-orb ${county.criticalProjectCount ? "critical" : ""}`}>{county.name.slice(0, 1)}</div><div><h3>{county.name}</h3><span>پرونده عملکردی</span></div></header><dl><div><dt>پروژه‌ها</dt><dd>{county.projectCount}</dd></div><div><dt>پیشرفت میانگین</dt><dd>{county.projectCount ? `${Math.round(county.averageProgress)}٪` : "—"}</dd></div><div><dt>بحرانی</dt><dd>{county.criticalProjectCount}</dd></div></dl><div className="progress-track"><i style={{ width: `${county.averageProgress}%` }} /></div></article>)}</div></section>;
}

export function OrganizationsPanel({ data }: { data: CommandCenterData }) {
  return <section className="panel-stack"><div className="section-heading"><div><span>پایش دستگاه‌ها</span><h2>دستگاه‌های اجرایی</h2><p>مقایسه امتیاز عملکرد و میزان تحقق برنامه‌های دستگاه‌های اجرایی.</p></div><strong>{data.organizations.length}<small>دستگاه تحت پایش</small></strong></div>{data.organizations.length ? <div className="organization-grid">{data.organizations.map((organization) => { const score = Number(organization.performanceScore); return <article className="card" key={organization.code}><div className="card-header"><h2>{organization.name}</h2><span className={`status ${score >= 80 ? "ok" : "attention"}`}>{score >= 80 ? "مطلوب" : "نیازمند بهبود"}</span></div><strong className="large-number">{Math.round(score)}٪</strong><p className="muted">امتیاز عملکرد ثبت‌شده</p><div className="progress-track"><i style={{ width: `${score}%` }} /></div></article>; })}</div> : <div className="empty-state">هنوز اطلاعاتی برای دستگاه‌های اجرایی ثبت نشده است.</div>}</section>;
}

export function AlertsPanel({ data }: { data: CommandCenterData }) {
  return <section className="panel-stack"><div className="section-heading"><div><span>مرکز توجه مدیریتی</span><h2>هشدارهای فعال</h2><p>هشدارهای ایجادشده بر اساس انحراف پروژه‌ها از برنامه و شاخص‌های عملکردی.</p></div><strong>{data.alerts.length}<small>هشدار باز</small></strong></div>{data.alerts.length ? <div className="alert-list">{data.alerts.map((alert) => <article className={`alert-row ${alert.severity}`} key={alert.id}><i /><div><h3>{alert.title}</h3><p>{alert.entityLabel}</p></div><span>{alert.severity === "critical" ? "بحرانی" : "نیازمند توجه"}</span></article>)}</div> : <div className="empty-state success">در حال حاضر هشدار فعالی ثبت نشده است.</div>}</section>;
}
