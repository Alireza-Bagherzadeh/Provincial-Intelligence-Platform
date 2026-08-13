"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./content-studio-fix.module.css";

type ContentItem = {
  id: string;
  title?: string;
  summary?: string;
  body?: string;
  kind?: string;
  category?: string;
  published_at?: string;
  source_url?: string;
  source_label?: string;
  importance?: number | string;
  tags?: string[];
  images?: string[];
  county_id?: string;
  county_id_label?: string;
  is_demo?: boolean;
};

type KindFilter = { value: string; label: string };
type LookupOption = { value: string; label: string };
type SortMode = "newest" | "oldest" | "title";
type ViewMode = "list" | "grid";
type IconName =
  | "database" | "file" | "landmark" | "megaphone" | "mic" | "cart" | "briefcase"
  | "plus" | "search" | "filter" | "list" | "grid" | "eye" | "edit" | "trash"
  | "pin" | "calendar" | "chevron-left" | "chevron-right" | "close" | "help" | "layers"
  | "refresh" | "image" | "external";

type ContentStudioProps = { onOpenStructured?: () => void };

const kindFilters: KindFilter[] = [
  { value: "all", label: "همه" },
  { value: "news", label: "خبر" },
  { value: "tourism", label: "گردشگری" },
  { value: "culture", label: "فرهنگ و میراث" },
  { value: "notice", label: "اطلاعیه" },
  { value: "speech", label: "سخنان مسئولان" },
  { value: "procurement", label: "مناقصه و خرید" },
  { value: "project", label: "پروژه" },
  { value: "crisis", label: "بحران" },
  { value: "sector", label: "بخشی" },
  { value: "investment", label: "سرمایه‌گذاری" },
  { value: "report", label: "گزارش" },
];

const statCards = [
  { kind: "all", label: "کل محتوا", icon: "layers" as IconName, tone: "cyan" },
  { kind: "news", label: "خبر", icon: "file" as IconName, tone: "blue" },
  { kind: "tourism", label: "گردشگری", icon: "landmark" as IconName, tone: "amber" },
  { kind: "notice", label: "اطلاعیه", icon: "megaphone" as IconName, tone: "violet" },
  { kind: "speech", label: "سخنان", icon: "mic" as IconName, tone: "teal" },
  { kind: "procurement", label: "مناقصه و خرید", icon: "cart" as IconName, tone: "orange" },
  { kind: "project", label: "پروژه‌ها", icon: "briefcase" as IconName, tone: "gold" },
];

const emptyForm = {
  title: "",
  summary: "",
  body: "",
  kind: "news",
  category: "اخبار استان",
  published_at: new Date().toISOString().slice(0, 10),
  source_url: "",
  source_label: "استانداری سمنان",
  county_id: "",
  importance: "3",
  tags: "",
};

function asText(value: unknown) {
  return value === undefined || value === null ? "" : String(value);
}

function kindLabel(kind?: string) {
  return kindFilters.find((item) => item.value === kind)?.label ?? "سایر";
}

function persianDate(value?: string) {
  if (!value) return "بدون تاریخ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return value;
  }
}

