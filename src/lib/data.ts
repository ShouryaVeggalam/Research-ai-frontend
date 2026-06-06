/* ────────────────────────────────────────────────────────────
   CELESTRA RESEARCH AI — MOCK INTELLIGENCE DATASET
   Realistic synthetic data powering the command center.
   ──────────────────────────────────────────────────────────── */

export type Tone = "indigo" | "purple" | "blue" | "emerald" | "amber" | "rose";
export type Priority = "Critical" | "High" | "Medium" | "Low";

/* ---------------------------------- KPIs ---------------------------------- */

export interface KPI {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delta: number;
  tone: Tone;
}

export const heroMetrics: KPI[] = [
  { label: "Markets Tracked", value: 142, delta: 6.2, tone: "indigo" },
  { label: "Competitors Tracked", value: 1284, delta: 11.4, tone: "purple" },
  { label: "Industries Monitored", value: 38, delta: 2.1, tone: "blue" },
  { label: "Opportunities Found", value: 326, delta: 18.7, tone: "emerald" },
  { label: "Risk Alerts", value: 47, delta: -8.3, tone: "rose" },
  { label: "Trend Signals", value: 912, delta: 24.5, tone: "amber" },
];

/* ------------------------------ Intelligence Feed ------------------------- */

export type FeedType =
  | "Competitor"
  | "Industry"
  | "Funding"
  | "Regulatory"
  | "Opportunity"
  | "Trend"
  | "Risk";

export interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  source: string;
  time: string;
  impact: number; // 0-100
  confidence: number; // 0-100
  priority: Priority;
}

export const feedItems: FeedItem[] = [
  {
    id: "f1",
    type: "Competitor",
    title: "Anthropic launched enterprise agent platform with autonomous workflows",
    source: "Product Radar",
    time: "2m ago",
    impact: 92,
    confidence: 96,
    priority: "Critical",
  },
  {
    id: "f2",
    type: "Funding",
    title: "Mistral AI closes $640M Series C at $14B valuation",
    source: "Capital Signals",
    time: "11m ago",
    impact: 84,
    confidence: 99,
    priority: "High",
  },
  {
    id: "f3",
    type: "Industry",
    title: "Vertical AI software spend accelerating — projected +41% YoY",
    source: "Macro Index",
    time: "24m ago",
    impact: 78,
    confidence: 88,
    priority: "High",
  },
  {
    id: "f4",
    type: "Regulatory",
    title: "EU AI Act enforcement timeline finalized for high-risk systems",
    source: "Policy Watch",
    time: "39m ago",
    impact: 71,
    confidence: 94,
    priority: "Medium",
  },
  {
    id: "f5",
    type: "Opportunity",
    title: "White space detected: AI compliance tooling for mid-market fintech",
    source: "Opportunity Engine",
    time: "52m ago",
    impact: 88,
    confidence: 82,
    priority: "Critical",
  },
  {
    id: "f6",
    type: "Trend",
    title: "On-device inference momentum surging across consumer hardware",
    source: "Signal Mesh",
    time: "1h ago",
    impact: 67,
    confidence: 79,
    priority: "Medium",
  },
  {
    id: "f7",
    type: "Risk",
    title: "Supply concentration risk rising in high-bandwidth memory market",
    source: "Risk Sentinel",
    time: "1h ago",
    impact: 74,
    confidence: 86,
    priority: "High",
  },
  {
    id: "f8",
    type: "Competitor",
    title: "Perplexity shipped enterprise search with SOC2 + on-prem connector",
    source: "Product Radar",
    time: "2h ago",
    impact: 69,
    confidence: 91,
    priority: "Medium",
  },
  {
    id: "f9",
    type: "Funding",
    title: "Sierra raises $175M to expand conversational AI for support ops",
    source: "Capital Signals",
    time: "3h ago",
    impact: 63,
    confidence: 97,
    priority: "Medium",
  },
  {
    id: "f10",
    type: "Opportunity",
    title: "Demand spike: AI evaluation & observability among Series B startups",
    source: "Opportunity Engine",
    time: "4h ago",
    impact: 81,
    confidence: 77,
    priority: "High",
  },
  {
    id: "f11",
    type: "Industry",
    title: "Healthcare AI adoption crossing inflection in revenue-cycle automation",
    source: "Macro Index",
    time: "5h ago",
    impact: 72,
    confidence: 84,
    priority: "Medium",
  },
  {
    id: "f12",
    type: "Trend",
    title: "Synthetic data tooling entering mainstream enterprise pipelines",
    source: "Signal Mesh",
    time: "6h ago",
    impact: 58,
    confidence: 73,
    priority: "Low",
  },
];

