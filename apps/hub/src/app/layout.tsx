import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Prep — монорепо для подготовки к собеседованию",
  description: "React, TypeScript и Monorepo вопросы в одном месте",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-950 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
