"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("semnan-theme", next);
    setTheme(next);
  };

  const isLight = theme === "light";

  return <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={isLight ? "فعال کردن حالت تیره" : "فعال کردن حالت روشن"} title={isLight ? "حالت تیره" : "حالت روشن"}>
    <span aria-hidden="true">{isLight ? "☾" : "☀"}</span>
    <b>{isLight ? "حالت تیره" : "حالت روشن"}</b>
  </button>;
}