export const feedToneMap: Record<FeedType, Tone> = {
  Competitor: "purple",
  Industry: "blue",
  Funding: "emerald",
  Regulatory: "amber",
  Opportunity: "indigo",
  Trend: "blue",
  Risk: "rose",
};

/* ------------------------------ Strategy Map ------------------------------ */

export interface GraphNode {
  id: string;
  label: string;
  type: "market" | "industry" | "opportunity" | "risk" | "core";
  x: number; // 0-100
  y: number; // 0-100
  size: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export const graphNodes: GraphNode[] = [
  { id: "core", label: "Celestra Core", type: "core", x: 50, y: 50, size: 26 },
  { id: "m1", label: "Enterprise AI", type: "market", x: 22, y: 24, size: 18 },
  { id: "m2", label: "Fintech", type: "market", x: 78, y: 22, size: 16 },
  { id: "m3", label: "Healthcare", type: "market", x: 80, y: 70, size: 15 },
  { id: "i1", label: "Vertical SaaS", type: "industry", x: 35, y: 72, size: 14 },
  { id: "i2", label: "Cybersecurity", type: "industry", x: 16, y: 56, size: 13 },
  { id: "o1", label: "Compliance Tooling", type: "opportunity", x: 60, y: 14, size: 12 },
  { id: "o2", label: "AI Observability", type: "opportunity", x: 64, y: 84, size: 12 },
  { id: "o3", label: "On-device Inference", type: "opportunity", x: 14, y: 82, size: 11 },
  { id: "r1", label: "Regulatory Risk", type: "risk", x: 90, y: 44, size: 11 },
  { id: "r2", label: "Supply Risk", type: "risk", x: 44, y: 90, size: 10 },
];

export const graphEdges: GraphEdge[] = [
  { from: "core", to: "m1" },
  { from: "core", to: "m2" },
  { from: "core", to: "m3" },
  { from: "core", to: "i1" },
  { from: "core", to: "i2" },
  { from: "m1", to: "o1" },
  { from: "m2", to: "o1" },
  { from: "m1", to: "o3" },
  { from: "m3", to: "o2" },
  { from: "i1", to: "o2" },
  { from: "m2", to: "r1" },
  { from: "m3", to: "r1" },
  { from: "i1", to: "r2" },
  { from: "i2", to: "m1" },
];

export const nodeToneMap: Record<GraphNode["type"], Tone> = {
  core: "indigo",
  market: "blue",
  industry: "purple",
  opportunity: "emerald",
  risk: "rose",
};

/* ------------------------------ Opportunities ----------------------------- */

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  opportunityScore: number;
  marketSize: number; // USD
  competitionScore: number; // lower is better
  growthRate: number; // %
  revenuePotential: number; // USD
  recommendation: string;
  rank: number;
  priority: Priority;
}

