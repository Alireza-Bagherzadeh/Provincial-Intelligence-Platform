"use client";

import { FormEvent, useMemo, useState } from "react";

import type { CommandCenterData } from "../../command/types";

export function AiPanel({ data }: { data: CommandCenterData }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("یک پرسش مدیریتی انتخاب یا تایپ کن. پاسخ بر اساس اطلاعات ثبت‌شده در سامانه آماده می‌شود.");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<string | null>(null);

  const prompts = useMemo(() => [
    "سه مسئله اصلی امروز چیست؟",
    "کدام شهرستان نیازمند توجه بیشتر است و چرا؟",
    "خلاصه خبرها و موضوعات مهم استان را بده.",
    "وضعیت پروژه‌ها و مصوبات عقب‌مانده را جمع‌بندی کن.",
    "هشدارهای بحران و پیش‌بینی‌های پرریسک را اولویت‌بندی کن.",
    "چه تعهداتی از سخنان مدیریتی باید پیگیری شوند؟"
  ], []);

  async function ask(value: string) {
    const cleaned = value.trim();
    if (!cleaned || loading) return;
    setQuestion(cleaned);
    setLoading(true);
    setAnswer("در حال تحلیل داده‌های مرکز فرماندهی...");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: cleaned })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "پاسخ دستیار در دسترس نیست");
      setAnswer(result.answer);
      setModel(result.model ?? null);
    } catch (error) {
      setAnswer(error instanceof Error ? `خطا: ${error.message}` : "خطای ناشناخته در دستیار هوشمند");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  return <section className="panel-stack">
    <div className="section-heading"><div><span>دستیار مدیریتی</span><h2>دستیار هوشمند اجرایی</h2><p>برای جمع‌بندی سریع وضعیت استان و مرور اطلاعات ثبت‌شده در سامانه.</p></div></div>

    <form className="assistant-input" onSubmit={submit}>
      <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="مثلاً: مهم‌ترین ریسک‌های استان برای ۳۰ روز آینده چیست؟" />
      <button type="submit" disabled={loading}>{loading ? "در حال تحلیل..." : "ارسال پرسش"}</button>
    </form>

    <div className="copilot-layout">
      <article className="copilot-prompts">{prompts.map((prompt) => <button type="button" key={prompt} disabled={loading} onClick={() => void ask(prompt)}>{prompt}<span>←</span></button>)}</article>
      <article className="copilot-answer"><span>پاسخ تحلیلی</span><p className={loading ? "ai-loading" : ""}>{answer}</p></article>
    </div>

    <article className="card rag-architecture"><div><span>راهنمای استفاده</span><h2>چه سؤال‌هایی مناسب این بخش هستند؟</h2><p>سؤال‌های مدیریتی درباره وضعیت پروژه‌ها، خبرهای مهم، تعهدات، هشدارها و روندهای ثبت‌شده در سامانه را مطرح کن.</p></div></article>
  </section>;
}
