import type { ExecutiveWorkspaceId } from "./executive-workspaces";

export type LoginRole = {
  slug: string;
  workspaceId: ExecutiveWorkspaceId;
  name: string;
  honorific: string;
  role: string;
  initials: string;
  description: string;
};

export const loginRoles: LoginRole[] = [
  { slug: "governor", workspaceId: "executive-governor", name: "محمدجواد کولیوند", honorific: "دکتر", role: "استاندار سمنان", initials: "م‌ک", description: "میز فرماندهی، گزارش معاونان، صورت‌جلسات و ریسک‌های کل استان" },
  { slug: "civil", workspaceId: "executive-civil", name: "فرج‌الله ایلیات", honorific: "مهندس", role: "معاون هماهنگی امور عمرانی", initials: "ف‌ا", description: "آب، انرژی، مسکن، راه و مدیریت بحران" },
  { slug: "economic", workspaceId: "executive-economic", name: "حمید دهرویه", honorific: "دکتر", role: "معاون هماهنگی امور اقتصادی", initials: "ح‌د", description: "تولید، سرمایه‌گذاری، اشتغال، تسهیلات و معادن" },
  { slug: "political", workspaceId: "executive-political", name: "مهدی آقابراری", honorific: "", role: "معاون سیاسی، امنیتی و اجتماعی", initials: "م‌آ", description: "تحولات جمعیتی، سرمایه اجتماعی و هشدارهای منطقه‌ای" },
  { slug: "resources", workspaceId: "executive-resources", name: "رضا عبدالله‌زاده", honorific: "دکتر", role: "معاون توسعه مدیریت و منابع", initials: "ر‌ع", description: "سرمایه انسانی، بهره‌وری دستگاه‌ها و دولت هوشمند" },
];

export function getLoginRole(slug: string) {
  return loginRoles.find((role) => role.slug === slug);
}
