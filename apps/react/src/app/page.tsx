import Link from "next/link";
import { reactQuestions } from "@fintech/interview-data";
import { QuestionList } from "@/components/QuestionList";

const ACCENT = "#0ea5e9";

const stats = {
  total: reactQuestions.length,
  junior: reactQuestions.filter((q) => q.difficulty === "junior").length,
  middle: reactQuestions.filter((q) => q.difficulty === "middle").length,
  senior: reactQuestions.filter((q) => q.difficulty === "senior").length,
};

export default function ReactPage() {
  return (
    <div>
      <header className="relative overflow-hidden bg-[#050508] px-6 py-20 text-white">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full blur-[130px]"
          style={{ background: `radial-gradient(circle, ${ACCENT}25, transparent 70%)` }}
        />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Nav pills */}
          <div className="mb-6 flex items-center gap-2">
            <a
              href={process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3003"}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
            >
              ← Hub
            </a>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-colors"
              style={{ backgroundColor: `${ACCENT}40` }}
            >
              ⚡ Quiz
            </Link>
            <Link
              href="/patterns"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
            >
              🧩 Паттерны
            </Link>
          </div>

          {/* Title */}
          <div className="mb-3 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: `${ACCENT}18`,
                border: `1px solid ${ACCENT}35`,
              }}
            >
              ⚛
            </div>
            <h1 className="text-5xl font-black tracking-tight">React</h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-white/50">
            Вопросы и ответы для подготовки к собеседованию. От Virtual DOM до батчинга в React 18.
          </p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Всего вопросов", value: stats.total },
              { label: "Junior", value: stats.junior, color: "text-emerald-400" },
              { label: "Middle", value: stats.middle, color: "text-amber-400" },
              { label: "Senior", value: stats.senior, color: "text-rose-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
                <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>

          {/* Cross-app links */}
          <div className="mt-5 flex gap-4 text-sm text-white/30">
            <a href={process.env.NEXT_PUBLIC_TYPESCRIPT_URL ?? "http://localhost:3001"} className="transition-colors hover:text-white/60">TypeScript →</a>
            <a href={process.env.NEXT_PUBLIC_MONOREPO_URL ?? "http://localhost:3002"} className="transition-colors hover:text-white/60">Monorepo →</a>
            <a href={process.env.NEXT_PUBLIC_NEXTJS_URL ?? "http://localhost:3005"} className="transition-colors hover:text-white/60">Next.js →</a>
            <a href={process.env.NEXT_PUBLIC_JAVASCRIPT_URL ?? "http://localhost:3006"} className="transition-colors hover:text-white/60">JavaScript →</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <QuestionList questions={reactQuestions} accent={ACCENT} topic="react" />
      </main>
    </div>
  );
}
