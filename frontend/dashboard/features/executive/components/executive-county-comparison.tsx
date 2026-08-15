"use client";

import { useMemo, useState } from "react";

import { countyNames } from "../../counties/data/county-analytics";
import type { ExecutiveWorkspace } from "../data/executive-workspaces";

function domainValue(base: number, countyCode: string, index: number) {
  const countyIndex = countyNames.findIndex((county) => county.code === countyCode);
  const offset = ((countyIndex + 2) * (index + 3) * 7) % 19 - 9;
  return Math.max(38, Math.min(94, base + offset));
}

export function ExecutiveCountyComparison({ workspace, month }: { workspace: ExecutiveWorkspace; month: string }) {
  const [firstCounty, setFirstCounty] = useState("semnan");
  const [secondCounty, setSecondCounty] = useState("shahroud");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const firstName = countyNames.find((county) => county.code === firstCounty)?.name ?? "سمنان";
  const secondName = countyNames.find((county) => county.code === secondCounty)?.name ?? "شاهرود";
  const values = useMemo(() => workspace.domains.map((domain, index) => ({
    label: domain.title,
    first: domainValue(domain.score, firstCounty, index),
    second: domainValue(domain.score, secondCounty, index),
  })), [firstCounty, secondCounty, workspace]);
  const chartWidth = 760;
  const chartHeight = 220;
  const chartPoint = (value: number, index: number) => ({ x: 45 + index * (chartWidth - 90) / Math.max(1, values.length - 1), y: 20 + (100 - value) * (chartHeight - 45) / 100 });

  return <article className="card executive-county-comparison">
    <div className="executive-comparison-head"><div><span>گزارش مقایسه‌ای شهرستان‌ها</span><h2>مقایسه شاخص‌های حوزه {workspace.person.role}</h2><p>{month} · امتیاز استانداردشده از صد</p></div><div className="executive-chart-switch"><button type="button" className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>نمودار میله‌ای</button><button type="button" className={chartType === "line" ? "active" : ""} onClick={() => setChartType("line")}>نمودار خطی</button></div></div>
    <div className="executive-comparison-controls"><label><span>شهرستان اول</span><select value={firstCounty} onChange={(event) => setFirstCounty(event.target.value)}>{countyNames.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select></label><label><span>شهرستان دوم</span><select value={secondCounty} onChange={(event) => setSecondCounty(event.target.value)}>{countyNames.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select></label><div className="executive-compare-legend"><span><i />{firstName}</span><span><i className="second" />{secondName}</span></div></div>
    {chartType === "bar" ? <div className="executive-grouped-chart">{values.map((item) => <div className="executive-group" key={item.label}><div className="executive-group-bars"><span style={{ height: `${item.first}%` }}><b>{item.first.toLocaleString("fa-IR")}</b></span><span className="second" style={{ height: `${item.second}%` }}><b>{item.second.toLocaleString("fa-IR")}</b></span></div><small>{item.label}</small></div>)}</div> : <div className="executive-compare-line"><svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`مقایسه خطی ${firstName} و ${secondName}`}>
      {[25, 50, 75, 100].map((tick) => <line key={tick} x1="35" x2={chartWidth - 20} y1={20 + (100 - tick) * (chartHeight - 45) / 100} y2={20 + (100 - tick) * (chartHeight - 45) / 100} />)}
      <polyline className="first" points={values.map((item, index) => { const point = chartPoint(item.first, index); return `${point.x},${point.y}`; }).join(" ")} />
      <polyline className="second" points={values.map((item, index) => { const point = chartPoint(item.second, index); return `${point.x},${point.y}`; }).join(" ")} />
      {values.map((item, index) => { const first = chartPoint(item.first, index); const second = chartPoint(item.second, index); return <g key={item.label}><circle className="first" cx={first.x} cy={first.y} r="4" /><circle className="second" cx={second.x} cy={second.y} r="4" /></g>; })}
    </svg><div>{values.map((item) => <span key={item.label}>{item.label}</span>)}</div></div>}
  </article>;
}
