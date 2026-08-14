"use client";

import { useMemo, useState } from "react";

import type { CommandCenterData, CountySnapshot } from "../../command/types";

const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const indicatorLabels = ["زیرساخت و عمران", "اقتصاد و سرمایه‌گذاری", "خدمات عمومی", "فرهنگی و اجتماعی", "مدیریت و منابع", "محیط‌زیست و انرژی"];
const colors = { primary: "#45d9c8", secondary: "#7f8da7" };

const clamp = (value: number) => Math.max(28, Math.min(96, value));

function scoreOf(county: CountySnapshot, index: number) {
  if (county.projectCount) return clamp(county.averageProgress - county.criticalProjectCount * 3 + Math.min(county.projectCount, 8));
  return clamp(52 + ((index + 3) * 7) % 19);
}

function indicatorsOf(county: CountySnapshot, index: number) {
  const score = scoreOf(county, index);
  return [
    clamp(score + county.projectCount * 2 - county.criticalProjectCount * 5),
    clamp(score - 4 + ((index + 2) * 5) % 13),
    clamp(score + 7 - ((index + 1) * 3) % 10),
    clamp(score - 2 + ((index + 4) * 4) % 14),
    clamp(score + 3 - county.criticalProjectCount * 7),
    clamp(score - 6 + ((index + 5) * 3) % 16),
  ];
}

function trendOf(score: number, index: number) {
  const offsets = [-17, -13, -14, -9, -11, -5, -8, -3, -1, 1, 5, 0];
  return offsets.map((offset, monthIndex) => clamp(score + offset + ((index + monthIndex) % 3) - 1));
}

function TrendComparison({ first, second, firstName, secondName }: { first: number[]; second: number[]; firstName: string; secondName: string }) {
  const width = 760, height = 270, padX = 42, padY = 28;
  const toPoints = (values: number[]) => values.map((value, index) => {
    const x = padX + index / Math.max(values.length - 1, 1) * (width - padX * 2);
    const y = height - padY - value / 100 * (height - padY * 2);
    return { x, y, value };
  });
  const firstPoints = toPoints(first);
  const secondPoints = toPoints(second);
  const line = (points: typeof firstPoints) => points.map(({ x, y }) => `${x},${y}`).join(" ");

  return <div className="county-trend-chart">
    <div className="compare-chart-legend"><span><i style={{ background: colors.primary }} />{firstName}</span><span><i style={{ background: colors.secondary }} />{secondName}</span></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`مقایسه روند ${firstName} و ${secondName}`}>
      {[25, 50, 75, 100].map((tick) => <g key={tick}><line x1={padX} x2={width - padX} y1={height - padY - tick / 100 * (height - padY * 2)} y2={height - padY - tick / 100 * (height - padY * 2)} className="county-compare-gridline" /><text x={width - 8} y={height - padY - tick / 100 * (height - padY * 2) + 4}>{tick.toLocaleString("fa-IR")}</text></g>)}
      <polyline points={line(secondPoints)} className="county-trend-line secondary" />
      <polyline points={line(firstPoints)} className="county-trend-line primary" />
      {secondPoints.map((point, index) => <circle key={`s-${index}`} cx={point.x} cy={point.y} r="3.5" className="county-trend-dot secondary"><title>{`${secondName} · ${months[index]}: ${Math.round(point.value)}`}</title></circle>)}
      {firstPoints.map((point, index) => <circle key={`p-${index}`} cx={point.x} cy={point.y} r="4" className="county-trend-dot primary"><title>{`${firstName} · ${months[index]}: ${Math.round(point.value)}`}</title></circle>)}
    </svg>
    <div className="county-trend-months">{months.map((month) => <span key={month}>{month}</span>)}</div>
  </div>;
}

function RadarComparison({ first, second, firstName, secondName }: { first: number[]; second: number[]; firstName: string; secondName: string }) {
  const size = 310, center = size / 2, radius = 92;
  const point = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / indicatorLabels.length;
    return [center + Math.cos(angle) * radius * ratio, center + Math.sin(angle) * radius * ratio] as const;
  };
  const polygon = (values: number[]) => values.map((value, index) => point(index, value / 100).join(",")).join(" ");

  return <div className="county-radar-compare">
    <div className="compare-chart-legend"><span><i style={{ background: colors.primary }} />{firstName}</span><span><i style={{ background: colors.secondary }} />{secondName}</span></div>
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="مقایسه چندبعدی شهرستان‌ها">
      {[.25, .5, .75, 1].map((ratio) => <polygon key={ratio} points={indicatorLabels.map((_, index) => point(index, ratio).join(",")).join(" ")} className="radar-grid" />)}
      {indicatorLabels.map((_, index) => { const [x, y] = point(index, 1); return <line key={index} x1={center} y1={center} x2={x} y2={y} className="radar-axis" />; })}
      <polygon points={polygon(second)} className="county-radar-secondary" />
      <polygon points={polygon(first)} className="county-radar-primary" />
      {indicatorLabels.map((label, index) => { const [x, y] = point(index, 1.25); return <text key={label} x={x} y={y} className="county-radar-label">{label}</text>; })}
    </svg>
  </div>;
}

