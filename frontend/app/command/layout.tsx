import type { Metadata } from "next";
import "../../dashboard/globals.css";

export const metadata: Metadata = {
  title: "مرکز فرماندهی استاندار سمنان",
  description: "رصد اجرایی و تصمیم‌یار استان سمنان"
};

export default function CommandLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript = `try{var t=localStorage.getItem("semnan-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;
  return <><script dangerouslySetInnerHTML={{ __html: themeScript }} />{children}</>;
}
