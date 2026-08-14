"use client";

import { useMemo, useState } from "react";

import type { CountySnapshot } from "../features/command/types";
import { provinceGeometry } from "../features/gis/data/province-geometry";

const layers = [
  { id: "projects", label: "پروژه‌ها" },
  { id: "alerts", label: "هشدارها" },
  { id: "progress", label: "پیشرفت" }
] as const;

export function ProvinceMap({ counties, expanded = false }: { counties: CountySnapshot[]; expanded?: boolean }) {
  const initialCode = counties.find((county) => county.code === "semnan")?.code ?? counties[0]?.code ?? "semnan";
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [activeLayers, setActiveLayers] = useState<string[]>(layers.map((layer) => layer.id));
  const selected = useMemo(() => counties.find((county) => county.code === selectedCode) ?? counties[0], [counties, selectedCode]);

  const toggleLayer = (layer: string) => setActiveLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  const chooseCounty = (code: string) => setSelectedCode(code);

  return <article className={`card province-map-card ${expanded ? "expanded" : ""}`}>
    <div className="card-header">
      <div><h2>نقشه تعاملی استان سمنان</h2><span className="map-caption">مرور وضعیت شهرستان‌ها، پروژه‌ها و موارد نیازمند توجه.</span></div>
      <div className="layer-switches">{layers.map((layer) => <button type="button" key={layer.id} onClick={() => toggleLayer(layer.id)} className={activeLayers.includes(layer.id) ? "active" : ""} aria-pressed={activeLayers.includes(layer.id)}>{layer.label}</button>)}</div>
    </div>

    <div className="semnan-map-shell">
      <div className="county-list" aria-label="انتخاب شهرستان">
        {provinceGeometry.map((geometry) => <button type="button" key={geometry.code} onClick={() => chooseCounty(geometry.code)} className={selectedCode === geometry.code ? "active" : ""}><i />{geometry.label}</button>)}
      </div>
      <svg className="semnan-svg" viewBox="0 0 1000 500" role="img" aria-label="نقشه شهرستان‌های استان سمنان">
        <g className="province-shadow" transform="translate(8 8)">{provinceGeometry.map((county) => <path key={county.code} d={county.path} />)}</g>
        {provinceGeometry.map((geometry) => {
          const county = counties.find((item) => item.code === geometry.code);
          const classNames = [
            "county-shape",
            selectedCode === geometry.code ? "selected" : "",
            activeLayers.includes("alerts") && county?.criticalProjectCount ? "critical" : "",
            activeLayers.includes("projects") && !county?.projectCount ? "no-data" : ""
          ].filter(Boolean).join(" ");
          return <g key={geometry.code} role="button" tabIndex={0} aria-label={`شهرستان ${geometry.label}`} aria-pressed={selectedCode === geometry.code} onClick={() => chooseCounty(geometry.code)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") chooseCounty(geometry.code); }} onMouseEnter={() => chooseCounty(geometry.code)}>
            <path className={classNames} d={geometry.path} />
            <text className="county-label" x={geometry.labelX} y={geometry.labelY}>{geometry.label}</text>
            {activeLayers.includes("progress") && county?.projectCount ? <text className="county-value" x={geometry.labelX} y={geometry.labelY + 25}>{Math.round(county.averageProgress)}٪</text> : null}
          </g>;
        })}
      </svg>
    </div>

    {selected ? <section className="map-drawer" aria-live="polite">
      <div><span>شهرستان انتخاب‌شده</span><h3>{selected.name}</h3><p>خلاصه وضعیت عملکردی</p></div>
      <div className="map-stats">
        <span><b>{selected.projectCount}</b> پروژه</span>
        <span><b>{selected.criticalProjectCount}</b> هشدار بحرانی</span>
        <span><b>{selected.projectCount ? `${Math.round(selected.averageProgress)}٪` : "—"}</b> پیشرفت میانگین</span>
      </div>
      <div className="progress-track"><i style={{ width: `${selected.averageProgress}%` }} /></div>
    </section> : <div className="empty-state">داده‌ای برای شهرستان‌ها دریافت نشد.</div>}
  </article>;
}
