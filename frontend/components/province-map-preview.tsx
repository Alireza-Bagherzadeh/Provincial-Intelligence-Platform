"use client";

import { useState } from "react";

const counties = ["سمنان", "شاهرود", "دامغان", "گرمسار", "مهدی‌شهر", "میامی", "سرخه", "آرادان"];
const snapshots: Record<string, { focus: string; score: number }> = {
  "سمنان": { focus: "خدمات و حکمرانی دیجیتال", score: 81 },
  "شاهرود": { focus: "آب، گردشگری و پروژه‌های شرق", score: 64 },
  "دامغان": { focus: "کشاورزی، گردشگری و زیرساخت", score: 72 },
  "گرمسار": { focus: "صنعت و سرمایه‌گذاری", score: 78 },
  "مهدی‌شهر": { focus: "راه، گردشگری و خدمات", score: 74 },
  "میامی": { focus: "آب روستایی و دسترسی", score: 59 },
  "سرخه": { focus: "خدمات و توسعه محلی", score: 76 },
  "آرادان": { focus: "کشاورزی و لجستیک", score: 71 }
};

export function ProvinceMapPreview() {
  const [selected, setSelected] = useState("سمنان");
  const snapshot = snapshots[selected];
  return <section className="province-card" aria-label="پیش‌نمایش شهرستان‌های استان">
    <div className="map-card-head"><div><span>نبض استان</span><h2>نقشه هوشمند استان</h2></div><b>{snapshot.score}<small>/100 امتیاز</small></b></div>
    <div className="mini-map"><div className="map-orbit orbit-one" /><div className="map-orbit orbit-two" /><span className="map-label">{selected}</span><div className="map-focus"><small>محور شاخص</small><strong>{snapshot.focus}</strong></div></div>
    <div className="county-pills">{counties.map((county) => <button type="button" key={county} className={selected === county ? "active" : ""} onClick={() => setSelected(county)}>{county}</button>)}</div>
    <p className="map-disclaimer">نمای فعلی یک Preview تعاملی است؛ مرز GIS واقعی در فاز اتصال GeoJSON/PostGIS جایگزین می‌شود.</p>
  </section>;
}
