import { typescriptQuestions } from "@fintech/interview-data";
import { QuestionList } from "@/components/QuestionList";

const ACCENT = "#8b5cf6";

const stats = {
  total: typescriptQuestions.length,
  junior: typescriptQuestions.filter((q) => q.difficulty === "junior").length,
  middle: typescriptQuestions.filter((q) => q.difficulty === "middle").length,
  senior: typescriptQuestions.filter((q) => q.difficulty === "senior").length,
};

export default function TypeScriptPage() {
  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 px-6 py-20 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px), radial-gradient(circle at 30% 70%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Interview Prep
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            TypeScript
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            От базовых типов до infer, mapped types и satisfies. Всё что спрашивают на собеседованиях.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { label: "Всего вопросов", value: stats.total },
              { label: "Junior", value: stats.junior, color: "text-emerald-300" },
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
          <a href="http://localhost:3000" className="hover:text-purple-600 transition-colors">← React</a>
          <a href="http://localhost:3002" className="hover:text-purple-600 transition-colors">Monorepo →</a>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <QuestionList questions={typescriptQuestions} accent={ACCENT} />
      </main>
    </div>
  );
}
