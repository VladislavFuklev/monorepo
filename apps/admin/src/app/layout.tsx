import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fintech Admin",
  description: "Internal admin panel for fintech platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 antialiased">
        <nav className="border-b border-gray-200 bg-white px-6 py-3">
          <span className="text-sm font-semibold text-gray-900">Fintech Admin</span>
        </nav>
        {children}
      </body>
    </html>
  );
}
