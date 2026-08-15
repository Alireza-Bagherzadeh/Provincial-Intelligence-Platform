import Link from "next/link";

import { loginRoles } from "../../dashboard/features/executive/data/login-roles";

export default function LoginPage() {
  return <main className="login-portal">
    <div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" />
    <header className="login-portal-head"><Link href="/">بازگشت به صفحه نخست</Link><span>مرکز فرماندهی استان سمنان</span></header>
    <section className="login-portal-copy"><span>ورود مدیران ارشد استان</span><h1>پنل اختصاصی خود را انتخاب کنید</h1><p>هر مدیر پس از ورود، گزارش‌ها، شاخص‌ها و مقایسه شهرستانی متناسب با حوزه مسئولیت خود را مشاهده می‌کند.</p></section>
    <section className="login-role-grid">
      {loginRoles.map((role, index) => <Link href={`/login/${role.slug}`} className={`login-role-card ${index === 0 ? "governor" : ""}`} key={role.slug}>
        <span className="login-role-index">{new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 }).format(index + 1)}</span>
        <span className="login-role-avatar">{role.initials}</span>
        <div><small>{role.role}</small><h2>{role.honorific ? `${role.honorific} ` : ""}{role.name}</h2><p>{role.description}</p></div>
        <b>ورود اختصاصی <span>←</span></b>
      </Link>)}
    </section>
  </main>;
}
