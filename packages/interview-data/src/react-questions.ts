import type { Question } from "./types";

export const reactQuestions: Question[] = [
  {
    id: "r1",
    question: "Что такое Virtual DOM и как работает reconciliation?",
    difficulty: "junior",
    tags: ["virtual dom", "reconciliation", "rendering"],
    answer: `Virtual DOM — это лёгкое JavaScript-представление реального DOM-дерева, хранящееся в памяти.

Когда состояние компонента меняется, React:
1. Строит новое Virtual DOM-дерево
2. Сравнивает его с предыдущим (алгоритм diffing)
3. Вычисляет минимальный набор изменений
4. Применяет только эти изменения к реальному DOM (patch)

Reconciliation — это именно процесс сравнения и вычисления изменений. React использует эвристический O(n) алгоритм с двумя допущениями: элементы разных типов дают разные деревья; элементы с одинаковым key между рендерами считаются теми же.`,
    code: `// При изменении state React не перерисовывает всё,
// а только то, что реально изменилось

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>          {/* обновится */}
      <p>Static text</p>             {/* не тронется */}
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
  },
  {
    id: "r2",
    question: "В чём разница между useState и useReducer?",
    difficulty: "junior",
    tags: ["hooks", "useState", "useReducer", "state"],
    answer: `useState — для простого, независимого состояния (числа, строки, булевы).
useReducer — для сложного состояния с несколькими связанными значениями или когда следующий state зависит от предыдущего через бизнес-логику.

Используй useReducer когда:
• Объект состояния содержит 3+ полей, которые меняются вместе
• Логика обновления сложная и её удобно тестировать отдельно
• Следующий state вычисляется из предыдущего через switch/case
• Хочешь Redux-подобную архитектуру без Redux`,
    code: `// useState — просто
const [count, setCount] = useState(0);

// useReducer — сложная логика
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset':     return 0;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
dispatch({ type: 'increment' });`,
  },
  {
    id: "r3",
    question: "Как работает useEffect? Что такое cleanup-функция?",
    difficulty: "junior",
    tags: ["hooks", "useEffect", "lifecycle", "cleanup"],
    answer: `useEffect запускается после того, как браузер отрисовал изменения (после paint). Принимает функцию-эффект и массив зависимостей.

Массив зависимостей:
• [] — запуск только при монтировании
• [a, b] — запуск когда a или b изменились
• без массива — запуск после каждого рендера

Cleanup-функция возвращается из эффекта и вызывается:
• Перед следующим запуском того же эффекта
• При размонтировании компонента

Используется для отписки от событий, отмены запросов, очистки таймеров.`,
    code: `useEffect(() => {
  const controller = new AbortController();

  fetch('/api/user', { signal: controller.signal })
    .then(r => r.json())
    .then(setUser);

  // cleanup: отменяем запрос если компонент размонтировался
  return () => controller.abort();
}, [userId]); // перезапускается когда userId меняется`,
  },
  {
    id: "r4",
    question: "Что такое useCallback и useMemo? Когда их использовать?",
    difficulty: "middle",
    tags: ["hooks", "useCallback", "useMemo", "performance", "memoization"],
    answer: `useMemo — кэширует результат вычисления. Пересчитывает только когда меняются зависимости.
useCallback — кэширует функцию (это useMemo для функций). Возвращает ту же ссылку между рендерами.

Когда использовать:
• useMemo — тяжёлые вычисления (сортировка, фильтрация больших массивов)
• useCallback — передача колбэков в React.memo-компоненты (иначе мемоизация дочернего бесполезна)

Не злоупотребляй: каждый вызов стоит памяти и времени. Сначала измерь, потом оптимизируй.`,
    code: `// useMemo — кэшируем тяжёлое вычисление
const filtered = useMemo(
  () => users.filter(u => u.name.includes(query)).sort(...),
  [users, query]
);

// useCallback — стабильная ссылка на функцию
const handleClick = useCallback((id: string) => {
  dispatch({ type: 'select', id });
}, [dispatch]); // dispatch из useReducer стабилен — зависимости не меняются

// Без useCallback дочерний компонент будет перерисовываться
// даже при React.memo, потому что handleClick — новая функция на каждом рендере
<MemoizedList onItemClick={handleClick} />`,
  },
  {
    id: "r5",
    question: "Разница между контролируемым и неконтролируемым компонентом?",
    difficulty: "junior",
    tags: ["forms", "controlled", "uncontrolled", "refs"],
    answer: `Контролируемый — React управляет значением через state. Input получает value из state и вызывает onChange для обновления.
Неконтролируемый — DOM управляет значением сам. React читает его через ref только когда нужно (например, при submit).

Контролируемые: валидация на лету, зависимые поля, трансформация ввода.
Неконтролируемые: простые формы, интеграция с не-React кодом, файловые инпуты.`,
    code: `// Контролируемый
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />

// Неконтролируемый
const ref = useRef<HTMLInputElement>(null);
<input ref={ref} defaultValue="initial" />
// читаем при submit: ref.current?.value`,
  },
  {
    id: "r6",
    question: "Что такое Context API? Когда использовать и когда не стоит?",
    difficulty: "middle",
    tags: ["context", "state management", "prop drilling"],
    answer: `Context позволяет передавать данные вниз по дереву компонентов без явной передачи через props на каждом уровне (решает prop drilling).

Когда использовать:
• Тема (dark/light), язык, данные авторизованного пользователя
• Данные, которые нужны многим компонентам на разных уровнях

Когда НЕ стоит:
• Часто меняющиеся данные (каждое изменение перерисует всех потребителей)
• Замена полноценного state-менеджера (Redux/Zustand) — у них оптимизации выборочных подписок

Оптимизация: разделяй контексты по частоте изменений — отдельно для статичных данных (тема), отдельно для динамичных.`,
    code: `const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// В любом дочернем компоненте:
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>Click</button>;
}`,
  },
  {
    id: "r7",
    question: "Что такое React.memo? Как он работает?",
    difficulty: "middle",
    tags: ["performance", "memoization", "React.memo", "rendering"],
    answer: `React.memo — HOC, который оборачивает компонент и предотвращает его перерисовку, если props не изменились (поверхностное сравнение).

Компонент перерисовывается когда:
• Изменился любой prop (по ссылке для объектов/функций/массивов)
• Изменился контекст, который он читает
• Родитель перерисовался (без React.memo)

Важно: если передаёшь в memo-компонент колбэк, оборачивай его в useCallback, иначе каждый рендер родителя создаёт новую функцию → memo не срабатывает.`,
    code: `const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  console.log('render'); // не вызовется, если user не изменился
  return <div>{user.name}</div>;
});

// Кастомное сравнение (вместо поверхностного)
const UserCard = React.memo(UserCardBase, (prev, next) => {
  return prev.user.id === next.user.id; // перерисовываем только при смене id
});`,
  },
  {
    id: "r8",
    question: "Что такое Higher-Order Component (HOC)?",
    difficulty: "middle",
    tags: ["HOC", "patterns", "composition"],
    answer: `HOC — функция, принимающая компонент и возвращающая новый компонент с расширенным поведением. Паттерн для переиспользования логики между компонентами.

Сегодня HOC вытеснены кастомными хуками: хуки проще, не создают лишних уровней в дереве, нет конфликтов имён props. Но HOC всё ещё актуальны для class-компонентов и некоторых сценариев (withRouter, connect в Redux, React.memo).`,
    code: `function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth();

    if (!user) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

// Использование
const ProtectedDashboard = withAuth(Dashboard);`,
  },
  {
    id: "r9",
    question: "Как работает React.lazy и Suspense?",
    difficulty: "middle",
    tags: ["lazy", "Suspense", "code splitting", "performance"],
    answer: `React.lazy позволяет лениво загружать компонент: его код не попадает в основной бандл, а загружается только при первом рендере.
Suspense — границы ожидания: пока компонент загружается, показывает fallback.

Это code splitting — разбивка бандла на части. Критически важно для больших приложений: пользователь загружает только то, что нужно прямо сейчас.`,
    code: `const Dashboard = React.lazy(() => import('./Dashboard'));
const Settings = React.lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
  },
  {
    id: "r10",
    question: "useLayoutEffect vs useEffect — в чём разница?",
    difficulty: "senior",
    tags: ["hooks", "useLayoutEffect", "useEffect", "rendering"],
    answer: `useEffect — запускается асинхронно после paint (браузер уже отрисовал экран).
useLayoutEffect — запускается синхронно после DOM-мутаций, но ДО того как браузер отрисует экран.

useLayoutEffect нужен когда:
• Читаешь размеры/позиции DOM-элементов и сразу обновляешь стили (иначе будет мигание)
• Синхронно изменяешь DOM до того как пользователь увидит промежуточное состояние

По умолчанию используй useEffect. useLayoutEffect — только если видишь визуальный glitch.`,
    code: `// Мигание есть (useEffect — после paint)
useEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height); // пользователь видит скачок
}, []);

