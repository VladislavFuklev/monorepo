import { useTranslations } from "next-intl";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProjectsGrid } from "./components/ProjectsGrid";

export default function HomePage() {
  const t = useTranslations("footer");

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectsGrid />
      </main>
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-gray-600">
        {t("copy")}
      </footer>
    </>
  );
}
