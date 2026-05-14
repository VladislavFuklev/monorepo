import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Interview — вопросы и ответы",
  description:
    "30+ вопросов по Next.js: App Router, Server Components, Server Actions, кеширование и оптимизация",
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