// Мигания нет (useLayoutEffect — до paint)
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height); // браузер ещё не рисовал — скачка нет
}, []);`,
  },
  {
    id: "r11",
    question: "Зачем нужны keys в списках?",
    difficulty: "junior",
    tags: ["keys", "lists", "reconciliation", "performance"],
    answer: `Key — идентификатор, помогающий React определить какие элементы списка изменились, добавились или удалились между рендерами.

Без key React сравнивает по индексу → при вставке элемента в начало всё "сдвигается" и перерисовывается. С key React точно знает какой элемент какой.

Правила:
• Key должен быть уникальным среди siblings (не глобально)
• Key должен быть стабильным (не Math.random())
• Индекс массива — плохой key если список может меняться`,
    code: `// Плохо — индекс нестабилен при добавлении/удалении
{items.map((item, index) => <Item key={index} {...item} />)}

// Хорошо — стабильный уникальный ID
{items.map(item => <Item key={item.id} {...item} />)}`,
  },
  {
    id: "r12",
    question: "Что такое Error Boundary?",
    difficulty: "middle",
    tags: ["error boundary", "error handling", "lifecycle"],
    answer: `Error Boundary — компонент-класс, перехватывающий JavaScript-ошибки в дочернем дереве и отображающий fallback UI вместо крашнувшегося дерева.

