import { monorepoQuestions } from "@fintech/interview-data";
import { QuestionList } from "@/components/QuestionList";

const ACCENT = "#10b981";

const stats = {
  total: monorepoQuestions.length,
  junior: monorepoQuestions.filter((q) => q.difficulty === "junior").length,
  middle: monorepoQuestions.filter((q) => q.difficulty === "middle").length,
  senior: monorepoQuestions.filter((q) => q.difficulty === "senior").length,
};

export default function MonorepoPage() {
  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 px-6 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Interview Prep
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            Monorepo
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Turborepo, pnpm workspaces, task graph, CI/CD и архитектурные решения для монорепозиториев.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { label: "Всего вопросов", value: stats.total },
              { label: "Junior", value: stats.junior, color: "text-emerald-200" },
              { label: "Middle", value: stats.middle, color: "text-amber-300" },
              { label: "Senior", value: stats.senior, color: "text-rose-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-white/15 px-5 py-3 backdrop-blur-sm">
                <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</p>
                <p className="text-xs text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation hint */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-6 text-sm text-gray-500">
          <a href="http://localhost:3000" className="hover:text-emerald-600 transition-colors">← React</a>
          <a href="http://localhost:3001" className="hover:text-emerald-600 transition-colors">← TypeScript</a>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <QuestionList questions={monorepoQuestions} accent={ACCENT} />
      </main>
    </div>
  );
}
