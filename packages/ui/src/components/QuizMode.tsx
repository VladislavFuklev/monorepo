"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question, Difficulty } from "@fintech/interview-data";
import { useProgress } from "@fintech/hooks";

interface QuizModeProps {
  questions: Question[];
  topic: string;
  accent: string;
  hubUrl: string;
  listUrl: string;
}

type Phase = "setup" | "quiz" | "summary";
type DiffFilter = Difficulty | "all";

const diffLabel: Record<Difficulty, string> = {
  junior: "Junior",
  middle: "Middle",
  senior: "Senior",
};

const diffStyle: Record<Difficulty, string> = {
  junior: "bg-emerald-100 text-emerald-700",
  middle: "bg-amber-100 text-amber-700",
  senior: "bg-rose-100 text-rose-700",
};

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function QuizMode({ questions, topic, accent, hubUrl, listUrl }: QuizModeProps) {
  const { isCompleted, toggle, count, percentage } = useProgress(topic, questions.length);

  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [onlyIncomplete, setOnlyIncomplete] = useState(true);
  const [doShuffle, setDoShuffle] = useState(true);

  const [phase, setPhase] = useState<Phase>("setup");
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [session, setSession] = useState({ known: 0, unknown: 0 });

  const current = queue[index];

  const previewCount = questions.filter((q) => {
    const matchDiff = diffFilter === "all" || q.difficulty === diffFilter;
    const matchIncomplete = !onlyIncomplete || !isCompleted(q.id);
    return matchDiff && matchIncomplete;
  }).length;

  function start() {
    let qs = questions.filter((q) => {
      const matchDiff = diffFilter === "all" || q.difficulty === diffFilter;
      const matchIncomplete = !onlyIncomplete || !isCompleted(q.id);
      return matchDiff && matchIncomplete;
    });
    if (doShuffle) qs = shuffled(qs);
    setQueue(qs);
    setIndex(0);
    setRevealed(false);
    setSession({ known: 0, unknown: 0 });
    setPhase("quiz");
  }

  function answer(known: boolean) {
    if (!current) return;
    if (known && !isCompleted(current.id)) toggle(current.id);
    setSession((s) => ({
      known: known ? s.known + 1 : s.known,
      unknown: known ? s.unknown : s.unknown + 1,
    }));
    const next = index + 1;
    if (next >= queue.length) {
      setPhase("summary");
    } else {
      setIndex(next);
      setRevealed(false);
    }
  }

  function restart() {
    setPhase("setup");
  }

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-lg">
          <Link
            href={listUrl}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← К списку вопросов
          </Link>

          <div
            className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl font-black"
            style={{ backgroundColor: accent }}
          >
            ?
          </div>

          <h1 className="mt-4 text-3xl font-black text-gray-900">Quiz-режим</h1>
          <p className="mt-2 text-gray-500">
            Отвечай на вопросы по памяти, затем смотри ответ. Так запоминается быстрее.
          </p>

          {/* Overall progress */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Общий прогресс</span>
              <span className="font-bold" style={{ color: accent }}>{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: accent }}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">{count} из {questions.length} вопросов изучено</p>
          </div>

          {/* Options */}
          <div className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">Настройки сессии</p>

            {/* Difficulty filter */}
            <div>
              <p className="mb-2 text-xs text-gray-500">Сложность</p>
              <div className="flex flex-wrap gap-2">
                {(["all", "junior", "middle", "senior"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiffFilter(d)}
                    className={[
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                      diffFilter === d
                        ? "text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                    ].join(" ")}
                    style={diffFilter === d ? { backgroundColor: accent } : {}}
                  >
                    {d === "all" ? "Все" : diffLabel[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <Toggle
                label="Только непройденные"
                checked={onlyIncomplete}
                onChange={setOnlyIncomplete}
                accent={accent}
              />
              <Toggle
                label="Перемешать вопросы"
                checked={doShuffle}
                onChange={setDoShuffle}
                accent={accent}
              />
            </div>
          </div>

          {/* Start */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {previewCount === 0 ? (
                <span className="text-rose-500">Нет вопросов с такими фильтрами</span>
              ) : (
                <><span className="font-semibold text-gray-900">{previewCount}</span> вопросов в сессии</>
              )}
            </p>
            <button
              onClick={start}
              disabled={previewCount === 0}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: accent }}
            >
              Начать →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  if (phase === "summary") {
    const total = session.known + session.unknown;
    const pct = total === 0 ? 0 : Math.round((session.known / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="text-5xl">
            {pct === 100 ? "🏆" : pct >= 60 ? "💪" : "📚"}
          </div>
          <h1 className="mt-4 text-3xl font-black text-gray-900">Сессия завершена!</h1>
          <p className="mt-2 text-gray-500">Вот как ты справился с {total} вопросами</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <StatCard label="Всего" value={total} color="text-gray-900" />
            <StatCard label="Знаю ✓" value={session.known} color="text-emerald-600" />
            <StatCard label="Повторю ✗" value={session.unknown} color="text-rose-500" />
          </div>

          {/* Score bar */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-gray-700">Результат сессии</span>
              <span style={{ color: accent }}>{pct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: accent }}
              />
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Общий прогресс</span>
              <span className="font-bold" style={{ color: accent }}>{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: accent }}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">{count} из {questions.length} вопросов изучено</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={restart}
              className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Ещё одна сессия
            </button>
            <Link
              href={listUrl}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              К списку вопросов
            </Link>
            <a
              href={hubUrl}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              На главную Hub →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz ───────────────────────────────────────────────────────────────────
  if (!current) return null;

  const progress = index + 1;
  const totalQ = queue.length;
  const progressPct = Math.round((index / totalQ) * 100);
  const alreadyDone = isCompleted(current.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={restart}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕ Выйти
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {progress} / {totalQ}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-emerald-600">✓ {session.known}</span>
            <span className="font-semibold text-rose-500">✗ {session.unknown}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-2 max-w-2xl">
          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        {/* Question card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${diffStyle[current.difficulty]}`}>
              {diffLabel[current.difficulty]}
            </span>
            {alreadyDone && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                ✓ изучено
              </span>
            )}
            {current.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xl font-bold leading-snug text-gray-900">{current.question}</p>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-8 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Показать ответ
            </button>
          ) : (
            <div className="mt-6">
              <div className="border-t border-gray-100 pt-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {current.answer}
                </p>
                {current.code && (
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                    <code>{current.code}</code>
                  </pre>
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  onClick={() => answer(false)}
                  className="rounded-xl border-2 border-rose-200 bg-rose-50 py-4 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-[0.98]"
                >
                  ✗ Повторю ещё
                </button>
                <button
                  onClick={() => answer(true)}
                  className="rounded-xl py-4 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: "#10b981" }}
                >
                  ✓ Знаю!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="mt-4 text-center text-xs text-gray-400">
          {!revealed ? "Нажми чтобы посмотреть ответ" : "Оцени своё знание честно"}
        </p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  accent,
}: {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-gray-700">{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? accent : "#e5e7eb" }}
      >
        <span
          className={[
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}