Что НЕ перехватывают:
• Ошибки в обработчиках событий (используй try/catch)
• Асинхронный код (setTimeout, Promise)
• Серверный рендеринг
• Ошибки в самом Error Boundary

Библиотека react-error-boundary предоставляет удобные функциональные обёртки.`,
    code: `class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>`,
  },
  {
    id: "r13",
    question: "Что такое prop drilling и как его избежать?",
    difficulty: "junior",
    tags: ["prop drilling", "context", "state management"],
    answer: `Prop drilling — передача props через несколько уровней компонентов, которым они сами не нужны, только чтобы передать их глубже.

Способы избежать:
1. Context API — для глобальных данных (тема, пользователь)
2. Composition (children/slots) — передавай готовые компоненты вместо данных
3. State-менеджер (Zustand, Redux) — компоненты подписываются напрямую
4. Перенос state ниже — иногда state можно сделать локальным`,
    code: `// Prop drilling — плохо
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Avatar user={user} />  {/* нужен только здесь */}

// Composition — лучше
<Layout sidebar={<Sidebar><Avatar user={user} /></Sidebar>}>

// Context — для глобальных данных
const user = useContext(UserContext); // в Avatar напрямую`,
  },
  {
    id: "r14",
    question: "Что такое кастомные хуки? Зачем их создавать?",
    difficulty: "middle",
    tags: ["custom hooks", "reusability", "hooks"],
    answer: `Кастомный хук — функция, начинающаяся с use, использующая другие хуки внутри. Позволяет выносить и переиспользовать stateful-логику между компонентами.

Преимущества над HOC/render props:
• Нет лишних элементов в дереве компонентов
• Нет конфликтов имён
• Явная типизация, понятный поток данных
• Легко тестировать изолированно`,
    code: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Использование в любом компоненте
const debouncedQuery = useDebounce(query, 300);
useEffect(() => {
  search(debouncedQuery);
}, [debouncedQuery]);`,
  },
  {
    id: "r15",
    question: "Что такое Portals?",
    difficulty: "middle",
    tags: ["portals", "DOM", "modal"],
    answer: `Portal позволяет рендерить дочерний компонент в другой DOM-узел, вне родительского дерева — но при этом он остаётся частью React-дерева (события всплывают как обычно).

Типичные сценарии: модальные окна, тултипы, dropdown — всё что должно выйти за пределы overflow:hidden или z-index родителя.`,
    code: `function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body  // рендерим прямо в body, минуя родителей
  );
}`,
  },
  {
    id: "r16",
    question: "Что такое useRef и для чего он используется?",
    difficulty: "junior",
    tags: ["useRef", "refs", "DOM", "hooks"],
    answer: `useRef возвращает мутабельный объект { current: ... }, который живёт весь жизненный цикл компонента. Изменение ref.current НЕ вызывает перерисовку.

