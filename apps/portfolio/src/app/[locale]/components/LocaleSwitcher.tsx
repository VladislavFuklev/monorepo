"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "en" ? "uk" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="relative flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-1 text-xs font-semibold transition-colors hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
      aria-label="Switch language"
    >
      <span
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "en"
            ? "bg-white/15 text-white"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        EN
      </span>
      <span
        className={`rounded-md px-2.5 py-1 transition-colors ${
          locale === "uk"
            ? "bg-white/15 text-white"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        UK
      </span>
    </button>
  );
}
