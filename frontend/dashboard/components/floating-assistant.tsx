"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import type { CommandCenterData } from "../features/command/types";

type ChatMessage = { id: number; role: "user" | "assistant"; text: string };

export function FloatingAssistant({ data, viewer, currentSection, month, county }: { data: CommandCenterData; viewer: { name: string; role: string }; currentSection: string; month: string; county: string }) {
  const [open, setOpen] = useState(false);
  const [invitationVisible, setInvitationVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "assistant", text: "سلام، درباره شاخص‌ها، شهرستان‌ها، گزارش‌ها و اقدامات حوزه خود چه کمکی نیاز دارید؟" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setInvitationVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMessages([{ id: Date.now(), role: "assistant", text: `سلام ${viewer.name}، درباره شاخص‌ها، شهرستان‌ها، گزارش‌ها و اقدامات حوزه خود چه کمکی نیاز دارید؟` }]);
  }, [viewer.name, viewer.role]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const assistantContext = useMemo(() => ({
    viewer,
    currentView: { section: currentSection, month, county },
    metrics: data.metrics,
    executiveBrief: data.brief,
    counties: data.counties,
    projects: data.projects,
    alerts: data.alerts,
    decisions: data.decisions,
    citizenSignals: data.citizenSignals,
    news: data.newsArticles,
    speeches: data.speechInsights,
    crises: data.crisisSignals,
    forecasts: data.forecastSignals,
  }), [county, currentSection, data, month, viewer]);

  async function ask(value: string) {
    const cleaned = value.trim();
    if (!cleaned || loading) return;
    const userMessage: ChatMessage = { id: Date.now(), role: "user", text: cleaned };
    setMessages((items) => [...items, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: cleaned, context: assistantContext }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "پاسخ دستیار در دسترس نیست.");
      setMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: result.answer }]);
    } catch (error) {
      setMessages((items) => [...items, { id: Date.now() + 1, role: "assistant", text: error instanceof Error ? error.message : "دستیار هوشمند موقتاً در دسترس نیست." }]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  const startChat = () => {
    setInvitationVisible(false);
    setOpen(true);
  };

  return <div className="floating-assistant" dir="rtl">
    {!open && invitationVisible ? <aside className="assistant-invitation" aria-label="پیشنهاد استفاده از دستیار هوشمند">
      <button type="button" className="assistant-invitation-close" onClick={() => setInvitationVisible(false)} aria-label="بستن پیشنهاد">×</button>
      <span className="assistant-orb">✦</span>
      <div><strong>مایل به استفاده از دستیار هوشمند هستید؟</strong><small>پرسش خود را همین‌جا و بدون خروج از صفحه مطرح کنید.</small></div>
      <button type="button" onClick={startChat}>شروع گفتگو</button>
    </aside> : null}

    {open ? <section className="floating-chat-panel" aria-label="گفتگو با دستیار هوشمند">
      <header><div><span className="assistant-orb">✦</span><p><strong>دستیار هوشمند استان</strong><small><i /> آماده پاسخ‌گویی به {viewer.role}</small></p></div><button type="button" onClick={() => setOpen(false)} aria-label="بستن گفتگو">×</button></header>
      <div className="floating-chat-context"><span>{currentSection}</span><span>{county}</span><span>{month}</span></div>
      <div className="floating-chat-messages" ref={messagesRef} aria-live="polite">
        {messages.map((message) => <div className={`floating-message ${message.role}`} key={message.id}><span>{message.role === "assistant" ? "✦" : viewer.name.slice(0, 1)}</span><p>{message.text}</p></div>)}
        {loading ? <div className="floating-message assistant loading"><span>✦</span><p><i /><i /><i /></p></div> : null}
      </div>
      <div className="floating-chat-suggestions">{["خلاصه وضعیت امروز", "مهم‌ترین هشدارها", "مصوبات عقب‌مانده"].map((prompt) => <button type="button" key={prompt} disabled={loading} onClick={() => void ask(prompt)}>{prompt}</button>)}</div>
      <form onSubmit={submit}><input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="پرسش خود را بنویسید..." aria-label="پرسش از دستیار هوشمند" /><button type="submit" disabled={loading || !question.trim()} aria-label="ارسال پرسش">←</button></form>
    </section> : <button type="button" className="floating-assistant-trigger" onClick={startChat} aria-label="باز کردن دستیار هوشمند"><span>✦</span><b>دستیار هوشمند</b></button>}
  </div>;
}