Два основных применения:
1. Доступ к DOM-элементу (фокус, размеры, анимации)
2. Хранение значений между рендерами без перерисовки (предыдущее значение, таймер, флаг)`,
    code: `// 1. DOM-доступ
const inputRef = useRef<HTMLInputElement>(null);
const focusInput = () => inputRef.current?.focus();
<input ref={inputRef} />

// 2. Хранение без перерисовки
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  timerRef.current = setTimeout(doSomething, 1000);
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, []);`,
  },
  {
    id: "r17",
    question: "Правила использования хуков",
    difficulty: "junior",
    tags: ["hooks", "rules", "eslint"],
    answer: `Два правила:

1. Вызывай хуки только на верхнем уровне — не внутри условий, циклов или вложенных функций. React полагается на стабильный порядок вызовов хуков между рендерами.

2. Вызывай хуки только из React-функций — из функциональных компонентов или кастомных хуков. Не из обычных JS-функций.

Почему: React хранит состояние хуков как связный список, привязанный к порядку вызовов. Если порядок меняется — состояние перепутается.

Плагин eslint-plugin-react-hooks автоматически проверяет эти правила.`,
    code: `// НЕЛЬЗЯ
if (condition) {
  const [state, setState] = useState(0); // порядок меняется!
}

// НЕЛЬЗЯ
for (const item of items) {
  useEffect(() => {}, [item]); // количество хуков меняется!
}

// МОЖНО — условие внутри хука
const [state, setState] = useState(0);
useEffect(() => {
  if (condition) doSomething();
}, [condition]);`,
  },
  {
    id: "r18",
    question: "Что такое StrictMode?",
    difficulty: "middle",
    tags: ["StrictMode", "development", "debugging"],
    answer: `React.StrictMode — инструмент разработки, активирующий дополнительные проверки и предупреждения. Не влияет на production-сборку.

Что делает в React 18+:
• Вызывает render, useState и useReducer инициализаторы дважды (чтобы выявить side effects в render-фазе)
• Монтирует → размонтирует → снова монтирует каждый компонент (проверяет корректность cleanup в useEffect)
• Предупреждает об устаревших API

Если твой компонент работает некорректно в StrictMode — это сигнал о баге, а не о проблеме StrictMode.`,
    code: `// main.tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// В dev-режиме useEffect сработает так:
// mount → cleanup → mount  (намеренно, для проверки)
// Если есть баг с double-mount — значит cleanup написан неверно`,
  },
  {
    id: "r19",
    question: "Что такое паттерн Compound Components?",
    difficulty: "senior",
    tags: ["patterns", "compound components", "composition", "context"],
    answer: `Compound Components — паттерн, при котором несколько компонентов работают вместе, разделяя неявное состояние через Context. Даёт гибкий API без prop drilling.

Примеры из стандартных HTML-элементов: select/option, ul/li, table/tr/td.

Преимущества: пользователь API сам контролирует разметку и порядок — компонент не диктует структуру. Легко расширять.`,
    code: `const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return (
    <button
      onClick={() => ctx.setActive(id)}
      className={ctx.active === id ? 'font-bold' : ''}
    >
      {children}
    </button>
  );
};

// Использование
<Tabs defaultTab="profile">
  <Tabs.Tab id="profile">Profile</Tabs.Tab>
  <Tabs.Tab id="settings">Settings</Tabs.Tab>
</Tabs>`,
  },
  {
    id: "r20",
    question: "Как работает batching обновлений состояния?",
    difficulty: "senior",
    tags: ["batching", "state", "performance", "React 18"],
    answer: `Batching — группировка нескольких вызовов setState в один ре-рендер. React 18 ввёл Automatic Batching: теперь батчинг работает везде — в Promise, setTimeout, нативных обработчиках событий.

До React 18 батчинг работал только в React event handlers. Несколько setState в setTimeout вызывали несколько рендеров.

Если нужно форсировать отдельный рендер — используй flushSync (редкий кейс).`,
    code: `// React 18 — один рендер для всех трёх обновлений
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  setUser(u => ({ ...u, name: 'Alice' }));
  // только один ре-рендер!
}, 1000);

// Если нужно немедленно — flushSync
import { flushSync } from 'react-dom';

flushSync(() => setCount(c => c + 1)); // рендер здесь
flushSync(() => setFlag(f => !f));     // рендер здесь`,
  },
];
