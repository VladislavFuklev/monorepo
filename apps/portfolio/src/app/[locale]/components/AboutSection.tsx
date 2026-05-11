import { useTranslations } from "next-intl";

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js",
  "Redux Toolkit", "React Query", "React Hook Form",
  "Tailwind CSS", "Material UI", "Styled Components",
  "HTML5", "CSS3", "SASS", "WebSocket", "Axios", "Git",
];

const EXPERIENCE = [
  {
    company: "Aventus Group",
    role: "Frontend Software Engineer",
    from: "Apr 2024",
    to: null,
    bullets: [
      "Client-facing & internal business applications",
      "Apple Pay / Google Pay payment integration",
      "Responsive, SEO-optimized landing pages",
      "React · TypeScript · Redux Toolkit · MUI",
    ],
  },
  {
    company: "PrivatBank",
    role: "Frontend Software Engineer",
    from: "Aug 2022",
    to: "Apr 2024",
    bullets: [
      "Migrated legacy jQuery projects to React",
      "New features, maintenance, cross-team collaboration",
      "JavaScript · TypeScript · React · Redux",
    ],
  },
  {
    company: "PrivatBank",
    role: "Project Manager",
    from: "Nov 2020",
    to: "Aug 2022",
    bullets: [
      "Technical specs for IT payment projects",
      "End-to-end payment case processing",
      "Analytics via dashboards & statistical models",
    ],
  },
] as const;

const EDUCATION = [
  { name: "Aventus Group / Udemy", detail: "Complete JavaScript + React" },
  { name: "SkillUp", detail: "Frontend Development" },
  { name: "National Mining University", detail: "Industrial Management · 2018" },
] as const;

export function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="relative border-t border-white/5 px-6 py-24">
      {/* Subtle blob */}
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-sky-600/8 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-600">
            {t("title")}
          </p>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            {t("summary")}
          </p>
        </div>

        {/* Grid: Skills + Experience + Education */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Left: Skills + Education */}
          <div className="flex flex-col gap-8">
            {/* Skills */}
            <div className="rounded-2xl border border-white/8 bg-gray-900/40 p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                {t("skills")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs font-medium text-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="rounded-2xl border border-white/8 bg-gray-900/40 p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                {t("education")}
              </h3>
              <div className="flex flex-col gap-3">
                {EDUCATION.map(({ name, detail }) => (
                  <div key={name} className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-white">{name}</span>
                    <span className="text-xs text-gray-500">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Experience timeline */}
          <div className="rounded-2xl border border-white/8 bg-gray-900/40 p-6">
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t("experience")}
            </h3>

            <div className="relative flex flex-col gap-0">
              {/* Vertical line */}
              <div className="absolute bottom-2 left-[5px] top-2 w-px bg-white/8" />

              {EXPERIENCE.map(({ company, role, from, to, bullets }, i) => (
                <div key={i} className="relative mb-7 pl-6 last:mb-0">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-gray-700 bg-gray-900 ring-2 ring-white/10" />

                  {/* Header */}
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <div>
                      <span className="text-sm font-bold text-white">{company}</span>
                      <span className="ml-2 text-xs text-gray-400">{role}</span>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-gray-600">
                      {from} – {to ?? t("present")}
                    </span>
                  </div>

                  {/* Bullets */}
                  <ul className="flex flex-col gap-1">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
