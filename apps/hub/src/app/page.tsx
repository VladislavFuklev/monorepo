import { reactQuestions, typescriptQuestions, monorepoQuestions, nextjsQuestions } from "@fintech/interview-data";
import { TopicCard } from "@/components/TopicCard";

const total = reactQuestions.length + typescriptQuestions.length + monorepoQuestions.length + nextjsQuestions.length;

const topics = [
  {
    title: "React",
    description: "Virtual DOM, хуки, паттерны, производительность — всё для собеса.",
    url: process.env.NEXT_PUBLIC_REACT_URL ?? "http://localhost:3000",
    accentColor: "#0ea5e9",
    icon: "⚛",
    tag: "Frontend",
    questions: reactQuestions,
  },
  {
    title: "Next.js",
    description: "App Router, Server Components, Server Actions, кеширование и Streaming.",
    url: process.env.NEXT_PUBLIC_NEXTJS_URL ?? "http://localhost:3005",
    accentColor: "#6366f1",
    icon: "▲",
    tag: "Framework",
    questions: nextjsQuestions,
  },
  {
    title: "TypeScript",
    description: "Дженерики, utility types, mapped types и conditional types.",
    url: process.env.NEXT_PUBLIC_TYPESCRIPT_URL ?? "http://localhost:3001",
    accentColor: "#8b5cf6",
    icon: "𝗧𝗦",
    tag: "Language",
    questions: typescriptQuestions,
  },
  {
    title: "Monorepo",
    description: "Turborepo, pnpm workspaces, task graph и архитектурные решения.",
    url: process.env.NEXT_PUBLIC_MONOREPO_URL ?? "http://localhost:3002",
    accentColor: "#10b981",
    icon: "📦",
    tag: "Architecture",
    questions: monorepoQuestions,
  },
];

const techStack = [
  { label: "Turborepo", desc: "Task orchestration + caching" },
  { label: "pnpm workspaces", desc: "Dependency management" },
  { label: "Next.js 15", desc: "React framework (×4 apps)" },
  { label: "TypeScript", desc: "Strict mode across all packages" },
  { label: "Tailwind CSS v4", desc: "Utility-first styling" },
  { label: "packages/ui", desc: "Shared component library" },
  { label: "packages/hooks", desc: "Shared React hooks" },
  { label: "packages/config", desc: "Shared tsconfig + ESLint" },
];

export default function HubPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background ambient orbs */}
      <div className="pointer-events-none absolute -top-64 left-[-15%] h-[700px] w-[700px] rounded-full bg-sky-600/10 blur-[160px]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[20%] left-[35%] h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-[160px]" />

      {/* Hero */}
      <section className="relative px-6 pb-20 pt-28">
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Status badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/50 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            4 приложения · 1 монорепо · production ready
          </div>

          {/* Big title */}
          <h1 className="text-7xl font-black tracking-tight text-white leading-none md:text-8xl">
            Interview{" "}
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Hub
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/40">
            React, Next.js, TypeScript, Monorepo — полная подготовка к собеседованию
            в одном месте, с прогрессом.
          </p>

          {/* Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-10">
            {[
              { value: total, label: "вопросов" },
              { value: 4, label: "темы" },
              { value: 4, label: "приложения" },
              { value: 5, label: "пакетов" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-5xl font-black text-white">{value}</p>
                <p className="mt-1.5 text-sm text-white/30">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((t) => {
              const q = t.questions as typeof reactQuestions;
              return (
                <TopicCard
                  key={t.title}
                  title={t.title}
                  description={t.description}
                  url={t.url}
                  accentColor={t.accentColor}
                  icon={t.icon}
                  tag={t.tag}
                  total={q.length}
                  junior={q.filter((x) => x.difficulty === "junior").length}
                  middle={q.filter((x) => x.difficulty === "middle").length}
                  senior={q.filter((x) => x.difficulty === "senior").length}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/20">
            Стек монорепо
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-xl border border-white/6 bg-white/[0.03] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
              >
                <p className="text-sm font-semibold text-white/80">{label}</p>
                <p className="mt-0.5 text-xs text-white/30">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/20">
        Built with Turborepo · pnpm workspaces · Next.js 15 · TypeScript strict
      </footer>
    </div>
  );
}
