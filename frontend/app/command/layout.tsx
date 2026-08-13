import type { Metadata } from "next";
import "../../dashboard/globals.css";

export const metadata: Metadata = {
  title: "مرکز فرماندهی استاندار سمنان",
  description: "رصد اجرایی و تصمیم‌یار استان سمنان"
};

export default function CommandLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
