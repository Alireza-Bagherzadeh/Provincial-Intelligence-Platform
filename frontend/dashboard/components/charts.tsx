import type { CSSProperties } from "react";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0));

export function LineAreaChart({ values, labels = [] }: { values: number[]; labels?: string[] }) {
  const width = 520;
  const height = 190;
  const pad = 18;
  const safe = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const min = Math.min(...safe, 0);
  const max = Math.max(...safe, 100);
  const span = Math.max(max - min, 1);
  const points = safe.map((value, index) => {
    const x = pad + (index / (safe.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;
  return <div className="svg-chart-wrap">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="نمودار روند خطی">
      {[25, 50, 75].map((tick) => <line key={tick} x1={pad} x2={width - pad} y1={height - pad - tick / 100 * (height - pad * 2)} y2={height - pad - tick / 100 * (height - pad * 2)} className="chart-gridline" />)}
      <polygon points={area} className="area-fill" />
      <polyline points={line} className="line-stroke" />
      {points.map(([x, y], index) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="4" className="line-dot" /><title>{`${labels[index] ?? index + 1}: ${safe[index].toFixed(0)}`}</title></g>)}
    </svg>
    {labels.length ? <div className="axis-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div> : null}
  </div>;
}

export type DonutSegment = { label: string; value: number; tone?: "success" | "warning" | "danger" | "cyan" | "gold" };

const toneColor = { success: "#6fc393", warning: "#e1ac58", danger: "#d97171", cyan: "#62c6c9", gold: "#d7ae61" };

function ChartEmptyState({ label = "هنوز داده‌ای برای این نمودار ثبت نشده است." }: { label?: string }) {
  return <div className="chart-empty"><span>بدون داده</span><p>{label}</p><small>از بخش «مدیریت داده» رکورد اضافه کن.</small></div>;
}

export function DonutChart({ segments, centerLabel }: { segments: DonutSegment[]; centerLabel: string }) {
  const rawTotal = segments.reduce((sum, item) => sum + Math.max(item.value, 0), 0);
  if (rawTotal <= 0) return <ChartEmptyState label={`داده‌ای برای ${centerLabel} ثبت نشده است.`} />;
  const total = rawTotal;
  let cursor = 0;
  const stops = segments.map((segment, index) => {
    const start = cursor;
    cursor += Math.max(segment.value, 0) / total * 100;
    return `${toneColor[segment.tone ?? (["success", "warning", "danger", "cyan", "gold"] as const)[index % 5]]} ${start}% ${cursor}%`;
  });
  const style = { background: `conic-gradient(${stops.join(",")})` } as CSSProperties;
  return <div className="donut-layout">
    <div className="donut" style={style}><div className="donut-hole"><b>{total.toLocaleString("fa-IR")}</b><span>{centerLabel}</span></div></div>
    <div className="donut-legend">{segments.map((segment, index) => <div key={segment.label}><i style={{ background: toneColor[segment.tone ?? (["success", "warning", "danger", "cyan", "gold"] as const)[index % 5]] }} /><span>{segment.label}</span><b>{segment.value.toLocaleString("fa-IR")}</b></div>)}</div>
  </div>;
}

export function HorizontalBarChart({ rows, max = 100 }: { rows: Array<{ label: string; value: number; benchmark?: number; status?: string }>; max?: number }) {
  if (!rows.length) return <ChartEmptyState />;
  return <div className="horizontal-bars">{rows.map((row) => {
    const width = clamp(row.value / max * 100);
    const benchmark = row.benchmark == null ? null : clamp(row.benchmark / max * 100);
    return <div className="hbar-row" key={row.label}>
      <div className="hbar-label"><span>{row.label}</span><b>{row.value.toFixed(0)}</b></div>
      <div className="hbar-track"><i className={row.status === "critical" ? "risk" : row.status === "attention" ? "warn" : "ok"} style={{ width: `${width}%` }} />{benchmark != null ? <em style={{ right: `${benchmark}%` }} title={`مقدار مرجع ${row.benchmark}`} /> : null}</div>
    </div>;
  })}</div>;
}

export function RadarChart({ values, labels }: { values: number[]; labels: string[] }) {
  if (!values.length) return <ChartEmptyState />;
  const size = 260;
  const center = size / 2;
  const radius = 88;
  const count = Math.max(values.length, 3);
  const point = (index: number, ratio: number) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / count);
    return [center + Math.cos(angle) * radius * ratio, center + Math.sin(angle) * radius * ratio] as const;
  };
  const polygon = values.map((value, index) => point(index, clamp(value) / 100).join(",")).join(" ");
  return <div className="radar-wrap"><svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="نمودار راداری ارزیابی عملکرد">
    {[.25, .5, .75, 1].map((ratio) => <polygon key={ratio} points={Array.from({ length: count }, (_, index) => point(index, ratio).join(",")).join(" ")} className="radar-grid" />)}
    {Array.from({ length: count }, (_, index) => { const [x, y] = point(index, 1); return <line key={index} x1={center} y1={center} x2={x} y2={y} className="radar-axis" />; })}
    <polygon points={polygon} className="radar-value" />
    {values.map((value, index) => { const [x, y] = point(index, clamp(value) / 100); return <circle key={index} cx={x} cy={y} r="4" className="radar-dot"><title>{`${labels[index]}: ${value.toFixed(0)}`}</title></circle>; })}
    {labels.map((label, index) => { const [x, y] = point(index, 1.18); return <text key={label} x={x} y={y} className="radar-label">{label}</text>; })}
  </svg></div>;
}

export function Heatmap({ rows, columns, values }: { rows: string[]; columns: string[]; values: number[][] }) {
  if (!rows.length || !columns.length) return <ChartEmptyState />;
  const gridStyle = { gridTemplateColumns: `minmax(85px, 1fr) repeat(${Math.max(columns.length, 1)}, minmax(68px, 1fr))` } as CSSProperties;
  return <div className="heatmap-shell">
    <div className="heatmap-head" style={gridStyle}><span />{columns.map((column) => <b key={column}>{column}</b>)}</div>
    {rows.map((row, rowIndex) => <div className="heatmap-row" style={gridStyle} key={row}><strong>{row}</strong>{columns.map((column, colIndex) => {
      const value = clamp(values[rowIndex]?.[colIndex] ?? 0);
      const style = { "--heat": `${value}%` } as CSSProperties;
      return <span key={column} className={`heat-cell ${value < 60 ? "low" : value < 75 ? "mid" : "high"}`} style={style}><b>{value.toFixed(0)}</b><small>{column}</small></span>;
    })}</div>)}
  </div>;
}

export function SparkBars({ values }: { values: number[] }) {
  if (!values.length) return <div className="spark-bars spark-bars-empty" aria-label="داده‌ای ثبت نشده است" />;
  const max = Math.max(...values, 1);
  return <div className="spark-bars" aria-label="نمودار میله‌ای کوچک">{values.map((value, index) => <i key={index} style={{ height: `${Math.max(value / max * 100, 5)}%` }} title={String(value)} />)}</div>;
}

export function SentimentStack({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  const rawTotal = positive + neutral + negative;
  if (rawTotal <= 0) return <ChartEmptyState label="داده‌ای برای تحلیل لحن ثبت نشده است." />;
  const total = rawTotal;
  return <div className="sentiment-stack" title={`مثبت ${positive}، خنثی ${neutral}، منفی ${negative}`}>
    <i className="positive" style={{ width: `${positive / total * 100}%` }} />
    <i className="neutral" style={{ width: `${neutral / total * 100}%` }} />
    <i className="negative" style={{ width: `${negative / total * 100}%` }} />
  </div>;
}

export function GaugeChart({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const safe = clamp(value / Math.max(max, 1) * 100);
  return <div className="gauge-wrap" aria-label={`${label}: ${value}`}>
    <div className="gauge" style={{ background: `conic-gradient(from 270deg, #62c6c9 0 ${safe / 2}%, rgba(255,255,255,.08) ${safe / 2}% 50%, transparent 50% 100%)` }}>
      <div className="gauge-hole"><strong>{Math.round(value).toLocaleString("fa-IR")}</strong><span>{label}</span></div>
    </div>
  </div>;
}

export function ForecastBandChart({ rows }: { rows: Array<{ label: string; current: number; forecast: number; low?: number | null; high?: number | null; risk?: string }> }) {
  if (!rows.length) return <ChartEmptyState />;
  const max = Math.max(...rows.flatMap((row) => [row.current, row.forecast, row.high ?? 0]), 1);
  return <div className="forecast-chart">{rows.map((row) => {
    const current = clamp(row.current / max * 100);
    const forecast = clamp(row.forecast / max * 100);
    const low = clamp((row.low ?? Math.min(row.current, row.forecast)) / max * 100);
    const high = clamp((row.high ?? Math.max(row.current, row.forecast)) / max * 100);
    return <div className="forecast-row" key={row.label}>
      <div className="forecast-label"><span>{row.label}</span><b>{row.current.toFixed(0)} → {row.forecast.toFixed(0)}</b></div>
      <div className="forecast-track"><i className="forecast-band" style={{ right: `${low}%`, width: `${Math.max(high - low, 1)}%` }} /><i className="forecast-current" style={{ right: `${current}%` }} /><i className={`forecast-target ${row.risk === "critical" ? "risk" : row.risk === "attention" ? "warn" : "ok"}`} style={{ right: `${forecast}%` }} /></div>
    </div>;
  })}</div>;
}

export function ScatterPlot({ points, xLabel, yLabel }: { points: Array<{ label: string; x: number; y: number; size?: number; risk?: string }>; xLabel: string; yLabel: string }) {
  if (!points.length) return <ChartEmptyState />;
  const width = 520, height = 250, pad = 34;
  const maxX = Math.max(...points.map((p) => p.x), 1);
  const maxY = Math.max(...points.map((p) => p.y), 1);
  return <div className="svg-chart-wrap scatter-wrap"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${xLabel} در برابر ${yLabel}`}>
    {[25, 50, 75].map((tick) => <g key={tick}><line x1={pad} x2={width-pad} y1={height-pad-tick/100*(height-pad*2)} y2={height-pad-tick/100*(height-pad*2)} className="chart-gridline" /><line y1={pad} y2={height-pad} x1={pad+tick/100*(width-pad*2)} x2={pad+tick/100*(width-pad*2)} className="chart-gridline" /></g>)}
    {points.map((point) => {
      const cx=pad+point.x/maxX*(width-pad*2); const cy=height-pad-point.y/maxY*(height-pad*2); const r=5+Math.min(point.size ?? 0, 20)/4;
      return <g key={point.label}><circle cx={cx} cy={cy} r={r} className={`scatter-dot ${point.risk ?? ""}`}><title>{`${point.label}: ${xLabel} ${point.x.toFixed(0)}، ${yLabel} ${point.y.toFixed(0)}`}</title></circle><text x={cx} y={cy-r-5} className="scatter-label">{point.label}</text></g>;
    })}
    <text x={width/2} y={height-4} className="axis-title">{xLabel}</text><text x="10" y={height/2} transform={`rotate(-90 10 ${height/2})`} className="axis-title">{yLabel}</text>
  </svg></div>;
}

export function WaterfallChart({ items }: { items: Array<{ label: string; value: number }> }) {
  if (!items.length) return <ChartEmptyState />;
  const totals: number[]=[]; let running=0; for (const item of items) { running += item.value; totals.push(running); }
  const max = Math.max(...totals.map(Math.abs), ...items.map((i) => Math.abs(i.value)), 1);
  return <div className="waterfall">{items.map((item, index) => {
    const previous=index ? totals[index-1] : 0; const current=totals[index]; const top=Math.max(previous,current); const bottom=Math.min(previous,current);
    return <div className="waterfall-col" key={item.label}><div className="waterfall-stage"><i className={item.value >= 0 ? "positive" : "negative"} style={{ height: `${Math.max(Math.abs(item.value)/max*76, 4)}%`, bottom: `${Math.max(bottom/max*76, 0)}%` }} /><em style={{ bottom: `${Math.max(current/max*76, 0)}%` }} /></div><b>{item.value > 0 ? "+" : ""}{item.value.toFixed(0)}</b><span>{item.label}</span></div>;
  })}</div>;
}
