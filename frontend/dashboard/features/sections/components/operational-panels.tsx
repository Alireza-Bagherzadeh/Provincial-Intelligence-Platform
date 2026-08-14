import { DonutChart, HorizontalBarChart, LineAreaChart, WaterfallChart } from "../../../components/charts";
import type { CommandCenterData } from "../../command/types";
import { MOCK_REPORTS } from "./mock-section-state";

const decisionStatus = { open: "در حال اقدام", at_risk: "در معرض ریسک", overdue: "سررسید گذشته", completed: "تکمیل‌شده" };
const reportStatus = { ready: "آماده", review: "در حال بررسی", draft: "پیش‌نویس" };

export function DecisionsPanel({ data }: { data: CommandCenterData }) {
  const overdue = data.decisions.filter((decision) => decision.status === "overdue").length;

  return <section className="panel-stack">
    <div className="section-heading">
      <div><span>پیگیری تعهدات اجرایی</span><h2>مصوبات و اقدامات</h2><p>مرور تعهدات، مهلت‌ها و میزان پیشرفت اقدامات مصوب‌شده.</p></div>
      <strong>{overdue}<small>سررسید گذشته</small></strong>
    </div>
    <div className="decision-list">{data.decisions.map((decision) => <article className="decision-card" key={decision.title}>
      <header><div><h3>{decision.title}</h3><p>{decision.owner.name} · {decision.county?.name ?? "استانی"}</p></div><span className={`status ${decision.status === "completed" ? "ok" : decision.status === "overdue" ? "risk" : "attention"}`}>{decisionStatus[decision.status]}</span></header>
      <div className="decision-meta"><span>مهلت: <b>{decision.dueDate}</b></span><span>پیشرفت: <b>{Number(decision.progress).toFixed(0)}٪</b></span></div>
      <div className="progress-track"><i style={{ width: `${decision.progress}%` }} /></div>
    </article>)}</div>
  </section>;
}

export function FinancePanel({ data }: { data: CommandCenterData }) {
  const allocated = data.budgetRecords.reduce((total, record) => total + Number(record.allocatedAmount), 0);
  const spent = data.budgetRecords.reduce((total, record) => total + Number(record.actualSpending), 0);
  const realization = allocated ? spent / allocated * 100 : 0;
  const countyRows = data.budgetRecords.map((record) => ({ label: record.county.name, value: Number(record.allocatedAmount) ? Number(record.actualSpending) / Number(record.allocatedAmount) * 100 : 0, benchmark: 85 }));

  return <section className="panel-stack">
    <div className="section-heading"><div><span>کنترل مالی</span><h2>بودجه و سرمایه‌گذاری</h2><p>پایش تخصیص، هزینه‌کرد و میزان تحقق اعتبارات در سطح استان.</p></div><strong>{Math.round(realization)}٪<small>نرخ تحقق اعتبار</small></strong></div>
    <div className="finance-summary"><article><span>اعتبار مصوب</span><b>{Math.round(allocated / 1_000_000_000)} میلیارد</b></article><article><span>هزینه‌کرد</span><b>{Math.round(spent / 1_000_000_000)} میلیارد</b></article><article><span>باقی‌مانده اعتبار</span><b>{Math.round((allocated - spent) / 1_000_000_000)} میلیارد</b></article></div>
    <div className="analytics-grid two-one">
      <article className="card analytics-card"><div className="card-header"><div><h2>تحقق بودجه به تفکیک شهرستان</h2><p className="muted">مقایسه با نرخ هدف ۸۵ درصدی استان.</p></div></div><HorizontalBarChart rows={countyRows} /></article>
      <article className="card analytics-card"><div className="card-header"><h2>ترکیب مصرف اعتبار</h2></div><DonutChart centerLabel="میلیارد" segments={[{ label: "هزینه‌شده", value: Math.round(spent / 1_000_000_000), tone: "success" }, { label: "باقی‌مانده", value: Math.max(Math.round((allocated - spent) / 1_000_000_000), 0), tone: "gold" }]} /></article>
    </div>
    <article className="card analytics-card"><div className="card-header"><div><h2>روند تخصیص تا مانده</h2><p className="muted">نمای تغییر اعتبار مصوب پس از هزینه‌کرد و مانده قابل تخصیص.</p></div><span className="source-pill">تغییرات اعتبار</span></div><WaterfallChart items={[{ label: "اعتبار", value: Math.round(allocated / 1_000_000_000) }, { label: "هزینه", value: -Math.round(spent / 1_000_000_000) }, { label: "مانده", value: Math.round((allocated - spent) / 1_000_000_000) }]} /></article>
    <div className="budget-grid">{data.budgetRecords.map((record) => {
      const rate = Number(record.allocatedAmount) ? Number(record.actualSpending) / Number(record.allocatedAmount) * 100 : 0;
      return <article className="comparison-card" key={`${record.county.name}-${record.category}`}><div><h3>{record.county.name}</h3><span>{record.category} · {record.fiscalYear}</span></div><b>{Math.round(rate)}٪</b><div className="progress-track"><i style={{ width: `${rate}%` }} /></div><small>نرخ تحقق اعتبار</small></article>;
    })}</div>
  </section>;
}

