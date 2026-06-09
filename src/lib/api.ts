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

import type { FeedItem, FeedType, KPI, Priority } from "@/lib/data";
import { heroMetrics } from "@/lib/data";

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
