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
  junior: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  middle: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  senior: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
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
      <div className="min-h-screen bg-[#050508] px-6 py-10">
        <div className="mx-auto max-w-md">
          {/* Back */}
          <Link
            href={listUrl}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            ← К вопросам
          </Link>

          {/* Hero */}
          <div className="mb-8">
            <div
              className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg"
              style={{ backgroundColor: accent, boxShadow: `0 0 32px ${accent}55` }}
            >
              ⚡
            </div>
            <h1 className="text-3xl font-black text-white">Quiz-режим</h1>
            <p className="mt-2 text-sm text-white/50">
              Отвечай по памяти, потом смотри ответ — так запоминается быстрее.
            </p>
          </div>

          {/* Progress card */}
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">Общий прогресс</span>
              <span className="text-sm font-bold" style={{ color: accent }}>{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: accent }}
              />
            </div>
            <p className="mt-2 text-xs text-white/30">{count} из {questions.length} изучено</p>
          </div>

          {/* Settings card */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5 space-y-5">
            <p className="text-sm font-semibold text-white/80">Настройки сессии</p>

            {/* Difficulty */}
            <div>
              <p className="mb-2.5 text-xs text-white/40">Сложность</p>
              <div className="flex flex-wrap gap-2">
                {(["all", "junior", "middle", "senior"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiffFilter(d)}
                    className={[
                      "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                      diffFilter === d
                        ? "text-white shadow-md"
                        : "bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/80",
                    ].join(" ")}
                    style={diffFilter === d ? { backgroundColor: accent, boxShadow: `0 0 12px ${accent}55` } : {}}
                  >
                    {d === "all" ? "Все" : diffLabel[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 border-t border-white/8 pt-4">
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
            <p className="text-sm text-white/40">
              {previewCount === 0 ? (
                <span className="text-rose-400">Нет подходящих вопросов</span>
              ) : (
                <><span className="font-semibold text-white/80">{previewCount}</span> вопросов</>
              )}
            </p>
            <button
              onClick={start}
              disabled={previewCount === 0}
              className="rounded-xl px-7 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}55` }}
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
    const emoji = pct === 100 ? "🏆" : pct >= 60 ? "💪" : "📚";
    const message = pct === 100 ? "Идеально!" : pct >= 60 ? "Хороший результат" : "Нужно повторить";

    return (
      <div className="min-h-screen bg-[#050508] px-6 py-12">
        <div className="mx-auto max-w-md">
          {/* Result hero */}
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">{emoji}</div>
            <h1 className="text-3xl font-black text-white">Сессия завершена!</h1>
            <p className="mt-2 text-white/50">{message} — {total} вопросов пройдено</p>
          </div>

          {/* Score ring card */}
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/5 p-6 text-center">
            <div className="relative mx-auto mb-4 flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42" fill="none" strokeWidth="10"
                  stroke={accent}
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                  style={{ filter: `drop-shadow(0 0 8px ${accent})`, transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <span className="text-3xl font-black text-white">{pct}<span className="text-lg text-white/50">%</span></span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Результат сессии</p>
          </div>

          {/* Stat cards */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/8 bg-white/5 p-4 text-center">
              <p className="text-2xl font-black text-white">{total}</p>
              <p className="mt-1 text-xs text-white/40">Всего</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">{session.known}</p>
              <p className="mt-1 text-xs text-emerald-500/70">Знаю ✓</p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
              <p className="text-2xl font-black text-rose-400">{session.unknown}</p>
              <p className="mt-1 text-xs text-rose-500/70">Повторю ✗</p>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mb-8 rounded-2xl border border-white/8 bg-white/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">Общий прогресс</span>
              <span className="text-sm font-bold" style={{ color: accent }}>{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: accent }}
              />
            </div>
            <p className="mt-2 text-xs text-white/30">{count} из {questions.length} изучено</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={restart}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: accent, boxShadow: `0 0 24px ${accent}44` }}
            >
              Ещё одна сессия
            </button>
            <Link
              href={listUrl}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 text-center text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              К списку вопросов
            </Link>
            <a
              href={hubUrl}
              className="text-center text-sm text-white/30 transition-colors hover:text-white/60"
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
    <div className="min-h-screen bg-[#050508]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 border-b border-white/8 bg-[#050508]/90 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={restart}
              className="text-sm text-white/30 transition-colors hover:text-white/70"
            >
              ✕ Выйти
            </button>
            <span className="text-sm font-semibold text-white/60">
              <span className="text-white">{progress}</span>
              <span className="mx-1 text-white/30">/</span>
              {totalQ}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="text-emerald-400">✓ {session.known}</span>
            <span className="text-rose-400">✗ {session.unknown}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-2.5 max-w-2xl">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Question card */}
        <div className="rounded-3xl bg-white shadow-2xl">
          {/* Card header */}
          <div className="border-b border-gray-100 px-8 pt-7 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                current.difficulty === "junior"
                  ? "bg-emerald-50 text-emerald-700"
                  : current.difficulty === "middle"
                  ? "bg-amber-50 text-amber-700"
                  : "bg-rose-50 text-rose-700"
              }`}>
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
          </div>

          {/* Question */}
          <div className="px-8 py-7">
            <p className="text-xl font-bold leading-snug text-gray-900">{current.question}</p>

            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="mt-8 w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01] hover:opacity-95 active:scale-[0.98]"
                style={{ backgroundColor: accent, boxShadow: `0 8px 24px ${accent}44` }}
              >
                Показать ответ
              </button>
            ) : (
              <div className="mt-6">
                <div className="rounded-2xl bg-gray-50 p-6">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {current.answer}
                  </p>
                  {current.code && (
                    <pre className="mt-4 overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                      <code>{current.code}</code>
                    </pre>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => answer(false)}
                    className="rounded-2xl border-2 border-rose-100 bg-rose-50 py-4 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-[0.97]"
                  >
                    ✗ Повторю ещё
                  </button>
                  <button
                    onClick={() => answer(true)}
                    className="rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
                    style={{ backgroundColor: "#10b981", boxShadow: "0 8px 20px #10b98144" }}
                  >
                    ✓ Знаю!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="mt-4 text-center text-xs text-white/25">
          {!revealed ? "Сначала подумай — потом смотри ответ" : "Честно оцени своё знание"}
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
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-white/60">{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? accent : "rgba(255,255,255,0.1)" }}
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
