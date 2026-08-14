"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentStudio } from "./content-studio";

type Option = { value: string; label: string };
type Lookups = { counties: Option[]; organizations: Option[] };
type FieldType = "text" | "textarea" | "number" | "date" | "url" | "select" | "tags";
type LookupKey = keyof Lookups;

type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Option[];
  lookup?: LookupKey;
  wide?: boolean;
};

type ResourceConfig = {
  id: string;
  label: string;
  description: string;
  fields: FieldConfig[];
  titleField: string;
  subtitleFields?: string[];
};

type RecordItem = Record<string, unknown> & { id: string; is_demo?: boolean };

const statusProject: Option[] = [
  { value: "on_track", label: "طبق برنامه" },
  { value: "attention", label: "نیازمند توجه" },
  { value: "critical", label: "بحرانی" },
  { value: "complete", label: "تکمیل‌شده" }
];
const statusDecision: Option[] = [
  { value: "open", label: "باز" },
  { value: "at_risk", label: "در معرض ریسک" },
  { value: "overdue", label: "سررسید گذشته" },
  { value: "completed", label: "تکمیل‌شده" }
];
const statusHealth: Option[] = [
  { value: "healthy", label: "پایدار" },
  { value: "attention", label: "نیازمند توجه" },
  { value: "critical", label: "بحرانی" }
];

