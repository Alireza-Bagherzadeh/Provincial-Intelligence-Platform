"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import img from "../assets/logowhite.png";

export const commandSections = [
  { id: "overview", label: "نمای کلی", group: "فرماندهی" },
  { id: "monitoring", label: "رصد استان", group: "فرماندهی" },
  { id: "map", label: "نقشه هوشمند", group: "فرماندهی" },
  { id: "benchmark", label: "مقایسه شهرستان‌ها", group: "فرماندهی" },

  { id: "projects", label: "پروژه‌ها", group: "عملیات" },
  { id: "counties", label: "شهرستان‌ها", group: "عملیات" },
  { id: "organizations", label: "دستگاه‌های اجرایی", group: "عملیات" },
  { id: "performance", label: "ارزیابی عملکرد", group: "عملیات" },
  { id: "decisions", label: "مصوبات و تعهدات", group: "عملیات" },
  { id: "finance", label: "بودجه و سرمایه‌گذاری", group: "عملیات" },
  { id: "procurement", label: "مناقصات و خرید", group: "عملیات" },

  { id: "sectors", label: "هوشمندی بخشی", group: "هوشمندی" },
  { id: "news", label: "هوشمندی خبر", group: "هوشمندی" },
  { id: "speech", label: "هوشمندی سخنان", group: "هوشمندی" },
  { id: "citizen", label: "صدای مردم", group: "هوشمندی" },
  { id: "alerts", label: "هشدارها", group: "هوشمندی" },
  { id: "crisis", label: "بحران و تاب‌آوری", group: "هوشمندی" },
  {
    id: "forecast",
    label: "پیش‌بینی و هشدار زودهنگام",
    group: "هوشمندی",
  },

  { id: "reports", label: "گزارش‌ها", group: "داده و AI" },
  { id: "manage", label: "مدیریت داده", group: "داده و AI" },
  { id: "ai", label: "دستیار هوشمند", group: "داده و AI" },
] as const;

export type CommandSectionId =
  (typeof commandSections)[number]["id"];

export function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: CommandSectionId;
  onSelect: (section: CommandSectionId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = [
    ...new Set(commandSections.map((section) => section.group)),
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

              {commandSections
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