import type { Question } from "./types";

export const monorepoQuestions: Question[] = [
  {
    id: "m1",
    question: "Что такое монорепозиторий и какие его преимущества?",
    difficulty: "junior",
    tags: ["monorepo", "basics", "architecture"],
    answer: `Монорепозиторий (monorepo) — единый git-репозиторий, содержащий несколько независимых проектов (приложений и библиотек).

Преимущества:
• Переиспользование кода — общие компоненты, типы, утилиты в одном месте без дублирования
• Атомарные изменения — один коммит меняет API и всех его потребителей одновременно, нет рассинхрона версий
• Единые инструменты — один eslint, один tsconfig, единый CI/CD пайплайн
• Видимость — легко найти где используется любой компонент
• Рефакторинг — переименовать функцию во всех проектах за один раз

Недостатки:
• Рост размера репозитория
• Сборка требует умной оркестрации (иначе пересобирается всё)
• Нужна дисциплина команды в поддержании границ между пакетами`,
    code: `# Polyrepo — 3 репозитория, 3 CI, версионирование вручную
github.com/company/ui-kit      v2.1.0
github.com/company/web-app     uses ui-kit@2.0.0  ← отстаёт!
github.com/company/admin-app   uses ui-kit@2.1.0

# Monorepo — один репозиторий, всё актуально
monorepo/
  packages/ui/         ← единственная версия
  apps/web/            ← всегда актуальна
  apps/admin/          ← всегда актуальна`,
  },
  {
    id: "m2",
    question: "Что такое Turborepo и как работает кэширование?",
    difficulty: "middle",
    tags: ["turborepo", "caching", "build system"],
    answer: `Turborepo — умный build system для монорепозиториев. Знает граф зависимостей между пакетами и оптимизирует выполнение задач.

Кэширование работает так:
1. Вычисляется хэш: исходные файлы + зависимости + переменные окружения
2. Если такой хэш уже есть в кэше — задача пропускается, результат берётся из кэша
3. Если нет — задача выполняется, результат сохраняется в кэш

Local cache — папка .turbo на диске.
Remote cache — Vercel или self-hosted: кэш шарится между CI и всей командой.

Результат: второй build одного и того же кода занимает < 1 секунды.`,
    code: `# turbo.json — конфигурация кэширования
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],   // сначала зависимости
      "inputs": ["src/**", ".env"],  // что хэшировать
      "outputs": [".next/**", "dist/**"]  // что кэшировать
    }
  }
}

# Remote cache подключается одной командой:
npx turbo login
npx turbo link

# Теперь CI и все разработчики шарят кэш
$ turbo run build
# cache hit ✓  @fintech/ui  (не меняли — берём из кэша)
# cache miss ✗  @fintech/web (изменили — пересобираем)`,
  },
  {
    id: "m3",
    question: "Как работает граф зависимостей и порядок сборки?",
    difficulty: "middle",
    tags: ["task graph", "dependencies", "build order"],
    answer: `Turborepo строит DAG (directed acyclic graph) на основе зависимостей между пакетами в package.json. Задачи выполняются в топологическом порядке.

dependsOn: ["^build"] — символ ^ означает "build зависимостей должен завершиться до моего build".
dependsOn: ["lint"] — без ^ означает "lint того же пакета".

Параллельность: задачи, не зависящие друг от друга, выполняются параллельно — Turborepo автоматически использует все ядра.`,
    code: `# Граф нашего монорепо:
types ──────────────────┐
                        ▼
api ─────────────────► web    (параллельно)
                        ▲
ui ──────────────────► admin  (параллельно)

# Порядок сборки (автоматически):
# 1. types         (ни от чего не зависит)
# 2. api, ui       (параллельно, зависят от types)
# 3. web, admin    (параллельно, зависят от api+ui)

# Если менялся только packages/ui:
$ turbo run build --filter=...[HEAD^1]
# ✓ cached  types
# ✓ cached  api
# ✗ build   ui       (изменился)
# ✗ build   web      (зависит от ui)
# ✗ build   admin    (зависит от ui)`,
  },
  {
    id: "m4",
    question: "Что такое pnpm workspaces и workspace:* протокол?",
    difficulty: "middle",
    tags: ["pnpm", "workspaces", "workspace protocol"],
    answer: `pnpm workspaces — механизм, позволяющий пакетам в монорепозитории ссылаться друг на друга как на обычные npm-зависимости, без публикации в npm.

Конфигурируется в pnpm-workspace.yaml. После этого pnpm создаёт симлинки в node_modules.

workspace:* — специальный протокол вместо версии. Означает "используй локальную версию из workspace".
workspace:^1.0.0 — использует локальную, но при публикации подставляет ^1.0.0.

При pnpm install все workspace-пакеты линкуются между собой через symlinks.`,
    code: `# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

# packages/ui/package.json
{ "name": "@fintech/ui" }

# apps/web/package.json
{
  "dependencies": {
    "@fintech/ui": "workspace:*"    // локальная ссылка
  }
}

# После pnpm install:
apps/web/node_modules/@fintech/ui → ../../../../packages/ui  (symlink)

# Изменил packages/ui/Button.tsx — apps/web сразу видит изменение
# Не нужно публиковать или пересобирать`,
  },
  {
    id: "m5",
    question: "Фильтрация задач: --filter флаг в Turborepo",
    difficulty: "middle",
    tags: ["filter", "turborepo", "affected packages"],
    answer: `--filter позволяет запускать задачи только для выбранных пакетов и их зависимостей.

Синтаксис:
• --filter=@fintech/web — только web
• --filter=@fintech/web... — web и все его зависимости
• --filter=...@fintech/ui — все пакеты, зависящие от ui
• --filter=...[HEAD^1] — все пакеты, изменившиеся с предыдущего коммита
• --filter=...[origin/main] — все изменения относительно main

Это критически важно для CI: не нужно пересобирать всё при изменении одного пакета.`,
    code: `# Запустить только web с его зависимостями
pnpm turbo run build --filter=@fintech/web...

# Запустить всё что изменилось в PR (относительно main)
pnpm turbo run build --filter=...[origin/main]

# Запустить только приложения (не packages)
pnpm turbo run dev --filter="./apps/*"

# Комбинация: изменившиеся + их потребители
pnpm turbo run test --filter=...[HEAD^1]...

# В CI:
- run: pnpm turbo run build --filter=...[origin/main]
  # Пересобирает только то, что реально поменялось в PR`,
  },
  {
    id: "m6",
    question: "Turborepo vs Nx vs Lerna — в чём разница?",
    difficulty: "middle",
    tags: ["turborepo", "nx", "lerna", "comparison"],
    answer: `Turborepo:
• Простая конфигурация (один turbo.json)
• Фокус на скорости (кэш + параллельность)
• Не диктует структуру проекта
• От Vercel, отличная интеграция с Next.js
• Лучший выбор для большинства проектов

Nx:
• Больше функций: code generation, affected detection, module boundaries
• Строгий контроль зависимостей между пакетами (lint rules)
• Сложнее настроить, больше магии
• Лучше для крупных enterprise-команд с чёткой архитектурой

Lerna:
• Исторически первый (2015)
• Сегодня делегирует кэш Nx или Turborepo
• Сильная сторона — публикация пакетов (versioning, changelogs)
• Используй Lerna только если нужна публикация в npm`,
    code: `# Turborepo — минимальная конфигурация
# turbo.json — один файл, понятный синтаксис

# Nx — больше файлов
# nx.json, project.json для каждого пакета
# + generators, executors, plugins

# Lerna — для публикации пакетов
npx lerna version   # bump versions
npx lerna publish   # publish to npm

# Вывод: для большинства команд Turborepo — оптимальный выбор
# Nx если нужны module boundaries и code generation
# Lerna если публикуете open-source библиотеки`,
  },
  {
    id: "m7",
    question: "Как организовать shared конфиги (TypeScript, ESLint)?",
    difficulty: "middle",
    tags: ["shared config", "tsconfig", "eslint", "config package"],
    answer: `Создаётся отдельный пакет packages/config, который экспортирует базовые конфиги. Все приложения и пакеты наследуют от него.

Преимущества:
• Единое место для правил — меняешь в одном месте, применяется везде
• Версионирование конфигов вместе с кодом
• Специализированные конфиги под разные контексты (nextjs, react-library, node)

TypeScript: extends в tsconfig.json
ESLint (flat config): import и spread в eslint.config.js`,
    code: `# packages/config/tsconfig.base.json — базовый
{
  "compilerOptions": { "strict": true, "target": "ES2020" }
}

# packages/config/tsconfig.nextjs.json — для Next.js
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": { "jsx": "preserve", "lib": ["dom"] }
}

# apps/web/tsconfig.json — минимальный
{
  "extends": "@fintech/config/tsconfig/nextjs",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}

# packages/config/eslint.base.js
export default [js.configs.recommended, tsPlugin, prettier];

# apps/web/eslint.config.js
import nextConfig from "@fintech/config/eslint/nextjs";
export default nextConfig;`,
  },
  {
    id: "m8",
    question: "Как настроить CI/CD для монорепозитория?",
    difficulty: "senior",
    tags: ["CI/CD", "github actions", "affected packages"],
    answer: `Ключевые принципы CI/CD в монорепо:

1. Affected-only builds — пересобирать только то, что изменилось (--filter)
2. Remote cache — CI использует тот же кэш что и разработчики
3. Параллельный деплой — web и admin деплоятся независимо
4. Один CI job для проверок (type-check, lint, build) — быстро, кэш Turborepo

Инструменты: GitHub Actions / GitLab CI + Turborepo remote cache (Vercel или self-hosted).`,
    code: `# .github/workflows/ci.yml
jobs:
  ci:
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 2 }  # нужно для --filter=[HEAD^1]
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check      # turbo — только изменившиеся
      - run: pnpm build           # turbo — только изменившиеся

# deploy-web.yml — деплоит только web при merge в main
- run: pnpm turbo run build --filter=@fintech/web...
- run: vercel deploy apps/web --prod

# Важно: --frozen-lockfile в CI
# Если pnpm-lock.yaml расходится с package.json — install падает
# Защищает от "у меня работает, в CI нет"`,
  },
  {
    id: "m9",
    question: "Версионирование пакетов в монорепо",
    difficulty: "senior",
    tags: ["versioning", "changesets", "publishing"],
    answer: `Два сценария:

1. Внутренние пакеты (private: true) — версия не важна, workspace:* всегда указывает на актуальную. Не нужен сложный versioning.

2. Публичные пакеты (npm) — нужен инструмент для bumping версий и changelogs.

Лучший инструмент для публичных пакетов — Changesets (@changesets/cli):
• Разработчик добавляет changeset-файл к PR (описывает что изменилось)
• При мерже Changesets автоматически бампает версии и генерирует CHANGELOG
• Публикует в npm через CI

Lerna также поддерживает versioning: fixed mode (все пакеты одна версия) и independent mode (у каждого своя).`,
    code: `# Установка Changesets
pnpm add -Dw @changesets/cli
pnpm changeset init

# Разработчик добавляет changeset:
pnpm changeset
# Выбираешь пакеты, тип bump (major/minor/patch), описание

# Создаётся файл .changeset/random-name.md:
---
"@fintech/ui": minor
---
Add Avatar component

# При мерже в main — CI бампает версии:
pnpm changeset version   # обновляет package.json + CHANGELOG
pnpm changeset publish   # публикует в npm`,
  },
  {
    id: "m10",
    question: "Что такое package boundaries и почему они важны?",
    difficulty: "senior",
    tags: ["package boundaries", "architecture", "nx", "eslint"],
    answer: `Package boundaries — правила о том, какой пакет может импортировать какой. Нужны чтобы не допустить циклических зависимостей и архитектурного хаоса.

Типичные правила:
• apps/* могут импортировать из packages/* — ОК
• packages/ui НЕ может импортировать из apps/* — нарушение!
• packages/api НЕ может импортировать из packages/ui — разделение ответственности
• Нет циклических зависимостей (A→B→A)

Инструменты для контроля:
• Nx — eslint-plugin-nx/enforce-module-boundaries
• Кастомный eslint-plugin с правилами no-restricted-imports
• Простая конвенция + code review`,
    code: `# Правильный граф зависимостей (ациклический):
config  ──────────────────────────────────────┐
types   ──────────────────────────────────┐   │
api     (depends: types, config) ─────┐  │   │
ui      (depends: types, config) ─────┤  │   │
                                       ▼  ▼   ▼
                                      web, admin

# НЕЛЬЗЯ:
packages/ui → apps/web        # пакет зависит от приложения!
packages/api → packages/ui    # нарушение разделения ответственности
packages/ui → packages/api    # UI не должен знать о HTTP

# Nx module boundaries в eslint:
"@nx/enforce-module-boundaries": ["error", {
  "depConstraints": [
    { "sourceTag": "scope:app", "onlyDependOnLibsWithTags": ["scope:lib"] }
  ]
}]`,
  },
  {
    id: "m11",
    question: "Как избежать дублирования зависимостей в монорепо?",
    difficulty: "middle",
    tags: ["dependencies", "hoisting", "deduplication", "pnpm"],
    answer: `pnpm решает проблему дублирования через:

1. Content-addressable store — каждый пакет хранится один раз на диске, независимо от количества проектов где используется.

2. Hoisting — общие зависимости поднимаются в корневой node_modules. Каждый пакет видит только свои явные зависимости.

3. Phantom dependencies prevention — pnpm по умолчанию запрещает импортировать пакеты, не указанные в зависимостях (strict mode). Это предотвращает случайный импорт поднятых пакетов.

Devtools общие для всего монорепо ставятся в корневой package.json с флагом -w (workspace).`,
    code: `# Установка общей dev-зависимости (turbo, typescript)
pnpm add -Dw turbo typescript

# Установка зависимости в конкретный пакет
pnpm add react --filter @fintech/web

# pnpm store — один физический файл для всех версий
~/.pnpm-store/
  react@19.0.0/   ← один раз, используется везде через hardlinks

# Структура node_modules в pnpm (strict)
node_modules/
  .pnpm/          ← все зависимости с их транзитивными зависимостями
  react → .pnpm/react@19.0.0/node_modules/react  (symlink)
  @fintech/ui → ../../packages/ui  (workspace symlink)`,
  },
  {
    id: "m12",
    question: "Как организовать типы в монорепо?",
    difficulty: "middle",
    tags: ["types", "shared types", "package", "typescript"],
    answer: `Общие типы — в отдельный пакет packages/types. Он должен:
• Содержать только интерфейсы/типы (нет рантайм-кода)
• Быть независимым (не импортировать из других packages/*)
• Экспортировать именованно (не default export)

Типы специфичные для одного пакета — остаются внутри него.
Типы специфичные для одного приложения — внутри него.

Путь к типам через tsconfig paths: packages/ui/tsconfig.json указывает путь к packages/types/src напрямую (не через node_modules) для быстрого resolve без сборки.`,
    code: `# packages/types/src/index.ts — только re-exports
export type { User, UserRole } from './user';
export type { Transaction } from './transaction';
export type { ApiResponse, PaginatedResponse } from './api';

# packages/ui/tsconfig.json — прямой путь к types
{
  "compilerOptions": {
    "paths": {
      "@fintech/types": ["../types/src/index.ts"]
    }
  }
}

# Использование
import type { User } from '@fintech/types';
// TS разрешает напрямую из src, не из node_modules
// Нет необходимости компилировать types перед использованием`,
  },
  {
    id: "m13",
    question: "Минусы монорепозитория",
    difficulty: "junior",
    tags: ["tradeoffs", "cons", "monorepo"],
    answer: `Реальные минусы которые нужно учитывать:

1. Размер и скорость git — git clone, git status, git log замедляются с ростом. Решение: git sparse-checkout, shallow clone в CI.

2. Умная сборка обязательна — без Turborepo/Nx каждый push пересобирает всё. Нужны инвестиции в настройку.

3. Права доступа сложнее — нельзя дать доступ к отдельному приложению, только ко всему репо. CODEOWNERS частично решает.

4. Дисциплина команды — без контроля границ пакеты начинают импортировать что попало, граф зависимостей превращается в хаос.

5. Первоначальная настройка — значительно сложнее чем просто создать Next.js проект.`,
    code: `# Проблема с git blame в большом монорепо
git log --all  # медленно если история огромная

# Решение для CI — shallow clone
- uses: actions/checkout@v4
  with:
    fetch-depth: 2  # только последние 2 коммита (для --filter)

# Проблема: кто-то импортирует из чужого пакета без явной зависимости
# packages/ui/Button.tsx
import { apiClient } from '@fintech/api'  // НАРУШЕНИЕ! ui не должен знать про API

# Решение: eslint + no-restricted-imports или Nx module boundaries
# + code review culture`,
  },
  {
    id: "m14",
    question: "Как работает transpilePackages в Next.js с монорепо?",
    difficulty: "middle",
    tags: ["next.js", "transpilePackages", "build", "typescript"],
    answer: `По умолчанию Next.js не транспилирует node_modules — только свой src. Но workspace-пакеты (@fintech/ui) находятся в node_modules как симлинки и содержат TypeScript/.tsx.

transpilePackages: ['@fintech/ui'] говорит Next.js: "включи эти пакеты в процесс webpack/swc компиляции".

Без этого: ошибка "cannot parse JSX" или "unknown import" при импорте workspace-пакетов с TypeScript.
С этим: Next.js компилирует пакет как часть своего бандла — работает server components, tree shaking, CSS.

Альтернатива — pre-compiled пакеты (пакет компилирует сам себя через tsc/tsup, экспортирует .js + .d.ts). Но в монорепо transpilePackages проще.`,
    code: `// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: [
    '@fintech/ui',
    '@fintech/api',
    '@fintech/types',
  ],
};

// Без этого — ошибка при импорте tsx файлов из workspace:
// Module parse failed: Unexpected token (JSX)

// С этим — Next.js обрабатывает как свой код:
import { Button } from '@fintech/ui';         // OK — tsx
import { getUser } from '@fintech/api';        // OK — ts
import type { User } from '@fintech/types';    // OK — types only`,
  },
  {
    id: "m15",
    question: "Monorepo vs Polyrepo — когда выбирать что?",
    difficulty: "middle",
    tags: ["monorepo", "polyrepo", "architecture decision"],
    answer: `Monorepo выбирай когда:
• Команды работают над связанными проектами (один продукт)
• Много общего кода (UI-кит, API-клиент, типы)
• Хочешь атомарных изменений (API + потребители в одном PR)
• Команда < 50-100 человек (дальше нужны продвинутые инструменты)

Polyrepo выбирай когда:
• Независимые продукты с разными командами и релизными циклами
• Разные технологические стеки (Python + Go + TypeScript)
• Нужна изоляция прав доступа на уровне репозитория
• Команды работают полностью независимо

На практике: большинство стартапов и продуктовых компаний выигрывают от монорепо. Polyrepo имеет смысл для платформ с независимыми сервисами (microservices с разными командами).`,
    code: `# Monorepo — одна команда, один продукт
monorepo/
  apps/web          # команда A
  apps/admin        # команда A
  packages/ui       # shared
  packages/api      # shared

# Polyrepo — независимые продукты/команды
github.com/company/product-web      # команда A
github.com/company/product-mobile   # команда B (React Native)
github.com/company/data-service     # команда C (Python)
github.com/company/ui-kit           # shared, публикуется в npm

# Риск polyrepo: ui-kit v2 вышел, но product-web застрял на v1
# Риск monorepo: один человек сломал сборку — все встали`,
  },
];