export const opportunities: Opportunity[] = [
  {
    id: "op1",
    title: "AI Compliance Tooling for Mid-Market Fintech",
    category: "Fintech · RegTech",
    opportunityScore: 94,
    marketSize: 12_400_000_000,
    competitionScore: 28,
    growthRate: 47,
    revenuePotential: 240_000_000,
    recommendation: "Enter aggressively. Low competition, regulatory tailwinds, urgent buyer need.",
    rank: 1,
    priority: "Critical",
  },
  {
    id: "op2",
    title: "AI Evaluation & Observability Platform",
    category: "Developer Infrastructure",
    opportunityScore: 89,
    marketSize: 8_900_000_000,
    competitionScore: 41,
    growthRate: 53,
    revenuePotential: 180_000_000,
    recommendation: "Strong fit. Build differentiated eval primitives before incumbents consolidate.",
    rank: 2,
    priority: "Critical",
  },
  {
    id: "op3",
    title: "Vertical AI for Revenue-Cycle Healthcare",
    category: "Healthcare · Automation",
    opportunityScore: 86,
    marketSize: 15_200_000_000,
    competitionScore: 38,
    growthRate: 39,
    revenuePotential: 310_000_000,
    recommendation: "High ceiling. Requires compliance investment but defensible once embedded.",
    rank: 3,
    priority: "High",
  },
  {
    id: "op4",
    title: "On-Device Inference SDK for Consumer Apps",
    category: "Edge AI",
    opportunityScore: 82,
    marketSize: 6_100_000_000,
    competitionScore: 35,
    growthRate: 61,
    revenuePotential: 120_000_000,
    recommendation: "Fast-growing. Capture developer mindshare with best-in-class latency.",
    rank: 4,
    priority: "High",
  },
  {
    id: "op5",
    title: "Autonomous Agent Orchestration for Support Ops",
    category: "Enterprise AI",
    opportunityScore: 79,
    marketSize: 9_700_000_000,
    competitionScore: 52,
    growthRate: 44,
    revenuePotential: 165_000_000,
    recommendation: "Crowded but expanding. Win on reliability and integration depth.",
    rank: 5,
    priority: "High",
  },
  {
    id: "op6",
    title: "Synthetic Data Pipelines for Regulated Industries",
    category: "Data Infrastructure",
    opportunityScore: 74,
    marketSize: 4_300_000_000,
    competitionScore: 31,
    growthRate: 36,
    revenuePotential: 88_000_000,
    recommendation: "Niche but sticky. Strong margins, slower sales cycles.",
    rank: 6,
    priority: "Medium",
  },
];

/* ------------------------------ Competitors ------------------------------- */

export interface Competitor {
  id: string;
  name: string;
  logo: string; // emoji/initials placeholder
  category: string;
  funding: number;
  employees: number;
  pricing: string;
  threatLevel: number; // 0-100
  threat: Priority;
  momentum: number; // -100..100
  productChanges: string[];
  recentNews: { title: string; time: string }[];
  spark: number[];
}

