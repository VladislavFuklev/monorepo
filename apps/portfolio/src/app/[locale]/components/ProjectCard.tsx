interface Tech {
  label: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  tag: string;
  icon: string;
  gradient: string;
  gradientBar: string;
  techs: Tech[];
  demoUrl: string;
  sourceUrl: string;
  demoLabel: string;
  sourceLabel: string;
  liveLabel: string;
  isFeatured?: boolean;
}

export function ProjectCard({
  title,
  description,
  tag,
  icon,
  gradient,
  gradientBar,
  techs,
  demoUrl,
  sourceUrl,
  demoLabel,
  sourceLabel,
  liveLabel,
  isFeatured,
}: ProjectCardProps) {
  if (isFeatured) {
    return <FeaturedCard {...{ title, description, tag, icon, gradient, gradientBar, techs, demoUrl, sourceUrl, demoLabel, sourceLabel, liveLabel }} />;
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl hover:shadow-black/60">
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradientBar}`} />

      {/* Hover glow */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04] bg-gradient-to-br ${gradient}`}
      />

      {/* Header */}
      <div className="relative mb-5 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl bg-gradient-to-br ${gradient}`}
        >
          {icon}
        </div>
        <span className="rounded-full border border-white/8 px-2.5 py-0.5 text-xs text-gray-500">
          {tag}
        </span>
      </div>

      {/* Body */}
      <h3 className="relative mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="relative flex-1 text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      {/* Tech tags */}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {techs.map(({ label }) => (
          <span
            key={label}
            className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-xs text-gray-500"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="relative mt-5 flex gap-2 border-t border-white/8 pt-5">
        {/* Live badge */}
        <span className="mr-auto flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {liveLabel}
        </span>

        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10"
        >
          {demoLabel} ↗
        </a>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white/8 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:border-white/15 hover:text-white"
        >
          {sourceLabel}
        </a>
      </div>
    </div>
  );
}

function FeaturedCard({
  title,
  description,
  tag,
  icon,
  gradient,
  gradientBar,
  techs,
  demoUrl,
  sourceUrl,
  demoLabel,
  sourceLabel,
  liveLabel,
}: Omit<ProjectCardProps, "isFeatured">) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60 md:col-span-2">
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradientBar}`} />

      {/* Background gradient glow */}
      <div
        className={`absolute inset-0 opacity-[0.06] bg-gradient-to-br ${gradient}`}
      />
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.09] bg-gradient-to-br ${gradient}`}
      />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {liveLabel}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-300">
              {tag}
            </span>
          </div>
          <h3 className="text-2xl font-black text-white">{title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="relative mb-6 max-w-xl text-base leading-relaxed text-gray-400">
        {description}
      </p>

      {/* Tech tags */}
      <div className="relative mb-8 flex flex-wrap gap-2">
        {techs.map(({ label }) => (
          <span
            key={label}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="relative mt-auto flex items-center gap-3 border-t border-white/8 pt-6">
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${gradient} px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90`}
        >
          {demoLabel}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-gray-400 transition-all hover:border-white/20 hover:text-white"
        >
          <GitHubIcon />
          {sourceLabel}
        </a>
      </div>
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