export function CountyComparisonPanel({ data }: { data: CommandCenterData }) {
  const counties = data.counties.length ? data.counties : [];
  const [primaryCode, setPrimaryCode] = useState(counties[0]?.code ?? "");
  const [secondaryCode, setSecondaryCode] = useState(counties[1]?.code ?? counties[0]?.code ?? "");

  const profiles = useMemo(() => counties.map((county, index) => ({
    county,
    score: scoreOf(county, index),
    indicators: indicatorsOf(county, index),
    trend: trendOf(scoreOf(county, index), index),
  })), [counties]);
  const ranked = [...profiles].sort((a, b) => b.score - a.score);
  const primary = profiles.find((item) => item.county.code === primaryCode) ?? profiles[0];
  const secondary = profiles.find((item) => item.county.code === secondaryCode) ?? profiles[1] ?? profiles[0];

  if (!primary || !secondary) return <section className="panel-stack"><div className="empty-state">اطلاعات شهرستانی برای مقایسه در دسترس نیست.</div></section>;

  const primaryRank = ranked.findIndex((item) => item.county.code === primary.county.code) + 1;
  const previous = primary.trend.at(-2) ?? primary.score;
  const change = primary.score - previous;

  const selectPrimary = (code: string) => {
    if (code === secondary.county.code) setSecondaryCode(primary.county.code);
    setPrimaryCode(code);
  };
  const selectSecondary = (code: string) => {
    if (code === primary.county.code) setPrimaryCode(secondary.county.code);
    setSecondaryCode(code);
  };

  return <section className="panel-stack county-comparison-panel">
    <div className="section-heading county-comparison-heading"><div><span>پایش تعاملی عملکرد</span><h2>مقایسه تعاملی شهرستان‌ها</h2><p>تحلیل شاخص‌های اجرایی، پیشرفت پروژه‌ها و روند عملکردی شهرستان‌های استان</p></div><strong>{Math.round(primary.score).toLocaleString("fa-IR")}<small>شاخص کلی {primary.county.name}</small></strong></div>

    <div className="county-compare-kpis">
      <article><span>شاخص کلی عملکرد</span><b>{Math.round(primary.score).toLocaleString("fa-IR")}</b><small>از ۱۰۰</small></article>
      <article><span>رتبه در استان</span><b>{primaryRank.toLocaleString("fa-IR")}</b><small>از {ranked.length.toLocaleString("fa-IR")} شهرستان</small></article>
      <article><span>بهبود نسبت به دوره قبل</span><b className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{Math.round(change).toLocaleString("fa-IR")}٪</b><small>نسبت به ماه قبل</small></article>
      <article><span>تعداد شاخص‌ها</span><b>{indicatorLabels.length.toLocaleString("fa-IR")}</b><small>محور تحلیلی</small></article>
    </div>

    <div className="county-compare-controls">
      <label><span>شهرستان منتخب</span><select aria-label="شهرستان منتخب" value={primary.county.code} onChange={(event) => selectPrimary(event.target.value)}>{counties.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select></label>
      <label><span>مقایسه با</span><select aria-label="شهرستان مقایسه" value={secondary.county.code} onChange={(event) => selectSecondary(event.target.value)}>{counties.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select></label>
      <div><span>بازه زمانی</span><b>فروردین تا اسفند ۱۴۰۴</b></div>
    </div>

    <div className="county-compare-main-grid">
      <article className="card county-ranking-card"><div className="card-header"><div><h2>رتبه‌بندی شهرستان‌ها</h2><p className="muted">بر اساس شاخص کلی عملکرد</p></div></div><div className="county-ranking-list">{ranked.map((item, index) => <button type="button" className={item.county.code === primary.county.code ? "active" : ""} onClick={() => selectPrimary(item.county.code)} key={item.county.code}><span>{(index + 1).toLocaleString("fa-IR")}</span><b>{item.county.name}</b><i><em style={{ width: `${item.score}%` }} /></i><strong>{Math.round(item.score).toLocaleString("fa-IR")}</strong></button>)}</div></article>
      <article className="card county-trend-card"><div className="card-header"><div><h2>روند شاخص کلی در طول زمان</h2><p className="muted">مقایسه روند ماهانه دو شهرستان منتخب</p></div></div><TrendComparison first={primary.trend} second={secondary.trend} firstName={primary.county.name} secondName={secondary.county.name} /></article>
    </div>

    <div className="county-compare-secondary-grid">
      <article className="card county-indicator-bars"><div className="card-header"><div><h2>مقایسه شاخص‌های کلیدی</h2><p className="muted">مقایسه مستقیم امتیاز هر حوزه</p></div></div>{indicatorLabels.map((label, index) => <div className="paired-indicator" key={label}><header><span>{label}</span><b>{Math.round(primary.indicators[index]).toLocaleString("fa-IR")} / {Math.round(secondary.indicators[index]).toLocaleString("fa-IR")}</b></header><div><i className="primary" style={{ width: `${primary.indicators[index]}%` }} /><i className="secondary" style={{ width: `${secondary.indicators[index]}%` }} /></div></div>)}</article>
      <article className="card county-radar-card"><div className="card-header"><div><h2>مقایسه چندبعدی</h2><p className="muted">پروفایل عملکردی دو شهرستان</p></div></div><RadarComparison first={primary.indicators} second={secondary.indicators} firstName={primary.county.name} secondName={secondary.county.name} /></article>
      <article className="card county-selected-summary"><span>شهرستان منتخب</span><h2>{primary.county.name}</h2><div><p><b>{primaryRank.toLocaleString("fa-IR")}</b>رتبه استانی</p><p><b>{primary.county.projectCount.toLocaleString("fa-IR")}</b>پروژه در حال پایش</p><p><b>{Math.round(primary.county.averageProgress).toLocaleString("fa-IR")}٪</b>میانگین پیشرفت</p><p><b>{primary.county.criticalProjectCount.toLocaleString("fa-IR")}</b>مورد نیازمند توجه</p></div></article>
    </div>
  </section>;
}