function isManagedImage(value?: string) {
  if (!value || typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return false;
  // Only images mirrored into our own backend media storage are shown publicly.
  // Older source-site URLs may be blocked/broken and must not inflate the image count.
  return src.includes("/media/collector/") || src.startsWith("/media/collector/");
}

function managedImages(item?: ContentItem | null) {
  return (item?.images ?? []).filter((value) => isManagedImage(value)).slice(0, 6);
}

function primaryManagedImage(item?: ContentItem | null) {
  return managedImages(item)[0] ?? "";
}

function sourceHost(value?: string) {
  if (!value) return "";
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function bodyParagraphs(value?: string) {
  const text = (value ?? "").trim();
  if (!text) return [];
  const junk = [
    /^نسخه(?:\s+آزمایشی)?$/i,
    /^[x×]$/i,
    /^پایگاه\s+مرکزی$/i,
    /^مشاهده\s+پایگاه$/i,
    /^استانداری\s+سمنان$/i,
    /^شهرستان(?:‌|\s)*ها$/i,
    /^فرمانداری\s+شهرستان/i,
    /^وضعیت\s*[:：]/i,
    /^پیشرفت\s*[:：]/i,
    /^در\s+انتظار\s+راه\s*اندازی$/i,
    /^تکمیل$/i,
  ];
  const seen = new Set<string>();
  return text
    .split(/\n{2,}|\n/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 30)
    .filter((item) => !(item.length <= 120 && junk.some((pattern) => pattern.test(item))))
    .filter((item) => {
      const key = item.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase("fa");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "database": return <svg {...common}><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>;
    case "file": return <svg {...common}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h6M9 16h6"/></svg>;
    case "landmark": return <svg {...common}><path d="M3 9l9-5 9 5"/><path d="M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16"/></svg>;
    case "megaphone": return <svg {...common}><path d="M4 12v-2l12-5v12L4 12z"/><path d="M7 13l2 6h3l-2-7"/></svg>;
    case "mic": return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/></svg>;
    case "cart": return <svg {...common}><path d="M3 4h2l2 11h10l3-8H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>;
    case "briefcase": return <svg {...common}><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5h6v2M3 12h18"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
    case "filter": return <svg {...common}><path d="M4 5h16l-6 7v5l-4 2v-7z"/></svg>;
    case "list": return <svg {...common}><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
    case "grid": return <svg {...common}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg>;
    case "eye": return <svg {...common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg>;
    case "edit": return <svg {...common}><path d="M4 20h4l10-10-4-4L4 16z"/><path d="m13 7 4 4"/></svg>;
    case "trash": return <svg {...common}><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></svg>;
    case "pin": return <svg {...common}><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
    case "chevron-left": return <svg {...common}><path d="m14 6-6 6 6 6"/></svg>;
    case "chevron-right": return <svg {...common}><path d="m10 6 6 6-6 6"/></svg>;
    case "close": return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "help": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 4 1.8c-1.1.8-1.8 1.2-1.8 2.7M12 17h.01"/></svg>;
    case "layers": return <svg {...common}><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>;
    case "refresh": return <svg {...common}><path d="M20 6v5h-5"/><path d="M18.5 15a7 7 0 1 1-.4-7.5L20 9"/></svg>;
    case "image": return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 20"/></svg>;
    case "external": return <svg {...common}><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v7H4V6h7"/></svg>;
    default: return null;
  }
}

function SafeImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return null;
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}

export function ContentStudio({ onOpenStructured }: ContentStudioProps) {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [counties, setCounties] = useState<LookupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/management?resource=news", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "خطا در دریافت محتوا");
      const nextItems = (data.items ?? []) as ContentItem[];
      setItems(nextItems);
      setCounties((data.lookups?.counties ?? []) as LookupOption[]);
      setSelected((current) => current && nextItems.some((item) => item.id === current.id) ? nextItems.find((item) => item.id === current.id) ?? nextItems[0] ?? null : nextItems[0] ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در دریافت محتوا");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => map.set(item.kind ?? "other", (map.get(item.kind ?? "other") ?? 0) + 1));
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("fa");
    const list = items.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!q) return true;
      return [item.title, item.summary, item.body, item.category, item.county_id_label, item.source_label, ...(item.tags ?? [])]
        .some((value) => asText(value).toLocaleLowerCase("fa").includes(q));
    });
    return list.sort((a, b) => {
      if (sort === "title") return asText(a.title).localeCompare(asText(b.title), "fa");
      const aDate = new Date(a.published_at ?? 0).getTime() || 0;
      const bDate = new Date(b.published_at ?? 0).getTime() || 0;
      return sort === "oldest" ? aDate - bDate : bDate - aDate;
    });
  }, [items, kind, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [kind, search, sort]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  useEffect(() => {
    if (!filtered.length) return setSelected(null);
    if (!selected || !filtered.some((item) => item.id === selected.id)) setSelected(filtered[0]);
  }, [filtered, selected]);

  function openCreate() { setEditing(null); setForm({ ...emptyForm }); setEditorOpen(true); }
  function openEdit(item: ContentItem) {
    setEditing(item);
    setForm({
      title: item.title ?? "", summary: item.summary ?? "", body: item.body ?? "", kind: item.kind ?? "news",
      category: item.category ?? "اخبار استان", published_at: item.published_at ?? new Date().toISOString().slice(0, 10),
      source_url: item.source_url ?? "", source_label: item.source_label ?? "استانداری سمنان", county_id: item.county_id ?? "",
      importance: asText(item.importance || 3), tags: Array.isArray(item.tags) ? item.tags.join("، ") : "",
    });
    setEditorOpen(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/management", {
        method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ resource: "news", id: editing?.id ?? null, data: form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "ذخیره انجام نشد");
      setEditorOpen(false); setEditing(null); setForm({ ...emptyForm });
      setMessage(editing ? "محتوا با موفقیت ویرایش شد." : "محتوا با موفقیت ثبت شد.");
      await load(); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "خطا در ذخیره محتوا"); }
    finally { setSaving(false); }
  }

  async function remove(item: ContentItem) {
    if (!window.confirm(`«${item.title ?? "این محتوا"}» حذف شود؟`)) return;
    const response = await fetch("/api/management", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ resource: "news", id: item.id }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "حذف انجام نشد");
    if (selected?.id === item.id) setSelected(null);
    setReaderOpen(false); await load(); router.refresh();
  }

  const selectedTags = (selected?.tags ?? []).slice(0, 8);
  const selectedImages = managedImages(selected);
  const selectedCover = primaryManagedImage(selected);
  const selectedParagraphs = bodyParagraphs(selected?.body);

  return <section className={`studio-page ${styles.scope}`} dir="rtl">
    <header className="studio-page-head">
      <div className="studio-title-wrap">
        <div className="studio-title-icon"><Icon name="database" size={25} /></div>
        <div><span className="studio-eyebrow">CONTENT MANAGEMENT</span><h1>مدیریت داده</h1><p>اخبار و محتوای استان؛ جمع‌آوری مستقیم از منبع، دسته‌بندی موضوعی و ویرایش داخل همین داشبورد</p></div>
      </div>
      <div className="studio-head-actions">
        {onOpenStructured ? <button type="button" className="studio-quiet-btn" onClick={onOpenStructured}><Icon name="database" size={16}/> داده‌های ساختاریافته</button> : null}
        <button type="button" className="studio-icon-btn" aria-label="راهنمای صفحه" title="محتوا با Collector محلی جمع‌آوری می‌شود"><Icon name="help" size={18}/></button>
      </div>
    </header>

    <div className="studio-stats">{statCards.map((card) => {
      const value = card.kind === "all" ? items.length : counts.get(card.kind) ?? 0;
      return <button type="button" className={`studio-stat tone-${card.tone} ${kind === card.kind ? "is-active" : ""}`} onClick={() => setKind(card.kind)} key={card.kind}>
        <span className="studio-stat-icon"><Icon name={card.icon} size={21}/></span><span><small>{card.label}</small><strong>{value.toLocaleString("fa-IR")}</strong><em>مورد</em></span>
      </button>;
    })}</div>

    <div className="studio-controls">
      <div className="studio-actions-row">
        <button type="button" className="studio-primary" onClick={openCreate}><Icon name="plus" size={18}/> افزودن محتوا</button>
        <button type="button" className="studio-secondary" onClick={() => void load()} disabled={loading}><Icon name="refresh" size={17}/>{loading ? "در حال به‌روزرسانی" : "به‌روزرسانی لیست"}</button>
        <label className="studio-search"><Icon name="search" size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو در عنوان، متن کامل، موضوع و برچسب‌ها..." /></label>
        <button type="button" className="studio-filter-btn" aria-label="فیلتر"><Icon name="filter" size={18}/></button>
      </div>
      <div className="studio-tabs" role="tablist" aria-label="نوع محتوا">{kindFilters.slice(0, 9).map((item) => <button type="button" role="tab" aria-selected={kind === item.value} className={kind === item.value ? "active" : ""} onClick={() => setKind(item.value)} key={item.value}>{item.label}</button>)}</div>
    </div>

    {message ? <div className="studio-message">{message}</div> : null}

    <div className="studio-workspace">
      <section className="studio-preview-panel">
        <div className="studio-panel-title"><div><span>پیش‌نمایش محتوا</span><small>CONTENT PREVIEW</small></div></div>
        {!selected ? <div className="studio-empty"><Icon name="file" size={26}/><b>{loading ? "در حال دریافت محتوا..." : "محتوایی برای نمایش وجود ندارد"}</b></div> : <>
          <div className={`studio-preview-hero ${selectedCover ? "with-image" : "text-only"}`}>
            {selectedCover ? <div className="studio-preview-media"><SafeImage src={selectedCover} alt={selected.title || "تصویر نمونه"} className="studio-preview-image" /></div> : null}
            <div className="studio-preview-copy">
              <span className={`studio-kind-badge kind-${selected.kind ?? "other"}`}>{kindLabel(selected.kind)}</span>
              <h2>{selected.title || "بدون عنوان"}</h2>
              <div className="studio-preview-meta"><span><Icon name="pin" size={14}/>{selected.county_id_label || "کل استان"}</span><span><Icon name="calendar" size={14}/>{persianDate(selected.published_at)}</span><span>{selected.category || "عمومی"}</span></div>
            </div>
          </div>

          <div className="studio-preview-section"><span>خلاصه</span><p>{selected.summary || (selected.body ?? "").slice(0, 520) || "برای این محتوا خلاصه‌ای ثبت نشده است."}</p></div>
          <div className="studio-preview-section tags"><span>برچسب‌ها</span><div>{selectedTags.length ? selectedTags.map((tag) => <b key={tag}>{tag}</b>) : <b>بدون برچسب</b>}</div></div>
          <div className="studio-preview-actions"><button type="button" className="danger" onClick={() => void remove(selected)}><Icon name="trash" size={16}/> حذف</button><button type="button" onClick={() => openEdit(selected)}><Icon name="edit" size={16}/> ویرایش</button><button type="button" className="primary" onClick={() => setReaderOpen(true)}><Icon name="eye" size={17}/> مشاهده کامل</button></div>
        </>}
      </section>

      <section className="studio-list-panel">
        <div className="studio-list-head"><div><span>لیست محتوا</span><small>{filtered.length.toLocaleString("fa-IR")} مورد</small></div><div className="studio-list-tools">
          <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="مرتب‌سازی"><option value="newest">جدیدترین</option><option value="oldest">قدیمی‌ترین</option><option value="title">عنوان</option></select>
          <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="نمای لیستی"><Icon name="list" size={17}/></button><button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="نمای شبکه‌ای"><Icon name="grid" size={16}/></button>
        </div></div>
        {loading ? <div className="studio-empty"><span className="studio-loader"/><b>در حال دریافت محتوا...</b></div> : null}
        {!loading && paged.length === 0 ? <div className="studio-empty"><Icon name="search" size={26}/><b>نتیجه‌ای پیدا نشد</b><span>فیلتر یا عبارت جستجو را تغییر بده.</span></div> : null}
        <div className={`studio-list ${viewMode === "grid" ? "is-grid" : ""}`}>{paged.map((item) => {
          const itemCover = primaryManagedImage(item);
          return <article className={`studio-list-item no-ai ${itemCover ? "has-thumb" : "no-thumb"} ${selected?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}>
            {itemCover ? <div className="studio-list-thumb"><SafeImage src={itemCover} alt={item.title || "تصویر نمونه"} className="studio-list-thumb-image" /></div> : null}
            <div className="studio-list-copy"><div className="studio-item-topline"><span className={`studio-kind-badge kind-${item.kind ?? "other"}`}>{kindLabel(item.kind)}</span><time>{persianDate(item.published_at)}</time></div><h3>{item.title || "بدون عنوان"}</h3><div className="studio-item-location"><span>{item.county_id_label || "کل استان"}</span><i>•</i><span>{item.category || "عمومی"}</span></div><p>{item.summary || bodyParagraphs(item.body)[0] || "بدون خلاصه"}</p></div>
          </article>;
        })}</div>
        <footer className="studio-pagination"><span>نمایش {filtered.length ? ((page - 1) * pageSize + 1).toLocaleString("fa-IR") : "۰"} تا {Math.min(page * pageSize, filtered.length).toLocaleString("fa-IR")} از {filtered.length.toLocaleString("fa-IR")} مورد</span><div><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><Icon name="chevron-right" size={16}/></button>{Array.from({ length: Math.min(3, totalPages) }, (_, index) => index + 1).map((value) => <button type="button" className={page === value ? "active" : ""} onClick={() => setPage(value)} key={value}>{value.toLocaleString("fa-IR")}</button>)}{totalPages > 4 ? <span>…</span> : null}{totalPages > 3 ? <button type="button" className={page === totalPages ? "active" : ""} onClick={() => setPage(totalPages)}>{totalPages.toLocaleString("fa-IR")}</button> : null}<button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><Icon name="chevron-left" size={16}/></button></div></footer>
      </section>
    </div>

    {editorOpen ? <div className="studio-modal-backdrop" onMouseDown={() => { setEditorOpen(false); setEditing(null); }}><div className="studio-modal studio-editor" onMouseDown={(event) => event.stopPropagation()}><header><div><span>{editing ? "EDIT CONTENT" : "NEW CONTENT"}</span><h2>{editing ? "ویرایش محتوا" : "افزودن محتوا"}</h2></div><button type="button" onClick={() => { setEditorOpen(false); setEditing(null); }}><Icon name="close" size={18}/></button></header><form className="studio-editor-form" onSubmit={save}>
      <label className="wide"><span>عنوان</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label><span>نوع محتوا</span><select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{kindFilters.filter((item) => item.value !== "all").map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>
      <label><span>موضوع</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
      <label><span>تاریخ انتشار</span><input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></label>
      <label><span>شهرستان</span><select value={form.county_id} onChange={(e) => setForm({ ...form, county_id: e.target.value })}><option value="">کل استان</option>{counties.map((county) => <option value={county.value} key={county.value}>{county.label}</option>)}</select></label>
      <label><span>اهمیت</span><input type="number" min="1" max="5" value={form.importance} onChange={(e) => setForm({ ...form, importance: e.target.value })} /></label>
      <label className="wide"><span>خلاصه</span><textarea rows={4} required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
      <label className="wide"><span>متن کامل</span><textarea rows={13} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
      <label className="wide"><span>لینک منبع</span><input dir="ltr" type="url" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} /></label>
      <label><span>نام منبع</span><input value={form.source_label} onChange={(e) => setForm({ ...form, source_label: e.target.value })} /></label>
      <label className="wide"><span>برچسب‌ها</span><input value={form.tags} placeholder="گردشگری، شاهرود، طبیعت" onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
      <div className="studio-editor-actions"><button type="button" onClick={() => { setEditorOpen(false); setEditing(null); }}>انصراف</button><button type="submit" className="primary" disabled={saving}>{saving ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ثبت محتوا"}</button></div>
    </form></div></div> : null}

    {readerOpen && selected ? <div className="studio-modal-backdrop" onMouseDown={() => setReaderOpen(false)}><article className="studio-modal studio-reader article-reader" onMouseDown={(event) => event.stopPropagation()}><header><div><span className={`studio-kind-badge kind-${selected.kind ?? "other"}`}>{kindLabel(selected.kind)}</span><h2>{selected.title || "بدون عنوان"}</h2></div><button type="button" onClick={() => setReaderOpen(false)}><Icon name="close" size={18}/></button></header>
      <div className="studio-reader-meta"><span>{selected.source_label || "استانداری سمنان"}</span><span>{selected.county_id_label || "کل استان"}</span><span>{persianDate(selected.published_at)}</span><span>{selected.category || "عمومی"}</span>{selectedImages.length ? <span>{selectedImages.length.toLocaleString("fa-IR")} تصویر</span> : null}</div>
      {selectedImages.length ? <div className="studio-reader-gallery is-primary"><b>تصاویر مطلب</b><div>{selectedImages.map((image, index) => <SafeImage src={image} alt={`${selected.title || "مطلب"} - تصویر ${index + 1}`} key={image} />)}</div></div> : null}
      {selected.summary ? <div className="studio-reader-summary">{selected.summary}</div> : null}
      <div className="studio-reader-body">{selectedParagraphs.length ? selectedParagraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>) : <p>متن کامل این مطلب هنوز ثبت نشده است.</p>}</div>
      {selected.source_url ? <a className="studio-source-link" href={selected.source_url} target="_blank" rel="noreferrer"><Icon name="external" size={15}/> مشاهده منبع اصلی</a> : null}
    </article></div> : null}
  </section>;
}
