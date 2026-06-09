/* ────────────────────────────────────────────────────────────
   CELESTRA RESEARCH AI — BACKEND API CLIENT
   Connects the command center to the FastAPI intelligence backend.

   The base URL is read from NEXT_PUBLIC_API_URL (set this in Vercel to the
   deployed Render backend, e.g. https://celestra-research-api.onrender.com).

   Auth: the dashboard has no login screen, so the client bootstraps a
   self-contained demo tenant — it tries to log in with the demo credentials
   and registers them on first use. Override via NEXT_PUBLIC_DEMO_EMAIL /
   NEXT_PUBLIC_DEMO_PASSWORD if you want to point at a specific account.
   ──────────────────────────────────────────────────────────── */

import type {
  Competitor,
  FeedItem,
  FeedType,
  Industry,
  KPI,
  Market,
  Opportunity,
  Priority,
  Report,
  Risk,
  Segment,
  Tone,
  Trend,
} from "@/lib/data";
import { customerNeeds as mockCustomerNeeds, executive as mockExecutive, heroMetrics } from "@/lib/data";

// Default to the expected Render host so the app works out of the box once the
// backend is deployed. Override with NEXT_PUBLIC_API_URL in Vercel if the
// deployed host differs. If the host is unreachable, the UI falls back to the
// rich demo dataset, so a wrong/missing value never breaks the page.
const DEFAULT_BASE = "https://celestra-research-api.onrender.com";
const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BASE).replace(/\/$/, "");
const API_PREFIX = "/api/v1";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@celestra.ai";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "celestra-demo-2026";

const TOKEN_KEY = "celestra.access_token";

/** True when a backend URL is configured. */
export const isBackendConfigured = RAW_BASE.length > 0;

