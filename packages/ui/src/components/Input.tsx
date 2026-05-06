import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          "block w-full rounded-md border px-3 py-2 text-sm shadow-sm",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300",
          className,
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
