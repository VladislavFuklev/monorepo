"use client";

import { useState } from "react";
import Link from "next/link";

type Group = "all" | "modifiers" | "extraction" | "conditional" | "template";

interface UtilityType {
  id: string;
  name: string;
  group: Exclude<Group, "all">;
  summary: string;
  signature: string;
  input: string;
  output: string;
  example: string;
}

const utils: UtilityType[] = [
  // ── Modifiers ──────────────────────────────────────────────────────────────
  {
    id: "partial",
    name: "Partial<T>",
    group: "modifiers",
    summary: "Все поля T становятся необязательными",
    signature: "type Partial<T> = { [K in keyof T]?: T[K] }",
    input: "type User = { id: number; name: string; email: string }",
    output: "{ id?: number; name?: string; email?: string }",
    example: `type User = { id: number; name: string; email: string };

function updateUser(id: number, patch: Partial<User>) {
  // patch может содержать любое подмножество полей
}

updateUser(1, { name: "Alice" });           // ✓
updateUser(1, { name: "Bob", email: "b@" }); // ✓`,
  },
  {
    id: "required",
    name: "Required<T>",
    group: "modifiers",
    summary: "Все поля T становятся обязательными",
    signature: "type Required<T> = { [K in keyof T]-?: T[K] }",
    input: "type Config = { host?: string; port?: number; ssl?: boolean }",
    output: "{ host: string; port: number; ssl: boolean }",
    example: `type Config = { host?: string; port?: number };

// Убеждаемся что конфиг полностью заполнен перед запуском
function startServer(config: Required<Config>) {
  console.log(config.host.toUpperCase()); // безопасно — host точно есть
}`,
  },
  {
    id: "readonly",
    name: "Readonly<T>",
    group: "modifiers",
    summary: "Все поля T становятся readonly — объект нельзя мутировать",
    signature: "type Readonly<T> = { readonly [K in keyof T]: T[K] }",
    input: "type Point = { x: number; y: number }",
    output: "{ readonly x: number; readonly y: number }",
    example: `type Point = { x: number; y: number };

const origin: Readonly<Point> = { x: 0, y: 0 };
origin.x = 1; // ✗ Error: Cannot assign to 'x'

// Полезно для иммутабельных данных (Redux state, config)
const CONFIG: Readonly<AppConfig> = loadConfig();`,
  },
  {
    id: "record",
    name: "Record<K, V>",
    group: "modifiers",
    summary: "Создаёт тип объекта с ключами K и значениями V",
    signature: "type Record<K extends keyof any, V> = { [P in K]: V }",
    input: "K = 'react' | 'ts' | 'css',  V = number",
    output: "{ react: number; ts: number; css: number }",
    example: `type Topic = "react" | "ts" | "css";

const scores: Record<Topic, number> = {
  react: 90,
  ts:    85,
  css:   70,
};

// Словарь id → объект
type UserMap = Record<string, User>;
const users: UserMap = {};
users["u1"] = { id: "u1", name: "Alice" };`,
  },
  // ── Extraction ─────────────────────────────────────────────────────────────
  {
    id: "pick",
    name: "Pick<T, K>",
    group: "extraction",
    summary: "Берём только указанные ключи K из типа T",
    signature: "type Pick<T, K extends keyof T> = { [P in K]: T[P] }",
    input: "T = User,  K = 'id' | 'name'",
    output: "{ id: number; name: string }",
    example: `type User = { id: number; name: string; password: string; role: string };

// Публичный профиль — без чувствительных полей
type PublicProfile = Pick<User, "id" | "name">;

// API-ответ для списка
type UserListItem = Pick<User, "id" | "name" | "role">;`,
  },
  {
    id: "omit",
    name: "Omit<T, K>",
    group: "extraction",
    summary: "Берём все ключи T, кроме указанных K",
    signature: "type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>",
    input: "T = User,  K = 'password'",
    output: "{ id: number; name: string; role: string }",
    example: `type User = { id: number; name: string; password: string };

// Исключаем пароль из публичного типа
type SafeUser = Omit<User, "password">;

// При создании — id генерируется сервером, не нужен в запросе
type CreateUserDTO = Omit<User, "id">;`,
  },
  {
    id: "exclude",
    name: "Exclude<T, U>",
    group: "extraction",
    summary: "Из union T убираем типы, которые входят в U",
    signature: "type Exclude<T, U> = T extends U ? never : T",
    input: "T = 'a' | 'b' | 'c',  U = 'a'",
    output: "'b' | 'c'",
    example: `type Status = "idle" | "loading" | "success" | "error";

// Убираем терминальные состояния
type ActiveStatus = Exclude<Status, "success" | "error">;
// → "idle" | "loading"

type NonString = Exclude<string | number | boolean, string>;
// → number | boolean`,
  },
  {
    id: "extract",
    name: "Extract<T, U>",
    group: "extraction",
    summary: "Из union T оставляем только типы, которые входят в U",
    signature: "type Extract<T, U> = T extends U ? T : never",
    input: "T = 'a' | 'b' | 'c',  U = 'a' | 'c'",
    output: "'a' | 'c'",
    example: `type Event = "click" | "focus" | "blur" | "submit";

// Только события мыши
type MouseEvent = Extract<Event, "click" | "mousedown" | "mouseup">;
// → "click"

// Извлечь только функции из union
type Fn = Extract<string | number | (() => void), Function>;
// → () => void`,
  },
  {
    id: "nonnullable",
    name: "NonNullable<T>",
    group: "extraction",
    summary: "Убирает null и undefined из типа T",
    signature: "type NonNullable<T> = T & {}",
    input: "T = string | null | undefined",
    output: "string",
    example: `type MaybeUser = User | null | undefined;

type DefiniteUser = NonNullable<MaybeUser>; // User

// Полезно после проверок или в generic-функциях
function assertDefined<T>(val: T): NonNullable<T> {
  if (val == null) throw new Error("Expected defined value");
  return val as NonNullable<T>;
}`,
  },
  // ── Extraction from types ──────────────────────────────────────────────────
  {
    id: "returntype",
    name: "ReturnType<T>",
    group: "conditional",
    summary: "Извлекает тип возвращаемого значения функции T",
    signature: "type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never",
    input: "T = () => { id: number; name: string }",
    output: "{ id: number; name: string }",
    example: `function createUser() {
  return { id: 1, name: "Alice", role: "admin" as const };
}

// Не нужно дублировать тип вручную
type User = ReturnType<typeof createUser>;
// → { id: number; name: string; role: "admin" }

// Работает с async функциями через Awaited
type AsyncUser = Awaited<ReturnType<typeof fetchUser>>;`,
  },
  {
    id: "parameters",
    name: "Parameters<T>",
    group: "conditional",
    summary: "Извлекает типы параметров функции T как tuple",
    signature: "type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never",
    input: "T = (id: number, name: string) => void",
    output: "[id: number, name: string]",
    example: `function createUser(name: string, role: "admin" | "user", age: number) {}

type Args = Parameters<typeof createUser>;
// → [name: string, role: "admin" | "user", age: number]

// Полезно для wrapper-функций
function withLogging<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log("calling with", args);
    return fn(...args);
  };
}`,
  },
  {
    id: "awaited",
    name: "Awaited<T>",
    group: "conditional",
    summary: "Разворачивает Promise — рекурсивно получает тип результата",
    signature: "type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T",
    input: "T = Promise<Promise<string>>",
    output: "string",
    example: `async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise<{ id: string; name: string }>;
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// → { id: string; name: string }

// Promise<Promise<T>> → T (рекурсивно)
type Deep = Awaited<Promise<Promise<Promise<number>>>>;
// → number`,
  },
  // ── Template literal ───────────────────────────────────────────────────────
  {
    id: "template-literal",
    name: "Template Literal Types",
    group: "template",
    summary: "Строковые типы через шаблонные литералы — генерация union из комбинаций",
    signature: "type T = `${A}${B}`",
    input: "A = 'get' | 'set',  B = 'Name' | 'Age'",
    output: "'getName' | 'getAge' | 'setName' | 'setAge'",
    example: `type Direction = "top" | "right" | "bottom" | "left";
type Margin = \`margin-\${Direction}\`;
// → "margin-top" | "margin-right" | "margin-bottom" | "margin-left"

// CSS property builder
type CSSProp = \`\${string}-\${string}\`;

// Event handlers
type EventName = "click" | "focus" | "blur";
type Handler = \`on\${Capitalize<EventName>}\`;
// → "onClick" | "onFocus" | "onBlur"

// Getter/setter pattern
type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };`,
  },
  {
    id: "mapped-types",
    name: "Mapped Types",
    group: "template",
    summary: "Трансформируем все ключи типа через [K in keyof T]",
    signature: "type Mapped<T> = { [K in keyof T]: transform }",
    input: "T = { name: string; age: number }",
    output: "{ name: string[]; age: number[] }",
    example: `// Делаем все значения массивами
type Arrayify<T> = { [K in keyof T]: T[K][] };

type User = { name: string; age: number };
type ArrayUser = Arrayify<User>;
// → { name: string[]; age: number[] }

// Переименование ключей через as
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// → { getName: () => string; getAge: () => number }

// Фильтрация ключей (убираем функции)
type DataOnly<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};`,
  },
];

