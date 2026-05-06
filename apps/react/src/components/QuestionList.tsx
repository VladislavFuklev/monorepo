"use client";

import { useState, useMemo } from "react";
import type { Question, Difficulty } from "@fintech/interview-data";
import { useProgress } from "@fintech/hooks";
import { useDebounce } from "@fintech/hooks";

interface QuestionListProps {
  questions: Question[];
  accent: string;
  topic: string;
}

const difficultyLabel: Record<Difficulty, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

const difficultyStyle: Record<Difficulty, string> = {
  junior: "bg-emerald-100 text-emerald-700",
  middle: "bg-amber-100 text-amber-700",
  senior: "bg-rose-100 text-rose-700",
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
      {/* Progress bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-900">
              Прогресс: {count} / {questions.length}
            </span>
            {count === questions.length && questions.length > 0 && (
              <span className="ml-2 text-sm text-emerald-600 font-medium">🎉 Все изучены!</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold" style={{ color: accent }}>{percentage}%</span>
            {count > 0 && (
              <button
                onClick={reset}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
              >
                сбросить
              </button>
            )}
          </div>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: accent }}
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
          className="h-10 flex-1 min-w-56 rounded-lg border border-gray-200 bg-white px-4 text-sm shadow-sm outline-none focus:border-transparent focus:ring-2"
          style={{ "--tw-ring-color": accent } as React.CSSProperties}
        />
        <div className="flex gap-2">
          {(["all", "junior", "middle", "senior"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={[
                "h-10 rounded-lg px-4 text-sm font-medium transition-all",
                difficulty === d
                  ? "text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
              ].join(" ")}
              style={difficulty === d ? { backgroundColor: accent } : {}}
            >
              {d === "all" ? "Все" : difficultyLabel[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <p className="text-sm text-gray-500">
        {filtered.length} из {questions.length} вопросов
      </p>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q, idx) => {
          const done = isCompleted(q.id);
          const isOpen = openId === q.id;

          return (
            <div
              key={q.id}
              className={[
                "rounded-xl border bg-white shadow-sm overflow-hidden transition-all duration-200",
                done ? "border-emerald-200" : "border-gray-200",
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
                      ? "bg-emerald-500 text-white scale-110"
                      : "text-white",
                  ].join(" ")}
                  style={done ? {} : { backgroundColor: accent }}
                >
                  {done ? "✓" : idx + 1}
                </button>

                {/* Question text */}
                <button
                  onClick={() => setOpenId(isOpen ? null : q.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className={["font-semibold leading-snug", done ? "text-gray-400 line-through" : "text-gray-900"].join(" ")}>
                    {q.question}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyStyle[q.difficulty]}`}>
                      {difficultyLabel[q.difficulty]}
                    </span>
                    {q.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Chevron */}
                <button onClick={() => setOpenId(isOpen ? null : q.id)}>
                  <svg
                    className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 pb-5 pt-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {q.answer}
                  </p>
                  {q.code && (
                    <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                      <code>{q.code}</code>
                    </pre>
                  )}
                  <button
                    onClick={() => toggle(q.id)}
                    className={[
                      "mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      done
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "text-white hover:opacity-90",
                    ].join(" ")}
                    style={done ? {} : { backgroundColor: accent }}
                  >
                    {done ? "✓ Изучено — снять отметку" : "Отметить как изучено"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
            Ничего не найдено. Попробуй другой запрос.
          </div>
        )}
      </div>
    </div>
  );
}