export function CitizenPanel({ data }: { data: CommandCenterData }) {
  const requests = data.citizenSignals.reduce((total, signal) => total + signal.requestCount, 0);
  const resolved = data.citizenSignals.reduce((total, signal) => total + signal.resolvedCount, 0);
  const rates = data.citizenSignals.map((signal) => signal.requestCount ? signal.resolvedCount / signal.requestCount * 100 : 0);
  const responseHours = data.citizenSignals.map((signal) => Number(signal.averageResponseHours));

  return <section className="panel-stack">
    <div className="section-heading"><div><span>پاسخ‌گویی و رضایت</span><h2>صدای مردم</h2><p>پایش درخواست‌های مردمی، نرخ پاسخ‌گویی و زمان متوسط رسیدگی.</p></div><strong>{requests ? Math.round(resolved / requests * 100) : 0}٪<small>نرخ پاسخ‌گویی</small></strong></div>
    <div className="analytics-grid equal">
      <article className="card analytics-card"><div className="card-header"><div><h2>روند نرخ پاسخ‌گویی</h2><p className="muted">مقایسه فعلی بین شهرستان‌ها</p></div></div><LineAreaChart values={rates.length ? rates : [0, 0]} labels={data.citizenSignals.map((item) => item.county.name)} /></article>
      <article className="card analytics-card"><div className="card-header"><div><h2>زمان متوسط پاسخ</h2><p className="muted">ساعت؛ مقدار کمتر بهتر است.</p></div></div><HorizontalBarChart max={Math.max(...responseHours, 72)} rows={data.citizenSignals.map((item) => ({ label: item.county.name, value: Number(item.averageResponseHours), status: Number(item.averageResponseHours) > 48 ? "critical" : Number(item.averageResponseHours) > 30 ? "attention" : "healthy" }))} /></article>
    </div>
    <div className="citizen-grid">{data.citizenSignals.map((signal) => {
      const resolution = signal.requestCount ? signal.resolvedCount / signal.requestCount * 100 : 0;
      return <article className="county-card" key={`${signal.county.name}-${signal.category}`}><header><div className={`county-orb ${Number(signal.changePercent) > 5 ? "critical" : ""}`}>{signal.county.name.slice(0, 1)}</div><div><h3>{signal.county.name}</h3><span>{signal.category}</span></div></header><dl><div><dt>درخواست</dt><dd>{signal.requestCount}</dd></div><div><dt>پاسخ</dt><dd>{signal.resolvedCount}</dd></div><div><dt>زمان متوسط</dt><dd>{Number(signal.averageResponseHours).toFixed(0)}س</dd></div></dl><div className="progress-track"><i style={{ width: `${resolution}%` }} /></div><small className={Number(signal.changePercent) > 0 ? "negative demo-note" : "positive demo-note"}>تغییر {Number(signal.changePercent) > 0 ? "+" : ""}{Number(signal.changePercent).toFixed(0)}٪</small></article>;
    })}</div>
  </section>;
}

export function ReportsPanel({ data: _data }: { data: CommandCenterData }) {
  const reports = MOCK_REPORTS;
  const ready = reports.filter((report) => report.status === "ready").length;
  const review = reports.filter((report) => report.status === "review").length;
  const draft = reports.filter((report) => report.status === "draft").length;

  return <section className="panel-stack">
    <div className="section-heading"><div><span>خروجی مدیریتی</span><h2>گزارش‌ها</h2><p>دسترسی یکپارچه به گزارش‌های مدیریتی، وضعیت بررسی و آمادگی انتشار.</p></div><strong>{reports.length}<small>گزارش ثبت‌شده</small></strong></div>
    <div className="finance-summary"><article><span>آماده انتشار</span><b>{ready.toLocaleString("fa-IR")}</b></article><article><span>در حال بررسی</span><b>{review.toLocaleString("fa-IR")}</b></article><article><span>پیش‌نویس</span><b>{draft.toLocaleString("fa-IR")}</b></article></div>
    <div className="report-list">{reports.map((report) => <article className="report-card" key={report.title}><div className="report-icon">گ</div><div><h3>{report.title}</h3><p>{report.organization?.name ?? "استانی"} · {report.periodLabel}</p></div><span className={`status ${report.status === "ready" ? "ok" : "attention"}`}>{reportStatus[report.status]}</span></article>)}</div>
  </section>;
}
