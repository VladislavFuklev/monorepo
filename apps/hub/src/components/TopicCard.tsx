interface TopicCardProps {
  title: string;
  description: string;
  url: string;
  gradient: string;
  total: number;
  junior: number;
  middle: number;
  senior: number;
  icon: string;
  tag: string;
}

export function TopicCard({
  title, description, url, gradient, total, junior, middle, senior, icon, tag,
}: TopicCardProps) {
  return (
    <a
      href={url}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Gradient glow on hover */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${gradient}`}
      />

      {/* Icon */}
      <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${gradient}`}>
        {icon}
      </div>

      {/* Tag */}
      <span className="mb-3 inline-flex w-fit items-center rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-gray-400">
        {tag}
      </span>

      {/* Title & description */}
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-2 rounded-xl bg-gray-800/60 p-4">
        <Stat label="Всего" value={total} color="text-white" />
        <Stat label="Junior" value={junior} color="text-emerald-400" />
        <Stat label="Middle" value={middle} color="text-amber-400" />
        <Stat label="Senior" value={senior} color="text-rose-400" />
      </div>

      {/* CTA */}
      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
        Начать изучение
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
