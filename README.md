# Celestra Research AI

**Your AI Strategy Department** — an AI-powered strategic intelligence command center.

Not a SaaS dashboard, CRM, or chat clone. Celestra is designed to feel like an
intelligence operating system used by CEOs, founders, strategy teams, VCs, and
analysts — closer to Palantir Foundry × Bloomberg Terminal × Linear than a
typical AI startup product.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens)
- **Framer Motion** — page transitions, graph & card animations
- **Recharts** — area / radar visualizations
- **next-themes** — dark (default) + light
- **Geist** font (Sans + Mono)
- **Lucide** icons

## Design System

- Default **dark mode**: background `#050505`, panels `#0B0B0F`, cards `#111118`,
  hairline borders `rgba(255,255,255,0.08)`.
- Accents: Indigo, Purple, Electric Blue, Emerald (subtle glows, no neon).
- Premium typographic hierarchy (hero 64px, sections 32px, metrics 48px).
- Ambient aurora background, grid texture, glass panels, live pulse indicators.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | **Mission Control** — hero, live metrics, Live Intelligence Feed, Global Strategy Map |
| `/market-intelligence` | Market sizing, growth, attractiveness, saturation |
| `/competitor-intelligence` | Competitor profiles, funding, threat levels, product changes |
| `/customer-intelligence` | Segment demand, satisfaction, churn, needs radar |
| `/trend-intelligence` | Trend momentum, velocity, confidence, forecast timeline |
| `/industry-intelligence` | Industry health, adoption, disruption |
| `/opportunity-discovery` | **Opportunity Center** — scored, ranked strategic openings |
| `/risk-intelligence` | Risk matrix, heatmap, threat timeline, strategic alerts |
| `/strategy-agent` | Conversational AI strategist with suggested prompts |
| `/chief-research-officer` | **Executive dashboard** — health, priorities, actions, summary |
| `/reports` | Generated intelligence reports |
| `/settings` | Network, agents, alerts, appearance |

All data is realistic synthetic mock data in `src/lib/data.ts`.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Project Structure

```
src/
  app/                  # routes (App Router)
  components/
    shell/              # sidebar, top bar, app shell, theme toggle
    ui/                 # card, button, badge, progress, score-ring, counter, section
    viz/                # sparkline, area-trend, metric-card
    features/           # live-feed, strategy-map
  lib/
    data.ts             # mock intelligence dataset
    nav.ts              # navigation config
    tones.ts            # static Tailwind tone-class maps
    utils.ts            # cn() + formatters
```
