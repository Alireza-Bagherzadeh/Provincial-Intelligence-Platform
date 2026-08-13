import Link from "next/link";

export function PublicHeader() {
  return <header className="public-nav">
    <Link className="brand" href="/"><span className="brand-mark">س</span><span><b>استانداری سمنان</b><small>پرتال حکمرانی هوشمند</small></span></Link>
    <nav className="nav-links" aria-label="ناوبری اصلی">
      <a href="#province">نمای استان</a><a href="#intelligence">نبض استان</a><a href="#news">اخبار و گردشگری</a><a href="#transparency">شفافیت</a><a href="#services">خدمات</a>
    </nav>
    <Link className="nav-cta" href="/command">مرکز فرماندهی <span>↗</span></Link>
  </header>;
}
