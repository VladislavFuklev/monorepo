"use client";

import { useState } from "react";
import Link from "next/link";

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
      <header className="relative overflow-hidden bg-[#050508] px-6 py-20 text-white">
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, #10b98122, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
            >
              ← Вопросы
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
            >
              ⚡ Quiz
            </Link>
          </div>
          <div className="mb-3 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: "#10b98118", border: "1px solid #10b98135" }}
            >
              🗂️
            </div>
            <h1 className="text-5xl font-black tracking-tight">Workspace</h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-white/50">
            Граф зависимостей этого монорепо, сравнение инструментов и ключевые концепции Turborepo.
          </p>
          <div className="mt-6 flex gap-2">
            {(["graph", "compare", "concepts"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                  tab === t
                    ? "bg-white text-slate-900 shadow"
                    : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70",
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
            <p className="mb-6 text-sm text-white/35">
              Кликни на пакет, чтобы увидеть его зависимости и кто от него зависит.
            </p>
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Приложения</p>
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
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/30">Пакеты</p>
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
              <div className="sticky top-4 self-start rounded-2xl border border-white/8 bg-white/[0.04] p-5">
                {selected ? (
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
                      <code className="font-bold text-white/90">{selected.label}</code>
                      <span className={`ml-auto rounded-full border px-2 py-0.5 text-xs font-medium ${
                        selected.type === "app"
                          ? "border-sky-500/25 bg-sky-500/15 text-sky-400"
                          : "border-amber-500/25 bg-amber-500/15 text-amber-400"
                      }`}>
                        {selected.type}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-white/50">{selected.description}</p>

                    {selected.deps.length > 0 && (
                      <div className="mb-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/30">Зависит от</p>
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
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-white/30">Используется в</p>
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
                      <p className="text-xs text-white/25">Нет зависимостей</p>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-3xl">👆</p>
                    <p className="mt-2 text-sm text-white/35">Выбери пакет чтобы увидеть детали</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Compare tab ── */}
        {tab === "compare" && (
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-colors hover:border-white/[0.14] hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{tool.logo}</span>
                  <div>
                    <h2 className="text-xl font-black text-white/90">{tool.name}</h2>
                    <p className="text-xs text-white/40">{tool.tagline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-400">Сильные стороны</p>
                  <ul className="space-y-1.5">
                    {tool.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-white/60">
                        <span className="mt-0.5 shrink-0 text-emerald-400">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-400">Слабые стороны</p>
                  <ul className="space-y-1.5">
                    {tool.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2 text-sm text-white/60">
                        <span className="mt-0.5 shrink-0 text-rose-400">✗</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/8 bg-white/5 p-3 text-xs text-white/50">
                  <span className="font-semibold text-white/70">Лучше всего для:</span> {tool.bestFor}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Concepts tab ── */}
        {tab === "concepts" && (
          <div className="space-y-2">
            {concepts.map((c) => {
              const isOpen = openConcept === c.id;
              return (
                <div
                  key={c.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-emerald-500/25 bg-white/[0.06]"
                      : "border-white/8 bg-white/[0.04] hover:border-white/[0.14] hover:bg-white/[0.06]"
                  }`}
                >
                  <button
                    onClick={() => setOpenConcept(isOpen ? null : c.id)}
                    className="flex w-full items-center gap-4 p-6 text-left"
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <div className="flex-1">
                      <p className="font-black text-white/90">{c.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-sm text-white/40">{c.description}</p>
                    </div>
                    <svg
                      className={`h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="space-y-4 border-t border-white/6 px-6 pb-6 pt-4">
                      <p className="text-sm leading-relaxed text-white/60">{c.description}</p>
                      <pre className="overflow-x-auto rounded-xl border border-white/8 bg-black/50 p-5 text-xs leading-relaxed text-white/80">
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
        "w-full rounded-xl border p-4 text-left transition-all duration-200",
        isSelected
          ? "border-2"
          : isHighlighted
          ? "border-2"
          : isDimmed
          ? "border-white/5 bg-white/[0.02] opacity-25"
          : "border-white/8 bg-white/[0.04] hover:border-white/[0.16] hover:bg-white/[0.07]",
      ].join(" ")}
      style={
        isSelected || isHighlighted
          ? { borderColor: node.color, boxShadow: `0 0 0 1px ${node.color}40, 0 0 16px ${node.color}20`, backgroundColor: `${node.color}10` }
          : {}
      }
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: node.color }} />
        <code className="text-sm font-bold text-white/80">{node.label}</code>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-white/40">{node.description}</p>
      {node.deps.length > 0 && (
        <p className="mt-2 text-xs text-white/25">
          deps: {node.deps.join(", ")}
        </p>
      )}
    </button>
  );
}
