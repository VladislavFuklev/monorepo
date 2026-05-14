import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monorepo Interview — вопросы и ответы",
  description: "15 вопросов по монорепозиторию, Turborepo и pnpm workspaces",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#050508] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
