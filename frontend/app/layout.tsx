import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سامانه هوشمند حکمرانی استان سمنان",
  description: "درگاه عمومی استانداری سمنان و داده‌های شفاف استانی"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
