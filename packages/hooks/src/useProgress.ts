"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface UseProgressReturn {
  completed: string[];
  toggle: (id: string) => void;
  isCompleted: (id: string) => boolean;
  count: number;
  percentage: number;
  reset: () => void;
}

export function useProgress(topic: string, total: number): UseProgressReturn {
  const [completed, setCompleted] = useLocalStorage<string[]>(`progress:${topic}`, []);

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setCompleted]
  );

  const isCompleted = useCallback((id: string) => completed.includes(id), [completed]);

  const percentage = useMemo(
    () => (total === 0 ? 0 : Math.round((completed.length / total) * 100)),
    [completed.length, total]
  );

  const reset = useCallback(() => setCompleted([]), [setCompleted]);

  return { completed, toggle, isCompleted, count: completed.length, percentage, reset };
}
