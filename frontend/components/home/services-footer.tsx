import Link from "next/link";
import { AiracLogo } from "./airac-logo";
import { publicServices } from "./data";
import { Icon } from "./icons";

export function ServicesFooter() {
  return <>
    <section className="services-section section-pad" id="services">
      <div className="page-shell">
        <div className="services-intro"><span className="kicker">درگاه‌های یکپارچه</span><h2>خدمات هوشمند،<br/>برای همه استان</h2><p>مسیرهای روشن و مستقیم برای دسترسی شهروندان، سرمایه‌گذاران و مدیران به خدمات و اطلاعات معتبر.</p></div>
        <div className="services-list">
          {publicServices.map((service, index) => <a className="service-row" href="#services" key={service.title}>
            <span className="service-number">۰{index + 1}</span><span className="service-icon"><Icon name={service.icon} /></span><span><b>{service.title}</b><small>{service.text}</small></span><Icon name="arrow" />
          </a>)}
        </div>
      </div>
    </section>
    <footer className="site-footer">
      <div className="footer-crest" aria-hidden="true"><span /></div>
      <div className="page-shell footer-main">
        <div className="footer-brand">
          <AiracLogo className="footer-airac-logo" />
          <div><b>درگاه حکمرانی هوشمند استان سمنان</b><p>زیرساخت یکپارچه داده، تحلیل و تصمیم‌سازی برای توسعه متوازن و آینده‌نگر استان.</p></div>
        </div>
        <div className="footer-links"><div><b>دسترسی سریع</b><a href="#province">معرفی استان</a><a href="#projects">پروژه‌های پیشران</a><a href="#news">اخبار و رویدادها</a></div><div><b>سامانه‌ها</b><Link href="/command">مرکز فرماندهی</Link><a href="#services">میز خدمت هوشمند</a><a href="#services">شفافیت عملکرد</a></div></div>
        <div className="footer-contact"><b>ارتباط با استانداری</b><p>سمنان، میدان استاندارد، استانداری سمنان</p><a href="tel:02333330000">۰۲۳ ـ ۳۳۳۳۰۰۰۰</a><a href="mailto:info@semnan.gov.ir">info@semnan.gov.ir</a></div>
      </div>
      <div className="page-shell footer-bottom"><span>تمامی حقوق این درگاه متعلق به مرکز راهبری پژوهش و پیشرفت هوش مصنوعی است.</span><span>نسخه ۱.۰ · به‌روزرسانی مرداد ۱۴۰۵</span></div>
    </footer>
  </>;
}

