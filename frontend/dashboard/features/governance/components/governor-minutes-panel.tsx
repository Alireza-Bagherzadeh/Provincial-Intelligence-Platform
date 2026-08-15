"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { executiveWorkspaces, type ExecutiveWorkspaceId } from "../../executive/data/executive-workspaces";

const reportScopes: ExecutiveWorkspaceId[] = ["executive-governor", "executive-civil", "executive-economic", "executive-political", "executive-resources"];

export function GovernorMinutesPanel({ month }: { month: string }) {
  const [scope, setScope] = useState<ExecutiveWorkspaceId>("executive-governor");
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [title, setTitle] = useState("جلسه بررسی اولویت‌های اجرایی استان سمنان");
  const [date, setDate] = useState("۲۴ مرداد ۱۴۰۵");
  const [meetingNumber, setMeetingNumber] = useState("۱۴۰۵/۵۲");
  const [location, setLocation] = useState("سالن جلسات استانداری سمنان");
  const [participants, setParticipants] = useState("استاندار سمنان، معاونان استاندار، مدیران دستگاه‌های مرتبط و دبیر جلسه");
  const [summary, setSummary] = useState("پس از ارائه آخرین وضعیت شاخص‌ها و بررسی موضوعات نیازمند تصمیم، بر تسریع اقدامات بین‌دستگاهی، تعیین مسئول مشخص و گزارش نتیجه در موعد مقرر تأکید شد.");
  const workspace = executiveWorkspaces[scope];
  const reportTitle = useMemo(() => period === "daily" ? "گزارش و صورت‌جلسه روزانه" : "گزارش و صورت‌جلسه هفتگی", [period]);

  return <section className="meeting-report-page">
    <div className="meeting-report-heading no-print"><div><span>میز گزارش استاندار</span><h2>صورت‌جلسه و گزارش مدیریتی قابل چاپ</h2><p>ساخت گزارش از شاخص‌های استاندار یا هر یک از معاونت‌ها بر اساس قالب رسمی استانداری سمنان</p></div><button type="button" onClick={() => window.print()}>چاپ گزارش <span>⎙</span></button></div>
    <div className="meeting-report-layout">
      <aside className="meeting-editor card no-print">
        <div className="meeting-editor-tabs"><button type="button" className={period === "daily" ? "active" : ""} onClick={() => setPeriod("daily")}>گزارش روزانه</button><button type="button" className={period === "weekly" ? "active" : ""} onClick={() => setPeriod("weekly")}>گزارش هفتگی</button></div>
        <label><span>حوزه گزارش</span><select value={scope} onChange={(event) => setScope(event.target.value as ExecutiveWorkspaceId)}>{reportScopes.map((id) => <option value={id} key={id}>{executiveWorkspaces[id].person.role} - {executiveWorkspaces[id].person.name}</option>)}</select></label>
        <label><span>عنوان جلسه</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <div className="meeting-editor-pair"><label><span>تاریخ</span><input value={date} onChange={(event) => setDate(event.target.value)} /></label><label><span>شماره</span><input value={meetingNumber} onChange={(event) => setMeetingNumber(event.target.value)} /></label></div>
        <label><span>محل برگزاری</span><input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
        <label><span>حاضران</span><textarea rows={3} value={participants} onChange={(event) => setParticipants(event.target.value)} /></label>
        <label><span>جمع‌بندی دبیر جلسه</span><textarea rows={5} value={summary} onChange={(event) => setSummary(event.target.value)} /></label>
        <div className="meeting-editor-note">پیش‌نمایش روبه‌رو هم‌زمان با تغییر اطلاعات به‌روز می‌شود.</div>
      </aside>

      <article className="meeting-print-sheet" dir="rtl">
        <header className="official-letterhead">
          <div className="official-meta"><span>تاریخ: {date}</span><span>شماره: {meetingNumber}</span><span>پیوست: دارد</span></div>
          <div className="official-emblem"><b>باسمه تعالی</b><Image src="/images/semnan-government-letterhead.png" width={92} height={96} alt="نشان استانداری سمنان" priority /></div>
          <h2>استانداری سمنان</h2>
        </header>
        <div className="official-document-body">
          <div className="official-document-title"><span>{reportTitle}</span><h1>{title}</h1><p>{workspace.person.role} - {workspace.person.name} · دوره گزارش {month}</p></div>
          <dl className="official-meeting-details"><div><dt>محل جلسه</dt><dd>{location}</dd></div><div><dt>حاضران</dt><dd>{participants}</dd></div><div><dt>حوزه مورد بررسی</dt><dd>{workspace.title}</dd></div></dl>
          <section><h3>جمع‌بندی مدیریتی</h3><p>{workspace.brief}</p><p>{summary}</p></section>
          <section><h3>شاخص‌های مطرح‌شده در جلسه</h3><table><thead><tr><th>ردیف</th><th>شاخص</th><th>مقدار</th><th>وضعیت و تغییر</th></tr></thead><tbody>{workspace.metrics.map((metric, index) => <tr key={metric.label}><td>{(index + 1).toLocaleString("fa-IR")}</td><td>{metric.label}</td><td>{metric.value}</td><td>{metric.change}</td></tr>)}</tbody></table></section>
          <section><h3>مصوبات و اقدامات مورد توافق</h3><table><thead><tr><th>ردیف</th><th>شرح اقدام</th><th>مسئول</th><th>مهلت</th><th>پیشرفت</th></tr></thead><tbody>{workspace.actions.map((action, index) => <tr key={action.title}><td>{(index + 1).toLocaleString("fa-IR")}</td><td>{action.title}</td><td>{action.owner}</td><td>{action.due}</td><td>{action.progress.toLocaleString("fa-IR")}٪</td></tr>)}</tbody></table></section>
          <section className="official-follow-up"><h3>دستور پیگیری</h3><p>دبیر جلسه موظف است آخرین وضعیت اجرای مصوبات را در گزارش بعدی ثبت و موارد دارای انحراف را برای تصمیم استاندار اعلام کند.</p></section>
          <footer><div><span>امضای دبیر جلسه</span></div><div><span>تأیید معاون مربوطه</span></div><div><span>دکتر محمدجواد کولیوند</span><b>استاندار سمنان</b></div></footer>
        </div>
      </article>
    </div>
  </section>;
}
