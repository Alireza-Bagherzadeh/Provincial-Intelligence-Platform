"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { LoginRole } from "../../dashboard/features/executive/data/login-roles";

export function RoleLoginForm({ role }: { role: LoginRole }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.localStorage.setItem("semnan-active-role", role.workspaceId);
    window.setTimeout(() => router.push(`/command#${role.workspaceId}`), 250);
  }

  return <main className="role-login-page">
    <div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" />
    <section className="role-login-shell">
      <Link className="login-back" href="/login">← انتخاب مدیر دیگر</Link>
      <div className="role-login-identity">
        <span className="role-login-avatar">{role.initials}</span>
        <div><small>درگاه اختصاصی مدیران استان</small><h1>{role.honorific ? `${role.honorific} ` : ""}{role.name}</h1><p>{role.role}</p></div>
      </div>
      <div className="role-login-grid">
        <div className="role-login-intro">
          <span>مرکز پایش و تصمیم‌سازی استان سمنان</span>
          <h2>ورود امن به پنل اختصاصی</h2>
          <p>{role.description}</p>
          <ul><li>گزارش‌های مدیریتی متناسب با حوزه مسئولیت</li><li>مقایسه شاخص‌های شهرستانی</li><li>هشدارها، مصوبات و اقدامات اولویت‌دار</li></ul>
        </div>
        <form className="role-login-form" onSubmit={submit}>
          <label><span>شناسه سازمانی</span><input name="username" autoComplete="username" placeholder="شناسه سازمانی خود را وارد کنید" /></label>
          <label><span>رمز عبور</span><input name="password" type="password" autoComplete="current-password" placeholder="رمز عبور" /></label>
          <div className="role-login-options"><label><input type="checkbox" /> مرا به خاطر بسپار</label><button type="button">بازیابی رمز عبور</button></div>
          <button className="role-login-submit" type="submit" disabled={submitting}>{submitting ? "در حال ورود..." : "ورود به پنل اختصاصی"}<span>←</span></button>
        </form>
      </div>
    </section>
  </main>;
}
