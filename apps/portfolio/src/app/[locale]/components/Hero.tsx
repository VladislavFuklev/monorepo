import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32">
      {/* ── Atmosphere blobs ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-20 h-[700px] w-[700px] rounded-full bg-blue-600/20 blur-[160px]" />
        <div className="absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/3 rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* ── Dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative w-full max-w-4xl text-center">
        {/* Badge */}
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          {t("hero.badge")}
        </div>

        {/* Greeting */}
        <p className="animate-fade-up delay-100 mb-2 text-xl text-gray-500">
          {t("hero.greeting")}
        </p>

        {/* Name */}
        <h1 className="animate-fade-up delay-200 mb-3 text-7xl font-black leading-none tracking-tight text-white md:text-8xl">
          Vlad Fyklev
        </h1>

        {/* Role */}
        <div className="animate-fade-up delay-300 mb-8 text-4xl font-black tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            {t("hero.role")}
          </span>
        </div>

        {/* Description */}
        <p className="animate-fade-up delay-300 mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-400">
          {t("hero.description")}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up delay-400 mb-20 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all hover:shadow-violet-900/50 hover:opacity-90"
          >
            {t("hero.cta_projects")}
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
          >
            <GitHubIcon />
            {t("hero.cta_github")}
            <ExternalLinkIcon />
          </a>
        </div>

        {/* Divider */}
        <div className="animate-fade-in delay-500 mx-auto mb-10 h-14 w-px bg-gradient-to-b from-white/20 to-transparent" />

        {/* Stats */}
        <div className="animate-fade-up delay-500 mx-auto grid max-w-xs grid-cols-3 gap-8">
          <Stat value="4" label={t("stats.years")} />
          <Stat value="2" label={t("stats.companies")} />
          <Stat value="16+" label={t("stats.technologies")} accent />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`text-2xl font-black leading-none ${
          accent
            ? "bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent"
            : "text-white"
        }`}
      >
        {value}
      </span>
      <span className="text-center text-xs leading-tight text-gray-500">
        {label}
      </span>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 opacity-60"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