export const competitors: Competitor[] = [
  {
    id: "c1",
    name: "Anthropic",
    logo: "AN",
    category: "Frontier Models · Enterprise",
    funding: 7_300_000_000,
    employees: 1200,
    pricing: "Usage + Enterprise seats",
    threatLevel: 91,
    threat: "Critical",
    momentum: 38,
    productChanges: [
      "Launched autonomous agent platform",
      "Expanded enterprise context window",
      "Added SOC2 + HIPAA compliance tiers",
    ],
    recentNews: [
      { title: "Enterprise agent platform GA", time: "2m ago" },
      { title: "New government partnership announced", time: "2d ago" },
    ],
    spark: [62, 64, 61, 68, 72, 75, 79, 84, 88, 91],
  },
  {
    id: "c2",
    name: "Mistral AI",
    logo: "MI",
    category: "Open Models · Infra",
    funding: 1_700_000_000,
    employees: 320,
    pricing: "Open + Managed API",
    threatLevel: 78,
    threat: "High",
    momentum: 44,
    productChanges: [
      "Released new mixture-of-experts model",
      "Launched fine-tuning studio",
    ],
    recentNews: [
      { title: "$640M Series C closed", time: "11m ago" },
      { title: "EU sovereign cloud deal", time: "5d ago" },
    ],
    spark: [40, 44, 46, 50, 55, 58, 62, 68, 73, 78],
  },
  {
    id: "c3",
    name: "Perplexity",
    logo: "PX",
    category: "AI Search · Knowledge",
    funding: 1_000_000_000,
    employees: 280,
    pricing: "Freemium + Enterprise",
    threatLevel: 69,
    threat: "High",
    momentum: 29,
    productChanges: [
      "Shipped enterprise search",
      "Added on-prem connector",
      "SOC2 Type II certified",
    ],
    recentNews: [
      { title: "Enterprise search launch", time: "2h ago" },
      { title: "Publisher revenue-share program", time: "1w ago" },
    ],
    spark: [50, 52, 51, 55, 58, 60, 62, 65, 67, 69],
  },
  {
    id: "c4",
    name: "Sierra",
    logo: "SI",
    category: "Conversational AI · Support",
    funding: 285_000_000,
    employees: 190,
    pricing: "Outcome-based",
    threatLevel: 58,
    threat: "Medium",
    momentum: 22,
    productChanges: ["Expanded voice agents", "Added analytics suite"],
    recentNews: [
      { title: "$175M raise", time: "3h ago" },
      { title: "Fortune 500 deployment", time: "2w ago" },
    ],
    spark: [42, 43, 45, 46, 48, 50, 52, 54, 56, 58],
  },
  {
    id: "c5",
    name: "Glean",
    logo: "GL",
    category: "Enterprise Search · Knowledge",
    funding: 620_000_000,
    employees: 540,
    pricing: "Per-seat Enterprise",
    threatLevel: 64,
    threat: "Medium",
    momentum: 18,
    productChanges: ["Launched agentic workflows", "New permissions engine"],
    recentNews: [
      { title: "Series E extension", time: "1w ago" },
      { title: "Marketplace for agents", time: "3w ago" },
    ],
    spark: [55, 56, 57, 58, 60, 61, 62, 63, 63, 64],
  },
  {
    id: "c6",
    name: "Harvey",
    logo: "HV",
    category: "Vertical AI · Legal",
    funding: 500_000_000,
    employees: 340,
    pricing: "Enterprise contract",
    threatLevel: 52,
    threat: "Medium",
    momentum: 31,
    productChanges: ["Expanded to compliance workflows", "Multi-jurisdiction support"],
    recentNews: [
      { title: "Global law firm rollout", time: "4d ago" },
      { title: "New funding round", time: "1mo ago" },
    ],
    spark: [38, 40, 42, 44, 45, 47, 49, 50, 51, 52],
  },
];

/* -------------------------------- Trends ---------------------------------- */

export interface Trend {
  id: string;
  name: string;
  category: string;
  momentum: number; // 0-100
  growth: number; // %
  velocity: number; // 0-100
  confidence: number; // 0-100
  stage: "Emerging" | "Accelerating" | "Peaking" | "Maturing";
  forecast: number[]; // historical + projected series
  tone: Tone;
}

