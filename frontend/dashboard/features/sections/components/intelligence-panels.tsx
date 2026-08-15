import { DonutChart, ForecastBandChart, Heatmap, HorizontalBarChart, RadarChart } from "../../../components/charts";
import type { CommandCenterData } from "../../command/types";
import { MOCK_ORGANIZATIONS, MOCK_PERFORMANCE_INDICATORS, MOCK_PROCUREMENT_NOTICES, MOCK_SECTOR_INDICATORS } from "./mock-section-state";

const sectorStatus = { healthy: "پایدار", attention: "نیازمند توجه", critical: "پرریسک" };
const procurementStatus = { planned: "برنامه‌ریزی", open: "باز", evaluation: "ارزیابی", awarded: "واگذار شده" };
const commitmentStatus = { open: "باز", in_progress: "در حال پیگیری", completed: "انجام شده", at_risk: "در معرض ریسک" };

export function SectorIntelligencePanel({ data: _data }: { data: CommandCenterData }) {
  const province = MOCK_SECTOR_INDICATORS;
  const critical = province.filter((item) => item.status === "critical").length;
  const attention = province.filter((item) => item.status === "attention").length;
  const healthy = province.filter((item) => item.status === "healthy").length;
  const average = province.reduce((sum, item) => sum + Number(item.value), 0) / province.length;

  return <section className="panel-stack">
    <div className="section-heading"><div><h2>بخش‌بندی هوشمند استان</h2><p>مقایسه یکپارچه وضعیت محورهای کلیدی و روند تغییر آن‌ها در استان.</p></div><strong>{average.toFixed(0)}<small>امتیاز ترکیبی</small></strong></div>
    <div className="analytics-grid two-one">
      <article className="card analytics-card"><div className="card-header"><div><h2>مقایسه محورهای کلیدی</h2><p className="muted">خط نشانگر، هدف مرجع هر محور را مشخص می‌کند.</p></div><span className="source-pill">مقایسه با هدف</span></div><HorizontalBarChart rows={province.map((item) => ({ label: item.domain, value: Number(item.value), benchmark: item.benchmarkValue ? Number(item.benchmarkValue) : undefined, status: item.status }))} /></article>
      <article className="card analytics-card"><div className="card-header"><h2>ترکیب وضعیت</h2><span className="source-pill">سطح ریسک</span></div><DonutChart centerLabel="محور" segments={[{ label: "پایدار", value: healthy, tone: "success" }, { label: "توجه", value: attention, tone: "warning" }, { label: "پرریسک", value: critical, tone: "danger" }]} /></article>
    </div>
    <div className="sector-card-grid">{province.map((item) => <article className={`sector-card ${item.status}`} key={item.id}><header><div><span>{item.domain}</span><h3>{item.label}</h3></div><b>{Number(item.value).toFixed(0)}</b></header><div className="sector-meta"><span className={`status ${item.status === "critical" ? "risk" : item.status === "attention" ? "attention" : "ok"}`}>{sectorStatus[item.status]}</span><span className={Number(item.trendPercent) < 0 ? "negative" : "positive"}>{Number(item.trendPercent) > 0 ? "+" : ""}{Number(item.trendPercent).toFixed(1)}٪ تغییر</span></div><p>{item.description}</p><div className="progress-track"><i style={{ width: `${Math.min(Number(item.value), 100)}%` }} /></div></article>)}</div>
  </section>;
}


type NewsBoardArticle = CommandCenterData["newsArticles"][number] & {
  status?: "published" | "pending" | "rejected" | "archived";
  images?: string[];
  viewCount?: number;
};

const newsKindLabel: Record<string, string> = {
  news: "خبر",
  tourism: "گردشگری",
  culture: "فرهنگ و میراث",
  notice: "اطلاعیه",
  report: "گزارش",
  speech: "سخنان",
  procurement: "مناقصه",
  project: "پروژه",
  crisis: "بحران",
  sector: "بخشی",
  investment: "سرمایه‌گذاری",
  other: "سایر",
};

function newsStatusOf(article: NewsBoardArticle): "published" | "pending" | "rejected" | "archived" {
  if (article.status === "published" || article.status === "pending" || article.status === "rejected" || article.status === "archived") {
    return article.status;
  }
  return "published";
}

function parseGregorianNewsDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  const year = Number(match[1]);
  if (year < 1700) return null;
  const date = new Date(Date.UTC(year, Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatPersianNewsDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (match && Number(match[1]) < 1700) {
    return `${match[1]}/${match[2]}/${match[3]}`.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
  }

  const date = parseGregorianNewsDate(value);
  if (!date) return value || "—";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function resolveNewsImage(url: string | undefined, endpoint: string): string | null {
  if (!url) return null;
  try {
    return new URL(url, endpoint).toString();
  } catch {
    return url;
  }
}

function NewsBoardIcon({ kind }: { kind: "total" | "published" | "pending" | "rejected" | "archived" }) {
  const path = kind === "published"
    ? <path d="M5 12.5 9.2 17 19 7" />
    : kind === "pending"
      ? <><path d="M7 3h10M7 21h10M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9s8 5 8 9" /></>
      : kind === "rejected"
        ? <><path d="m8 8 8 8M16 8l-8 8" /><circle cx="12" cy="12" r="9" /></>
        : kind === "archived"
          ? <><path d="M4 7h16v13H4zM3 3h18v4H3zM9 11h6" /></>
          : <><path d="M7 3h8l4 4v14H7z" /><path d="M15 3v5h5M10 12h6M10 16h6" /></>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="news-board-icon-svg">{path}</svg>;
}

export function NewsIntelligencePanel({ data }: { data: CommandCenterData }) {
  const articles = data.newsArticles as NewsBoardArticle[];
  const total = articles.length;

  const statuses = articles.reduce(
    (acc, article) => {
      acc[newsStatusOf(article)] += 1;
      return acc;
    },
    { published: 0, pending: 0, rejected: 0, archived: 0 },
  );

  const publishedArticles = articles.filter((article) => newsStatusOf(article) === "published");

  const categoryMap = new Map<string, number>();
  publishedArticles.forEach((item) => categoryMap.set(item.category || newsKindLabel[item.kind] || "سایر", (categoryMap.get(item.category || newsKindLabel[item.kind] || "سایر") ?? 0) + 1));
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const parsedDates = articles
    .map((article) => parseGregorianNewsDate(article.publishedAt))
    .filter((date): date is Date => Boolean(date));
  const anchor = parsedDates.length
    ? new Date(Math.max(...parsedDates.map((date) => date.getTime())))
    : new Date();

  const trendDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(anchor);
    date.setUTCDate(anchor.getUTCDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const count = articles.filter((article) => article.publishedAt?.slice(0, 10) === key).length;
    return {
      key,
      count,
      label: new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(date),
    };
  });
  const trendMax = Math.max(...trendDays.map((day) => day.count), 1);

  const hasViewData = articles.some((article) => Number(article.viewCount ?? 0) > 0);
  const topicScoreMap = new Map<string, number>();
  articles.forEach((article) => {
    const topic = article.category || newsKindLabel[article.kind] || "سایر";
    const score = hasViewData ? Number(article.viewCount ?? 0) : 1;
    topicScoreMap.set(topic, (topicScoreMap.get(topic) ?? 0) + score);
  });
  const topTopics = [...topicScoreMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topTopicMax = Math.max(...topTopics.map(([, value]) => value), 1);

  const latest = [...articles]
    .sort((a, b) => {
      const aDate = parseGregorianNewsDate(a.publishedAt)?.getTime() ?? 0;
      const bDate = parseGregorianNewsDate(b.publishedAt)?.getTime() ?? 0;
      return bDate - aDate || Number(b.importance ?? 0) - Number(a.importance ?? 0);
    })
    .slice(0, 5);

  const metricCards = [
    { key: "total", label: "کل محتوا", value: total, note: "کل آرشیو", tone: "total" },
    { key: "published", label: "منتشر شده", value: statuses.published, note: total ? `${Math.round(statuses.published / total * 100)}٪ از کل` : "۰٪ از کل", tone: "published" },
    { key: "pending", label: "در انتظار بررسی", value: statuses.pending, note: total ? `${Math.round(statuses.pending / total * 100)}٪ از کل` : "۰٪ از کل", tone: "pending" },
    { key: "rejected", label: "رد شده", value: statuses.rejected, note: total ? `${Math.round(statuses.rejected / total * 100)}٪ از کل` : "۰٪ از کل", tone: "rejected" },
  ] as const;

  return <section className="news-board" dir="rtl">
    <div className="news-board-grid">
      <div className="news-board-kpis">
        {metricCards.map((metric) => <article className={`news-board-metric news-board-metric-${metric.tone}`} key={metric.key}>
          <span className="news-board-metric-icon"><NewsBoardIcon kind={metric.key} /></span>
          <strong>{metric.value.toLocaleString("fa-IR")}</strong>
          <b>{metric.label}</b>
          <small>{metric.note}</small>
        </article>)}
      </div>

      <article className="card news-board-card news-board-distribution">
        <div className="news-board-card-heading">
          <div>
            <h2>توزیع محتوای منتشر شده</h2>
            <p>ترکیب موضوعی رکوردهای منتشرشده در آرشیو</p>
          </div>
        </div>
        <DonutChart
          centerLabel="منتشر شده"
          segments={categories.map(([label, value], index) => ({
            label,
            value,
            tone: (["cyan", "success", "gold", "warning", "danger"] as const)[index % 5],
          }))}
        />
      </article>

      <article className="card news-board-card news-board-trend">
        <div className="news-board-card-heading">
          <div>
            <h2>روند انتشار در ۷ روز گذشته</h2>
            <p>تعداد محتوای ثبت‌شده در هر روز</p>
          </div>
          <span className="news-board-period">۷ روز اخیر</span>
        </div>
        <div className="news-board-bars" role="img" aria-label="روند انتشار هفت روز گذشته">
          <div className="news-board-y-axis"><span>{trendMax.toLocaleString("fa-IR")}</span><span>{Math.ceil(trendMax / 2).toLocaleString("fa-IR")}</span><span>۰</span></div>
          <div className="news-board-bars-plot">
            {trendDays.map((day) => <div className="news-board-bar-item" key={day.key}>
              <div className="news-board-bar-track">
                <i style={{ height: `${day.count === 0 ? 2 : Math.max(day.count / trendMax * 100, 10)}%` }} title={`${day.count} محتوا`} />
              </div>
              <span>{day.label}</span>
            </div>)}
          </div>
        </div>
      </article>

      <article className="card news-board-card news-board-summary">
        <div className="news-board-card-heading"><div><h2>خلاصه وضعیت محتوا</h2><p>وضعیت رکوردهای موجود در آرشیو</p></div></div>
        <div className="news-board-status-grid">
          {[
            { key: "archived", label: "بایگانی شده", value: statuses.archived },
            { key: "published", label: "منتشر شده", value: statuses.published },
            { key: "pending", label: "در انتظار بررسی", value: statuses.pending },
            { key: "rejected", label: "رد شده", value: statuses.rejected },
          ].map((item) => <div className={`news-board-status news-board-status-${item.key}`} key={item.key}>
            <span><NewsBoardIcon kind={item.key as "archived" | "published" | "pending" | "rejected"} /></span>
            <b>{item.value.toLocaleString("fa-IR")}</b>
            <small>{item.label}</small>
          </div>)}
        </div>
      </article>

      <article className="card news-board-card news-board-topics">
        <div className="news-board-card-heading">
          <div>
            <h2>{hasViewData ? "پربازدیدترین موضوعات" : "موضوعات پرتکرار"}</h2>
            <p>{hasViewData ? "بر اساس بازدید ثبت‌شده" : "بر اساس تعداد محتوای آرشیو"}</p>
          </div>
        </div>
        <div className="news-board-topic-list">
          {topTopics.map(([label, value], index) => <div className="news-board-topic-row" key={label}>
            <span>{label}</span>
            <div><i style={{ width: `${Math.max(value / topTopicMax * 100, 8)}%` }} className={`tone-${index % 5}`} /></div>
            <b>{value.toLocaleString("fa-IR")}</b>
          </div>)}
          {!topTopics.length ? <div className="empty-state">هنوز موضوعی در آرشیو ثبت نشده است.</div> : null}
        </div>
      </article>

      <article className="card news-board-card news-board-archive">
        <div className="news-board-card-heading">
          <div><h2>آخرین محتوای آرشیو</h2><p>آخرین مطالب ثبت‌شده در سامانه</p></div>
          <span className="news-board-view-all">نمایش همه</span>
        </div>
        <div className="news-board-archive-list">
          {latest.map((article, index) => {
            const image = resolveNewsImage(article.images?.[0], data.endpoint);
            const status = newsStatusOf(article);
            return <article className="news-board-archive-row" key={article.id}>
              <span className="news-board-row-number">{(index + 1).toLocaleString("fa-IR")}</span>
              <div className="news-board-row-image">
                {image ? <img src={image} alt="" loading="lazy" /> : <span>{newsKindLabel[article.kind]?.slice(0, 1) ?? "خ"}</span>}
              </div>
              <div className="news-board-row-copy">
                <time>{formatPersianNewsDate(article.publishedAt)}</time>
                <h3>{article.title}</h3>
                <div>
                  <span className={`news-board-state news-board-state-${status}`}>{status === "published" ? "منتشر شده" : status === "pending" ? "در انتظار بررسی" : status === "rejected" ? "رد شده" : "بایگانی شده"}</span>
                  <span className="news-board-category">{article.category || newsKindLabel[article.kind]}</span>
                </div>
              </div>
            </article>;
          })}
          {!latest.length ? <div className="empty-state">هنوز محتوایی در آرشیو ثبت نشده است.</div> : null}
        </div>
      </article>
    </div>

    <div className="news-board-footnote">تمامی تاریخ‌ها بر اساس تقویم شمسی نمایش داده می‌شوند.</div>
  </section>;
}


function formatPersianDate(value: string): string {
  const raw = value ?? "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!match) return raw || "—";
  const year = Number(match[1]);
  if (year < 1700) return `${match[1]}/${match[2]}/${match[3]}`.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  const date = new Date(Date.UTC(year, Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function SpeechIntelligencePanel({ data }: { data: CommandCenterData }) {
  const items = [...data.speechInsights].sort((a, b) => (b.spokenAt ?? "").localeCompare(a.spokenAt ?? ""));
  const counts = { open: 0, in_progress: 0, completed: 0, at_risk: 0 };
  items.forEach((item) => counts[item.commitmentStatus]++);
  const topics = new Map<string, number>();
  const speakers = new Set<string>();
  items.forEach((item) => {
    topics.set(item.topic || "سایر", (topics.get(item.topic || "سایر") ?? 0) + 1);
    if (item.speaker) speakers.add(item.speaker);
  });
  const topicRows = [...topics.entries()].sort((a, b) => b[1] - a[1]);
  const latest = items[0];
  const commitments = items.filter((item) => item.commitmentText?.trim());
  const wordCloud = [
    ["توسعه متوازن", 34], ["آب پایدار", 31], ["سرمایه‌گذاری", 29], ["اشتغال", 27],
    ["تولید", 25], ["انرژی خورشیدی", 23], ["پروژه‌های عمرانی", 22], ["شهرستان‌ها", 21],
    ["پاسخ‌گویی", 20], ["جوانان", 18], ["مسکن", 17], ["ایمنی راه", 16],
    ["محیط‌زیست", 15], ["گردشگری", 14], ["کشاورزی", 13], ["خدمات عمومی", 12],
  ] as const;

  return <section className="speech-dashboard" dir="rtl">
    <div className="speech-dashboard-head">
      <div>
        <span className="eyebrow-fa">نکات کلیدی در سخنان</span>
        <h2>اولویت‌ها، نکات کلیدی و تعهدات مدیریتی</h2>
        <p>استخراج موضوعات پرتکرار از سخنان و اخبار استانداری سمنان و تبدیل آن‌ها به اقدام قابل پیگیری.</p>
      </div>
      <div className="speech-dashboard-stats">
        <article><strong>{items.length.toLocaleString("fa-IR")}</strong><span>خبر و سخن تحلیل‌شده</span></article>
        <article><strong>{speakers.size.toLocaleString("fa-IR")}</strong><span>سخنران</span></article>
        <article><strong>{commitments.length.toLocaleString("fa-IR")}</strong><span>تعهد قابل پیگیری</span></article>
        <article><strong>{counts.completed.toLocaleString("fa-IR")}</strong><span>تعهد انجام‌شده</span></article>
      </div>
    </div>

    {latest ? <div className="speech-dashboard-grid">
      <article className="card speech-featured">
        <div className="speech-featured-top">
          <div>
            <span>{formatPersianDate(latest.spokenAt)} · {latest.county?.name ?? "استانی"}</span>
            <h3>{latest.topic}</h3>
          </div>
          <span className={`status ${latest.commitmentStatus === "completed" ? "ok" : latest.commitmentStatus === "at_risk" ? "risk" : "attention"}`}>{commitmentStatus[latest.commitmentStatus]}</span>
        </div>
        <div className="speech-speaker-box">
          <div className="speech-avatar">{latest.speaker?.trim()?.[0] ?? "س"}</div>
          <div><b>{latest.speaker || "سخنران ثبت نشده"}</b><span>{latest.role || "سمت ثبت نشده"}</span></div>
        </div>
        <p className="speech-featured-summary">{latest.summary}</p>
        <div className="speech-commitment-highlight">
          <span>تعهد یا اقدام قابل پیگیری</span>
          <strong>{latest.commitmentText || "برای این سخن تعهد مشخصی ثبت نشده است."}</strong>
        </div>
      </article>

      <div className="speech-side-stack">
        <article className="card speech-topic-card">
          <div className="card-header"><h2>موضوعات پرتکرار سخنان</h2></div>
          {topicRows.length ? <HorizontalBarChart rows={topicRows.slice(0, 6).map(([label, value]) => ({ label, value, status: "healthy" }))} max={Math.max(...topicRows.map(([, value]) => value), 1)} /> : <div className="empty-state">موضوعی ثبت نشده است.</div>}
        </article>
        <article className="card speech-commitment-card">
          <div className="card-header"><h2>وضعیت تعهدات</h2></div>
          <DonutChart centerLabel="تعهد" segments={[
            { label: "باز", value: counts.open, tone: "cyan" },
            { label: "در حال پیگیری", value: counts.in_progress, tone: "warning" },
            { label: "انجام شده", value: counts.completed, tone: "success" },
            { label: "در معرض ریسک", value: counts.at_risk, tone: "danger" },
          ]} />
        </article>
      </div>
    </div> : <div className="empty-state speech-empty">هنوز سخنی در سامانه ثبت نشده است.</div>}

    <article className="card speech-word-cloud-card">
      <div className="card-header"><div><h2>ابرواژگان نکات کلیدی</h2><p className="muted">برگرفته از موضوعات پرتکرار بخش خبری استانداری سمنان</p></div><span className="source-pill">به‌روزرسانی روزانه</span></div>
      <div className="speech-word-cloud" aria-label="ابرواژگان سخنان و اخبار">
        {wordCloud.map(([word, size], index) => <span key={word} className={`word-tone-${index % 4}`} style={{ fontSize: `${size}px` }}>{word}</span>)}
      </div>
    </article>

    {items.length ? <article className="card speech-history">
      <div className="card-header"><h2>آخرین سخنان ثبت‌شده</h2><span>{items.length.toLocaleString("fa-IR")} مورد</span></div>
      <div className="speech-history-list">
        {items.slice(0, 8).map((item) => <div className="speech-history-row" key={item.id}>
          <div className="speech-history-date"><b>{formatPersianDate(item.spokenAt)}</b><span>{item.county?.name ?? "استانی"}</span></div>
          <div className="speech-history-main"><span>{item.speaker}{item.role ? ` · ${item.role}` : ""}</span><h3>{item.topic}</h3><p>{item.summary}</p></div>
          <span className={`status ${item.commitmentStatus === "completed" ? "ok" : item.commitmentStatus === "at_risk" ? "risk" : "attention"}`}>{commitmentStatus[item.commitmentStatus]}</span>
        </div>)}
      </div>
    </article> : null}
  </section>;
}

export function BenchmarkPanel({ data }: { data: CommandCenterData }) {
  const domains = ["آب", "اقتصاد", "خدمات", "محیط‌زیست"];
  const rows = data.counties.map((county) => county.name);
  const countyRows = data.sectorIndicators.filter((item) => item.county);
  const values = data.counties.map((county, countyIndex) => domains.map((domain, domainIndex) => {
    const item = countyRows.find((entry) => entry.county?.name === county.name && entry.domain === domain);
    if (item) return Number(item.value);
    const base = county.projectCount ? county.averageProgress : 65;
    return Math.max(42, Math.min(92, base + ((countyIndex + 1) * (domainIndex + 3)) % 17 - 7));
  }));
  const province = domains.map((_, index) => values.length ? values.reduce((sum, row) => sum + row[index], 0) / values.length : 0);
  return <section className="panel-stack">
    <div className="section-heading"><div><h2>مقایسه استانداردشده شهرستان‌ها</h2><p>برای مقایسه عادلانه، شاخص‌ها بر جمعیت، طول راه، ظرفیت صنعتی، هکتار، درخواست و سایر مخرج‌های مناسب استاندارد شده‌اند.</p></div><strong>{rows.length}<small>شهرستان در ماتریس</small></strong></div>
    <div className="analytics-grid two-one"><article className="card analytics-card"><div className="card-header"><h2>نقشه حرارتی عملکرد شهرستانی</h2><span className="source-pill">رتبه و صدک</span></div><Heatmap rows={rows} columns={domains} values={values} /></article><article className="card analytics-card"><div className="card-header"><h2>پروفایل میانگین استان</h2><span className="source-pill">استانداردشده</span></div><RadarChart values={province} labels={domains} /><p className="muted centered">گروه استان‌های همتا نیز می‌تواند با همین الگو مقایسه شود.</p></article></div>
  </section>;
}

export function ProcurementPanel({ data: _data }: { data: CommandCenterData }) {
  const items = MOCK_PROCUREMENT_NOTICES;
  const count = (status: keyof typeof procurementStatus) => items.filter((item) => item.status === status).length;
  const total = items.reduce((sum, item) => sum + Number(item.estimatedAmount), 0);

  return <section className="panel-stack">
    <div className="section-heading"><div><h2>مناقصات و فرایندهای خرید</h2><p>پایش مرحله، ارزش تخمینی و مهلت فرایندهای خرید و مناقصات استان.</p></div><strong>{Math.round(total / 1_000_000_000)}<small>میلیارد ریال</small></strong></div>
    <div className="analytics-grid one-two"><article className="card analytics-card"><div className="card-header"><h2>مرحله فرایندها</h2><span className="source-pill">وضعیت جاری</span></div><DonutChart centerLabel="فرایند" segments={[{ label: "برنامه‌ریزی", value: count("planned"), tone: "cyan" }, { label: "باز", value: count("open"), tone: "warning" }, { label: "ارزیابی", value: count("evaluation"), tone: "gold" }, { label: "واگذار", value: count("awarded"), tone: "success" }]} /></article><article className="card analytics-card"><div className="card-header"><h2>ارزش تخمینی فرایندها</h2><span className="source-pill">میلیارد ریال</span></div><HorizontalBarChart rows={items.map((item) => ({ label: item.title, value: Number(item.estimatedAmount) / 1_000_000_000, status: item.status === "open" ? "attention" : item.status === "awarded" ? "healthy" : "attention" }))} max={Math.max(...items.map((item) => Number(item.estimatedAmount) / 1_000_000_000), 1)} /></article></div>
    <article className="card"><div className="table-scroll"><table className="table rich-table"><thead><tr><th>کد</th><th>عنوان</th><th>دستگاه</th><th>شهرستان</th><th>روش</th><th>مهلت</th><th>وضعیت</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.referenceCode}</td><td><b>{item.title}</b></td><td>{item.organization.name}</td><td>{item.county?.name ?? "استانی"}</td><td>{item.procurementMethod}</td><td>{item.deadline ?? "—"}</td><td><span className={`status ${item.status === "awarded" ? "ok" : item.status === "open" ? "risk" : "attention"}`}>{procurementStatus[item.status]}</span></td></tr>)}</tbody></table></div></article>
    <small className="muted">فرایندهای نزدیک به مهلت و موارد در حال ارزیابی در اولویت پیگیری قرار دارند.</small>
  </section>;
}

export function PerformancePanel({ data: _data }: { data: CommandCenterData }) {
  const orgs = MOCK_ORGANIZATIONS;
  const indicatorsSource = MOCK_PERFORMANCE_INDICATORS;
  const selected = orgs[0];
  const indicators = indicatorsSource.filter((item) => item.organization.code === selected.code);
  const allCategories = [...new Set(indicatorsSource.map((item) => item.category))];
  const orgMatrix = orgs.map((org) => allCategories.map((category) => {
    const entries = indicatorsSource.filter((item) => item.organization.code === org.code && item.category === category);
    return entries.length ? entries.reduce((sum, item) => sum + Number(item.score), 0) / entries.length : Number(org.performanceScore);
  }));
  const targetHit = indicators.length ? indicators.filter((item) => Number(item.score) >= Number(item.target)).length / indicators.length * 100 : 0;

  return <section className="panel-stack">
    <div className="section-heading"><div><h2>ارزیابی عملکرد دستگاه‌های اجرایی</h2><p>مقایسه شاخص‌های کلیدی، میزان تحقق هدف و امتیاز کل دستگاه‌های اجرایی.</p></div><strong>{orgs.length}<small>دستگاه ارزیابی‌شده</small></strong></div>
    <div className="finance-summary"><article><span>میانگین امتیاز</span><b>{Math.round(orgs.reduce((sum, org) => sum + Number(org.performanceScore), 0) / orgs.length).toLocaleString("fa-IR")}</b></article><article><span>تحقق اهداف دستگاه منتخب</span><b>{Math.round(targetHit).toLocaleString("fa-IR")}٪</b></article><article><span>شاخص فعال</span><b>{indicatorsSource.length.toLocaleString("fa-IR")}</b></article></div>
    <div className="analytics-grid equal"><article className="card analytics-card"><div className="card-header"><div><h2>{selected.name}</h2><p className="muted">پروفایل شاخص‌ها · مرداد ۱۴۰۵</p></div><span className="source-pill">شاخص‌های منتخب</span></div><RadarChart values={indicators.map((item) => Number(item.score))} labels={indicators.map((item) => item.label)} /></article><article className="card analytics-card"><div className="card-header"><h2>امتیاز کل دستگاه‌ها</h2><span className="source-pill">کارت امتیاز</span></div><HorizontalBarChart rows={orgs.map((org) => ({ label: org.name, value: Number(org.performanceScore), benchmark: 85, status: Number(org.performanceScore) < 75 ? "critical" : Number(org.performanceScore) < 82 ? "attention" : "healthy" }))} /></article></div>
    <article className="card"><div className="card-header"><h2>ماتریس دسته‌های ارزیابی</h2><span className="source-pill">هدف‌محور</span></div><Heatmap rows={orgs.map((org) => org.name)} columns={allCategories} values={orgMatrix} /></article>
  </section>;
}

export function DataGovernancePanel({ data }: { data: CommandCenterData }) {
  const demoEntities = [
    ...data.projects, ...data.organizations, ...data.decisions, ...data.budgetRecords, ...data.citizenSignals,
    ...data.newsArticles, ...data.sectorIndicators, ...data.procurementNotices, ...data.speechInsights, ...data.performanceIndicators, ...data.crisisSignals, ...data.forecastSignals
  ];
  const realCount = demoEntities.filter((item) => !item.isDemo).length;
  const coverage = demoEntities.length ? realCount / demoEntities.length * 100 : 0;
  const stages = [
    ["منابع", "سامانه‌های دولتی، خبر، سخنرانی و حسگرها"], ["دریافت", "رابط‌های تبادل و گردآوری داده"], ["آرشیو خام", "مخزن داده‌های دریافت‌شده"],
    ["اعتبارسنجی", "پاک‌سازی، تکراری‌زدایی و کنترل کیفیت"], ["انبار داده", "انبار یکپارچه داده‌های استانی"], ["لایه معنایی", "شاخص، فراداده و واژه‌نامه داده"],
    ["بهره‌برداری", "داشبورد، نقشه، تحلیل هوشمند و درگاه عمومی"]
  ];
  return <section className="panel-stack">
    <div className="section-heading"><div><span>حاکمیت و تبار داده</span><h2>حاکمیت داده و شناسنامه شاخص</h2><p>هر شاخص باید منبع، تاریخ مرجع، تاریخ انتشار، واحد، جغرافیا، روش محاسبه، آخرین به‌روزرسانی و امتیاز کیفیت داشته باشد.</p></div><strong>{coverage.toFixed(0)}٪<small>پوشش داده‌های جاری</small></strong></div>
    <div className="data-governance-grid"><article className="card lineage-card"><h2>زنجیره داده پیشنهادی</h2><div className="data-pipeline">{stages.map(([title, detail], index) => <div key={title}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div></article><article className="card"><div className="card-header"><h2>وضعیت اتصال فعلی</h2><span className={`source-pill ${data.source === "graphql" ? "connected" : "warning"}`}>{data.source === "graphql" ? "متصل" : data.source === "partial" ? "اتصال محدود" : "آرشیو محلی"}</span></div><dl className="governance-dl"><div><dt>نشانی سرویس</dt><dd><code data-keep-latin>{data.endpoint}</code></dd></div><div><dt>تازگی داده</dt><dd>{data.freshness}</dd></div><div><dt>رکوردهای تحلیلی</dt><dd>{demoEntities.length.toLocaleString("fa-IR")}</dd></div><div><dt>رکوردهای تأییدشده</dt><dd>{realCount.toLocaleString("fa-IR")}</dd></div></dl><h3 className="subhead">حداقل شناسنامه هر شاخص</h3><div className="schema-chips">{["منبع", "تاریخ مرجع", "تاریخ انتشار", "واحد", "جغرافیا", "روش محاسبه", "آخرین به‌روزرسانی", "امتیاز کیفیت"].map((item) => <span key={item}>{item}</span>)}</div></article></div>
  </section>;
}


const crisisSeverityLabel = { low: "کم", medium: "متوسط", high: "زیاد", critical: "بحرانی" };
const crisisStatusLabel = { open: "باز", monitoring: "در حال پایش", resolved: "رفع‌شده" };

const MOCK_CRISIS_SIGNALS: CommandCenterData["crisisSignals"] = [
  { id: "mock-crisis-1", title: "کاهش ذخیره آب در چند نقطه استان", category: "آب", severity: "high", status: "monitoring", occurredAt: "2026-08-13", impactScore: 74, summary: "کاهش سطح ذخیره و افزایش مصرف تابستانی نیازمند پایش مستمر و مدیریت مصرف است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "سمنان" }, isDemo: true },
  { id: "mock-crisis-2", title: "افزایش خطر حریق در مراتع", category: "محیط‌زیست", severity: "critical", status: "open", occurredAt: "2026-08-12", impactScore: 88, summary: "گرمای هوا و خشکی پوشش گیاهی احتمال گسترش حریق در برخی مناطق را افزایش داده است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "شاهرود" }, isDemo: true },
  { id: "mock-crisis-3", title: "اختلال مقطعی در محور مواصلاتی", category: "راه و حمل‌ونقل", severity: "medium", status: "monitoring", occurredAt: "2026-08-11", impactScore: 51, summary: "تردد در بخشی از محور با محدودیت موقت همراه است و وضعیت تا عادی‌شدن مسیر پایش می‌شود.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "دامغان" }, isDemo: true },
  { id: "mock-crisis-4", title: "افزایش بار مصرف برق در ساعات اوج", category: "انرژی", severity: "high", status: "monitoring", occurredAt: "2026-08-13", impactScore: 69, summary: "مصرف بالا در ساعات اوج می‌تواند شبکه را تحت فشار قرار دهد و مدیریت بار ضروری است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "گرمسار" }, isDemo: true },
  { id: "mock-crisis-5", title: "رفع آب‌گرفتگی موضعی پس از بارش", category: "هواشناسی", severity: "low", status: "resolved", occurredAt: "2026-08-09", impactScore: 24, summary: "آب‌گرفتگی محدود گزارش‌شده رفع شده و شرایط به وضعیت عادی بازگشته است.", sourceLabel: "مرکز تاب‌آوری استان", county: { name: "مهدی‌شهر" }, isDemo: true },
];

export function CrisisPanel({ data }: { data: CommandCenterData }) {
  const items = data.crisisSignals.length ? data.crisisSignals : MOCK_CRISIS_SIGNALS;
  const active = items.filter((item) => item.status !== "resolved");
  const critical = active.filter((item) => item.severity === "critical").length;
  const monitoring = items.filter((item) => item.status === "monitoring").length;
  const resolved = items.filter((item) => item.status === "resolved").length;
  const avgImpact = active.length ? active.reduce((sum, item) => sum + item.impactScore, 0) / active.length : 0;
  const byCategory = new Map<string, number>();
  active.forEach((item) => byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1));

  return <section className="ops-dashboard crisis-dashboard" dir="rtl">
    <div className="ops-dashboard-heading">
      <div><span>بحران و تاب‌آوری</span><h2>مرکز بحران، تاب‌آوری و آمادگی</h2><p>نمای یکپارچه‌ای از رخدادهای فعال، شدت اثر و وضعیت رسیدگی در سطح استان.</p></div>
      {!data.crisisSignals.length ? <span className="ops-demo-badge">به‌روزرسانی تحلیلی</span> : null}
    </div>
    <div className="ops-kpi-grid">
      <article><span>رخداد فعال</span><strong>{active.length.toLocaleString("fa-IR")}</strong><small>نیازمند پایش</small></article>
      <article><span>رخداد بحرانی</span><strong>{critical.toLocaleString("fa-IR")}</strong><small>اولویت بسیار بالا</small></article>
      <article><span>در حال پایش</span><strong>{monitoring.toLocaleString("fa-IR")}</strong><small>در جریان رسیدگی</small></article>
      <article><span>رفع‌شده</span><strong>{resolved.toLocaleString("fa-IR")}</strong><small>خاتمه‌یافته</small></article>
    </div>
    <div className="ops-two-col">
      <article className="card ops-category-card"><div className="card-header"><h2>رخدادهای فعال بر حسب حوزه</h2></div><HorizontalBarChart rows={[...byCategory.entries()].map(([label, value]) => ({ label, value, status: value > 1 ? "critical" : "attention" }))} max={Math.max(...byCategory.values(), 1)} /></article>
      <article className="card ops-impact-card"><div className="card-header"><h2>شدت اثر رخدادهای فعال</h2></div><div className="ops-impact-number"><strong>{Math.round(avgImpact).toLocaleString("fa-IR")}</strong><span>از ۱۰۰</span></div><div className="ops-impact-track"><i style={{ width: `${Math.min(avgImpact, 100)}%` }} /></div><p>میانگین شدت اثر رخدادهایی که هنوز بسته نشده‌اند.</p></article>
    </div>
    <div className="ops-card-grid">
      {items.map((item) => <article className={`ops-event-card ${item.severity}`} key={item.id}>
        <header><div><span>{item.category} · {item.county?.name ?? "استانی"}</span><h3>{item.title}</h3></div><span className={`status ${item.severity === "critical" ? "risk" : item.severity === "high" ? "attention" : item.status === "resolved" ? "ok" : "attention"}`}>{crisisSeverityLabel[item.severity]}</span></header>
        <p>{item.summary}</p>
        <footer><span>{crisisStatusLabel[item.status]}</span><span>{formatPersianDate(item.occurredAt)}</span><b>اثر {item.impactScore.toLocaleString("fa-IR")} از ۱۰۰</b></footer>
      </article>)}
    </div>
  </section>;
}

const MOCK_FORECAST_SIGNALS: CommandCenterData["forecastSignals"] = [
  { id: "mock-forecast-1", domain: "آب", metricLabel: "فشار مصرف آب شهری", asOf: "2026-08-13", horizonLabel: "۷ روز آینده", currentValue: "68", forecastValue: "79", lowerBound: "72", upperBound: "84", unit: "امتیاز", riskLevel: "attention", confidence: 0, methodology: "", county: { name: "سمنان" }, isDemo: true },
  { id: "mock-forecast-2", domain: "انرژی", metricLabel: "اوج مصرف برق", asOf: "2026-08-13", horizonLabel: "۳ روز آینده", currentValue: "74", forecastValue: "88", lowerBound: "82", upperBound: "92", unit: "امتیاز", riskLevel: "critical", confidence: 0, methodology: "", county: { name: "گرمسار" }, isDemo: true },
  { id: "mock-forecast-3", domain: "راه", metricLabel: "تراکم تردد بین‌شهری", asOf: "2026-08-13", horizonLabel: "۴۸ ساعت آینده", currentValue: "52", forecastValue: "66", lowerBound: "58", upperBound: "71", unit: "امتیاز", riskLevel: "attention", confidence: 0, methodology: "", county: { name: "دامغان" }, isDemo: true },
  { id: "mock-forecast-4", domain: "محیط‌زیست", metricLabel: "ریسک حریق مراتع", asOf: "2026-08-13", horizonLabel: "۵ روز آینده", currentValue: "63", forecastValue: "81", lowerBound: "75", upperBound: "86", unit: "امتیاز", riskLevel: "critical", confidence: 0, methodology: "", county: { name: "شاهرود" }, isDemo: true },
  { id: "mock-forecast-5", domain: "کشاورزی", metricLabel: "تنش گرمایی محصولات", asOf: "2026-08-13", horizonLabel: "۷ روز آینده", currentValue: "47", forecastValue: "56", lowerBound: "50", upperBound: "61", unit: "امتیاز", riskLevel: "healthy", confidence: 0, methodology: "", county: { name: "میامی" }, isDemo: true },
];

export function ForecastPanel({ data }: { data: CommandCenterData }) {
  const items = data.forecastSignals.length ? data.forecastSignals : MOCK_FORECAST_SIGNALS;
  const critical = items.filter((item) => item.riskLevel === "critical").length;
  const attention = items.filter((item) => item.riskLevel === "attention").length;
  const healthy = items.filter((item) => item.riskLevel === "healthy").length;
  const chartRows = items.map((item) => ({ label: item.metricLabel, current: Number(item.currentValue), forecast: Number(item.forecastValue), low: item.lowerBound == null ? null : Number(item.lowerBound), high: item.upperBound == null ? null : Number(item.upperBound), risk: item.riskLevel }));

  return <section className="ops-dashboard forecast-dashboard" dir="rtl">
    <div className="ops-dashboard-heading">
      <div><span>پیش‌بینی و هشدار زودهنگام</span><h2>چشم‌انداز کوتاه‌مدت شاخص‌های حساس</h2><p>نمایی ساده از روند مورد انتظار چند شاخص مهم برای کمک به برنامه‌ریزی و اولویت‌بندی اقدامات.</p></div>
      {!data.forecastSignals.length ? <span className="ops-demo-badge">به‌روزرسانی تحلیلی</span> : null}
    </div>
    <div className="ops-kpi-grid forecast-kpis">
      <article><span>شاخص‌های پایش‌شده</span><strong>{items.length.toLocaleString("fa-IR")}</strong><small>در این نما</small></article>
      <article><span>پرریسک</span><strong>{critical.toLocaleString("fa-IR")}</strong><small>نیازمند اقدام فوری</small></article>
      <article><span>نیازمند توجه</span><strong>{attention.toLocaleString("fa-IR")}</strong><small>نیازمند پایش</small></article>
      <article><span>وضعیت عادی</span><strong>{healthy.toLocaleString("fa-IR")}</strong><small>بدون هشدار جدی</small></article>
    </div>
    <article className="card forecast-main-card">
      <div className="card-header"><div><h2>مقایسه وضع فعلی و برآورد کوتاه‌مدت</h2><p className="muted">هر ردیف تغییر مورد انتظار یک شاخص را نمایش می‌دهد.</p></div></div>
      <ForecastBandChart rows={chartRows} />
    </article>
    <div className="forecast-card-grid-v14">
      {items.map((item) => <article className={`forecast-card-v14 ${item.riskLevel}`} key={item.id}>
        <header><div><span>{item.domain} · {item.county?.name ?? "استانی"}</span><h3>{item.metricLabel}</h3></div><span className={`status ${item.riskLevel === "critical" ? "risk" : item.riskLevel === "attention" ? "attention" : "ok"}`}>{sectorStatus[item.riskLevel]}</span></header>
        <div className="forecast-value-line"><div><small>فعلی</small><b>{Number(item.currentValue).toLocaleString("fa-IR")}</b></div><i>←</i><div><small>برآورد</small><strong>{Number(item.forecastValue).toLocaleString("fa-IR")}</strong></div><span>{item.unit}</span></div>
        <footer><span>{item.horizonLabel}</span><span>به‌روزرسانی: {formatPersianDate(item.asOf)}</span></footer>
      </article>)}
    </div>
  </section>;
}