const resources: ResourceConfig[] = [
  {
    id: "news",
    label: "خبر و محتوا",
    description: "خبر، اطلاعیه، گزارش و محتوای گردشگری استان",
    titleField: "title",
    subtitleFields: ["category", "published_at"],
    fields: [
      { name: "title", label: "عنوان", required: true, wide: true },
      { name: "summary", label: "خلاصه", type: "textarea", required: true, wide: true },
      { name: "category", label: "دسته‌بندی", required: true, placeholder: "اقتصادی، اجتماعی، عمرانی..." },
      { name: "kind", label: "نوع محتوا", type: "select", required: true, options: [
        { value: "news", label: "خبر" }, { value: "tourism", label: "گردشگری" }, { value: "notice", label: "اطلاعیه" }, { value: "report", label: "گزارش" }
      ] },
      { name: "published_at", label: "تاریخ انتشار", type: "date", required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان / نامشخص" }] },
      { name: "source_url", label: "لینک منبع", type: "url", wide: true, placeholder: "https://..." },
      { name: "source_label", label: "نام منبع", placeholder: "استانداری سمنان" },
      { name: "sentiment_score", label: "امتیاز لحن", type: "number", min: -1, max: 1, step: 0.1 },
      { name: "importance", label: "اهمیت مدیریتی", type: "number", min: 0, max: 100, step: 1 },
      { name: "tags", label: "برچسب‌ها", type: "tags", wide: true, placeholder: "آب، شاهرود، پروژه عمرانی" }
    ]
  },
  {
    id: "project", label: "پروژه", description: "پروژه‌های اجرایی و عمرانی", titleField: "title", subtitleFields: ["responsible_organization", "status"],
    fields: [
      { name: "title", label: "عنوان پروژه", required: true, wide: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", required: true },
      { name: "status", label: "وضعیت", type: "select", options: statusProject, required: true },
      { name: "planned_progress", label: "پیشرفت برنامه‌ای (%)", type: "number", min: 0, max: 100, step: 0.1, required: true },
      { name: "actual_progress", label: "پیشرفت واقعی (%)", type: "number", min: 0, max: 100, step: 0.1, required: true },
      { name: "responsible_organization", label: "دستگاه مسئول", required: true, wide: true }
    ]
  },
  {
    id: "decision", label: "مصوبه", description: "مصوبات، اقدامات و تعهدات اجرایی", titleField: "title", subtitleFields: ["status", "due_date"],
    fields: [
      { name: "title", label: "عنوان مصوبه / اقدام", required: true, wide: true },
      { name: "owner_id", label: "دستگاه مسئول", type: "select", lookup: "organizations", required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] },
      { name: "status", label: "وضعیت", type: "select", options: statusDecision, required: true },
      { name: "due_date", label: "مهلت", type: "date", required: true },
      { name: "progress", label: "پیشرفت (%)", type: "number", min: 0, max: 100, step: 0.1, required: true }
    ]
  },
  {
    id: "budget", label: "بودجه", description: "اعتبار و هزینه‌کرد شهرستانی", titleField: "category", subtitleFields: ["fiscal_year", "allocated_amount"],
    fields: [
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", required: true },
      { name: "category", label: "عنوان / دسته بودجه", required: true, wide: true },
      { name: "fiscal_year", label: "سال مالی", required: true, placeholder: "1405" },
      { name: "allocated_amount", label: "اعتبار تخصیص‌یافته", type: "number", min: 0, step: 1, required: true },
      { name: "actual_spending", label: "هزینه‌کرد واقعی", type: "number", min: 0, step: 1, required: true }
    ]
  },
  {
    id: "organization", label: "دستگاه اجرایی", description: "سازمان‌ها و دستگاه‌های اجرایی", titleField: "name", subtitleFields: ["code", "performance_score"],
    fields: [
      { name: "name", label: "نام دستگاه", required: true, wide: true },
      { name: "code", label: "کد", required: true },
      { name: "performance_score", label: "امتیاز عملکرد", type: "number", min: 0, max: 100, step: 0.1, required: true }
    ]
  },
  {
    id: "performance", label: "KPI عملکرد", description: "شاخص‌های ارزیابی دستگاه‌های اجرایی", titleField: "label", subtitleFields: ["category", "period_label"],
    fields: [
      { name: "organization_id", label: "دستگاه اجرایی", type: "select", lookup: "organizations", required: true },
      { name: "category", label: "حوزه ارزیابی", required: true },
      { name: "label", label: "عنوان KPI", required: true, wide: true },
      { name: "score", label: "امتیاز", type: "number", min: 0, max: 100, step: 0.1, required: true },
      { name: "target", label: "هدف", type: "number", min: 0, max: 100, step: 0.1, required: true },
      { name: "period_label", label: "دوره", required: true, placeholder: "مرداد 1405" },
      { name: "weight", label: "وزن", type: "number", min: 0, step: 0.1, required: true }
    ]
  },
  {
    id: "sector", label: "شاخص بخشی", description: "آب، انرژی، صنعت، اشتغال، محیط‌زیست و سایر حوزه‌ها", titleField: "label", subtitleFields: ["domain", "period_label"],
    fields: [
      { name: "code", label: "کد شاخص", required: true },
      { name: "domain", label: "حوزه", required: true, placeholder: "آب، انرژی، اشتغال..." },
      { name: "label", label: "عنوان شاخص", required: true, wide: true },
      { name: "value", label: "مقدار", type: "number", step: 0.01, required: true },
      { name: "unit", label: "واحد" },
      { name: "period_label", label: "دوره", required: true },
      { name: "trend_percent", label: "تغییر (%)", type: "number", step: 0.01 },
      { name: "benchmark_value", label: "Benchmark", type: "number", step: 0.01 },
      { name: "status", label: "وضعیت", type: "select", options: statusHealth, required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] },
      { name: "description", label: "توضیح", type: "textarea", wide: true }
    ]
  },
  {
    id: "speech", label: "سخن و تعهد", description: "سخنان مدیران و تعهدات قابل پیگیری", titleField: "topic", subtitleFields: ["speaker", "spoken_at"],
    fields: [
      { name: "speaker", label: "سخنران", required: true },
      { name: "role", label: "سمت", required: true },
      { name: "spoken_at", label: "تاریخ", type: "date", required: true },
      { name: "topic", label: "موضوع", required: true, wide: true },
      { name: "summary", label: "خلاصه", type: "textarea", required: true, wide: true },
      { name: "commitment_text", label: "تعهد استخراج‌شده", type: "textarea", wide: true },
      { name: "commitment_status", label: "وضعیت تعهد", type: "select", options: [
        { value: "open", label: "باز" }, { value: "in_progress", label: "در حال پیگیری" }, { value: "completed", label: "انجام‌شده" }, { value: "at_risk", label: "در ریسک" }
      ], required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] },
      { name: "source_url", label: "لینک منبع", type: "url", wide: true }
    ]
  },
  {
    id: "crisis", label: "بحران", description: "رخدادها، بحران‌ها و سیگنال‌های تاب‌آوری", titleField: "title", subtitleFields: ["severity", "occurred_at"],
    fields: [
      { name: "title", label: "عنوان رخداد", required: true, wide: true },
      { name: "category", label: "حوزه", required: true },
      { name: "severity", label: "شدت", type: "select", options: [
        { value: "low", label: "کم" }, { value: "medium", label: "متوسط" }, { value: "high", label: "زیاد" }, { value: "critical", label: "بحرانی" }
      ], required: true },
      { name: "status", label: "وضعیت", type: "select", options: [
        { value: "open", label: "باز" }, { value: "monitoring", label: "در حال پایش" }, { value: "resolved", label: "رفع‌شده" }
      ], required: true },
      { name: "occurred_at", label: "تاریخ رخداد", type: "date", required: true },
      { name: "impact_score", label: "شدت اثر / 100", type: "number", min: 0, max: 100, step: 1, required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] },
      { name: "source_label", label: "منبع" },
      { name: "summary", label: "شرح رخداد", type: "textarea", wide: true }
    ]
  },
  {
    id: "forecast", label: "پیش‌بینی", description: "Forecast و هشدار زودهنگام", titleField: "metric_label", subtitleFields: ["domain", "horizon_label"],
    fields: [
      { name: "domain", label: "حوزه", required: true },
      { name: "metric_label", label: "شاخص پیش‌بینی", required: true, wide: true },
      { name: "as_of", label: "تاریخ مبنا", type: "date", required: true },
      { name: "horizon_label", label: "افق پیش‌بینی", required: true, placeholder: "30 روز آینده" },
      { name: "current_value", label: "مقدار فعلی", type: "number", step: 0.01, required: true },
      { name: "forecast_value", label: "مقدار پیش‌بینی", type: "number", step: 0.01, required: true },
      { name: "lower_bound", label: "حد پایین", type: "number", step: 0.01 },
      { name: "upper_bound", label: "حد بالا", type: "number", step: 0.01 },
      { name: "unit", label: "واحد" },
      { name: "risk_level", label: "سطح ریسک", type: "select", options: statusHealth, required: true },
      { name: "confidence", label: "اعتماد (%)", type: "number", min: 0, max: 100, step: 1, required: true },
      { name: "methodology", label: "روش تحلیل", placeholder: "تحلیل روند، مدل آماری یا نظر کارشناسی" },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] }
    ]
  },
  {
    id: "procurement", label: "مناقصه", description: "مناقصات و فرایندهای خرید", titleField: "title", subtitleFields: ["status", "published_at"],
    fields: [
      { name: "title", label: "عنوان", required: true, wide: true },
      { name: "organization_id", label: "دستگاه", type: "select", lookup: "organizations", required: true },
      { name: "status", label: "وضعیت", type: "select", options: [
        { value: "planned", label: "برنامه‌ریزی" }, { value: "open", label: "باز" }, { value: "evaluation", label: "ارزیابی" }, { value: "awarded", label: "واگذارشده" }
      ], required: true },
      { name: "published_at", label: "تاریخ انتشار", type: "date", required: true },
      { name: "deadline", label: "مهلت" , type: "date" },
      { name: "estimated_amount", label: "برآورد مبلغ", type: "number", min: 0, step: 1 },
      { name: "procurement_method", label: "روش خرید", required: true },
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", options: [{ value: "", label: "کل استان" }] },
      { name: "reference_code", label: "شماره / کد مرجع" }
    ]
  },
  {
    id: "citizen", label: "صدای مردم", description: "درخواست‌ها و شاخص پاسخ‌گویی", titleField: "category", subtitleFields: ["request_count", "resolved_count"],
    fields: [
      { name: "county_id", label: "شهرستان", type: "select", lookup: "counties", required: true },
      { name: "category", label: "موضوع درخواست", required: true, wide: true },
      { name: "request_count", label: "تعداد درخواست", type: "number", min: 0, step: 1, required: true },
      { name: "resolved_count", label: "پاسخ‌داده‌شده", type: "number", min: 0, step: 1, required: true },
      { name: "average_response_hours", label: "میانگین پاسخ (ساعت)", type: "number", min: 0, step: 0.1, required: true },
      { name: "change_percent", label: "تغییر (%)", type: "number", step: 0.1, required: true }
    ]
  },
  {
    id: "report", label: "گزارش", description: "گزارش‌های مدیریتی و اجرایی", titleField: "title", subtitleFields: ["report_type", "period_label"],
    fields: [
      { name: "title", label: "عنوان گزارش", required: true, wide: true },
      { name: "report_type", label: "نوع گزارش", required: true },
      { name: "period_label", label: "بازه", required: true },
      { name: "status", label: "وضعیت", type: "select", options: [
        { value: "ready", label: "آماده" }, { value: "review", label: "در بررسی" }, { value: "draft", label: "پیش‌نویس" }
      ], required: true },
      { name: "organization_id", label: "دستگاه", type: "select", lookup: "organizations", options: [{ value: "", label: "کل استان" }] }
    ]
  },
  {
    id: "county", label: "شهرستان", description: "اطلاعات پایه شهرستان‌ها", titleField: "name", subtitleFields: ["code", "population"],
    fields: [
      { name: "name", label: "نام شهرستان", required: true },
      { name: "code", label: "کد", required: true },
      { name: "population", label: "جمعیت", type: "number", min: 0, step: 1 }
    ]
  }
];

