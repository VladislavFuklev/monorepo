import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Interview — вопросы и ответы",
  description: "20 популярных вопросов по React для подготовки к собеседованию",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
