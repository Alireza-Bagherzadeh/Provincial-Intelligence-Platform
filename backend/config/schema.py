from __future__ import annotations

from decimal import Decimal

import strawberry
import strawberry_django
from django.db.models import Avg, Count, Q

from apps.geography.models import County
from apps.intelligence.models import CrisisSignal, ForecastSignal, NewsArticle, PerformanceIndicator, ProcurementNotice, SectorIndicator, SpeechInsight
from apps.operations.models import BudgetRecord, CitizenSignal, Decision, ExecutiveReport, Organization
from apps.projects.models import Project


@strawberry_django.type(County)
class CountyType:
    id: strawberry.auto
    name: strawberry.auto
    code: strawberry.auto
    population: strawberry.auto
    is_demo: strawberry.auto


@strawberry_django.type(Project)
class ProjectType:
    id: strawberry.auto
    title: strawberry.auto
    status: strawberry.auto
    planned_progress: strawberry.auto
    actual_progress: strawberry.auto
    responsible_organization: strawberry.auto
    is_demo: strawberry.auto
    county: CountyType


@strawberry_django.type(Organization)
class OrganizationType:
    id: strawberry.auto
    name: strawberry.auto
    code: strawberry.auto
    performance_score: strawberry.auto
    is_demo: strawberry.auto


@strawberry_django.type(Decision)
class DecisionType:
    id: strawberry.auto
    title: strawberry.auto
    status: strawberry.auto
    due_date: strawberry.auto
    progress: strawberry.auto
    owner: OrganizationType
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry_django.type(BudgetRecord)
class BudgetRecordType:
    id: strawberry.auto
    category: strawberry.auto
    fiscal_year: strawberry.auto
    allocated_amount: strawberry.auto
    actual_spending: strawberry.auto
    county: CountyType
    is_demo: strawberry.auto


@strawberry_django.type(CitizenSignal)
class CitizenSignalType:
    id: strawberry.auto
    category: strawberry.auto
    request_count: strawberry.auto
    resolved_count: strawberry.auto
    average_response_hours: strawberry.auto
    change_percent: strawberry.auto
    county: CountyType
    is_demo: strawberry.auto


@strawberry_django.type(ExecutiveReport)
class ExecutiveReportType:
    id: strawberry.auto
    title: strawberry.auto
    report_type: strawberry.auto
    period_label: strawberry.auto
    status: strawberry.auto
    organization: OrganizationType | None
    is_demo: strawberry.auto


@strawberry_django.type(NewsArticle)
class NewsArticleType:
    id: strawberry.auto
    title: strawberry.auto
    summary: strawberry.auto
    category: strawberry.auto
    kind: strawberry.auto
    published_at: strawberry.auto
    source_url: strawberry.auto
    source_label: strawberry.auto
    sentiment_score: strawberry.auto
    importance: strawberry.auto
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry_django.type(SectorIndicator)
class SectorIndicatorType:
    id: strawberry.auto
    code: strawberry.auto
    domain: strawberry.auto
    label: strawberry.auto
    value: strawberry.auto
    unit: strawberry.auto
    period_label: strawberry.auto
    trend_percent: strawberry.auto
    benchmark_value: strawberry.auto
    status: strawberry.auto
    description: strawberry.auto
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry_django.type(ProcurementNotice)
class ProcurementNoticeType:
    id: strawberry.auto
    title: strawberry.auto
    status: strawberry.auto
    published_at: strawberry.auto
    deadline: strawberry.auto
    estimated_amount: strawberry.auto
    procurement_method: strawberry.auto
    reference_code: strawberry.auto
    organization: OrganizationType
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry_django.type(SpeechInsight)
class SpeechInsightType:
    id: strawberry.auto
    speaker: strawberry.auto
    role: strawberry.auto
    spoken_at: strawberry.auto
    topic: strawberry.auto
    summary: strawberry.auto
    commitment_text: strawberry.auto
    commitment_status: strawberry.auto
    county: CountyType | None
    source_url: strawberry.auto
    is_demo: strawberry.auto


@strawberry_django.type(PerformanceIndicator)
class PerformanceIndicatorType:
    id: strawberry.auto
    category: strawberry.auto
    label: strawberry.auto
    score: strawberry.auto
    target: strawberry.auto
    period_label: strawberry.auto
    weight: strawberry.auto
    organization: OrganizationType
    is_demo: strawberry.auto


@strawberry_django.type(CrisisSignal)
class CrisisSignalType:
    id: strawberry.auto
    title: strawberry.auto
    category: strawberry.auto
    severity: strawberry.auto
    status: strawberry.auto
    occurred_at: strawberry.auto
    impact_score: strawberry.auto
    summary: strawberry.auto
    source_label: strawberry.auto
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry_django.type(ForecastSignal)
class ForecastSignalType:
    id: strawberry.auto
    domain: strawberry.auto
    metric_label: strawberry.auto
    as_of: strawberry.auto
    horizon_label: strawberry.auto
    current_value: strawberry.auto
    forecast_value: strawberry.auto
    lower_bound: strawberry.auto
    upper_bound: strawberry.auto
    unit: strawberry.auto
    risk_level: strawberry.auto
    confidence: strawberry.auto
    methodology: strawberry.auto
    county: CountyType | None
    is_demo: strawberry.auto


