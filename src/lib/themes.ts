/* Theme registry for Celestra Research AI.
   `id` is used directly as the <html> class via next-themes. */

export interface ThemeDef {
  id: string;
  name: string;
  description: string;
  scheme: "dark" | "light";
  swatch: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themes: ThemeDef[] = [
  {
    id: "dark-command",
    name: "Dark Command",
    description: "Mission Control Interface",
    scheme: "dark",
    swatch: { bg: "#050505", primary: "#00E5FF", secondary: "#00FFA3", accent: "#FFB800" },
  },
  {
    id: "light-executive",
    name: "Light Executive",
    description: "Executive Clarity",
    scheme: "light",
    swatch: { bg: "#F7F8FC", primary: "#3B82F6", secondary: "#22C55E", accent: "#8B5CF6" },
  },
  {
    id: "ocean",
    name: "Ocean Intelligence",
    description: "Deep Data Network",
    scheme: "dark",
    swatch: { bg: "#031926", primary: "#00C2FF", secondary: "#00FFD1", accent: "#4DEEEA" },
  },
  {
    id: "sunset",
    name: "Sunset Analytics",
    description: "Warm Executive Energy",
    scheme: "dark",
    swatch: { bg: "#0D1117", primary: "#FF6B35", secondary: "#FFB703", accent: "#FF4D6D" },
  },
  {
    id: "forest",
    name: "Forest Strategy",
    description: "Growth Intelligence",
    scheme: "dark",
    swatch: { bg: "#071A07", primary: "#00FF85", secondary: "#8EFF00", accent: "#00D46A" },
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    description: "Financial Terminal",
    scheme: "dark",
    swatch: { bg: "#020617", primary: "#2563EB", secondary: "#60A5FA", accent: "#38BDF8" },
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Premium SaaS Lights",
    scheme: "dark",
    swatch: { bg: "#030712", primary: "#00F5D4", secondary: "#7B2CBF", accent: "#4CC9F0" },
  },
  {
    id: "volcanic",
    name: "Volcanic",
    description: "High Energy Operations",
    scheme: "dark",
    swatch: { bg: "#080808", primary: "#FF3D00", secondary: "#FF9100", accent: "#FF1744" },
  },
];

export const themeIds = themes.map((t) => t.id);
export const defaultThemeId = "dark-command";
