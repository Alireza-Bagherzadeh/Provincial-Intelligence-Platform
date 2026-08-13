import type { ExecutiveBriefItem } from "../features/overview/data/overview";

const severityByKind: Record<ExecutiveBriefItem["kind"], string> = { risk: "critical", citizen: "warning", report: "", sector: "warning", commitment: "warning", procurement: "warning", crisis: "critical", forecast: "critical" };

export function ExecutiveBrief({ entries }: { entries: ExecutiveBriefItem[] }) {
  return <article className="card"><div className="card-header"><h2>آنچه امروز باید بدانید</h2><button className="text-button">مشاهدهٔ همه</button></div><div className="brief">{entries.map((entry)=><div className="brief-item" key={entry.title}><i className={`severity ${severityByKind[entry.kind]}`} /><p>{entry.title}</p><span>{entry.actionLabel}</span></div>)}</div></article>;
}
