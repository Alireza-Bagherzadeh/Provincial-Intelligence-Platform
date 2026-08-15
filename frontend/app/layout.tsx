import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./home.css";

export const metadata: Metadata = {
  title: "سمنان هوشمند | درگاه حکمرانی و تصمیم‌سازی استان",
  description: "درگاه یکپارچه داده، تحلیل، پروژه‌ها و خدمات هوشمند استان سمنان"
};

const themeScript = `(() => { try { const saved = localStorage.getItem('semnan-theme'); const preferred = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; document.documentElement.dataset.theme = saved || preferred; } catch (_) { document.documentElement.dataset.theme = 'dark'; } })();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="fa" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
    <body>{children}</body>
  </html>;
}
