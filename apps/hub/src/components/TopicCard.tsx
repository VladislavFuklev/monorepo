interface TopicCardProps {
  title: string;
  description: string;
  url: string;
  accentColor: string;
  total: number;
  junior: number;
  middle: number;
  senior: number;
  icon: string;
  tag: string;
}

export function TopicCard({
  title, description, url, accentColor, total, junior, middle, senior, icon, tag,
}: TopicCardProps) {
  return (
    <a
      href={url}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.07]"
    >
      {/* Colored top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, ${accentColor}90, transparent 60%)` }}
      />

      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${accentColor}20, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
        }}
      >
        {icon}
      </div>

      {/* Tag */}
      <span className="relative mb-3 inline-flex w-fit items-center rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/40">
        {tag}
      </span>

      {/* Title & description */}
      <h2 className="relative text-2xl font-black text-white">{title}</h2>
      <p className="relative mt-2 text-sm leading-relaxed text-white/45">{description}</p>

      {/* Stats */}
      <div className="relative mt-6 grid grid-cols-4 gap-2 rounded-xl border border-white/6 bg-black/20 p-4">
        <Stat label="Всего" value={total} color="text-white" />
        <Stat label="Junior" value={junior} color="text-emerald-400" />
        <Stat label="Middle" value={middle} color="text-amber-400" />
        <Stat label="Senior" value={senior} color="text-rose-400" />
      </div>

      {/* CTA */}
      <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-white/35 transition-colors duration-200 group-hover:text-white/80">
        Открыть
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
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
      <p className="text-xs text-white/30">{label}</p>
    </div>
  );
}
