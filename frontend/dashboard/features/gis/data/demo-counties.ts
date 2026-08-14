import type { CountySnapshot } from "../../command/types";

/** Presentation-only fallback used only when GraphQL cannot be reached. */
export const demoCounties: CountySnapshot[] = [
  { code: "garmsar", name: "گرمسار", projectCount: 1, criticalProjectCount: 0, averageProgress: 84, isDemo: true },
  { code: "aradan", name: "آرادان", projectCount: 0, criticalProjectCount: 0, averageProgress: 0, isDemo: true },
  { code: "sorkheh", name: "سرخه", projectCount: 0, criticalProjectCount: 0, averageProgress: 0, isDemo: true },
  { code: "semnan", name: "سمنان", projectCount: 1, criticalProjectCount: 0, averageProgress: 69, isDemo: true },
  { code: "mahdishahr", name: "مهدی‌شهر", projectCount: 0, criticalProjectCount: 0, averageProgress: 0, isDemo: true },
  { code: "damghan", name: "دامغان", projectCount: 1, criticalProjectCount: 0, averageProgress: 65, isDemo: true },
  { code: "shahroud", name: "شاهرود", projectCount: 1, criticalProjectCount: 1, averageProgress: 41, isDemo: true },
  { code: "meyami", name: "میامی", projectCount: 0, criticalProjectCount: 0, averageProgress: 0, isDemo: true }
];