function defaultFor(field: FieldConfig) {
  if (field.type === "select") {
    const merged = field.options ?? [];
    return merged.find((option) => option.value !== "")?.value ?? "";
  }
  if (field.type === "number") return "0";
  if (field.type === "date") return new Date().toISOString().slice(0, 10);
  return "";
}

function emptyForm(resource: ResourceConfig) {
  return Object.fromEntries(resource.fields.map((field) => [field.name, defaultFor(field)]));
}

function stringValue(value: unknown) {
  if (Array.isArray(value)) return value.join("، ");
  if (value === null || value === undefined) return "";
  return String(value);
}

export function DataEntryPanel() {
  const router = useRouter();
  const structuredResources = useMemo(() => resources.filter((item) => item.id !== "news"), []);
  const [structuredMode, setStructuredMode] = useState(false);
  const [resourceId, setResourceId] = useState(structuredResources[0]?.id ?? "project");
  const resource = useMemo(
    () => structuredResources.find((item) => item.id === resourceId) ?? structuredResources[0],
    [resourceId, structuredResources]
  );
  const [form, setForm] = useState<Record<string, string>>(() => emptyForm(structuredResources[0] ?? resources[1]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [lookups, setLookups] = useState<Lookups>({ counties: [], organizations: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadRecords(q = "") {
    if (!resource) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ resource: resource.id });
      if (q.trim()) params.set("search", q.trim());
      const response = await fetch(`/api/management?${params.toString()}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "خطا در خواندن داده‌ها");
      setItems(result.items ?? []);
      setLookups(result.lookups ?? { counties: [], organizations: [] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!structuredMode || !resource) return;
    setForm(emptyForm(resource));
    setEditingId(null);
    setSearch("");
    setMessage("");
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId, structuredMode]);

  function fieldOptions(field: FieldConfig) {
    const staticOptions = field.options ?? [];
    const lookupOptions = field.lookup ? lookups[field.lookup] : [];
    const placeholder = field.required && field.type === "select" && !staticOptions.some((option) => option.value === "")
      ? [{ value: "", label: "انتخاب کنید..." }]
      : [];
    const values = new Set<string>();
    return [...placeholder, ...staticOptions, ...lookupOptions].filter((option) => {
      if (values.has(option.value)) return false;
      values.add(option.value);
      return true;
    });
  }

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    if (!resource) return;
    setEditingId(null);
    setForm(emptyForm(resource));
  }

  function editItem(item: RecordItem) {
    if (!resource) return;
    const next = emptyForm(resource);
    resource.fields.forEach((field) => {
      next[field.name] = stringValue(item[field.name]);
    });
    setForm(next);
    setEditingId(item.id);
    setMessage(`در حال ویرایش «${stringValue(item[resource.titleField])}»`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!resource) return;
    setSaving(true);
    setMessage("");
    try {
      const body = { resource: resource.id, id: editingId, data: form };
      const response = await fetch("/api/management", {
        method: editingId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ذخیره انجام نشد");
      setMessage(editingId ? "رکورد با موفقیت ویرایش شد." : "رکورد با موفقیت ثبت شد.");
      resetForm();
      await loadRecords(search);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطای ناشناخته در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item: RecordItem) {
    if (!resource) return;
    const title = stringValue(item[resource.titleField]) || "این رکورد";
    if (!window.confirm(`«${title}» حذف شود؟`)) return;
    setMessage("");
    try {
      const response = await fetch("/api/management", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resource: resource.id, id: item.id })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "حذف انجام نشد");
      setMessage("رکورد حذف شد.");
      if (editingId === item.id) resetForm();
      await loadRecords(search);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "خطا در حذف");
    }
  }

  if (!structuredMode) {
    return <ContentStudio />;
  }

  if (!resource) return null;

  return <section className="structured-data-page">
    <header className="structured-data-head">
      <div>
        <span>STRUCTURED DATA</span>
        <h2>مدیریت داده‌های ساختاریافته</h2>
        <p>پروژه، بودجه، KPI، بحران، پیش‌بینی و سایر داده‌های عملیاتی استان</p>
      </div>
      <button type="button" onClick={() => setStructuredMode(false)}>بازگشت به کتابخانه محتوا</button>
    </header>

    <div className="structured-resource-tabs" role="tablist" aria-label="نوع داده">
      {structuredResources.map((item) => <button
        type="button"
        role="tab"
        aria-selected={resource.id === item.id}
        className={resource.id === item.id ? "active" : ""}
        onClick={() => setResourceId(item.id)}
        key={item.id}
      >{item.label}</button>)}
    </div>

    {message ? <div className="data-entry-message">{message}</div> : null}

    <div className="crud-layout structured-crud-layout">
      <article className="card crud-form-card">
        <header className="crud-card-head">
          <div><span className="section-kicker">{editingId ? "EDIT RECORD" : "NEW RECORD"}</span><h3>{editingId ? `ویرایش ${resource.label}` : `افزودن ${resource.label}`}</h3><p>{resource.description}</p></div>
          {editingId ? <button type="button" className="ghost-action" onClick={resetForm}>لغو ویرایش</button> : null}
        </header>

        <form className="inline-crud-form" onSubmit={submit}>
          {resource.fields.map((field) => {
            const value = form[field.name] ?? "";
            const common = { id: `field-${field.name}`, name: field.name, required: field.required, value };
            return <label className={field.wide ? "form-field wide" : "form-field"} key={field.name}>
              <span>{field.label}{field.required ? <b>*</b> : null}</span>
              {field.type === "textarea" ? <textarea {...common} rows={4} placeholder={field.placeholder} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField(field.name, event.target.value)} />
                : field.type === "select" ? <select {...common} onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField(field.name, event.target.value)}>{fieldOptions(field).map((option) => <option value={option.value} key={`${field.name}-${option.value}`}>{option.label}</option>)}</select>
                  : <input {...common} dir={field.type === "url" ? "ltr" : undefined} type={field.type === "tags" ? "text" : field.type ?? "text"} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField(field.name, event.target.value)} />}
            </label>;
          })}
          <div className="crud-form-actions">
            <button className="crud-save" type="submit" disabled={saving}>{saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : `ثبت ${resource.label}`}</button>
            <button className="crud-reset" type="button" onClick={resetForm}>پاک کردن فرم</button>
          </div>
        </form>
      </article>

      <article className="card records-card">
        <header className="crud-card-head records-head">
          <div><span className="section-kicker">سوابق ثبت‌شده</span><h3>{resource.label}های ثبت‌شده</h3><p>{loading ? "در حال دریافت..." : `${items.length} رکورد`}</p></div>
          <form className="records-search" onSubmit={(event: FormEvent) => { event.preventDefault(); void loadRecords(search); }}>
            <input value={search} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} placeholder="جست‌وجو..." />
            <button type="submit">جست‌وجو</button>
          </form>
        </header>

        <div className="records-list">
          {!loading && items.length === 0 ? <div className="records-empty"><b>هنوز رکوردی ثبت نشده</b><span>فرم سمت مقابل را پر کن و «ثبت» را بزن.</span></div> : null}
          {items.map((item) => <div className="record-row" key={item.id}>
            <div className="record-main">
              <strong>{stringValue(item[resource.titleField]) || "بدون عنوان"}</strong>
              <div>{(resource.subtitleFields ?? []).map((field) => {
                const relationLabel = item[`${field}_label`];
                const text = stringValue(relationLabel ?? item[field]);
                return text ? <span key={field}>{text}</span> : null;
              })}</div>
              <small className="real-tag">ثبت‌شده</small>
            </div>
            <div className="record-actions">
              <button type="button" onClick={() => editItem(item)}>ویرایش</button>
              <button type="button" className="danger" onClick={() => void removeItem(item)}>حذف</button>
            </div>
          </div>)}
        </div>
      </article>
    </div>
  </section>;
}