@strawberry.type
class CountySnapshotType:
    code: str
    name: str
    project_count: int
    critical_project_count: int
    average_progress: float
    is_demo: bool


@strawberry.type
class MetricType:
    key: str
    label: str
    value: str
    delta: str
    status: str
    is_demo: bool


@strawberry.type
class BriefItemType:
    kind: str
    title: str
    detail: str
    action_label: str
    is_demo: bool


@strawberry.type
class AlertType:
    id: strawberry.ID
    title: str
    severity: str
    entity_label: str
    status: str
    is_demo: bool


@strawberry.type
class DashboardSummaryType:
    metrics: list[MetricType]
    data_freshness_label: str
    is_demo: bool


def format_percent(value: Decimal | float | None) -> str:
    return f"{float(value or 0):.0f}٪"


@strawberry.type
class Query:
    counties: list[CountyType] = strawberry_django.field()
    projects: list[ProjectType] = strawberry_django.field()
    organizations: list[OrganizationType] = strawberry_django.field()
    decisions: list[DecisionType] = strawberry_django.field()
    budget_records: list[BudgetRecordType] = strawberry_django.field()
    citizen_signals: list[CitizenSignalType] = strawberry_django.field()
    reports: list[ExecutiveReportType] = strawberry_django.field()
    news_articles: list[NewsArticleType] = strawberry_django.field()
    sector_indicators: list[SectorIndicatorType] = strawberry_django.field()
    procurement_notices: list[ProcurementNoticeType] = strawberry_django.field()
    speech_insights: list[SpeechInsightType] = strawberry_django.field()
    performance_indicators: list[PerformanceIndicatorType] = strawberry_django.field()
    crisis_signals: list[CrisisSignalType] = strawberry_django.field()
    forecast_signals: list[ForecastSignalType] = strawberry_django.field()

    @strawberry.field
    def county_snapshots(self) -> list[CountySnapshotType]:
        counties = County.objects.annotate(
            project_count_value=Count("projects"),
            critical_count_value=Count("projects", filter=Q(projects__status=Project.Status.CRITICAL)),
            average_progress_value=Avg("projects__actual_progress"),
        ).order_by("name")
        return [
            CountySnapshotType(
                code=county.code,
                name=county.name,
                project_count=county.project_count_value,
                critical_project_count=county.critical_count_value,
                average_progress=float(county.average_progress_value or 0),
                is_demo=county.is_demo,
            )
            for county in counties
        ]

    @strawberry.field
    def dashboard_summary(self) -> DashboardSummaryType:
        projects = Project.objects.all()
        county_count = County.objects.count()
        project_count = projects.count()
        critical_count = projects.filter(status=Project.Status.CRITICAL).count()
        attention_count = projects.filter(status=Project.Status.ATTENTION).count()
        average_progress = projects.aggregate(value=Avg("actual_progress"))["value"]
        critical_sectors = SectorIndicator.objects.filter(status=SectorIndicator.Status.CRITICAL).count()
        article_count = NewsArticle.objects.count()
        open_procurement = ProcurementNotice.objects.exclude(status=ProcurementNotice.Status.AWARDED).count()
        active_crises = CrisisSignal.objects.exclude(status=CrisisSignal.Status.RESOLVED).count()
        critical_forecasts = ForecastSignal.objects.filter(risk_level=ForecastSignal.Risk.CRITICAL).count()
        has_demo = (
            County.objects.filter(is_demo=True).exists()
            or projects.filter(is_demo=True).exists()
            or SectorIndicator.objects.filter(is_demo=True).exists()
        )
        return DashboardSummaryType(
            metrics=[
                MetricType(key="counties", label="شهرستان‌های تحت پایش", value=str(county_count), delta="لایه جغرافیایی استان", status="healthy", is_demo=has_demo),
                MetricType(key="projects", label="پروژه‌های ثبت‌شده", value=str(project_count), delta="مرکز کنترل پروژه", status="healthy", is_demo=has_demo),
                MetricType(key="critical", label="پروژه‌های بحرانی", value=str(critical_count), delta="نیازمند اقدام فوری", status="critical" if critical_count else "healthy", is_demo=has_demo),
                MetricType(key="attention", label="نیازمند توجه", value=str(attention_count), delta="انحراف برنامه و عملکرد", status="attention" if attention_count else "healthy", is_demo=has_demo),
                MetricType(key="progress", label="میانگین پیشرفت واقعی", value=format_percent(average_progress), delta="محاسبه‌شده از پروژه‌ها", status="healthy", is_demo=has_demo),
                MetricType(key="sector-risk", label="ریسک‌های بخشی", value=str(critical_sectors), delta="آب، انرژی، محیط‌زیست و اقتصاد", status="critical" if critical_sectors else "healthy", is_demo=has_demo),
                MetricType(key="news", label="محتوای رصدشده", value=str(article_count), delta="خبر، اطلاعیه و گردشگری", status="healthy", is_demo=has_demo),
                MetricType(key="procurement", label="فرایندهای خرید باز", value=str(open_procurement), delta="پایش شفافیت مناقصات", status="attention" if open_procurement else "healthy", is_demo=has_demo),
                MetricType(key="crisis", label="سیگنال‌های بحران فعال", value=str(active_crises), delta="تاب‌آوری و پاسخ به رخداد", status="critical" if active_crises else "healthy", is_demo=has_demo),
                MetricType(key="forecast", label="هشدارهای پیش‌بینی", value=str(critical_forecasts), delta="Early Warning و Forecast", status="critical" if critical_forecasts else "healthy", is_demo=has_demo),
            ],
            data_freshness_label="دادهٔ نمایشی مستندمحور در PostgreSQL/PostGIS" if has_demo else "دادهٔ ثبت‌شده در پایگاه عملیاتی",
            is_demo=has_demo,
        )

    @strawberry.field
    def executive_brief(self) -> list[BriefItemType]:
        items: list[BriefItemType] = []
        projects = Project.objects.exclude(status__in=[Project.Status.ON_TRACK, Project.Status.COMPLETE]).select_related("county")[:2]
        items.extend(
            BriefItemType(
                kind="risk",
                title=f"پروژه «{project.title}» نیازمند پیگیری است.",
                detail=f"{project.county.name}: پیشرفت واقعی {format_percent(project.actual_progress)} در برابر برنامه {format_percent(project.planned_progress)}.",
                action_label="مشاهده پروژه",
                is_demo=project.is_demo,
            )
            for project in projects
        )
        sector = SectorIndicator.objects.filter(status=SectorIndicator.Status.CRITICAL).first()
        if sector:
            items.append(BriefItemType(kind="sector", title=f"ریسک بخشی: {sector.label}", detail=sector.description or f"امتیاز فعلی {sector.value} {sector.unit}", action_label="هوشمندی بخشی", is_demo=sector.is_demo))
        commitment = SpeechInsight.objects.filter(commitment_status=SpeechInsight.CommitmentStatus.AT_RISK).first()
        if commitment:
            items.append(BriefItemType(kind="commitment", title=f"تعهد در معرض ریسک: {commitment.topic}", detail=commitment.commitment_text or commitment.summary, action_label="پیگیری تعهد", is_demo=commitment.is_demo))
        crisis = CrisisSignal.objects.filter(status__in=[CrisisSignal.Status.OPEN, CrisisSignal.Status.MONITORING]).order_by("-impact_score").first()
        if crisis:
            items.append(BriefItemType(kind="crisis", title=f"سیگنال بحران: {crisis.title}", detail=crisis.summary or f"امتیاز اثر {crisis.impact_score} از ۱۰۰", action_label="مرکز بحران", is_demo=crisis.is_demo))
        forecast = ForecastSignal.objects.filter(risk_level=ForecastSignal.Risk.CRITICAL).first()
        if forecast:
            items.append(BriefItemType(kind="forecast", title=f"هشدار پیش‌بینی: {forecast.metric_label}", detail=f"{forecast.current_value} → {forecast.forecast_value} {forecast.unit} در افق {forecast.horizon_label}", action_label="پیش‌بینی", is_demo=forecast.is_demo))
        return items[:6]

    @strawberry.field
    def alerts(self) -> list[AlertType]:
        alerts: list[AlertType] = []
        projects = Project.objects.exclude(status__in=[Project.Status.ON_TRACK, Project.Status.COMPLETE]).select_related("county")
        alerts.extend(
            AlertType(
                id=strawberry.ID(str(project.id)),
                title="انحراف پیشرفت پروژه از برنامه",
                severity="critical" if project.status == Project.Status.CRITICAL else "attention",
                entity_label=f"{project.title} · {project.county.name}",
                status="open",
                is_demo=project.is_demo,
            )
            for project in projects
        )
        for indicator in SectorIndicator.objects.filter(status=SectorIndicator.Status.CRITICAL)[:3]:
            alerts.append(AlertType(id=strawberry.ID(str(indicator.id)), title=f"ریسک بخشی: {indicator.label}", severity="critical", entity_label=indicator.domain, status="open", is_demo=indicator.is_demo))
        for crisis in CrisisSignal.objects.exclude(status=CrisisSignal.Status.RESOLVED)[:3]:
            alerts.append(AlertType(id=strawberry.ID(str(crisis.id)), title=f"رخداد/بحران: {crisis.title}", severity="critical" if crisis.severity == CrisisSignal.Severity.CRITICAL else "attention", entity_label=crisis.county.name if crisis.county else crisis.category, status=crisis.status, is_demo=crisis.is_demo))
        return alerts


schema = strawberry.Schema(query=Query)