export const trends: Trend[] = [
  {
    id: "t1",
    name: "Autonomous AI Agents",
    category: "Enterprise AI",
    momentum: 96,
    growth: 142,
    velocity: 91,
    confidence: 89,
    stage: "Accelerating",
    forecast: [20, 28, 35, 44, 56, 68, 79, 88, 96],
    tone: "indigo",
  },
  {
    id: "t2",
    name: "On-Device Inference",
    category: "Edge AI",
    momentum: 84,
    growth: 98,
    velocity: 78,
    confidence: 81,
    stage: "Accelerating",
    forecast: [18, 24, 30, 38, 47, 58, 68, 77, 84],
    tone: "blue",
  },
  {
    id: "t3",
    name: "AI Evaluation & Observability",
    category: "Dev Infrastructure",
    momentum: 88,
    growth: 121,
    velocity: 85,
    confidence: 84,
    stage: "Accelerating",
    forecast: [12, 18, 26, 35, 46, 58, 70, 80, 88],
    tone: "emerald",
  },
  {
    id: "t4",
    name: "Synthetic Data Generation",
    category: "Data Infrastructure",
    momentum: 71,
    growth: 64,
    velocity: 62,
    confidence: 76,
    stage: "Emerging",
    forecast: [22, 26, 31, 37, 44, 52, 60, 66, 71],
    tone: "purple",
  },
  {
    id: "t5",
    name: "AI Compliance & Governance",
    category: "RegTech",
    momentum: 79,
    growth: 88,
    velocity: 73,
    confidence: 86,
    stage: "Accelerating",
    forecast: [15, 21, 28, 36, 46, 57, 67, 74, 79],
    tone: "amber",
  },
  {
    id: "t6",
    name: "Multimodal Search",
    category: "Knowledge",
    momentum: 62,
    growth: 51,
    velocity: 55,
    confidence: 72,
    stage: "Emerging",
    forecast: [25, 28, 32, 37, 42, 48, 54, 59, 62],
    tone: "blue",
  },
];

/* --------------------------------- Risks ---------------------------------- */

export interface Risk {
  id: string;
  name: string;
  category: string;
  likelihood: number; // 0-100
  severity: number; // 0-100
  level: Priority;
  trend: "Rising" | "Stable" | "Falling";
  owner: string;
  detail: string;
}

export const risks: Risk[] = [
  {
    id: "rk1",
    name: "EU AI Act Compliance Exposure",
    category: "Regulatory",
    likelihood: 82,
    severity: 74,
    level: "High",
    trend: "Rising",
    owner: "Policy Watch",
    detail: "High-risk system classification could require conformity assessments.",
  },
  {
    id: "rk2",
    name: "HBM Supply Concentration",
    category: "Supply Chain",
    likelihood: 68,
    severity: 86,
    level: "High",
    trend: "Rising",
    owner: "Risk Sentinel",
    detail: "Memory supply concentrated among few vendors; pricing volatility rising.",
  },
  {
    id: "rk3",
    name: "Frontier Model Commoditization",
    category: "Market",
    likelihood: 74,
    severity: 62,
    level: "Medium",
    trend: "Rising",
    owner: "Macro Index",
    detail: "Margins compressing as open models close capability gap.",
  },
  {
    id: "rk4",
    name: "Talent Concentration Risk",
    category: "Operational",
    likelihood: 55,
    severity: 58,
    level: "Medium",
    trend: "Stable",
    owner: "Org Signals",
    detail: "Key researcher mobility could shift competitive balance quickly.",
  },
  {
    id: "rk5",
    name: "Data Privacy Litigation",
    category: "Legal",
    likelihood: 47,
    severity: 71,
    level: "Medium",
    trend: "Stable",
    owner: "Policy Watch",
    detail: "Training-data provenance disputes increasing across jurisdictions.",
  },
  {
    id: "rk6",
    name: "Cloud Cost Inflation",
    category: "Financial",
    likelihood: 61,
    severity: 49,
    level: "Low",
    trend: "Falling",
    owner: "Capital Signals",
    detail: "Inference cost per token declining but volume offsets savings.",
  },
  {
    id: "rk7",
    name: "Security: Prompt Injection",
    category: "Security",
    likelihood: 70,
    severity: 66,
    level: "High",
    trend: "Rising",
    owner: "Risk Sentinel",
    detail: "Agentic systems expand attack surface for untrusted inputs.",
  },
];

/* ------------------------------- Markets ---------------------------------- */

export interface Market {
  id: string;
  name: string;
  size: number;
  cagr: number;
  attractiveness: number;
  saturation: number;
  signal: number[];
  tone: Tone;
}

