"use client";

import { useState } from "react";

type Tab = "graph" | "compare" | "concepts";

// ── Dependency graph data ─────────────────────────────────────────────────────

interface Node {
  id: string;
  label: string;
  type: "app" | "package";
  color: string;
  deps: string[];
  description: string;
}

const nodes: Node[] = [
  {
    id: "hub",
    label: "app-hub",
    type: "app",
    color: "#6366f1",
    deps: ["interview-data", "ui"],
    description: "Landing page — навигация между приложениями",
  },
  {
    id: "react",
    label: "app-react",
    type: "app",
    color: "#0ea5e9",
    deps: ["interview-data", "ui", "hooks"],
    description: "Вопросы по React, quiz-режим, паттерны",
  },
  {
    id: "typescript",
    label: "app-typescript",
    type: "app",
    color: "#8b5cf6",
    deps: ["interview-data", "ui", "hooks"],
    description: "Вопросы по TypeScript, quiz-режим, шпаргалка",
  },
  {
    id: "monorepo",
    label: "app-monorepo",
    type: "app",
    color: "#10b981",
    deps: ["interview-data", "ui", "hooks"],
    description: "Вопросы по Monorepo, quiz-режим, workspace",
  },
  {
    id: "ui",
    label: "pkg/ui",
    type: "package",
    color: "#f59e0b",
    deps: ["interview-data", "hooks"],
    description: "Button, Card, Badge, Input, QuizMode — shared UI",
  },
  {
    id: "hooks",
    label: "pkg/hooks",
    type: "package",
    color: "#f97316",
    deps: [],
    description: "useProgress, useLocalStorage, useDebounce",
  },
  {
    id: "interview-data",
    label: "pkg/interview-data",
    type: "package",
    color: "#ec4899",
    deps: [],
    description: "Question type, react/ts/monorepo вопросы",
  },
  {
    id: "config",
    label: "pkg/config",
    type: "package",
    color: "#64748b",
    deps: [],
    description: "tsconfig base, ESLint config — shared tooling",
  },
  {
    id: "types",
    label: "pkg/types",
    type: "package",
    color: "#64748b",
    deps: [],
    description: "Shared TypeScript types (User, Transaction, API)",
  },
];

// ── Tool comparison data ──────────────────────────────────────────────────────

const tools = [
  {
    name: "Turborepo",
    logo: "⚡",
    accent: "#ef4444",
    tagline: "Task orchestration + remote caching",
    strengths: ["Incremental builds — кэшируются только изменившиеся таски", "Remote caching — шарим кэш между CI и девами", "Параллельный запуск зависимых задач", "Минимальный конфиг — одна turbo.json"],
    weaknesses: ["Только task runner, не package manager", "Нет code generation из коробки", "Слабее Nx по enterprise-фичам"],
    bestFor: "Новые проекты, стартапы, команды без сложной инфраструктуры",
  },
  {
    name: "Nx",
    logo: "🔷",
    accent: "#0ea5e9",
    tagline: "Monorepo framework с богатой экосистемой",
    strengths: ["Affected commands — тестируем только то, что изменилось", "Generators & executors — code generation", "Nx Cloud — distributed task execution", "Богатая экосистема плагинов (React, Next, NestJS...)"],
    weaknesses: ["Высокий порог входа и конфигурации", "Vendor lock-in в Nx Cloud", "Тяжелее для маленьких проектов"],
    bestFor: "Крупные enterprise-команды, много приложений, нужны generators",
  },
  {
    name: "pnpm workspaces",
    logo: "📦",
    accent: "#f59e0b",
    tagline: "Package manager + workspace протокол",
    strengths: ["workspace:* протокол — локальные зависимости", "Content-addressable storage — экономия диска", "Строгая изоляция — нет phantom dependencies", "Нативная поддержка workspaces без доп. инструментов"],
    weaknesses: ["Только управление пакетами, не task runner", "Нет встроенного кэширования билдов", "Нужен отдельный инструмент для orchestration"],
    bestFor: "Используется в паре с Turborepo или Nx как package manager",
  },
  {
    name: "Lerna",
    logo: "🐉",
    accent: "#8b5cf6",
    tagline: "Ветеран монорепо — первый mainstream инструмент",
    strengths: ["Независимая версионность пакетов", "Automated changelogs и npm publishing", "Большая история и документация"],
    weaknesses: ["Устарел — команда рекомендует Nx + Lerna", "Медленнее Turborepo без кэширования", "Избыточен если не нужен npm publishing"],
    bestFor: "Open-source проекты с независимой версионностью пакетов",
  },
];

