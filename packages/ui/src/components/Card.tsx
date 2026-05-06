import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={["rounded-lg border border-gray-200 bg-white p-6 shadow-sm", className].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div {...props} className={["mb-4 border-b border-gray-100 pb-4", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: CardProps) {
  return (
    <h3 {...props} className={["text-lg font-semibold text-gray-900", className].join(" ")}>
      {children}
    </h3>
  );
}