function url(path: string): string {
  return `${RAW_BASE}${API_PREFIX}${path}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = 12_000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/* ----------------------------- Authentication ----------------------------- */

async function login(email: string, password: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(url("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function register(email: string, password: string): Promise<void> {
  try {
    await fetchWithTimeout(url("/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: "Celestra Demo", role: "founder" }),
    });
  } catch {
    /* ignore — registration is best-effort (409 if it already exists) */
  }
}

/** Ensure we have a valid token, bootstrapping the demo tenant if needed. */
async function ensureAuth(): Promise<string | null> {
  const existing = getToken();
  if (existing) return existing;

  let token = await login(DEMO_EMAIL, DEMO_PASSWORD);
  if (!token) {
    await register(DEMO_EMAIL, DEMO_PASSWORD);
    token = await login(DEMO_EMAIL, DEMO_PASSWORD);
  }
  if (token) setToken(token);
  return token;
}

async function authedGet<T>(path: string): Promise<T | null> {
  if (!isBackendConfigured) return null;
  const token = await ensureAuth();
  if (!token) return null;
  try {
    const res = await fetchWithTimeout(url(path), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      clearToken();
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function authedPost<T>(path: string, body?: unknown): Promise<T | null> {
  if (!isBackendConfigured) return null;
  const token = await ensureAuth();
  if (!token) return null;
  try {
    const res = await fetchWithTimeout(url(path), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      clearToken();
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchList<T>(path: string, size = 100): Promise<T[] | null> {
  const data = await authedGet<Paginated<T>>(`${path}?size=${size}`);
  if (!data?.items?.length) return null;
  return data.items;
}

/* ------------------------------ Backend types ----------------------------- */

interface DashboardStats {
  markets_tracked: number;
  competitors_tracked: number;
  industries_monitored: number;
  opportunities_found: number;
  trend_signals: number;
  risk_alerts: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  research_health_score: number;
  strategic_confidence: number;
  top_opportunities: Array<Record<string, unknown>>;
  top_risks: Array<Record<string, unknown>>;
  live_feed: Array<Record<string, unknown>>;
  executive_recommendations: Array<Record<string, unknown>>;
}

interface BackendFeedItem {
  id: string;
  title: string;
  summary?: string | null;
  feed_type: string;
  priority: string;
  confidence: number;
  impact_score: number;
  created_at: string;
}

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

/* -------------------------------- Mappers --------------------------------- */

const STAT_BY_LABEL: Record<string, keyof DashboardStats> = {
  "Markets Tracked": "markets_tracked",
  "Competitors Tracked": "competitors_tracked",
  "Industries Monitored": "industries_monitored",
  "Opportunities Found": "opportunities_found",
  "Risk Alerts": "risk_alerts",
  "Trend Signals": "trend_signals",
};

/** Build the hero KPI cards from live backend stats, keeping mock tones/deltas. */
export function statsToKpis(stats: DashboardStats): KPI[] {
  return heroMetrics.map((kpi) => {
    const key = STAT_BY_LABEL[kpi.label];
    return key ? { ...kpi, value: stats[key] ?? 0 } : kpi;
  });
}

const FEED_TYPE_MAP: Record<string, FeedType> = {
  competitor: "Competitor",
  industry: "Industry",
  funding: "Funding",
  regulatory: "Regulatory",
  opportunity: "Opportunity",
  trend: "Trend",
  risk: "Risk",
  market: "Trend",
  customer: "Opportunity",
};

const PRIORITY_MAP: Record<string, Priority> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function mapFeedItem(item: BackendFeedItem): FeedItem {
  return {
    id: item.id,
    type: FEED_TYPE_MAP[item.feed_type] ?? "Trend",
    title: item.title,
    source: "Celestra Signal",
    time: relativeTime(item.created_at),
    impact: Math.round(item.impact_score),
    confidence: Math.round((item.confidence ?? 0) * 100),
    priority: PRIORITY_MAP[item.priority] ?? "Medium",
  };
}

/* ------------------------ Entity backend shapes --------------------------- */

interface BackendMarket {
  id: string;
  name: string;
  market_size_usd?: number | null;
  growth_rate?: number | null;
  market_score?: number | null;
  attractiveness?: number | null;
}

interface BackendCompetitor {
  id: string;
  name: string;
  description?: string | null;
  threat_level?: string | null;
  competitor_score?: number | null;
  funding_usd?: number | null;
  employee_count?: number | null;
  pricing?: Record<string, unknown> | null;
  updates?: Record<string, unknown> | null;
}

interface BackendCustomerSegment {
  id: string;
  name: string;
  size_estimate?: number | null;
  sentiment_score?: number | null;
  pain_points?: Record<string, unknown> | null;
}

interface BackendTrend {
  id: string;
  name: string;
  category?: string | null;
  trend_score?: number | null;
  strength?: string | null;
  velocity?: number | null;
  confidence?: number | null;
  forecast?: Record<string, unknown> | null;
}

interface BackendIndustry {
  id: string;
  name: string;
  industry_score?: number | null;
  health?: string | null;
  growth_rate?: number | null;
}

interface BackendOpportunity {
  id: string;
  title: string;
  category?: string | null;
  opportunity_score?: number | null;
  market_size_usd?: number | null;
  revenue_potential_usd?: number | null;
  competition_score?: number | null;
  growth_potential?: number | null;
  priority?: string | null;
  rationale?: Record<string, unknown> | null;
}

interface BackendRisk {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  risk_score?: number | null;
  likelihood?: number | null;
  impact?: number | null;
  severity?: string | null;
}

interface BackendRecommendation {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  confidence?: number | null;
  action_plan?: { steps?: string[] } | null;
}

interface BackendReport {
  id: string;
  title: string;
  report_type: string;
  summary?: string | null;
  confidence?: number | null;
  created_at: string;
}

interface BackendBrief {
  id: string;
  title: string;
  brief_type: string;
  executive_summary?: string | null;
  strategic_confidence?: number | null;
  created_at: string;
}

interface AgentResult {
  agent: string;
  summary: string;
  score: number;
  confidence: number;
  findings?: Array<Record<string, unknown>>;
  metrics?: Record<string, unknown>;
  recommendations?: string[];
}

/* --------------------------- Mapping helpers ------------------------------ */

const TONES: Tone[] = ["indigo", "purple", "blue", "emerald", "amber", "rose"];

function toneAt(i: number): Tone {
  return TONES[i % TONES.length];
}

function mapPriority(p?: string | null): Priority {
  return PRIORITY_MAP[(p ?? "medium").toLowerCase()] ?? "Medium";
}

function mapThreat(level?: string | null): Priority {
  const m: Record<string, Priority> = {
    severe: "Critical",
    critical: "Critical",
    high: "High",
    moderate: "Medium",
    medium: "Medium",
    low: "Low",
  };
  return m[(level ?? "medium").toLowerCase()] ?? "Medium";
}

function pct(value?: number | null, asDecimal = false): number {
  if (value == null) return 0;
  const v = asDecimal && value <= 1 ? value * 100 : value;
  return Math.round(Math.max(0, Math.min(100, v)));
}

function spark(base: number, len = 8): number[] {
  return Array.from({ length: len }, (_, j) =>
    Math.max(8, Math.min(100, base - 18 + j * 4)),
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function reportTone(type: string): Tone {
  const t = type.toLowerCase();
  if (t.includes("risk")) return "rose";
  if (t.includes("opportunity")) return "indigo";
  if (t.includes("competitor")) return "purple";
  if (t.includes("trend")) return "amber";
  if (t.includes("customer")) return "emerald";
  if (t.includes("market")) return "blue";
  return "indigo";
}

function trendStage(strength?: string | null): Trend["stage"] {
  const s = (strength ?? "").toLowerCase();
  if (s === "peaking") return "Peaking";
  if (s === "declining") return "Maturing";
  if (s === "growing") return "Accelerating";
  return "Emerging";
}

function mapMarket(m: BackendMarket, i: number): Market {
  const attractiveness = Math.round(m.attractiveness ?? m.market_score ?? 50);
  const cagr =
    m.growth_rate != null
      ? Math.round(m.growth_rate < 1 ? m.growth_rate * 100 : m.growth_rate)
      : 0;
  return {
    id: m.id,
    name: m.name,
    size: m.market_size_usd ?? 0,
    cagr,
    attractiveness,
    saturation: Math.max(0, Math.min(100, 100 - attractiveness + 12)),
    signal: spark(attractiveness),
    tone: toneAt(i),
  };
}

function mapCompetitor(c: BackendCompetitor, i: number): Competitor {
  const threatLevel = Math.round(c.competitor_score ?? 50);
  const updates = c.updates ?? {};
  const productChanges = Object.entries(updates)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => k.replace(/_/g, " "));
  const pricing =
    typeof c.pricing === "object" && c.pricing
      ? JSON.stringify(c.pricing).slice(0, 40) || "Enterprise"
      : "Enterprise";
  return {
    id: c.id,
    name: c.name,
    logo: initials(c.name),
    category: c.description?.slice(0, 48) ?? "Tracked competitor",
    funding: c.funding_usd ?? 0,
    employees: c.employee_count ?? 0,
    pricing,
    threatLevel,
    threat: mapThreat(c.threat_level),
    momentum: Math.round(threatLevel * 0.4),
    productChanges: productChanges.length ? productChanges : ["Active monitoring"],
    recentNews: [{ title: `${c.name} intelligence update`, time: "recent" }],
    spark: spark(threatLevel, 10),
  };
}

function mapSegment(s: BackendCustomerSegment, i: number): Segment {
  const sentiment = s.sentiment_score ?? 0;
  const satisfaction = pct(sentiment, true) || Math.round(50 + sentiment * 50);
  return {
    id: s.id,
    name: s.name,
    demand: Math.min(100, satisfaction + 10),
    satisfaction,
    churnRisk: Math.max(5, Math.min(95, 100 - satisfaction)),
    size: s.size_estimate ?? 0,
    tone: toneAt(i),
  };
}

function mapTrend(t: BackendTrend, i: number): Trend {
  const score = Math.round(t.trend_score ?? 50);
  const velocity = Math.round((t.velocity ?? 0.5) * 100);
  const conf = pct(t.confidence, true) || 70;
  const forecastArr = Array.isArray(t.forecast?.series)
    ? (t.forecast!.series as number[])
    : spark(score, 9);
  return {
    id: t.id,
    name: t.name,
    category: t.category ?? "Detected",
    momentum: score,
    growth: Math.max(velocity, Math.round(score * 0.6)),
    velocity,
    confidence: conf,
    stage: trendStage(t.strength),
    forecast: forecastArr,
    tone: toneAt(i),
  };
}

function mapIndustry(ind: BackendIndustry, i: number): Industry {
  const health = Math.round(ind.industry_score ?? (ind.health === "healthy" ? 75 : 45));
  const growth =
    ind.growth_rate != null
      ? Math.round(ind.growth_rate < 1 ? ind.growth_rate * 100 : ind.growth_rate)
      : 30;
  return {
    id: ind.id,
    name: ind.name,
    health,
    growth,
    adoption: Math.min(100, health - 5),
    disruption: Math.min(100, 100 - health + 20),
    tone: toneAt(i),
  };
}

function mapOpportunity(o: BackendOpportunity, i: number): Opportunity {
  const score = Math.round(o.opportunity_score ?? 50);
  const rationale = o.rationale?.driver ? String(o.rationale.driver) : "AI-ranked opportunity";
  return {
    id: o.id,
    title: o.title,
    category: o.category ?? "Strategic",
    opportunityScore: score,
    marketSize: o.market_size_usd ?? 0,
    competitionScore: Math.round(o.competition_score ?? 50),
    growthRate: Math.round(o.growth_potential ?? 40),
    revenuePotential: o.revenue_potential_usd ?? 0,
    recommendation: `Prioritize based on ${rationale}. Score ${score}/100.`,
    rank: i + 1,
    priority: mapPriority(o.priority),
  };
}

function mapRisk(r: BackendRisk, i: number): Risk {
  const likelihood = pct(r.likelihood, true) || Math.round((r.risk_score ?? 40) * 0.7);
  const severity = pct(r.impact, true) || Math.round(r.risk_score ?? 40);
  return {
    id: r.id,
    name: r.title,
    category: r.category.charAt(0).toUpperCase() + r.category.slice(1),
    likelihood,
    severity,
    level: mapThreat(r.severity),
    trend: likelihood > 60 ? "Rising" : severity > 60 ? "Stable" : "Falling",
    owner: "Risk Sentinel",
    detail: r.description ?? `${r.category} risk monitored by Celestra agents.`,
  };
}

function mapReport(r: BackendReport): Report {
  return {
    id: r.id,
    title: r.title,
    type: r.report_type.charAt(0).toUpperCase() + r.report_type.slice(1),
    date: formatDate(r.created_at),
    pages: r.summary ? Math.max(8, Math.ceil(r.summary.length / 120)) : 0,
    confidence: Math.round(
      r.confidence != null ? (r.confidence <= 1 ? r.confidence * 100 : r.confidence) : 80,
    ),
    status: "Ready",
    tone: reportTone(r.report_type),
  };
}

function mapBrief(b: BackendBrief): Report {
  return {
    id: b.id,
    title: b.title,
    type: b.brief_type.charAt(0).toUpperCase() + b.brief_type.slice(1) + " Brief",
    date: formatDate(b.created_at),
    pages: b.executive_summary ? Math.max(4, Math.ceil(b.executive_summary.length / 100)) : 0,
    confidence: Math.round((b.strategic_confidence ?? 0.8) * 100),
    status: "Ready",
    tone: "amber",
  };
}

export type ExecutiveData = typeof mockExecutive;

export function mapExecutiveFromCRO(
  cro: AgentResult,
  dash: DashboardResponse | null,
): ExecutiveData {
  const metrics = cro.metrics ?? {};
  const rawPriorities = metrics.strategic_priorities;
  let priorityItems: Array<Record<string, unknown>> = [];
  if (Array.isArray(rawPriorities)) {
    priorityItems = rawPriorities as Array<Record<string, unknown>>;
  } else if (rawPriorities && typeof rawPriorities === "object" && "items" in rawPriorities) {
    priorityItems = ((rawPriorities as { items?: Array<Record<string, unknown>> }).items) ?? [];
  }
  const recs = (metrics.executive_recommendations as string[]) ?? cro.recommendations ?? [];

  const rawConfidence =
    (metrics.strategic_confidence as number) ?? cro.confidence ?? mockExecutive.strategicConfidence / 100;
  const strategicConfidence = Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence);

  const topOppScore = dash?.top_opportunities?.[0]?.opportunity_score as number | undefined;
  const topRiskScore = dash?.top_risks?.[0]?.risk_score as number | undefined;

  return {
    researchHealth: Math.round(
      (metrics.research_health_score as number) ?? cro.score ?? mockExecutive.researchHealth,
    ),
    opportunityScore: Math.round(topOppScore ?? mockExecutive.opportunityScore),
    strategicConfidence,
    marketPosition: Math.round(cro.score ?? mockExecutive.marketPosition),
    riskExposure: Math.round(topRiskScore ?? mockExecutive.riskExposure),
    summary: cro.summary || mockExecutive.summary,
    priorities: priorityItems.length
      ? priorityItems.slice(0, 4).map((p, i) => ({
          title: String(p.title ?? "Strategic priority"),
          confidence: Math.round((p.confidence as number) ?? 80),
          tone: toneAt(i),
        }))
      : mockExecutive.priorities,
    actions: recs.length ? recs.slice(0, 5) : mockExecutive.actions,
    trajectory: mockExecutive.trajectory,
  };
}

/* ------------------------------- Public API ------------------------------- */

export async function fetchDashboard(): Promise<DashboardResponse | null> {
  return authedGet<DashboardResponse>("/dashboard");
}

export async function fetchHeroMetrics(): Promise<KPI[] | null> {
  const dash = await fetchDashboard();
  if (!dash?.stats) return null;
  return statsToKpis(dash.stats);
}

export async function fetchFeed(size = 14): Promise<FeedItem[] | null> {
  const data = await authedGet<Paginated<BackendFeedItem>>(`/feed?size=${size}`);
  if (!data?.items) return null;
  return data.items.map(mapFeedItem);
}

export async function fetchMarkets(): Promise<Market[] | null> {
  const items = await fetchList<BackendMarket>("/market");
  return items ? items.map(mapMarket) : null;
}

export async function fetchCompetitors(): Promise<Competitor[] | null> {
  const items = await fetchList<BackendCompetitor>("/competitor");
  return items ? items.map(mapCompetitor) : null;
}

export async function fetchCustomerSegments(): Promise<{
  segments: Segment[];
  needs: { need: string; intensity: number }[];
} | null> {
  const items = await fetchList<BackendCustomerSegment>("/customer");
  if (!items) return null;
  const segments = items.map(mapSegment);
  const needsMap = new Map<string, number>();
  for (const s of items) {
    const pains = s.pain_points;
    if (Array.isArray(pains)) {
      for (const p of pains) needsMap.set(String(p), 85);
    } else if (pains && typeof pains === "object") {
      for (const key of Object.keys(pains)) {
        needsMap.set(key.replace(/_/g, " "), 75);
      }
    }
  }
  const needs =
    needsMap.size > 0
      ? Array.from(needsMap.entries()).map(([need, intensity]) => ({ need, intensity }))
      : mockCustomerNeeds;
  return { segments, needs };
}

export async function fetchTrends(): Promise<Trend[] | null> {
  const items = await fetchList<BackendTrend>("/trend");
  return items ? items.map(mapTrend) : null;
}

export async function fetchIndustries(): Promise<Industry[] | null> {
  const items = await fetchList<BackendIndustry>("/industry");
  return items ? items.map(mapIndustry) : null;
}

export async function fetchOpportunities(): Promise<Opportunity[] | null> {
  const ranked = await authedGet<BackendOpportunity[]>("/opportunities?limit=50");
  if (ranked?.length) return ranked.map(mapOpportunity);
  const items = await fetchList<BackendOpportunity>("/opportunity");
  return items ? items.map(mapOpportunity) : null;
}

export async function fetchRisks(): Promise<Risk[] | null> {
  const items = await fetchList<BackendRisk>("/risk");
  return items ? items.map(mapRisk) : null;
}

export async function fetchReports(): Promise<Report[] | null> {
  const [research, briefs] = await Promise.all([
    authedGet<BackendReport[]>("/reports?limit=50"),
    authedGet<BackendBrief[]>("/reports/briefs?limit=50"),
  ]);
  const combined: Report[] = [];
  if (research?.length) combined.push(...research.map(mapReport));
  if (briefs?.length) combined.push(...briefs.map(mapBrief));
  return combined.length ? combined : null;
}

export async function fetchCROSummary(): Promise<ExecutiveData | null> {
  const [cro, dash] = await Promise.all([
    authedGet<AgentResult>("/cro/summary"),
    fetchDashboard(),
  ]);
  if (!cro) return null;
  return mapExecutiveFromCRO(cro, dash);
}

export async function fetchStrategyRecommendations(): Promise<BackendRecommendation[] | null> {
  return authedGet<BackendRecommendation[]>("/strategy/recommendations");
}

export async function runStrategyGenerate(): Promise<AgentResult | null> {
  return authedPost<AgentResult>("/strategy/generate");
}

export async function runOpportunityGenerate(): Promise<Opportunity[] | null> {
  const result = await authedPost<Array<Record<string, unknown>>>("/opportunities/generate");
  if (!result?.length) return null;
  return result.map((o, i) =>
    mapOpportunity(
      {
        id: String(o.title ?? i),
        title: String(o.title ?? "Opportunity"),
        category: o.category as string | undefined,
        opportunity_score: o.opportunity_score as number | undefined,
        market_size_usd: o.market_size_usd as number | undefined,
        revenue_potential_usd: o.revenue_potential_usd as number | undefined,
        competition_score: o.competition_score as number | undefined,
        growth_potential: o.growth_potential as number | undefined,
        priority: o.priority as string | undefined,
        rationale: o.rationale as Record<string, unknown> | undefined,
      },
      i,
    ),
  );
}

export async function runAgentAnalyze(agent: string): Promise<AgentResult | null> {
  return authedPost<AgentResult>(`/${agent}/analyze`);
}

/** Map a strategy recommendation or agent summary to a chat answer. */
export function strategyAnswerFromBackend(
  question: string,
  recs: BackendRecommendation[] | null,
  agent?: AgentResult | null,
): string | null {
  if (agent?.summary) return agent.summary;
  if (!recs?.length) return null;
  const q = question.toLowerCase();
  const match =
    recs.find((r) => r.title.toLowerCase().includes(q.split(" ").slice(-2).join(" "))) ??
    recs.find((r) => {
      const cat = (r.category ?? "").toLowerCase();
      if (q.includes("market") && cat.includes("market")) return true;
      if (q.includes("build") && cat.includes("product")) return true;
      if (q.includes("competitor") && cat.includes("competitive")) return true;
      if (q.includes("demand") && cat.includes("demand")) return true;
      if (q.includes("opportunit") && cat.includes("product")) return true;
      if (q.includes("risk") && cat.includes("risk")) return true;
      return false;
    }) ??
    recs[0];
  const steps = match.action_plan?.steps?.join(" · ") ?? "";
  return [match.description ?? match.title, steps ? `**Next steps:** ${steps}` : ""]
    .filter(Boolean)
    .join("\n\n");
}