export const markets: Market[] = [
  { id: "mk1", name: "Enterprise AI Platforms", size: 84_000_000_000, cagr: 38, attractiveness: 92, saturation: 54, signal: [40, 48, 52, 60, 66, 74, 82, 88], tone: "indigo" },
  { id: "mk2", name: "AI Developer Infrastructure", size: 31_000_000_000, cagr: 47, attractiveness: 88, saturation: 41, signal: [22, 28, 35, 44, 53, 62, 71, 80], tone: "emerald" },
  { id: "mk3", name: "Vertical AI — Healthcare", size: 52_000_000_000, cagr: 39, attractiveness: 85, saturation: 38, signal: [30, 36, 41, 49, 57, 64, 70, 77], tone: "blue" },
  { id: "mk4", name: "Vertical AI — Fintech", size: 47_000_000_000, cagr: 44, attractiveness: 90, saturation: 36, signal: [28, 34, 42, 51, 60, 69, 76, 84], tone: "purple" },
  { id: "mk5", name: "AI Security & Governance", size: 19_000_000_000, cagr: 52, attractiveness: 87, saturation: 29, signal: [16, 22, 30, 39, 50, 61, 72, 83], tone: "amber" },
  { id: "mk6", name: "Edge & On-Device AI", size: 23_000_000_000, cagr: 61, attractiveness: 83, saturation: 33, signal: [12, 18, 26, 36, 47, 58, 69, 80], tone: "rose" },
];

/* ------------------------------ Industries -------------------------------- */

export interface Industry {
  id: string;
  name: string;
  health: number;
  growth: number;
  adoption: number;
  disruption: number;
  tone: Tone;
}

export const industries: Industry[] = [
  { id: "in1", name: "Financial Services", health: 88, growth: 44, adoption: 71, disruption: 82, tone: "purple" },
  { id: "in2", name: "Healthcare", health: 84, growth: 39, adoption: 58, disruption: 76, tone: "blue" },
  { id: "in3", name: "Software & SaaS", health: 91, growth: 51, adoption: 86, disruption: 94, tone: "indigo" },
  { id: "in4", name: "Manufacturing", health: 72, growth: 28, adoption: 44, disruption: 61, tone: "amber" },
  { id: "in5", name: "Retail & Commerce", health: 79, growth: 33, adoption: 62, disruption: 70, tone: "emerald" },
  { id: "in6", name: "Energy & Utilities", health: 68, growth: 24, adoption: 38, disruption: 55, tone: "rose" },
];

/* ------------------------- Customer Intelligence -------------------------- */

export interface Segment {
  id: string;
  name: string;
  demand: number;
  satisfaction: number;
  churnRisk: number;
  size: number;
  tone: Tone;
}

export const segments: Segment[] = [
  { id: "s1", name: "Enterprise (5000+)", demand: 92, satisfaction: 81, churnRisk: 14, size: 420, tone: "indigo" },
  { id: "s2", name: "Mid-Market (500-5000)", demand: 88, satisfaction: 76, churnRisk: 22, size: 1180, tone: "emerald" },
  { id: "s3", name: "Growth (50-500)", demand: 79, satisfaction: 72, churnRisk: 31, size: 3240, tone: "blue" },
  { id: "s4", name: "Startup (<50)", demand: 84, satisfaction: 69, churnRisk: 38, size: 7600, tone: "purple" },
];

export const customerNeeds = [
  { need: "Compliance & Governance", intensity: 91 },
  { need: "Integration Depth", intensity: 84 },
  { need: "Latency & Reliability", intensity: 88 },
  { need: "Cost Predictability", intensity: 76 },
  { need: "Data Privacy", intensity: 93 },
  { need: "Customization", intensity: 71 },
];

/* -------------------------------- Reports --------------------------------- */

export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  pages: number;
  confidence: number;
  status: "Ready" | "Generating" | "Scheduled";
  tone: Tone;
}

