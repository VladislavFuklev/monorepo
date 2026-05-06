"use client";

import { useState, useMemo } from "react";
import type { Question, Difficulty } from "@fintech/interview-data";

interface QuestionListProps {
  questions: Question[];
  accent: string;
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

export function QuestionList({ questions, accent }: QuestionListProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesDiff = difficulty === "all" || q.difficulty === difficulty;
      const q2 = search.toLowerCase();
      const matchesSearch =
        !q2 ||
        q.question.toLowerCase().includes(q2) ||
        q.tags.some((t) => t.includes(q2));
      return matchesDiff && matchesSearch;
    });
  }, [questions, search, difficulty]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Поиск по вопросам и тегам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 flex-1 min-w-56 rounded-lg border border-gray-200 bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-current"
          style={{ color: "inherit" }}
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
        {filtered.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === q.id ? null : q.id)}
              className="flex w-full items-start gap-4 p-5 text-left"
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 leading-snug">{q.question}</p>
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
              </div>
              <svg
                className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${openId === q.id ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openId === q.id && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 pb-5 pt-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {q.answer}
                </p>
                {q.code && (
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                    <code>{q.code}</code>
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
            Ничего не найдено. Попробуй другой запрос.
          </div>
        )}
      </div>
    </div>
  );
}
