"use client";

import { useState } from "react";

type Category = "all" | "composition" | "state" | "performance";

interface Pattern {
  id: string;
  name: string;
  emoji: string;
  category: Exclude<Category, "all">;
  tag: string;
  summary: string;
  when: string[];
  avoid: string;
  code: string;
}

const patterns: Pattern[] = [
  {
    id: "custom-hook",
    name: "Custom Hook",
    emoji: "🪝",
    category: "state",
    tag: "Reuse",
    summary: "Выносим stateful логику в переиспользуемую функцию",
    when: [
      "Одна и та же логика нужна в нескольких компонентах",
      "Нужно протестировать логику отдельно от UI",
      "Компонент вырос — хук упрощает его",
    ],
    avoid: "Не создавай хук ради хука. Если логика в одном месте — оставь в компоненте.",
    code: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Использование
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <input onChange={(e) => setQuery(e.target.value)} />;
}`,
  },
  {
    id: "compound",
    name: "Compound Components",
    emoji: "🧩",
    category: "composition",
    tag: "Composition",
    summary: "Компоненты делят состояние через Context без prop drilling",
    when: [
      "Строишь гибкий компонент с несколькими взаимосвязанными частями",
      "Хочешь дать пользователю контроль над расположением частей",
      "Примеры: Tabs, Accordion, Select, Modal",
    ],
    avoid: "Избыточно для простых компонентов с 1–2 вариациями — там хватит обычных props.",
    code: `const TabsContext = createContext<{
  active: string;
  setActive: (v: string) => void;
} | null>(null);

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { active, setActive } = useContext(TabsContext)!;
  return (
    <button
      onClick={() => setActive(id)}
      className={active === id ? "active" : ""}
    >
      {children}
    </button>
  );
}

function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  const { active } = useContext(TabsContext)!;
  return active === id ? <div>{children}</div> : null;
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;

// Использование — полный контроль над структурой
<Tabs defaultTab="react">
  <Tabs.Tab id="react">React</Tabs.Tab>
  <Tabs.Tab id="ts">TypeScript</Tabs.Tab>
  <Tabs.Panel id="react">React content</Tabs.Panel>
  <Tabs.Panel id="ts">TS content</Tabs.Panel>
</Tabs>`,
  },
  {
    id: "hoc",
    name: "Higher-Order Component",
    emoji: "🔼",
    category: "composition",
    tag: "Composition",
    summary: "Функция принимает компонент и возвращает новый с расширенным поведением",
    when: [
      "Нужно добавить одинаковое поведение многим компонентам (авторизация, логирование)",
      "Работаешь с legacy-кодом, где хуки недоступны (class components)",
    ],
    avoid: "В современном React хуки решают большинство задач HOC чище. Вложенные HOC создают wrapper hell.",
    code: `function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to="/login" />;

    return <Component {...props} />;
  };
}

// Использование
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedProfile  = withAuth(Profile);

// Несколько HOC — compose чтобы избежать ада
const Enhanced = compose(withAuth, withLogger, withAnalytics)(Dashboard);`,
  },
  {
    id: "render-props",
    name: "Render Props",
    emoji: "🎭",
    category: "composition",
    tag: "Composition",
    summary: "Компонент принимает функцию как проп и вызывает её для рендера",
    when: [
      "Нужно шарить поведение (мышь, размер экрана), не зная заранее как это рендерится",
      "Нужна максимальная гибкость для потребителя компонента",
    ],
    avoid: "Хуки решают ту же задачу чище и без callback hell. Render props — редкость в современном коде.",
    code: `function MouseTracker({
  render,
}: {
  render: (pos: { x: number; y: number }) => React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: "100vh" }}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      {render(pos)}
    </div>
  );
}

// Использование
<MouseTracker
  render={({ x, y }) => (
    <img
      src="/cat.png"
      style={{ position: "absolute", left: x, top: y }}
    />
  )}
/>

// Тот же результат через хук — чище:
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}`,
  },
  {
    id: "context-reducer",
    name: "Context + useReducer",
    emoji: "🗂️",
    category: "state",
    tag: "State",
    summary: "Redux-like управление состоянием без внешних зависимостей",
    when: [
      "Состояние нужно компонентам на разных уровнях дерева",
      "Логика обновления сложная — несколько связанных полей",
      "Хочешь избежать Redux, но нужна предсказуемая state machine",
    ],
    avoid: "Для простого состояния достаточно useState. Context не кэшируется — частые обновления вызовут лишние ре-рендеры.",
    code: `type State = { count: number; status: "idle" | "loading" };
