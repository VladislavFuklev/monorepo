import { reactQuestions, typescriptQuestions, monorepoQuestions } from "@fintech/interview-data";
import { TopicCard } from "@/components/TopicCard";

const total = reactQuestions.length + typescriptQuestions.length + monorepoQuestions.length;

const topics = [
  {
    title: "React",
    description: "Virtual DOM, хуки, паттерны, производительность и всё что спрашивают на собеседованиях.",
    url: process.env.NEXT_PUBLIC_REACT_URL ?? "http://localhost:3000",
    gradient: "bg-gradient-to-br from-sky-500 to-blue-600",
    icon: "⚛️",
    tag: "Frontend",
    questions: reactQuestions,
  },
  {
    title: "TypeScript",
    description: "Дженерики, utility types, mapped types, conditional types и строгая типизация.",
    url: process.env.NEXT_PUBLIC_TYPESCRIPT_URL ?? "http://localhost:3001",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    icon: "𝗧𝗦",
    tag: "Language",
    questions: typescriptQuestions,
  },
  {
    title: "Monorepo",
    description: "Turborepo, pnpm workspaces, task graph, caching и архитектурные решения.",
    url: process.env.NEXT_PUBLIC_MONOREPO_URL ?? "http://localhost:3002",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-24">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow */}
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Monorepo · 4 приложения · 1 репозиторий
          </div>

          <h1 className="text-6xl font-black tracking-tight text-white">
            Interview{" "}
            <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Prep
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg text-gray-400">
            Подготовься к собеседованию по React, TypeScript и Monorepo. Всё в одном месте, с прогрессом.
          </p>

          {/* Global stats */}
          <div className="mt-10 flex justify-center gap-8">
            {[
              { label: "Вопросов", value: total },
              { label: "Тем", value: 3 },
              { label: "Приложений", value: 4 },
              { label: "Пакетов", value: 5 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-black text-white">{value}</p>
                <p className="mt-1 text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-5 md:grid-cols-3">
            {topics.map((t) => {
              const q = t.questions as typeof reactQuestions;
              return (
                <TopicCard
                  key={t.title}
                  title={t.title}
                  description={t.description}
                  url={t.url}
                  gradient={t.gradient}
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
      <section className="border-t border-white/5 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-gray-600">
            Стек монорепо
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map(({ label, desc }) => (
              <div
                key={label}
                className="rounded-xl border border-white/5 bg-gray-900 p-4 hover:border-white/10 transition-colors"
              >
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-gray-600">
        Built with Turborepo · pnpm workspaces · Next.js 15 · TypeScript strict
      </footer>
    </div>
  );
}