const groupMeta: Record<Exclude<Group, "all">, { label: string; color: string; bg: string; border: string }> = {
  modifiers:   { label: "Modifiers",   color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200" },
  extraction:  { label: "Extraction",  color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  conditional: { label: "Inference",   color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  template:    { label: "Template",    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
};

export default function CheatsheetPage() {
  const [group, setGroup] = useState<Group>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = utils.filter((u) => {
    const matchGroup = group === "all" || u.group === group;
    const s = search.toLowerCase();
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.summary.toLowerCase().includes(s);
    return matchGroup && matchSearch;
  });

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 px-6 py-20 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ← Вопросы
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ⚡ Quiz
            </Link>
          </div>
          <h1 className="text-5xl font-black tracking-tight">Utility Types</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            14 встроенных utility types с сигнатурой, входом, выходом и примером. Держи под рукой на собесе.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", "modifiers", "extraction", "conditional", "template"] as Group[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                  group === g
                    ? "bg-white text-purple-700 shadow"
                    : "bg-white/20 text-white hover:bg-white/30",
                ].join(" ")}
              >
                {g === "all" ? "Все" : groupMeta[g].label}
                <span className="ml-1.5 opacity-70">
                  {g === "all" ? utils.length : utils.filter((u) => u.group === g).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <input
          type="search"
          placeholder="Поиск по названию или описанию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />

        <div className="space-y-3">
          {filtered.map((u) => {
            const meta = groupMeta[u.group];
            const isOpen = openId === u.id;

            return (
              <div
                key={u.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${isOpen ? meta.border : "border-gray-200"}`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : u.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-base font-black text-gray-900">{u.name}</code>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{u.summary}</p>
                  </div>
                  <svg
                    className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-6 pt-4 space-y-4">
                    {/* Signature */}
                    <div>
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">Сигнатура</p>
                      <pre className="overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 text-xs text-gray-100">
                        <code>{u.signature}</code>
                      </pre>
                    </div>

                    {/* Input → Output */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className={`rounded-xl border p-3 ${meta.border} ${meta.bg}`}>
                        <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${meta.color}`}>Вход</p>
                        <code className="text-xs text-gray-700">{u.input}</code>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Результат</p>
                        <code className="text-xs font-semibold text-gray-900">{u.output}</code>
                      </div>
                    </div>

                    {/* Example */}
                    <div>
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">Пример</p>
                      <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                        <code>{u.example}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
              Ничего не найдено
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
