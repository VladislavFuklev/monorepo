"use client";

import { useState, useMemo } from "react";
import type { Question, Difficulty } from "@fintech/interview-data";
import { useProgress, useDebounce } from "@fintech/hooks";

interface QuestionListProps {
  questions: Question[];
  accent: string;
  topic: string;
}

const diffLabel: Record<Difficulty, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

const diffColor: Record<Difficulty, { pill: string }> = {
  junior: { pill: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
  middle: { pill: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  senior: { pill: "bg-rose-500/15 text-rose-400 border border-rose-500/30" },
};

export function QuestionList({ questions, accent, topic }: QuestionListProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 200);
  const { isCompleted, toggle, count, percentage, reset } = useProgress(topic, questions.length);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesDiff = difficulty === "all" || q.difficulty === difficulty;
      const s = debouncedSearch.toLowerCase();
      const matchesSearch =
        !s || q.question.toLowerCase().includes(s) || q.tags.some((t) => t.includes(s));
      return matchesDiff && matchesSearch;
    });
  }, [questions, debouncedSearch, difficulty]);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/80">
              {count} / {questions.length} изучено
            </span>
            {count === questions.length && questions.length > 0 && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                🎉 Все!
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: accent }}>
              {percentage}%
            </span>
            {count > 0 && (
              <button
                onClick={reset}
                className="text-xs text-white/25 underline underline-offset-2 transition-colors hover:text-white/50"
              >
                сбросить
              </button>
            )}
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: accent,
              boxShadow: `0 0 10px ${accent}88`,
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Поиск по вопросам и тегам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 min-w-56 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 placeholder:text-white/25 outline-none transition-colors focus:border-white/25 focus:bg-white/8"
        />
        <div className="flex gap-2">
          {(["all", "junior", "middle", "senior"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                "h-10 rounded-xl px-4 text-sm font-medium transition-all",
                difficulty === d
                  ? "text-white"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/8 hover:text-white/70",
              ].join(" ")}
              style={
                difficulty === d
                  ? { backgroundColor: accent, boxShadow: `0 0 16px ${accent}55` }
                  : {}
              }
            >
              {d === "all" ? "Все" : diffLabel[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <p className="text-sm text-white/30">
        {filtered.length} из {questions.length} вопросов
      </p>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.map((q, idx) => {
          const done = isCompleted(q.id);
          const isOpen = openId === q.id;
          const dc = diffColor[q.difficulty];

          return (
            <div
              key={q.id}
              className={[
                "overflow-hidden rounded-xl border transition-all duration-200",
                isOpen
                  ? "border-white/15 bg-white/[0.06]"
                  : done
                  ? "border-emerald-500/20 bg-white/[0.03] hover:bg-white/[0.05]"
                  : "border-white/7 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.05]",
              ].join(" ")}
            >
              <div className="flex w-full items-start gap-4 p-5">
                {/* Number / done indicator */}
                <button
                  onClick={() => toggle(q.id)}
                  title={done ? "Снять отметку" : "Отметить как изучено"}
                  className={[
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
                    done
                      ? "scale-110 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "text-white",
                  ].join(" ")}
                  style={done ? {} : { backgroundColor: accent }}
                >
                  {done ? "✓" : idx + 1}
                </button>

                {/* Question text */}
                <button
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p
                    className={[
                      "font-semibold leading-snug",
                      done ? "text-white/30 line-through" : "text-white/90",
                    ].join(" ")}
                  >
                    {q.question}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${dc.pill}`}>
                      {diffLabel[q.difficulty]}
                    </span>
                    {q.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-xs text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Chevron */}
                <button
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="mt-1 shrink-0"
                >
                  <svg
                    className={`h-4 w-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-white/6 px-5 pb-5 pt-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-white/65">
                    {q.answer}
                  </p>
                  {q.code && (
                    <pre className="mt-4 overflow-x-auto rounded-xl border border-white/8 bg-black/50 p-5 text-xs leading-relaxed text-white/80">
                      <code>{q.code}</code>
                    </pre>
                  )}
                  <button
                    onClick={() => toggle(q.id)}
                    className={[
                      "mt-4 rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                      done
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "text-white hover:opacity-90",
                    ].join(" ")}
                    style={done ? {} : { backgroundColor: accent, boxShadow: `0 0 12px ${accent}44` }}
                  >
                    {done ? "✓ Изучено — снять отметку" : "Отметить как изучено"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/6 bg-white/[0.03] py-16 text-center text-white/25">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
