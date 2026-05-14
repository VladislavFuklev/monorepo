import { useTranslations } from "next-intl";
import { ProjectCard } from "./ProjectCard";

const GITHUB = "https://github.com/VladislavFuklev";

const HUB_URL    = process.env.NEXT_PUBLIC_HUB_URL        ?? "https://monorepo-hub-phi.vercel.app";
const REACT_URL  = process.env.NEXT_PUBLIC_REACT_URL      ?? "https://monorepo-react-orcin.vercel.app";
const TS_URL     = process.env.NEXT_PUBLIC_TYPESCRIPT_URL ?? "https://monorepo-typescript.vercel.app";
const MONO_URL   = process.env.NEXT_PUBLIC_MONOREPO_URL   ?? "https://monorepo-monorepo.vercel.app";
const NEXTJS_URL = process.env.NEXT_PUBLIC_NEXTJS_URL     ?? "http://localhost:3005";
const CRYPTO_URL  = "https://nextapp-mu-gilt.vercel.app/dashboard";
const WEATHER_URL = "https://weather-widget-six-smoky.vercel.app/signin";
const FINANCE_URL = "https://dashboard-omega-sandy-89.vercel.app/";

export function ProjectsGrid() {
  const t = useTranslations("projects");

  const shared = {
    demoLabel:   t("demo"),
    sourceLabel: t("source"),
    liveLabel:   t("live"),
  };

  return (
    <section id="projects" className="relative px-6 pb-32 pt-8">
      {/* Atmosphere blob */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[160px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-600">
            {t("title")}
          </p>
          <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            {t("subtitle")}
          </h2>
        </div>

        {/* ── Monorepo group ── */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">
          Monorepo
        </p>
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Hub — featured, 2 cols */}
          <ProjectCard
            isFeatured
            title={t("hub.title")}
            description={t("hub.description")}
            tag={t("hub.tag")}
            icon="⬡"
            gradient="from-sky-500 to-violet-600"
            gradientBar="from-sky-400 via-violet-500 to-emerald-400"
            techs={[
              { label: "Next.js 15" },
              { label: "Turborepo" },
              { label: "TypeScript" },
              { label: "Tailwind v4" },
              { label: "pnpm workspaces" },
            ]}
            demoUrl={HUB_URL}
            sourceUrl={`${GITHUB}/monorepo`}
            {...shared}
          />
          <ProjectCard
            title={t("react.title")}
            description={t("react.description")}
            tag={t("react.tag")}
            icon="⚛"
            gradient="from-sky-500 to-blue-600"
            gradientBar="from-sky-400 to-blue-500"
            techs={[
              { label: "React 19" },
              { label: "TypeScript" },
              { label: "Next.js" },
            ]}
            demoUrl={REACT_URL}
            sourceUrl={`${GITHUB}/monorepo`}
            {...shared}
          />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <ProjectCard
            title={t("nextjs.title")}
            description={t("nextjs.description")}
            tag={t("nextjs.tag")}
            icon="▲"
            gradient="from-slate-600 to-indigo-700"
            gradientBar="from-slate-500 to-indigo-500"
            techs={[
              { label: "Next.js 15" },
              { label: "App Router" },
              { label: "TypeScript" },
            ]}
            demoUrl={NEXTJS_URL}
            sourceUrl={`${GITHUB}/monorepo`}
            {...shared}
          />
          <ProjectCard
            isFeatured
            title={t("typescript.title")}
            description={t("typescript.description")}
            tag={t("typescript.tag")}
            icon="𝗧𝗦"
            gradient="from-violet-500 to-purple-600"
            gradientBar="from-violet-400 to-purple-500"
            techs={[
              { label: "TypeScript" },
              { label: "Next.js" },
              { label: "Tailwind" },
            ]}
            demoUrl={TS_URL}
            sourceUrl={`${GITHUB}/monorepo`}
            {...shared}
          />
        </div>

        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Monorepo — featured, 2 cols */}
          <ProjectCard
            isFeatured
            title={t("monorepo.title")}
            description={t("monorepo.description")}
            tag={t("monorepo.tag")}
            icon="📦"
            gradient="from-emerald-500 to-teal-600"
            gradientBar="from-emerald-400 to-teal-500"
            techs={[
              { label: "Turborepo" },
              { label: "pnpm" },
              { label: "Next.js" },
              { label: "TypeScript" },
              { label: "Dependency Graph" },
            ]}
            demoUrl={MONO_URL}
            sourceUrl={`${GITHUB}/monorepo`}
            {...shared}
          />
        </div>

        {/* ── Pet projects group ── */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">
          Pet Projects
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ProjectCard
            title={t("crypto.title")}
            description={t("crypto.description")}
            tag={t("crypto.tag")}
            icon="₿"
            gradient="from-amber-500 to-orange-600"
            gradientBar="from-amber-400 to-orange-500"
            techs={[
              { label: "Next.js" },
              { label: "TypeScript" },
              { label: "Tailwind" },
              { label: "WebSocket" },
              { label: "REST API" },
            ]}
            demoUrl={CRYPTO_URL}
            sourceUrl="https://github.com/VladislavFuklev/nextapp"
            {...shared}
          />
          <ProjectCard
            title={t("weather.title")}
            description={t("weather.description")}
            tag={t("weather.tag")}
            icon="🌤"
            gradient="from-cyan-500 to-sky-600"
            gradientBar="from-cyan-400 to-sky-500"
            techs={[
              { label: "Next.js" },
              { label: "TypeScript" },
              { label: "NextAuth.js" },
              { label: "Open-Meteo" },
              { label: "Tailwind" },
            ]}
            demoUrl={WEATHER_URL}
            sourceUrl="https://github.com/VladislavFuklev/admin-dashboard"
            {...shared}
          />
          <ProjectCard
            title={t("finance.title")}
            description={t("finance.description")}
            tag={t("finance.tag")}
            icon="💳"
            gradient="from-rose-500 to-pink-600"
            gradientBar="from-rose-400 to-pink-500"
            techs={[
              { label: "Next.js" },
              { label: "Prisma" },
              { label: "Vercel Postgres" },
              { label: "NextAuth.js v5" },
              { label: "Zod" },
              { label: "Jest" },
            ]}
            demoUrl={FINANCE_URL}
            sourceUrl="https://github.com/VladislavFuklev/pet"
            {...shared}
          />
        </div>
      </div>
    </section>
  );
}
