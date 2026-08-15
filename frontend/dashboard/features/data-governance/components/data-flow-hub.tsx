"use client";

import { useState } from "react";

import { countyAnalytics } from "../../counties/data/county-analytics";

const nodePositions = [
  { x: 50, y: 7 }, { x: 78, y: 18 }, { x: 89, y: 49 }, { x: 77, y: 80 },
  { x: 50, y: 91 }, { x: 23, y: 80 }, { x: 11, y: 49 }, { x: 22, y: 18 },
];

const sourceBanks = [
  { label: "آب منطقه‌ای", icon: "≈" },
  { label: "شهرداری‌ها", icon: "▥" },
  { label: "شهرک صنعتی", icon: "⚙" },
  { label: "جهاد کشاورزی", icon: "⌁" },
  { label: "آموزش و فرهنگ", icon: "▤" },
  { label: "نفت و گاز", icon: "◉" },
  { label: "برق و مخابرات", icon: "ϟ" },
];

export function DataFlowHub() {
  const [selectedCode, setSelectedCode] = useState("semnan");
  const selected = countyAnalytics.find((county) => county.code === selectedCode) ?? countyAnalytics[0];

  return <section className="data-flow-section">
    <div className="data-flow-heading"><div><span>حاکمیت و یکپارچگی داده</span><h2>جریان زنده بانک‌های اطلاعاتی شهرستان‌ها به مرکز استان</h2><p>هر پیکان، دریافت داده، کنترل کیفیت و بازگشت تحلیل به شهرستان را به‌صورت زنده نمایش می‌دهد.</p></div><div className="data-flow-live"><i />جریان داده فعال</div></div>
    <div className="data-flow-layout">
      <div className="data-network-map">
        <div className="data-orbit orbit-one" /><div className="data-orbit orbit-two" /><div className="data-orbit orbit-three" />
        <svg className="data-network-lines" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="dataLineGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#258ec8" /><stop offset=".55" stopColor="var(--sg-cyan)" /><stop offset="1" stopColor="var(--sg-gold)" /></linearGradient>
            <marker id="dataArrow" markerWidth="13" markerHeight="13" refX="8" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 Z" fill="var(--sg-cyan)" /></marker>
          </defs>
          {nodePositions.map((position, index) => {
            const x = position.x * 10;
            const y = position.y * 6.5;
            return <g key={`${x}-${y}`}>
              <line className="data-flow-line-shadow" x1={x} y1={y} x2="500" y2="325" />
              <line className={`data-flow-line line-${index + 1}`} x1={x} y1={y} x2="500" y2="325" markerEnd="url(#dataArrow)" />
              <circle className={`data-packet packet-${index + 1}`} cx={x} cy={y} r="7"><animate attributeName="cx" values={`${x};500;${x}`} dur={`${3.1 + index * .2}s`} repeatCount="indefinite" /><animate attributeName="cy" values={`${y};325;${y}`} dur={`${3.1 + index * .2}s`} repeatCount="indefinite" /></circle>
            </g>;
          })}
        </svg>

        <div className="data-hub-cylinder" aria-label="مرکز حاکمیت داده استان سمنان">
          <div className="data-hub-cap"><span>مرکز یکپارچه‌سازی</span><strong>حاکمیت داده‌های استان سمنان</strong></div>
          <div className="data-hub-body"><div className="data-hub-screen"><i /><i /><i /><i /><span>استانداردسازی</span><span>کنترل کیفیت</span><span>تحلیل</span></div><small>دریافت امن · پردازش شاخص‌محور · بازگشت بینش</small></div>
          <div className="data-hub-base" />
        </div>

        {countyAnalytics.map((county, index) => <button type="button" className={`county-data-cylinder node-${index + 1} ${selectedCode === county.code ? "active" : ""}`} onClick={() => setSelectedCode(county.code)} key={county.code} aria-label={`نمایش بانک داده شهرستان ${county.name}`}>
          <span className="county-cylinder-cap">بانک داده</span><b>شهرستان {county.name}</b><small>{county.domains.length.toLocaleString("fa-IR")} گروه شاخص</small><i />
        </button>)}
      </div>

      <article className="data-source-universe card">
        <header><div><span>منابع اطلاعاتی شهرستان منتخب</span><h3>شهرستان {selected.name}</h3></div><strong>{selected.overall.toLocaleString("fa-IR")}<small>/۱۰۰</small></strong></header>
        <div className="source-orbit-map">
          <svg viewBox="0 0 500 390" preserveAspectRatio="none" aria-hidden="true">{sourceBanks.map((_, index) => { const angle = (index / sourceBanks.length) * Math.PI * 2 - Math.PI / 2; const x = 250 + Math.cos(angle) * 205; const y = 195 + Math.sin(angle) * 148; return <line key={index} x1={x} y1={y} x2="250" y2="195" />; })}</svg>
          <div className="selected-county-bank"><span>بانک تجمیعی</span><b>{selected.name}</b><i /></div>
          {sourceBanks.map((source, index) => <div className={`source-bank source-${index + 1}`} key={source.label}><i>{source.icon}</i><span>{source.label}</span><small>ارسال داده</small></div>)}
        </div>
        <p>آخرین وضعیت شاخص‌ها پس از دریافت از دستگاه‌ها، کنترل کیفیت و یکپارچه‌سازی در مرکز استان</p>
        <div className="data-county-indicators">{selected.domains.slice(0, 5).map((domain) => <div key={domain.label}><span>{domain.label}<b>{domain.value.toLocaleString("fa-IR")}</b></span><i><em style={{ width: `${domain.value}%` }} /></i></div>)}</div>
        <dl><div><dt>رکوردهای ماه جاری</dt><dd>{(selected.population % 7200 + 1200).toLocaleString("fa-IR")}</dd></div><div><dt>پوشش شاخص‌ها</dt><dd>{Math.min(99, selected.overall + 12).toLocaleString("fa-IR")}٪</dd></div><div><dt>آخرین دریافت</dt><dd>امروز، ۰۸:۱۰</dd></div></dl>
      </article>
    </div>
  </section>;
}
