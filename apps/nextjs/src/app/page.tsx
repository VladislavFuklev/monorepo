import Link from "next/link";
import { nextjsQuestions } from "@fintech/interview-data";
import { QuestionList } from "@/components/QuestionList";

const ACCENT = "#6366f1";

const stats = {
  total: nextjsQuestions.length,
  junior: nextjsQuestions.filter((q) => q.difficulty === "junior").length,
  middle: nextjsQuestions.filter((q) => q.difficulty === "middle").length,
  senior: nextjsQuestions.filter((q) => q.difficulty === "senior").length,
};

export default function NextJsPage() {
  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 px-6 py-20 text-white">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 40%, #6366f1 1px, transparent 1px), radial-gradient(circle at 75% 60%, #818cf8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Indigo glow */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          {/* Nav pills */}
          <div className="mb-4 flex items-center gap-2">
            <a
              href={process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3003"}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              ← Hub
            </a>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/40 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-indigo-500/60"
            >
              ⚡ Quiz
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-xl bg-white/10 px-3 py-1.5 text-2xl font-black tracking-tight">
              N
            </span>
            <h1 className="text-5xl font-black tracking-tight">Next.js</h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-white/70">
            App Router, Server Components, Server Actions, кеширование, Streaming и оптимизация
            производительности.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            {[
              { label: "Всего вопросов", value: stats.total },
              { label: "Junior", value: stats.junior, color: "text-emerald-300" },
              { label: "Middle", value: stats.middle, color: "text-amber-300" },
              { label: "Senior", value: stats.senior, color: "text-rose-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</p>
                <p className="text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>

          {/* Cross-app links */}
          <div className="mt-5 flex gap-4 text-sm text-white/50">
            <a href={process.env.NEXT_PUBLIC_REACT_URL ?? "http://localhost:3000"} className="transition-colors hover:text-white">React →</a>
            <a href={process.env.NEXT_PUBLIC_TYPESCRIPT_URL ?? "http://localhost:3001"} className="transition-colors hover:text-white">TypeScript →</a>
            <a href={process.env.NEXT_PUBLIC_MONOREPO_URL ?? "http://localhost:3002"} className="transition-colors hover:text-white">Monorepo →</a>
          </div>

          {/* Version badge */}
          <div className="mt-4 flex items-center gap-3 text-sm text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs">
              Next.js 15
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs">
              App Router
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs">
              React 19
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <QuestionList questions={nextjsQuestions} accent={ACCENT} topic="nextjs" />
      </main>
    </div>
  );
}
