import { ProvinceMap } from "../../../components/province-map";
import type { CommandSectionId } from "../../../components/sidebar";
import type { CommandCenterData } from "../../command/types";
import { OverviewSection } from "../../overview/components/overview-section";
import { AlertsPanel, CountiesPanel, MonitoringPanel, OrganizationsPanel, ProjectsPanel } from "./data-panels";
import { AiPanel } from "./demo-panels";
import { CrisisPanel, DataGovernancePanel, ForecastPanel, NewsIntelligencePanel, PerformancePanel, ProcurementPanel, SectorIntelligencePanel, SpeechIntelligencePanel } from "./intelligence-panels";
import { CitizenPanel, DecisionsPanel, FinancePanel, ReportsPanel } from "./operational-panels";
import { DataEntryPanel } from "./data-entry-panel";
import { CountyComparisonPanel } from "./county-comparison-panel";
import { ExecutiveWorkspace } from "../../executive/components/executive-workspace";
import { executiveWorkspaces, isExecutiveWorkspaceId } from "../../executive/data/executive-workspaces";
import { CountyProfilePanel } from "../../counties/components/county-profile-panel";
import { GovernorMinutesPanel } from "../../governance/components/governor-minutes-panel";
import type { ExecutiveWorkspaceId } from "../../executive/data/executive-workspaces";
import { ExecutiveDecisionsPanel, ExecutiveReportsPanel } from "../../executive/components/executive-role-panels";

export function SectionRouter({ section, data, onNavigate, selectedMonth, selectedCounty, selectedCountyName, workspaceId }: { section: CommandSectionId; data: CommandCenterData; onNavigate: (section: CommandSectionId) => void; selectedMonth: string; selectedCounty: string; selectedCountyName: string; workspaceId: ExecutiveWorkspaceId }) {
  if (isExecutiveWorkspaceId(section)) return <ExecutiveWorkspace workspace={executiveWorkspaces[section]} onNavigate={onNavigate} month={selectedMonth} selectedCountyName={selectedCountyName} />;

  switch (section) {
    case "overview": return <OverviewSection data={data} onNavigate={onNavigate} />;
    case "monitoring": return <MonitoringPanel data={data} />;
    case "map": return <ProvinceMap counties={data.counties} expanded />;
    case "benchmark": return <CountyComparisonPanel data={data} />;
    case "county-profile": return <CountyProfilePanel countyCode={selectedCounty} month={selectedMonth} onNavigate={onNavigate} />;
    case "governor-minutes": return <GovernorMinutesPanel month={selectedMonth} />;
    case "role-decisions": return <ExecutiveDecisionsPanel workspace={executiveWorkspaces[workspaceId]} month={selectedMonth} />;
    case "role-reports": return <ExecutiveReportsPanel workspace={executiveWorkspaces[workspaceId]} month={selectedMonth} selectedCountyName={selectedCountyName} />;
    case "projects": return <ProjectsPanel data={data} />;
    case "counties": return <CountiesPanel data={data} />;
    case "organizations": return <OrganizationsPanel data={data} />;
    case "performance": return <PerformancePanel data={data} />;
    case "sectors": return <SectorIntelligencePanel data={data} />;
    case "news": return <NewsIntelligencePanel data={data} />;
    case "speech": return <SpeechIntelligencePanel data={data} />;
    case "procurement": return <ProcurementPanel data={data} />;
    case "alerts": return <AlertsPanel data={data} />;
    case "crisis": return <CrisisPanel data={data} />;
    case "forecast": return <ForecastPanel data={data} />;
    case "decisions": return <DecisionsPanel data={data} />;
    case "finance": return <FinancePanel data={data} />;
    case "citizen": return <CitizenPanel data={data} />;
    case "reports": return <ReportsPanel data={data} />;
    // case "data": return <DataGovernancePanel data={data} />;
    case "manage": return <DataEntryPanel />;
    case "ai": return <AiPanel data={data} />;
  }
}
