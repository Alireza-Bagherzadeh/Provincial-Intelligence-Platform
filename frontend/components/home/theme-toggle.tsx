"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("semnan-theme", next);
    setTheme(next);
  };

  return <button className="icon-button" type="button" onClick={toggle} aria-label={theme === "dark" ? "فعال‌سازی زمینه روشن" : "فعال‌سازی زمینه تیره"} title={theme === "dark" ? "زمینه روشن" : "زمینه تیره"}>
    <Icon name={theme === "dark" ? "sun" : "moon"} />
  </button>;
}

