# Frontend Monorepo

Production-grade monorepo built with [Turborepo](https://turbo.build), Next.js 15, TypeScript, and pnpm workspaces.

Contains a **portfolio site** and a suite of **interview preparation apps** — all sharing a common component library, hooks, config, and data packages.

## Live

| App | URL |
| --- | --- |
| Portfolio | _coming soon_ |
| Interview Prep Hub | https://monorepo-hub-phi.vercel.app |
| React Interview Prep | https://monorepo-react-orcin.vercel.app |
| TypeScript Mastery | https://monorepo-typescript.vercel.app |
| Monorepo Architecture | https://monorepo-monorepo.vercel.app |
| Next.js Interview Prep | https://monorepo-nextjs-psi.vercel.app |
| JavaScript Interview Prep | _coming soon_ |

## Structure

```
apps/
  portfolio/    → Personal portfolio with i18n (EN/UK)   (port 3004)
  hub/          → Interview Prep central dashboard        (port 3003)
  react/        → React interview questions + quiz        (port 3000)
  typescript/   → TypeScript cheatsheet + quiz            (port 3001)
  monorepo/     → Monorepo architecture deep-dive         (port 3002)
  nextjs/       → Next.js interview questions + quiz       (port 3005)
  javascript/   → JavaScript interview questions + quiz    (port 3006)

packages/
  ui/             → Shared React component library (Button, Input, Card, Badge, QuizMode)
  hooks/          → Shared React hooks
  interview-data/ → Interview questions data (React, TypeScript, Monorepo, Next.js, JavaScript)
  api/            → Shared API client (axios + typed methods)
  types/          → Shared TypeScript interfaces
  config/         → Shared tsconfig & ESLint presets
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

```bash
npm install -g pnpm@9
pnpm install
```

## Dev

```bash
pnpm dev                 # all apps in parallel
pnpm dev:portfolio       # portfolio only      → localhost:3004
pnpm dev:hub             # hub only            → localhost:3003
pnpm dev:react           # react app only      → localhost:3000
pnpm dev:typescript      # typescript app only → localhost:3001
pnpm dev:monorepo        # monorepo app only   → localhost:3002
pnpm dev:nextjs          # next.js app only    → localhost:3005
pnpm dev:javascript      # javascript app only → localhost:3006
```

## Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Start all apps in watch mode           |
| `pnpm build`      | Build all apps and packages            |
| `pnpm type-check` | Run `tsc --noEmit` across the monorepo |
| `pnpm clean`      | Remove all build artifacts             |

## Environment variables

Each app reads its sibling URLs from env vars (with Vercel URLs as fallbacks):

| Variable                        | Used by    | Default fallback                              |
| ------------------------------- | ---------- | --------------------------------------------- |
| `NEXT_PUBLIC_HUB_URL`           | all apps   | `https://monorepo-hub-phi.vercel.app`         |
| `NEXT_PUBLIC_REACT_URL`         | hub, portfolio | `https://monorepo-react-orcin.vercel.app` |
| `NEXT_PUBLIC_TYPESCRIPT_URL`    | hub, portfolio | `https://monorepo-typescript.vercel.app`  |
| `NEXT_PUBLIC_MONOREPO_URL`      | hub, portfolio | `https://monorepo-monorepo.vercel.app`    |
| `NEXT_PUBLIC_NEXTJS_URL`        | hub, portfolio | `https://monorepo-nextjs-psi.vercel.app`  |
| `NEXT_PUBLIC_JAVASCRIPT_URL`    | hub, portfolio | _coming soon_                             |

## Packages

### `@fintech/ui`

Shared Tailwind-styled React components used across all apps.

```tsx
import { Button, Input, Card, Badge, QuizMode } from "@fintech/ui";
```

### `@fintech/interview-data`

Typed interview questions for React, TypeScript, and Monorepo topics.

```ts
import { reactQuestions, typescriptQuestions, monorepoQuestions, nextjsQuestions, javascriptQuestions } from "@fintech/interview-data";
// each question: { id, question, answer, code?, difficulty: "junior" | "middle" | "senior", tags: string[] }
```

### `@fintech/hooks`

Shared React hooks (e.g. `useLocalStorage`, `useQuiz`).

### `@fintech/config`

Extend tsconfig and ESLint in any workspace package:

```json
{ "extends": "@fintech/config/tsconfig/nextjs" }
```

## i18n

The portfolio app (`apps/portfolio`) uses [next-intl](https://next-intl.dev) with URL-based routing:

```
/en  → English
/uk  → Ukrainian
```

Language is auto-detected from the browser and stored in the URL. The `EN | UK` toggle in the navbar switches locale without a full page reload.

## Turborepo caching

Remote caching speeds up CI builds. Authenticate once:

```bash
npx turbo login
npx turbo link
```