export const reports: Report[] = [
  { id: "rp1", title: "Q3 Competitive Landscape — Enterprise AI", type: "Competitor", date: "Jun 04, 2026", pages: 42, confidence: 94, status: "Ready", tone: "purple" },
  { id: "rp2", title: "Fintech RegTech Opportunity Deep Dive", type: "Opportunity", date: "Jun 02, 2026", pages: 28, confidence: 89, status: "Ready", tone: "indigo" },
  { id: "rp3", title: "Global Risk Exposure Assessment", type: "Risk", date: "May 30, 2026", pages: 36, confidence: 86, status: "Ready", tone: "rose" },
  { id: "rp4", title: "Emerging Trend Forecast — H2 2026", type: "Trend", date: "Jun 06, 2026", pages: 0, confidence: 0, status: "Generating", tone: "amber" },
  { id: "rp5", title: "Healthcare AI Market Entry Brief", type: "Market", date: "Jun 08, 2026", pages: 0, confidence: 0, status: "Scheduled", tone: "blue" },
  { id: "rp6", title: "Customer Demand Signals — Mid-Market", type: "Customer", date: "May 28, 2026", pages: 19, confidence: 82, status: "Ready", tone: "emerald" },
];

/* --------------------------- Chief Research Officer ----------------------- */

export const executive = {
  researchHealth: 87,
  opportunityScore: 91,
  strategicConfidence: 84,
  marketPosition: 78,
  riskExposure: 34,
  summary:
    "Celestra's strategic position strengthened this quarter. Opportunity density is at an all-time high, led by AI compliance tooling and observability white space. Competitive pressure is intensifying from frontier-model players, but defensibility remains strong in vertical and regulated segments. Risk exposure is moderate and concentrated in regulatory and supply-chain vectors — both actively monitored. Recommended posture: aggressive expansion into 2 prioritized white-space markets while hardening compliance and supply resilience.",
  priorities: [
    { title: "Enter AI compliance tooling for fintech", confidence: 94, tone: "indigo" as Tone },
    { title: "Ship AI evaluation & observability suite", confidence: 89, tone: "emerald" as Tone },
    { title: "Harden EU AI Act compliance posture", confidence: 86, tone: "amber" as Tone },
    { title: "Diversify HBM supply dependencies", confidence: 79, tone: "rose" as Tone },
  ],
  actions: [
    "Allocate R&D toward compliance + observability white space within 2 quarters",
    "Establish regulatory affairs function ahead of EU AI Act enforcement",
    "Secure secondary memory supply agreements to reduce concentration risk",
    "Accelerate vertical healthcare GTM with revenue-cycle automation wedge",
  ],
  trajectory: [
    { month: "Jan", health: 72, opportunity: 78, risk: 41 },
    { month: "Feb", health: 75, opportunity: 81, risk: 39 },
    { month: "Mar", health: 77, opportunity: 83, risk: 44 },
    { month: "Apr", health: 80, opportunity: 86, risk: 38 },
    { month: "May", health: 84, opportunity: 88, risk: 36 },
    { month: "Jun", health: 87, opportunity: 91, risk: 34 },
  ],
};

/* ----------------------- Strategy Agent suggested prompts ----------------- */

export const strategyPrompts = [
  "Which market should we enter next?",
  "What should we build next?",
  "Where is demand growing fastest?",
  "What are competitors missing?",
  "What opportunities exist right now?",
  "What's our biggest strategic risk?",
];

export const strategyAnswers: Record<string, string> = {
  default:
    "Based on current intelligence, the highest-conviction move is entering **AI compliance tooling for mid-market fintech** (Opportunity Score 94). It combines a $12.4B market, low competition (28), 47% growth, and strong regulatory tailwinds from the EU AI Act. I'd pair this with the **AI evaluation & observability** play to build a developer-infrastructure moat before incumbents consolidate.",
};
