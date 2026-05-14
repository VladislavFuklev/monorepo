import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JavaScript Interview — вопросы и ответы",
  description: "25 ключевых вопросов по JavaScript: замыкания, Event Loop, Promise, прототипы и многое другое",
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
