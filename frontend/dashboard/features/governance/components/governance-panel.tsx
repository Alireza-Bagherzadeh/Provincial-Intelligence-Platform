"use client";

import { useState } from "react";

import { deputies, governorDecisions, governorTimeline } from "../data/governance";
import type { CommandSectionId } from "../../../components/sidebar";

export function GovernancePanel({ onNavigate }: { onNavigate: (section: CommandSectionId) => void }) {
  const [selectedDeputy, setSelectedDeputy] = useState<(typeof deputies)[number] | null>(null);

  return <section className="governance-dashboard" aria-labelledby="governance-title">
    <div className="governance-section-title">
      <div>
        <span>میز کار استاندار</span>
        <h2 id="governance-title">اقدامات، تصمیم‌ها و گزارش معاونان</h2>
      </div>
      <small>آخرین به‌روزرسانی امروز، ۰۸:۱۵</small>
    </div>

    <div className="governance-summary-grid">
      <article className="card governor-brief-card">
        <div className="card-header"><div><h2>جمع‌بندی اجرایی امروز</h2><p className="muted">مخاطب: محمدجواد کولیوند، استاندار سمنان</p></div><span className="governance-live">به‌روز</span></div>
        <p>سه موضوع در بازه ۴۸ ساعت آینده نیازمند تصمیم مدیریتی است. رشد ظرفیت خورشیدی و پیگیری احیای واحدهای تولیدی، روندهای مثبت اجرایی امروز هستند.</p>
        <div className="governor-priorities">
          <div><b>۰۱</b><span>تأمین برق شهرک صنعتی گرمسار</span></div>
          <div><b>۰۲</b><span>تسریع آبرسانی شاهرود</span></div>
          <div><b>۰۳</b><span>پایش ریسک پروژه‌های عمرانی</span></div>
        </div>
      </article>

      <article className="card governor-timeline-card">
        <div className="card-header"><div><h2>تقویم اجرایی امروز</h2><p className="muted">۶ رویداد و پیگیری</p></div></div>
        <div className="governor-timeline">{governorTimeline.map(([time, title]) => <div key={`${time}-${title}`}><b>{time}</b><span>{title}</span></div>)}</div>
      </article>
    </div>

    <div className="governance-section-title deputies-title">
      <div><span>معاونت‌ها</span><h2>گزارش معاونان به استاندار</h2></div>
      <small>۴ گزارش امروز</small>
    </div>
    <div className="deputy-report-grid">{deputies.map((deputy) => <article className={`card deputy-report-card tone-${deputy.tone}`} key={deputy.key}>
      <div className="deputy-report-head"><span>گزارش امروز</span><i /></div>
      <h3>{deputy.name}</h3>
      <small>{deputy.role}</small>
      <p>{deputy.note}</p>
      <strong>{deputy.action}</strong>
      <div className="deputy-report-actions"><button type="button" onClick={() => setSelectedDeputy(deputy)}>مشاهده گزارش</button><button type="button" className="primary" onClick={() => onNavigate(deputy.panel)}>پنل اختصاصی <span>←</span></button></div>
    </article>)}</div>

    <div className="governance-section-title decisions-title">
      <div><span>کارتابل مدیریتی</span><h2>تصمیم‌های موردنیاز استاندار</h2></div>
      <small>۴ پرونده باز</small>
    </div>
    <article className="card governor-decisions-card"><div className="table-scroll"><table className="table governance-table"><thead><tr><th>موضوع</th><th>ارائه‌کننده</th><th>مهلت</th><th>وضعیت</th></tr></thead><tbody>{governorDecisions.map(([subject, owner, deadline, status]) => <tr key={subject}><td><b>{subject}</b></td><td>{owner}</td><td>{deadline}</td><td><span className={`governance-status ${status === "بحرانی" ? "critical" : "attention"}`}>{status}</span></td></tr>)}</tbody></table></div></article>

    {selectedDeputy ? <div className="governance-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedDeputy(null); }}>
      <section className="governance-modal" role="dialog" aria-modal="true" aria-labelledby="deputy-report-title">
        <header><div><span>گزارش به استاندار</span><h2 id="deputy-report-title">{selectedDeputy.name}</h2><p>{selectedDeputy.role}</p></div><button type="button" onClick={() => setSelectedDeputy(null)} aria-label="بستن گزارش">×</button></header>
        <div className="deputy-modal-summary"><p>{selectedDeputy.note} سه اقدام در مسیر اجرا قرار دارد و یک موضوع برای تصمیم سطح استاندار ثبت شده است.</p><div><span>شاخص‌های مطلوب <b>۶</b></span><span>اقدام‌های باز <b>۴</b></span><span>پرونده فوری <b>۱</b></span><span>پوشش شهرستانی <b>۹۴٪</b></span></div></div>
        <h3>گزارش‌های حوزه معاونت</h3>
        <div className="deputy-modal-reports">{selectedDeputy.reports.map((report, index) => <article key={report}><span>دوره گزارش: مرداد ۱۴۰۵</span><h4>گزارش {report}</h4><p>روندهای کلیدی، تعهدات در جریان و اقدامات دستگاه‌های همکار یکپارچه شده است.</p><b className={index === 0 ? "critical" : "positive"}>{index === 0 ? "نیازمند تصمیم اجرایی" : "روند پیگیری مطلوب"}</b></article>)}</div>
      </section>
    </div> : null}
  </section>;
}
