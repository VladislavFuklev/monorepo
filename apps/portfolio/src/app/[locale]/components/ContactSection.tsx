import { useTranslations } from "next-intl";

const CONTACTS = [
  {
    label: "Email",
    value: "vladfyklev@gmail.com",
    href: "mailto:vladfyklev@gmail.com",
    icon: MailIcon,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    label: "Phone",
    value: "+38 063 712 42 66",
    href: "tel:+380637124266",
    icon: PhoneIcon,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "LinkedIn",
    value: "vladislavfyklev",
    href: "https://linkedin.com/in/vladislavfyklev",
    icon: LinkedInIcon,
    gradient: "from-violet-500 to-blue-600",
  },
  {
    label: "location",
    value: null,
    href: null,
    icon: PinIcon,
    gradient: "from-rose-500 to-pink-600",
  },
] as const;

export function ContactSection() {
  const t = useTranslations("contact");

  const contacts = [
    ...CONTACTS.slice(0, 3),
    { ...CONTACTS[3], value: t("location") },
  ];

  return (
    <section id="contact" className="relative border-t border-white/5 px-6 py-24">
      {/* Blob */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-600/8 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-600">
            {t("title")}
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white">
            {t("subtitle")}
          </h2>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {contacts.map(({ label, value, href, icon: Icon, gradient }) => {
            const inner = (
              <>
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
                  <Icon />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-600">
                  {label}
                </p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </>
            );

            const base =
              "group relative flex flex-col rounded-2xl border border-white/8 bg-gray-900/40 p-5 transition-all duration-300 hover:border-white/15 hover:bg-gray-900/70";

            return href ? (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={base}>
                {inner}
              </a>
            ) : (
              <div key={label} className={base}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
