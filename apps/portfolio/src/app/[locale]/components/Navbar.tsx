import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Navbar() {
  const t = useTranslations("nav");

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#"
          className="text-sm font-black tracking-tight text-white transition-opacity hover:opacity-70"
        >
          VF
          <span className="ml-1.5 text-xs font-normal text-gray-500">
            portfolio
          </span>
        </a>

        {/* Nav + Switcher */}
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            {(["projects", "about", "contact"] as const).map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t(key)}
              </a>
            ))}
          </nav>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
