"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import img from "../assets/logowhite.png";
import type { ExecutiveWorkspaceId } from "../features/executive/data/executive-workspaces";

export const commandSections = [
  { id: "overview", label: "نمای کلی", group: "فرماندهی" },
  { id: "monitoring", label: "رصد استان", group: "فرماندهی" },
  { id: "map", label: "نقشه هوشمند", group: "فرماندهی" },
  { id: "benchmark", label: "مقایسه شهرستان‌ها", group: "فرماندهی" },
  { id: "county-profile", label: "پرونده شهرستان منتخب", group: "فرماندهی" },

  { id: "executive-governor", label: "محمدجواد کولیوند | استاندار", group: "پنل اختصاصی مدیران" },
  { id: "governor-minutes", label: "صورت‌جلسات و گزارش چاپی", group: "پنل اختصاصی مدیران" },
  { id: "executive-civil", label: "فرج‌الله ایلیات | عمرانی", group: "پنل اختصاصی مدیران" },
  { id: "executive-economic", label: "حمید دهرویه | اقتصادی", group: "پنل اختصاصی مدیران" },
  { id: "executive-political", label: "مهدی آقابراری | سیاسی و اجتماعی", group: "پنل اختصاصی مدیران" },
  { id: "executive-resources", label: "رضا عبدالله‌زاده | توسعه مدیریت", group: "پنل اختصاصی مدیران" },

  { id: "projects", label: "پروژه‌ها", group: "عملیات" },
  { id: "counties", label: "شهرستان‌ها", group: "عملیات" },
  { id: "organizations", label: "دستگاه‌های اجرایی", group: "عملیات" },
  { id: "performance", label: "ارزیابی عملکرد", group: "عملیات" },
  { id: "decisions", label: "مصوبات و تعهدات", group: "عملیات" },
  { id: "finance", label: "بودجه و سرمایه‌گذاری", group: "عملیات" },
  { id: "procurement", label: "مناقصات و خرید", group: "عملیات" },

  { id: "sectors", label: "بخش‌بندی هوشمند", group: "هوشمندی" },
  { id: "news", label: "خبرگزاری هوشمند", group: "هوشمندی" },
  { id: "speech", label: "نکات کلیدی در سخنان", group: "هوشمندی" },
  { id: "citizen", label: "صدای مردم", group: "هوشمندی" },
  { id: "alerts", label: "هشدارها", group: "هوشمندی" },
  { id: "crisis", label: "بحران و تاب‌آوری", group: "هوشمندی" },
  {
    id: "forecast",
    label: "پیش‌بینی و هشدار زودهنگام",
    group: "هوشمندی",
  },

  { id: "reports", label: "گزارش‌ها", group: "داده و هوش مصنوعی" },
  { id: "manage", label: "مدیریت داده", group: "داده و هوش مصنوعی" },
  { id: "ai", label: "دستیار هوشمند", group: "داده و هوش مصنوعی" },

  { id: "role-reports", label: "گزارش‌های حوزه من", group: "فضای کاری من" },
  { id: "role-decisions", label: "مصوبات حوزه من", group: "فضای کاری من" },
] as const;

export type CommandSectionId =
  (typeof commandSections)[number]["id"];

type VisibleCommandSection = {
  id: CommandSectionId;
  label: string;
  group: string;
};

const roleOnlySections: CommandSectionId[] = ["role-reports", "role-decisions"];

export function allowedCommandSectionIds(workspaceId: ExecutiveWorkspaceId) {
  if (workspaceId === "executive-governor") {
    return commandSections.map((section) => section.id);
  }

  return [workspaceId, ...roleOnlySections, "ai"] as CommandSectionId[];
}

export function visibleCommandSections(workspaceId: ExecutiveWorkspaceId): VisibleCommandSection[] {
  if (workspaceId === "executive-governor") {
    return commandSections
      .filter((section) => !roleOnlySections.includes(section.id))
      .map((section) => ({
        ...section,
        group: section.group === "پنل اختصاصی مدیران" ? "نظارت عالی مدیران" : section.group,
      }));
  }

  return commandSections
    .filter((section) => section.id === workspaceId || roleOnlySections.includes(section.id) || section.id === "ai")
    .map((section) => ({
      ...section,
      label: section.id === workspaceId ? "داشبورد اختصاصی من" : section.label,
      group: section.id === "ai" ? "دستیار همراه" : "فضای کاری من",
    }));
}

export function Sidebar({
  activeSection,
  onSelect,
  workspaceId,
}: {
  activeSection: CommandSectionId;
  onSelect: (section: CommandSectionId) => void;
  workspaceId: ExecutiveWorkspaceId;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleSections = visibleCommandSections(workspaceId);

  const groups = [
    ...new Set(visibleSections.map((section) => section.group)),
  ];

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSelect = (section: CommandSectionId) => {
    onSelect(section);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="باز کردن منو"
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        className={`sidebar-backdrop ${
          mobileOpen ? "is-open" : ""
        }`}
        onClick={() => setMobileOpen(false)}
        aria-label="بستن منو"
      />

      <aside
        className={`side ${mobileOpen ? "is-open" : ""}`}
      >
        {/* لوگو جدا و بالا */}
        <Image
          src={img}
          alt="مرکز راهبری پژوهش و پیشرفت هوش مصنوعی"
          className="side-logo"
          priority
        />

        {/* همان ساختار اصلی خودت */}
        <div className="side-brand">
          <span className="side-mark">س</span>

          <div>
            <span>مرکز فرماندهی</span>
            <small>استان سمنان</small>
          </div>
        </div>

        <nav aria-label="ناوبری مرکز فرماندهی">
          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <small>{group}</small>

              {visibleSections
                .filter(
                  (section) =>
                    section.group === group
                )
                .map((section) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() =>
                      handleSelect(section.id)
                    }
                    className={`nav-item ${
                      activeSection === section.id
                        ? "active"
                        : ""
                    }`}
                    aria-current={
                      activeSection === section.id
                        ? "page"
                        : undefined
                    }
                  >
                    <i />
                    {section.label}
                  </button>
                ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
