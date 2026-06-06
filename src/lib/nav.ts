import {
  LayoutDashboard,
  Globe2,
  Swords,
  Users,
  TrendingUp,
  Building2,
  Sparkles,
  ShieldAlert,
  Bot,
  Crown,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
  badge?: string;
}

export const navItems: NavItem[] = [
  { label: "Mission Control", href: "/", icon: LayoutDashboard, group: "Command" },
  { label: "Market Intelligence", href: "/market-intelligence", icon: Globe2, group: "Intelligence" },
  { label: "Competitor Intelligence", href: "/competitor-intelligence", icon: Swords, group: "Intelligence" },
  { label: "Customer Intelligence", href: "/customer-intelligence", icon: Users, group: "Intelligence" },
  { label: "Trend Intelligence", href: "/trend-intelligence", icon: TrendingUp, group: "Intelligence" },
  { label: "Industry Intelligence", href: "/industry-intelligence", icon: Building2, group: "Intelligence" },
  { label: "Opportunity Discovery", href: "/opportunity-discovery", icon: Sparkles, group: "Intelligence", badge: "326" },
  { label: "Risk Intelligence", href: "/risk-intelligence", icon: ShieldAlert, group: "Intelligence", badge: "47" },
  { label: "Strategy Agent", href: "/strategy-agent", icon: Bot, group: "Agents" },
  { label: "Chief Research Officer", href: "/chief-research-officer", icon: Crown, group: "Agents" },
  { label: "Reports", href: "/reports", icon: FileBarChart, group: "Workspace" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Workspace" },
];

export const navGroups = ["Command", "Intelligence", "Agents", "Workspace"];
