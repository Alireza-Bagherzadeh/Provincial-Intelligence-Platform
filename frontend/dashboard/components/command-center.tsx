"use client";

import { useEffect, useState } from "react";

import type { CommandCenterData } from "../features/command/types";
import { SectionRouter } from "../features/sections/components/section-router";
import { commandSections, Sidebar, type CommandSectionId } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export function CommandCenter({ data }: { data: CommandCenterData }) {
  const [activeSection, setActiveSection] = useState<CommandSectionId>("overview");
  const active = commandSections.find((section) => section.id === activeSection) ?? commandSections[0];
  const isManage = activeSection === "manage";

  useEffect(() => {
    const requested = window.location.hash.replace("#", "") as CommandSectionId;
    if (commandSections.some((section) => section.id === requested)) setActiveSection(requested);
  }, []);

  const navigate = (section: CommandSectionId) => {
    setActiveSection(section);
    window.history.replaceState(null, "", `#${section}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <main className="command">
    <Sidebar activeSection={activeSection} onSelect={navigate} />
    <section className={`main ${isManage ? "manage-main" : ""}`}>
      {!isManage ? <>
        <header className="topbar">
          <div className="breadcrumb">مرکز فرماندهی / {active.label}</div>
          <div className="top-actions">
            <select className="mobile-nav" value={activeSection} onChange={(event) => navigate(event.target.value as CommandSectionId)} aria-label="انتخاب بخش مرکز فرماندهی">
              {commandSections.map((section) => <option value={section.id} key={section.id}>{section.label}</option>)}
            </select>
            <ThemeToggle />
            <button type="button" className="filter data-entry-shortcut" onClick={() => navigate("manage")}>+ ورود داده</button>
            <button type="button" className="filter">این ماه</button>
            <button type="button" className="filter">همهٔ شهرستان‌ها</button>
            <div className="governor-profile" aria-label="پروفایل استاندار سمنان">
              <span className="avatar">م‌ک</span>
              <span><strong>محمدجواد کولیوند</strong><small>استاندار سمنان</small></span>
            </div>
          </div>
        </header>
        <div className="heading">
          <div>
            <p>مرکز پایش و تصمیم‌سازی استاندار سمنان</p>
            <h1>{active.label}</h1>
            <p>{activeSection === "overview" ? "خلاصهٔ وضعیت، تغییرات و موارد نیازمند اقدام در یک نگاه." : "نمای تحلیلی متصل به داده‌های مرکز فرماندهی استان."}</p>
          </div>
        </div>
      </> : null}
      <SectionRouter section={activeSection} data={data} onNavigate={navigate} />
    </section>
  </main>;
}
