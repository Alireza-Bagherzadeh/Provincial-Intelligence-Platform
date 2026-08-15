"use client";

import Link from "next/link";
import { useState } from "react";
import { AiracLogo } from "./airac-logo";
import { Icon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "#province", label: "استان سمنان" },
  { href: "#governance", label: "حکمرانی هوشمند" },
  { href: "#projects", label: "پروژه‌ها" },
  { href: "#news", label: "اخبار و رویدادها" },
  { href: "#services", label: "خدمات" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-shell">
      <Link className="header-brand" href="/" aria-label="صفحه نخست مرکز راهبری پژوهش و پیشرفت هوش مصنوعی">
        <AiracLogo className="header-airac-logo" priority />
        <span><b>سمنان هوشمند</b><small>درگاه حکمرانی و تصمیم‌سازی استان</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="راهبری اصلی">
        {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button search-button" type="button" aria-label="جستجو"><Icon name="search" /></button>
        <ThemeToggle />
        <Link className="command-link" href="/login">ورود مدیران <Icon name="arrow" /></Link>
        <button className="icon-button menu-button" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} aria-label={open ? "بستن فهرست" : "باز کردن فهرست"}><Icon name={open ? "close" : "menu"} /></button>
      </div>
    </div>
    <div id="mobile-navigation" className={`mobile-nav ${open ? "open" : ""}`}>
      {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<Icon name="arrow" /></a>)}
      <Link href="/login">ورود مدیران <Icon name="arrow" /></Link>
    </div>
  </header>;
}