// ── Turbo concepts ────────────────────────────────────────────────────────────

const concepts = [
  {
    id: "pipeline",
    title: "Task Graph",
    emoji: "🔗",
    description: "Turborepo строит DAG (directed acyclic graph) из зависимостей задач. dependsOn: ['^build'] означает 'запускай build только после build всех пакетов, от которых я завишу'.",
    code: `// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // ^ = зависимости сначала
      "outputs": [".next/**"]
    },
    "dev": {
      "cache": false,           // dev нельзя кэшировать
      "persistent": true        // долгоживущий процесс
    },
    "test": {
      "dependsOn": ["build"]    // без ^ = в том же пакете
    }
  }
}`,
  },
  {
    id: "cache",
    title: "Caching",
    emoji: "💾",
    description: "Turbo хэширует inputs (файлы + env vars) и сохраняет outputs. При повторном запуске с теми же inputs — мгновенный cache hit. Remote cache шарит результаты между CI-машинами и разработчиками.",
    code: `// Turbo вычисляет хэш из:
// 1. Исходных файлов (inputs)
// 2. Переменных окружения (globalEnv / env)
// 3. Версий зависимостей

// Если хэш совпал — восстанавливает outputs из кэша
// и печатает "cache hit, replaying logs"

// Remote cache — сохраняем в Vercel / S3 / custom
// TURBO_TEAM=myteam TURBO_TOKEN=xxx pnpm build

// Проверить что кэшируется:
// pnpm turbo run build --dry=json`,
  },
  {
    id: "filter",
    title: "Filtering",
    emoji: "🔍",
    description: "Запускай задачи только для нужных пакетов. Фильтры можно комбинировать: по имени, по изменениям в git, по зависимостям.",
    code: `# Только один пакет
pnpm turbo run dev --filter=@fintech/app-react

# Все пакеты, изменившиеся относительно main
pnpm turbo run test --filter=...[origin/main]

# Пакет + все его зависимости
pnpm turbo run build --filter=@fintech/app-hub...

# Все пакеты зависящие от ui
pnpm turbo run test --filter=...@fintech/ui

# Исключить пакет
pnpm turbo run build --filter=!@fintech/app-hub`,
  },
  {
    id: "workspace-protocol",
    title: "workspace:* Protocol",
    emoji: "🔗",
    description: "pnpm workspace protocol позволяет ссылаться на локальные пакеты как на обычные npm-зависимости. При публикации workspace:* заменяется на реальную версию.",
    code: `// packages/ui/package.json
{
  "name": "@fintech/ui",
  "dependencies": {
    "@fintech/hooks": "workspace:*"  // всегда актуальная версия
  }
}

// apps/react/package.json
{
  "dependencies": {
    "@fintech/ui":   "workspace:*",
    "@fintech/hooks": "workspace:*"
  }
}

// pnpm создаёт symlinks: node_modules/@fintech/ui → packages/ui
// Изменения в packages/ui видны сразу без пересборки`,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [tab, setTab] = useState<Tab>("graph");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [openConcept, setOpenConcept] = useState<string | null>(null);

  const selected = nodes.find((n) => n.id === selectedNode);
  const dependents = nodes.filter((n) => n.deps.includes(selectedNode ?? ""));

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 px-6 py-20 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ← Вопросы
            </a>
            <a
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ⚡ Quiz
            </a>
          </div>
          <h1 className="text-5xl font-black tracking-tight">Workspace</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            Граф зависимостей этого монорепо, сравнение инструментов и ключевые концепции Turborepo.
          </p>
          <div className="mt-6 flex gap-2">
            {(["graph", "compare", "concepts"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-all capitalize",
                  tab === t
                    ? "bg-white text-teal-700 shadow"
                    : "bg-white/20 text-white hover:bg-white/30",
                ].join(" ")}
              >
                {t === "graph" ? "Граф" : t === "compare" ? "Сравнение" : "Концепции"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* ── Graph tab ── */}
        {tab === "graph" && (
          <div>
            <p className="mb-6 text-sm text-gray-500">
              Кликни на пакет, чтобы увидеть его зависимости и кто от него зависит.
            </p>
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Nodes */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Приложения</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {nodes.filter((n) => n.type === "app").map((n) => (
                    <NodeCard
                      key={n.id}
                      node={n}
                      isSelected={selectedNode === n.id}
                      isHighlighted={!!selectedNode && (selected?.deps.includes(n.id) || dependents.some((d) => d.id === n.id))}
                      isDimmed={!!selectedNode && selectedNode !== n.id && !selected?.deps.includes(n.id) && !dependents.some((d) => d.id === n.id)}
                      onClick={() => setSelectedNode(selectedNode === n.id ? null : n.id)}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">Пакеты</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {nodes.filter((n) => n.type === "package").map((n) => (
                    <NodeCard
                      key={n.id}
                      node={n}
                      isSelected={selectedNode === n.id}
                      isHighlighted={!!selectedNode && (selected?.deps.includes(n.id) || dependents.some((d) => d.id === n.id))}
                      isDimmed={!!selectedNode && selectedNode !== n.id && !selected?.deps.includes(n.id) && !dependents.some((d) => d.id === n.id)}
                      onClick={() => setSelectedNode(selectedNode === n.id ? null : n.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Detail panel */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm self-start sticky top-4">
                {selected ? (
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: selected.color }}
                      />
                      <code className="font-bold text-gray-900">{selected.label}</code>
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${selected.type === "app" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                        {selected.type}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">{selected.description}</p>

                    {selected.deps.length > 0 && (
                      <div className="mb-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Зависит от</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selected.deps.map((d) => {
                            const dep = nodes.find((n) => n.id === d);
                            return dep ? (
                              <button
                                key={d}
                                onClick={() => setSelectedNode(d)}
                                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                                style={{ backgroundColor: dep.color }}
                              >
                                {dep.label}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {dependents.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Используется в</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dependents.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setSelectedNode(d.id)}
                              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
                              style={{ backgroundColor: d.color }}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selected.deps.length === 0 && dependents.length === 0 && (
                      <p className="text-xs text-gray-400">Нет зависимостей</p>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-3xl">👆</p>
                    <p className="mt-2 text-sm text-gray-400">Выбери пакет чтобы увидеть детали</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Compare tab ── */}
        {tab === "compare" && (
          <div className="grid gap-5 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{tool.logo}</span>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{tool.name}</h2>
                    <p className="text-xs text-gray-500">{tool.tagline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">Сильные стороны</p>
                  <ul className="space-y-1.5">
                    {tool.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-600">Слабые стороны</p>
                  <ul className="space-y-1.5">
                    {tool.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 shrink-0 text-rose-400">✗</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                  <span className="font-semibold">Лучше всего для:</span> {tool.bestFor}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Concepts tab ── */}
        {tab === "concepts" && (
          <div className="space-y-3">
            {concepts.map((c) => {
              const isOpen = openConcept === c.id;
              return (
                <div
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <button
                    onClick={() => setOpenConcept(isOpen ? null : c.id)}
                    className="flex w-full items-center gap-4 p-6 text-left"
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{c.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{c.description}</p>
                    </div>
                    <svg
                      className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 pb-6 pt-4 space-y-4">
                      <p className="text-sm leading-relaxed text-gray-700">{c.description}</p>
                      <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                        <code>{c.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function NodeCard({
  node,
  isSelected,
  isHighlighted,
  isDimmed,
  onClick,
}: {
  node: Node;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group w-full rounded-xl border p-4 text-left transition-all duration-200",
        isSelected
          ? "border-2 shadow-md"
          : isHighlighted
          ? "border-2 opacity-100"
          : isDimmed
          ? "border-gray-100 opacity-30"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
      ].join(" ")}
      style={
        isSelected || isHighlighted
          ? { borderColor: node.color, boxShadow: `0 0 0 3px ${node.color}20` }
          : {}
      }
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: node.color }} />
        <code className="text-sm font-bold text-gray-900">{node.label}</code>
      </div>
      <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{node.description}</p>
      {node.deps.length > 0 && (
        <p className="mt-2 text-xs text-gray-400">
          deps: {node.deps.join(", ")}
        </p>
      )}
    </button>
  );
}