type Action =
  | { type: "increment" }
  | { type: "setLoading"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "setLoading":
      return { ...state, status: action.payload ? "loading" : "idle" };
  }
}

const Ctx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0, status: "idle" });
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useCounter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCounter must be inside Provider");
  return ctx;
}`,
  },
  {
    id: "memo",
    name: "memo / useMemo / useCallback",
    emoji: "⚡",
    category: "performance",
    tag: "Performance",
    summary: "Мемоизация для предотвращения лишних ре-рендеров",
    when: [
      "Компонент рендерится часто с теми же пропами → React.memo",
      "Дорогое вычисление не должно пересчитываться каждый рендер → useMemo",
      "Функция передаётся мемоизированному дочернему компоненту → useCallback",
    ],
    avoid: "Не мемоизируй всё подряд — это усложняет код без выгоды. Profile first, optimize second.",
    code: `// React.memo — пропускает рендер если пропы не изменились
const List = React.memo(function List({ items }: { items: string[] }) {
  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // пересчитывается только когда rawItems меняется
  const items = useMemo(
    () => rawItems.filter((i) => i.active).map((i) => i.name),
    [rawItems]
  );

  // стабильная ссылка — List не перерендерится при count++
  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <List items={items} onRemove={handleRemove} />
    </>
  );
}`,
  },
  {
    id: "suspense",
    name: "lazy + Suspense",
    emoji: "💤",
    category: "performance",
    tag: "Performance",
    summary: "Code splitting и декларативная загрузка компонентов",
    when: [
      "Большие компоненты (редакторы, графики, модалки) не нужны при старте",
      "Роутинг — каждая страница загружается отдельным чанком",
      "React 19 — use(promise) для data fetching прямо в render",
    ],
    avoid: "Нет смысла лениво загружать маленькие компоненты — overhead от чанка больше выигрыша.",
    code: `// Ленивая загрузка — чанк загружается только при рендере
const HeavyChart = lazy(() => import("./HeavyChart"));
const AdminPanel  = lazy(() => import("./AdminPanel"));

function App() {
  return (
    // fallback показывается пока чанк грузится
    <Suspense fallback={<Spinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}

// React 19 — use() для промисов
function UserProfile({ id }: { id: string }) {
  // автоматически активирует ближайший Suspense
  const user = use(fetchUser(id));
  return <div>{user.name}</div>;
}

// Роутинг (Next.js делает это автоматически per-page)
const routes = [
  { path: "/dashboard", element: lazy(() => import("./Dashboard")) },
  { path: "/settings",  element: lazy(() => import("./Settings")) },
];`,
  },
];

const categoryMeta: Record<Exclude<Category, "all">, { label: string; color: string; bg: string }> = {
  composition: { label: "Composition", color: "text-sky-700", bg: "bg-sky-100" },
  state:        { label: "State",       color: "text-violet-700", bg: "bg-violet-100" },
  performance:  { label: "Performance", color: "text-amber-700", bg: "bg-amber-100" },
};

const ACCENT = "#0ea5e9";

export default function PatternsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = category === "all" ? patterns : patterns.filter((p) => p.category === category);

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 px-6 py-20 text-white">
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
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ← Вопросы
            </a>
            <a
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              ⚡ Quiz
            </a>
          </div>
          <h1 className="text-5xl font-black tracking-tight">Паттерны</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            7 ключевых React-паттернов с примерами кода. Знай когда применять, а когда нет.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {(["all", "composition", "state", "performance"] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                  category === c
                    ? "bg-white text-blue-700 shadow"
                    : "bg-white/20 text-white hover:bg-white/30",
                ].join(" ")}
              >
                {c === "all" ? "Все" : categoryMeta[c].label}
                <span className="ml-1.5 opacity-70">
                  {c === "all" ? patterns.length : patterns.filter((p) => p.category === c).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="space-y-3">
          {filtered.map((p) => {
            const meta = categoryMeta[p.category];
            const isOpen = openId === p.id;

            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                  className="flex w-full items-start gap-4 p-6 text-left"
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-black text-gray-900">{p.name}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{p.summary}</p>
                  </div>
                  <svg
                    className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 pb-6 pt-5 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
                          Когда использовать
                        </p>
                        <ul className="space-y-1.5">
                          {p.when.map((w, i) => (
                            <li key={i} className="flex gap-2 text-sm text-emerald-800">
                              <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-700">
                          Когда избегать
                        </p>
                        <p className="text-sm text-rose-800">{p.avoid}</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Пример</p>
                      <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                        <code>{p.code}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
