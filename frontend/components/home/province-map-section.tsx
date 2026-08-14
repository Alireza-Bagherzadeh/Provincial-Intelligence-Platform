"use client";

import { useMemo, useState } from "react";
import { SemnanMapGraphic } from "../maps/semnan-map-graphic";
import { publicCounties } from "./data";
import { Icon } from "./icons";

export function ProvinceMapSection() {
  const [selectedCode, setSelectedCode] = useState("semnan");
  const selected = useMemo(() => publicCounties.find((county) => county.code === selectedCode) ?? publicCounties[3], [selectedCode]);
  const totalProjects = publicCounties.reduce((sum, county) => sum + county.projectCount, 0);

  return <section className="province-section section-pad" id="province">
    <div className="page-shell">
      <div className="section-heading split-heading">
        <div><span className="kicker">یک استان، هشت شهرستان</span><h2>سمنان در یک نگاه</h2></div>
        <p>از دروازه‌های غربی گرمسار تا پهنه‌های شرقی میامی؛ تصویر یکپارچه استان برای شناخت ظرفیت‌ها، رصد پروژه‌ها و تصمیم‌سازی شواهدمحور.</p>
      </div>
      <div className="public-map-layout">
        <div className="public-map-card">
          <div className="map-topline"><span><Icon name="map" /> نقشه تعاملی شهرستان‌ها</span><span className="live-label"><i /> به‌روزرسانی پیوسته</span></div>
          <SemnanMapGraphic counties={publicCounties} selectedCode={selectedCode} onSelect={setSelectedCode} className="public-semnan-svg" />
          <div className="map-county-tabs" aria-label="انتخاب شهرستان">
            {publicCounties.map((county) => <button key={county.code} className={county.code === selectedCode ? "active" : ""} type="button" onClick={() => setSelectedCode(county.code)}>{county.name}</button>)}
          </div>
        </div>
        <aside className="county-insight" aria-live="polite">
          <span className="county-number">۰{publicCounties.findIndex((county) => county.code === selectedCode) + 1}</span>
          <div><span className="kicker">شهرستان منتخب</span><h3>{selected.name}</h3><p>نمای شهرستانی از پروژه‌های پیشران و وضعیت پیشرفت اجرایی؛ درگاه ورود به اطلاعات دقیق‌تر دستگاه‌ها و بخش‌ها.</p></div>
          <dl>
            <div><dt>پروژه فعال</dt><dd>{selected.projectCount}</dd></div>
            <div><dt>پیشرفت میانگین</dt><dd>{Math.round(selected.averageProgress)}٪</dd></div>
            <div><dt>نیازمند توجه</dt><dd>{selected.criticalProjectCount}</dd></div>
          </dl>
          <div className="county-progress"><span style={{ width: `${selected.averageProgress}%` }} /></div>
          <a className="text-link" href="#projects">مشاهده پروژه‌های شهرستان <Icon name="arrow" /></a>
        </aside>
      </div>
      <div className="province-facts">
        <div><b>۸</b><span>شهرستان در شبکه استان</span></div>
        <div><b>{totalProjects}</b><span>پروژه پیشران در حال پایش</span></div>
        <div><b>۹۷٪</b><span>پوشش داده شهرستانی</span></div>
        <div><b>۲۴/۷</b><span>رصد شاخص‌های اجرایی</span></div>
      </div>
    </div>
  </section>;
}

