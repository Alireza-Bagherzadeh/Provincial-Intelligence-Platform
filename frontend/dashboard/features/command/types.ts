export type DataSourceState = "graphql" | "partial" | "demo";

export type ExecutiveMetric = {
  key: string;
  label: string;
  value: string;
  delta: string;
  status: "healthy" | "attention" | "critical";
  isDemo: boolean;
};

export type ExecutiveBriefItem = {
  kind: "risk" | "citizen" | "report" | "sector" | "commitment" | "procurement" | "crisis" | "forecast";
  title: string;
  detail: string;
  actionLabel: string;
  isDemo: boolean;
};

export type CountySnapshot = {
  code: string;
  name: string;
  projectCount: number;
  criticalProjectCount: number;
  averageProgress: number;
  isDemo: boolean;
};

export type ProjectSnapshot = {
  title: string;
  status: "on_track" | "attention" | "critical" | "complete";
  plannedProgress: string;
  actualProgress: string;
  responsibleOrganization: string;
  isDemo: boolean;
  county: { code: string; name: string };
};

export type AlertSnapshot = {
  id: string;
  title: string;
  severity: "attention" | "critical";
  entityLabel: string;
  status: string;
  isDemo: boolean;
};

export type OrganizationSnapshot = { name: string; code: string; performanceScore: string; isDemo: boolean };
export type DecisionSnapshot = { title: string; status: "open" | "at_risk" | "overdue" | "completed"; dueDate: string; progress: string; isDemo: boolean; owner: { name: string }; county?: { name: string } | null };
export type BudgetSnapshot = { category: string; fiscalYear: string; allocatedAmount: string; actualSpending: string; isDemo: boolean; county: { name: string } };
export type CitizenSignalSnapshot = { category: string; requestCount: number; resolvedCount: number; averageResponseHours: string; changePercent: string; isDemo: boolean; county: { name: string } };
export type ReportSnapshot = { title: string; reportType: string; periodLabel: string; status: "ready" | "review" | "draft"; isDemo: boolean; organization?: { name: string } | null };

export type NewsSnapshot = {
  id: string;
  title: string;
  summary: string;
  category: string;
  kind: "news" | "tourism" | "notice" | "report";
  publishedAt: string;
  sourceUrl: string;
  sourceLabel: string;
  sentimentScore: string;
  importance: number;
  county?: { code: string; name: string } | null;
  isDemo: boolean;
};

export type SectorIndicatorSnapshot = {
  id: string;
  code: string;
  domain: string;
  label: string;
  value: string;
  unit: string;
  periodLabel: string;
  trendPercent: string;
  benchmarkValue?: string | null;
  status: "healthy" | "attention" | "critical";
  description: string;
  county?: { code: string; name: string } | null;
  isDemo: boolean;
};

export type ProcurementSnapshot = {
  id: string;
  title: string;
  status: "planned" | "open" | "evaluation" | "awarded";
  publishedAt: string;
  deadline?: string | null;
  estimatedAmount: string;
  procurementMethod: string;
  referenceCode: string;
  organization: { name: string; code: string };
  county?: { name: string } | null;
  isDemo: boolean;
};

export type SpeechInsightSnapshot = {
  id: string;
  speaker: string;
  role: string;
  spokenAt: string;
  topic: string;
  summary: string;
  commitmentText: string;
  commitmentStatus: "open" | "in_progress" | "completed" | "at_risk";
  county?: { name: string } | null;
  sourceUrl: string;
  isDemo: boolean;
};

export type PerformanceIndicatorSnapshot = {
  id: string;
  category: string;
  label: string;
  score: string;
  target: string;
  periodLabel: string;
  weight: string;
  organization: { name: string; code: string };
  isDemo: boolean;
};


export type CrisisSignalSnapshot = {
  id: string;
  title: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "monitoring" | "resolved";
  occurredAt: string;
  impactScore: number;
  summary: string;
  sourceLabel: string;
  county?: { name: string } | null;
  isDemo: boolean;
};

export type ForecastSignalSnapshot = {
  id: string;
  domain: string;
  metricLabel: string;
  asOf: string;
  horizonLabel: string;
  currentValue: string;
  forecastValue: string;
  lowerBound?: string | null;
  upperBound?: string | null;
  unit: string;
  riskLevel: "healthy" | "attention" | "critical";
  confidence: number;
  methodology: string;
  county?: { name: string } | null;
  isDemo: boolean;
};


export type CommandCenterData = {
  metrics: ExecutiveMetric[];
  brief: ExecutiveBriefItem[];
  counties: CountySnapshot[];
  projects: ProjectSnapshot[];
  alerts: AlertSnapshot[];
  organizations: OrganizationSnapshot[];
  decisions: DecisionSnapshot[];
  budgetRecords: BudgetSnapshot[];
  citizenSignals: CitizenSignalSnapshot[];
  reports: ReportSnapshot[];
  newsArticles: NewsSnapshot[];
  sectorIndicators: SectorIndicatorSnapshot[];
  procurementNotices: ProcurementSnapshot[];
  speechInsights: SpeechInsightSnapshot[];
  performanceIndicators: PerformanceIndicatorSnapshot[];
  crisisSignals: CrisisSignalSnapshot[];
  forecastSignals: ForecastSignalSnapshot[];
  freshness: string;
  source: DataSourceState;
  endpoint: string;
  connectionMessage?: string;
};
