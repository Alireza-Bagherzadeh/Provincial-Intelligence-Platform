"use client";

import { useEffect, useRef, useState } from "react";

import type { CommandCenterData } from "../features/command/types";
import { SectionRouter } from "../features/sections/components/section-router";
import { allowedCommandSectionIds, commandSections, Sidebar, type CommandSectionId, visibleCommandSections } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { executiveWorkspaces, isExecutiveWorkspaceId } from "../features/executive/data/executive-workspaces";
import type { ExecutiveWorkspaceId } from "../features/executive/data/executive-workspaces";
import { countyNames, dashboardMonths } from "../features/counties/data/county-analytics";
import { PersianDigitNormalizer } from "./persian-digit-normalizer";
import { FloatingAssistant } from "./floating-assistant";

export function CommandCenter({ data }: { data: CommandCenterData }) {
  const [activeSection, setActiveSection] = useState<CommandSectionId>("overview");
  const [selectedMonth, setSelectedMonth] = useState(dashboardMonths[0]);
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [sessionWorkspace, setSessionWorkspace] = useState<ExecutiveWorkspaceId>("executive-governor");
  const [panelWorkspace, setPanelWorkspace] = useState<ExecutiveWorkspaceId>("executive-governor");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const active = commandSections.find((section) => section.id === activeSection) ?? commandSections[0];
  const isManage = activeSection === "manage";
  const activeWorkspace = isExecutiveWorkspaceId(activeSection) ? executiveWorkspaces[activeSection] : executiveWorkspaces[panelWorkspace];
  const activePerson = executiveWorkspaces[sessionWorkspace].person;
  const visibleSections = visibleCommandSections(sessionWorkspace);
  const selectedCountyName = selectedCounty === "all" ? "همه شهرستان‌ها" : countyNames.find((county) => county.code === selectedCounty)?.name ?? "همه شهرستان‌ها";

  useEffect(() => {
    const requested = window.location.hash.replace("#", "") as CommandSectionId;
    const storedRole = window.localStorage.getItem("semnan-active-role");
    const storedMonth = window.localStorage.getItem("semnan-selected-month");
    const storedCounty = window.localStorage.getItem("semnan-selected-county");
    const authenticatedWorkspace = isExecutiveWorkspaceId(storedRole ?? "") ? storedRole as ExecutiveWorkspaceId : "executive-governor";
    const allowedSections = allowedCommandSectionIds(authenticatedWorkspace);
    const fallbackSection: CommandSectionId = authenticatedWorkspace === "executive-governor" ? "overview" : authenticatedWorkspace;
    setSessionWorkspace(authenticatedWorkspace);
    setPanelWorkspace(authenticatedWorkspace);
    if (storedMonth && dashboardMonths.includes(storedMonth)) setSelectedMonth(storedMonth);
    if (storedCounty && (storedCounty === "all" || countyNames.some((county) => county.code === storedCounty))) setSelectedCounty(storedCounty);
    if (allowedSections.includes(requested)) {
      setActiveSection(requested);
      if (isExecutiveWorkspaceId(requested)) setPanelWorkspace(requested);
    } else {
      setActiveSection(fallbackSection);
      window.history.replaceState(null, "", `#${fallbackSection}`);
    }
  }, []);

  useEffect(() => {
    const closeProfileMenu = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeProfileMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeProfileMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const navigate = (section: CommandSectionId) => {
    if (!allowedCommandSectionIds(sessionWorkspace).includes(section)) return;
    setActiveSection(section);
    if (isExecutiveWorkspaceId(section)) {
      setPanelWorkspace(section);
    }
    window.history.replaceState(null, "", `#${section}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeMonth = (month: string) => {
    setSelectedMonth(month);
    window.localStorage.setItem("semnan-selected-month", month);
  };

  const changeCounty = (county: string) => {
    setSelectedCounty(county);
    window.localStorage.setItem("semnan-selected-county", county);
    if (county !== "all") navigate("county-profile");
  };

  const logoutAndChangeManager = () => {
    window.localStorage.removeItem("semnan-active-role");
    window.location.assign("/login");
  };

  return <main className="command">
    <PersianDigitNormalizer />
    <Sidebar activeSection={activeSection} onSelect={navigate} workspaceId={sessionWorkspace} />
    <section className={`main ${isManage ? "manage-main" : ""}`}>
      <header className={`topbar ${isManage ? "manage-topbar" : ""}`}>
        <div className="breadcrumb">مرکز فرماندهی / {active.label}</div>
        <div className="top-actions">
          <select className="mobile-nav" value={activeSection} onChange={(event) => navigate(event.target.value as CommandSectionId)} aria-label="انتخاب بخش مرکز فرماندهی">
            {visibleSections.map((section) => <option value={section.id} key={section.id}>{section.label}</option>)}
          </select>
          <ThemeToggle />
          {sessionWorkspace === "executive-governor" ? <button type="button" className={`filter data-entry-shortcut ${isManage ? "active" : ""}`} onClick={() => navigate("manage")}>+ ورود داده</button> : null}
          <select className="filter topbar-filter-select" value={selectedMonth} onChange={(event) => changeMonth(event.target.value)} aria-label="انتخاب ماه گزارش">{dashboardMonths.map((month) => <option value={month} key={month}>{month}</option>)}</select>
          <select className="filter topbar-filter-select" value={selectedCounty} onChange={(event) => changeCounty(event.target.value)} aria-label="انتخاب شهرستان"><option value="all">همه شهرستان‌ها</option>{countyNames.map((county) => <option value={county.code} key={county.code}>{county.name}</option>)}</select>
          <div className="profile-menu" ref={profileMenuRef}>
            <button type="button" className="governor-profile" aria-label={`پروفایل ${activePerson.role}`} aria-expanded={profileMenuOpen} aria-haspopup="menu" onClick={() => setProfileMenuOpen((open) => !open)}>
              <span className="avatar">{activePerson.initials}</span>
              <span><strong>{activePerson.name}</strong><small>{activePerson.role}</small></span>
              <i aria-hidden="true">⌄</i>
            </button>
            {profileMenuOpen ? <div className="profile-dropdown" role="menu">
              <div><span className="avatar">{activePerson.initials}</span><p><strong>{activePerson.name}</strong><small>{activePerson.role}</small></p></div>
              <button type="button" role="menuitem" onClick={logoutAndChangeManager}><span aria-hidden="true">↪</span><p><strong>خروج از حساب</strong><small>بازگشت به صفحه ورود</small></p></button>
            </div> : null}
          </div>
        </div>
      </header>
      {!isManage ? <>
        <div className="heading">
          <div>
            <p>مرکز پایش و تصمیم‌سازی استاندار سمنان</p>
            <h1>{active.label}</h1>
            <p>{isExecutiveWorkspaceId(activeSection) ? activeWorkspace.subtitle : activeSection === "overview" ? "خلاصهٔ وضعیت، تغییرات و موارد نیازمند اقدام در یک نگاه." : `نمای تحلیلی ${selectedCountyName} در ${selectedMonth}.`}</p>
          </div>
        </div>
      </> : null}
      <SectionRouter section={activeSection} data={data} onNavigate={navigate} selectedMonth={selectedMonth} selectedCounty={selectedCounty} selectedCountyName={selectedCountyName} workspaceId={panelWorkspace} />
    </section>
    <FloatingAssistant data={data} viewer={{ name: activePerson.name, role: activePerson.role }} currentSection={active.label} month={selectedMonth} county={selectedCountyName} />
  </main>;
}
