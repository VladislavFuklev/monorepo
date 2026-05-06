# Fintech Monorepo

Production-grade monorepo for a fintech dashboard built with [Turborepo](https://turbo.build), Next.js, TypeScript, and pnpm.

## Structure

```
apps/
  web/        → Customer-facing dashboard   (port 3000)
  admin/      → Internal admin panel        (port 3001)

packages/
  ui/         → Shared React component library (Button, Input, Card, Badge)
  api/        → Shared API client (axios + typed methods)
  types/      → Shared TypeScript interfaces (User, Transaction, …)
  config/     → Shared tsconfig & ESLint presets
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

```bash
npm install -g pnpm@9
```

## Getting started

```bash
# Install all dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Start only the web dashboard
pnpm dev:web

# Start only the admin panel
pnpm dev:admin
```

## Available scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Start all apps in watch mode             |
| `pnpm dev:web`     | Start only `apps/web` (port 3000)        |
| `pnpm dev:admin`   | Start only `apps/admin` (port 3001)      |
| `pnpm build`       | Build all apps and packages              |
| `pnpm lint`        | Run ESLint across the monorepo           |
| `pnpm type-check`  | Run `tsc --noEmit` across the monorepo   |
| `pnpm clean`       | Remove all build artifacts               |

## Environment variables

Copy `.env.example` to `.env.local` in each app directory:

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/admin/.env.local
```

| Variable               | Default                                    | Description        |
| ---------------------- | ------------------------------------------ | ------------------ |
| `NEXT_PUBLIC_API_URL`  | `https://api.fintech.example.com/v1`       | Backend API root   |

## Packages

### `@fintech/ui`

Headless, Tailwind-styled React components.

```tsx
import { Button, Input, Card, Badge } from "@fintech/ui";
```

### `@fintech/api`

Typed API methods powered by axios.

```ts
import { getUser, getUsers } from "@fintech/api";

const user = await getUser("usr_01");
const { data, total } = await getUsers({ page: 1, limit: 20 });
```

### `@fintech/types`

Shared TypeScript interfaces.

```ts
import type { User, Transaction, ApiResponse } from "@fintech/types";
```

### `@fintech/config`

Extend tsconfig and ESLint in any workspace package:

```json
// tsconfig.json
{ "extends": "@fintech/config/tsconfig/nextjs" }
```

```js
// eslint.config.js
import nextConfig from "@fintech/config/eslint/nextjs";
export default nextConfig;
```

## Turborepo caching

Remote caching is supported out of the box. Authenticate with:

```bash
npx turbo login
npx turbo link
```
