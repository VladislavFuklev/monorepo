import type { Question } from "./types";

export const nextjsQuestions: Question[] = [
  // ─────────────────────────── JUNIOR ───────────────────────────
  {
    id: "nj1",
    question: "Что такое Next.js и чем он отличается от чистого React?",
    difficulty: "junior",
    tags: ["basics", "ssr", "routing"],
    answer: `Next.js — это React-фреймворк с серверным рендерингом, файловым роутингом и встроенными оптимизациями.

Ключевые отличия от чистого React:
— Роутинг: встроен (файловая система), в React нужен react-router
— Рендеринг: SSR, SSG, ISR, CSR из коробки — в React только CSR
— Производительность: автоматическое разделение кода, оптимизация изображений
— API Routes: бэкенд-эндпоинты в том же проекте
— SEO: серверный HTML — поисковики индексируют сразу`,
    code: `// React (CRA) — только клиент
function App() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/data').then(r => r.json()).then(setData) }, []);
  return <div>{data?.title}</div>;
}

// Next.js Server Component — данные на сервере, нет useEffect
async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}`,
  },
  {
    id: "nj2",
    question: "В чём разница между App Router и Pages Router?",
    difficulty: "junior",
    tags: ["app-router", "pages-router", "routing"],
    answer: `Pages Router (до Next.js 13) — классический подход:
— Файлы в папке /pages
— Компоненты всегда Client Components
— Data fetching через getServerSideProps / getStaticProps
— _app.tsx для глобального layout

App Router (Next.js 13+) — современный подход:
— Файлы в папке /app
— Компоненты по умолчанию Server Components
— Data fetching напрямую в async-компонентах
— layout.tsx для вложенных layout'ов
— Поддержка Streaming, Parallel Routes, Intercepting Routes`,
    code: `// Pages Router
// pages/blog/[slug].tsx
export async function getServerSideProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}
export default function BlogPost({ post }) { ... }

// App Router
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);  // напрямую, без getServerSideProps
  return <article>{post.title}</article>;
}`,
  },
  {
    id: "nj3",
    question: "Что такое SSR, SSG, ISR и CSR? Когда использовать каждый?",
    difficulty: "junior",
    tags: ["ssr", "ssg", "isr", "csr", "rendering"],
    answer: `SSR (Server-Side Rendering) — HTML генерируется на сервере при каждом запросе.
+ Актуальные данные, хорошее SEO
- Медленнее, нагрузка на сервер
Когда: dashboard с персональными данными, корзина

SSG (Static Site Generation) — HTML генерируется один раз при билде.
+ Максимальная скорость, CDN-кешируется
- Данные устаревают до следующего билда
Когда: блог, документация, лендинги

ISR (Incremental Static Regeneration) — статика + автообновление по таймеру.
+ Скорость SSG + свежесть данных
Когда: интернет-магазин, новости

CSR (Client-Side Rendering) — рендеринг в браузере, данные через fetch.
+ Богатая интерактивность
- Плохое SEO, медленный первый экран
Когда: приватные страницы за авторизацией`,
    code: `// SSR (App Router) — динамический компонент
async function Page() {
  const data = await fetch(url, { cache: 'no-store' }); // не кешировать
  return <div>{data.name}</div>;
}

// SSG — статическая генерация
async function Page() {
  const data = await fetch(url); // кешируется по умолчанию (Next.js 14-)
  return <div>{data.name}</div>;
}

// ISR — ревалидация каждые 60 секунд
async function Page() {
  const data = await fetch(url, { next: { revalidate: 60 } });
  return <div>{data.name}</div>;
}`,
  },
  {
    id: "nj4",
    question: "Как работает файловый роутинг в App Router?",
    difficulty: "junior",
    tags: ["routing", "app-router", "file-system"],
    answer: `В App Router каждая папка в /app — это сегмент URL. Специальные файлы определяют поведение:

page.tsx    — UI страницы (делает маршрут публичным)
layout.tsx  — обёртка, сохраняется при навигации
loading.tsx — UI загрузки (Suspense fallback)
error.tsx   — UI ошибки (Error Boundary)
not-found.tsx — 404
route.ts    — API endpoint (Route Handler)

Динамические сегменты:
[slug]     — /blog/my-post → params.slug = "my-post"
[...slug]  — /blog/a/b/c → params.slug = ["a","b","c"]
(group)    — группировка без влияния на URL`,
    code: `app/
├── layout.tsx          → /  (корневой layout)
├── page.tsx            → /
├── about/
│   └── page.tsx        → /about
├── blog/
│   ├── page.tsx        → /blog
│   └── [slug]/
│       ├── page.tsx    → /blog/any-slug
│       └── loading.tsx → suspense при загрузке
└── (dashboard)/        → группа, не влияет на URL
    ├── layout.tsx      → общий layout для группы
    ├── analytics/page.tsx → /analytics
    └── settings/page.tsx  → /settings`,
  },
  {
    id: "nj5",
    question: "Зачем нужен компонент <Image> в Next.js?",
    difficulty: "junior",
    tags: ["image", "optimization", "performance"],
    answer: `<Image> — оптимизированная замена тегу <img> с автоматической оптимизацией:

1. Форматы: автоконвертация в WebP/AVIF
2. Lazy loading: загружается только когда видно
3. Размеры: предотвращает Cumulative Layout Shift (CLS)
4. Responsive: автоматические srcset для разных экранов
5. Кеширование: оптимизированные версии кешируются

Обязательные пропсы: src, alt, width+height (или fill)`,
    code: `import Image from 'next/image';

// Локальное изображение — размеры определяются автоматически
import avatar from './avatar.png';
<Image src={avatar} alt="Avatar" />

// Внешнее — нужны width/height или fill
<Image
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority  // загружать сразу (для изображений выше fold)
/>

// fill — занимает весь родительский контейнер
<div style={{ position: 'relative', height: '400px' }}>
  <Image src="/hero.jpg" alt="Hero" fill style={{ objectFit: 'cover' }} />
</div>`,
  },
  {
    id: "nj6",
    question: "Что делает компонент <Link> и зачем он нужен?",
    difficulty: "junior",
    tags: ["link", "navigation", "client-side"],
    answer: `<Link> — замена тегу <a> для навигации внутри приложения. Обеспечивает:

1. Client-side navigation — страница не перезагружается полностью
2. Prefetching — Next.js предзагружает страницу когда Link попадает в viewport
3. Scroll preservation — сохраняет позицию скролла
4. Активное состояние — можно отследить через usePathname()

Обычный <a> делает полную перезагрузку страницы — теряется состояние React.`,
    code: `import Link from 'next/link';

// Базовое использование
<Link href="/about">О нас</Link>

// С объектом
<Link href={{ pathname: '/blog', query: { page: 2 } }}>
  Страница 2
</Link>

// Отключить prefetching
<Link href="/heavy-page" prefetch={false}>...</Link>

// Активная ссылка
'use client';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
  const pathname = usePathname();
  return (
    <Link href={href} className={pathname === href ? 'active' : ''}>
      {children}
    </Link>
  );
}`,
  },
  {
    id: "nj7",
    question: "Что такое layout.tsx и как работают вложенные layouts?",
    difficulty: "junior",
    tags: ["layout", "app-router", "routing"],
    answer: `layout.tsx — компонент-обёртка, который сохраняется при навигации между страницами одного сегмента. В отличие от page.tsx, layout не перемонтируется.

Корневой layout (app/layout.tsx) обязателен — он должен содержать <html> и <body>.

Layouts вкладываются: каждый вложенный layout оборачивает дочерние страницы, сохраняя состояние (например, открытое меню).`,
    code: `// app/layout.tsx — корневой, обязателен
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx — вложенный
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />          {/* не перемонтируется при смене страницы */}
      <main>{children}</main>
    </div>
  );
}

// Результат для /dashboard/settings:
// RootLayout → DashboardLayout → SettingsPage`,
  },
  {
    id: "nj8",
    question: "Как создать API Route в Next.js App Router?",
    difficulty: "junior",
    tags: ["api", "route-handlers", "backend"],
    answer: `В App Router API-эндпоинты создаются через Route Handlers — файл route.ts в любой папке /app.

Именованные экспорты соответствуют HTTP-методам: GET, POST, PUT, DELETE, PATCH.
Принимают Request, возвращают Response (Web API).`,
    code: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.user.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`,
  },
  {
    id: "nj9",
    question: "Что такое loading.tsx и error.tsx в App Router?",
    difficulty: "junior",
    tags: ["loading", "error", "suspense", "app-router"],
    answer: `loading.tsx — автоматический Suspense boundary. Показывается пока page.tsx или layout.tsx загружают данные (async). Не нужно вручную оборачивать в <Suspense>.

error.tsx — автоматический Error Boundary. Перехватывает ошибки в сегменте (page.tsx и дочерних компонентах). Должен быть Client Component (имеет reset — функцию перезапуска).

Оба файла действуют на свой сегмент и все дочерние.`,
    code: `// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
  // показывается пока page.tsx ждёт данные
}

// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Что-то пошло не так!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
}`,
  },
  {
    id: "nj10",
    question: "Как работает generateStaticParams?",
    difficulty: "junior",
    tags: ["ssg", "dynamic-routes", "generateStaticParams"],
    answer: `generateStaticParams — аналог getStaticPaths из Pages Router. Возвращает список параметров для которых нужно предгенерировать статические страницы при билде.

Без generateStaticParams динамические маршруты рендерятся на сервере при каждом запросе (SSR). С ним — статически генерируются при билде.

Если запрошен параметр которого нет в списке — Next.js по умолчанию рендерит его на лету (можно изменить через dynamicParams = false).`,
    code: `// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return posts.map((post) => ({
    slug: post.slug,  // { slug: 'my-first-post' }, { slug: 'hello-world' }, ...
  }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  return <article>{post.title}</article>;
}

// Запретить страницы вне списка (вернёт 404)
export const dynamicParams = false;`,
  },

  // ─────────────────────────── MIDDLE ───────────────────────────
  {
    id: "nj11",
    question: "Server Components vs Client Components — ключевые различия",
    difficulty: "middle",
    tags: ["server-components", "client-components", "app-router"],
    answer: `Server Components (по умолчанию в App Router):
✓ Рендерятся на сервере, HTML отправляется клиенту
✓ Прямой доступ к БД, файловой системе, переменным окружения
✓ Не включаются в JS-бандл клиента → меньше размер
✗ Нет useState, useEffect, браузерных API
✗ Нет обработчиков событий (onClick и т.д.)

Client Components ("use client"):
✓ Интерактивность, хуки, browser API
✗ Включаются в бандл
✗ Нет прямого доступа к серверным ресурсам

Правило: держи как можно больше компонентов серверными, добавляй "use client" только там где нужна интерактивность. Server Component может рендерить Client Component, но не наоборот (напрямую).`,
    code: `// Server Component (по умолчанию)
// app/users/page.tsx
async function UsersPage() {
  const users = await db.user.findMany(); // прямой доступ к БД!
  return <UserList users={users} />;
}

// Client Component
// components/UserList.tsx
'use client';
import { useState } from 'react';

function UserList({ users }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.includes(search));

  return (
    <>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(u => <UserCard key={u.id} user={u} />)}
    </>
  );
}`,
  },
  {
    id: "nj12",
    question: "Что такое Server Actions и как их использовать?",
    difficulty: "middle",
    tags: ["server-actions", "forms", "mutations"],
    answer: `Server Actions — асинхронные функции с директивой "use server", которые выполняются на сервере. Позволяют делать мутации данных прямо из компонентов без написания отдельных API Routes.

Преимущества:
— Нет лишнего API эндпоинта
— Работают с нативными HTML-формами (даже без JS)
— Автоматически получают CSRF-защиту
— Поддерживают прогрессивное улучшение

Можно вызывать из Server и Client Components.`,
    code: `// app/todos/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;
  await db.todo.create({ data: { title } });
  revalidatePath('/todos');
}

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } });
  revalidatePath('/todos');
}

// Server Component — форма без JS
function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="title" required />
      <button type="submit">Добавить</button>
    </form>
  );
}

// Client Component — с useActionState для pending/error
'use client';
import { useActionState } from 'react';

function TodoFormClient() {
  const [state, action, isPending] = useActionState(createTodo, null);
  return (
    <form action={action}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? 'Сохраняю...' : 'Добавить'}
      </button>
    </form>
  );
}`,
  },
  {
    id: "nj13",
    question: "Как работает кеширование в Next.js 15?",
    difficulty: "middle",
    tags: ["caching", "fetch", "revalidate", "performance"],
    answer: `В Next.js 15 изменили дефолтное поведение кеша:

Next.js 14 и раньше: fetch кешируется по умолчанию
Next.js 15: fetch НЕ кешируется по умолчанию (как обычный браузерный fetch)

Уровни кеширования:
1. Request Memoization — один и тот же fetch() в одном рендере вызывается один раз
2. Data Cache — постоянный серверный кеш (revalidate: N)
3. Full Route Cache — закешированный HTML страницы на сервере
4. Router Cache — клиентский кеш навигации (prefetched страницы)

Управление кешем:
cache: 'no-store'   — всегда свежие данные
revalidate: 60      — обновлять каждые 60 сек (ISR)
revalidatePath()    — инвалидировать конкретный маршрут
revalidateTag()     — инвалидировать по тегу`,
    code: `// Нет кеша (Next.js 15 default = 'no-store')
fetch(url, { cache: 'no-store' });

// Постоянный кеш
fetch(url, { cache: 'force-cache' });

// ISR — обновлять каждые 60 сек
fetch(url, { next: { revalidate: 60 } });

// Тегированный кеш
fetch(url, { next: { tags: ['products'] } });

// В Server Action — инвалидировать тег
import { revalidateTag } from 'next/cache';
export async function updateProduct(id: string) {
  await db.product.update({ where: { id }, data: {...} });
  revalidateTag('products');  // все fetch с тегом 'products' обновятся
}

// unstable_cache для не-fetch данных
import { unstable_cache } from 'next/cache';
const getCachedUser = unstable_cache(
  async (id) => db.user.findUnique({ where: { id } }),
  ['user'],
  { revalidate: 3600, tags: ['users'] }
);`,
  },
  {
    id: "nj14",
    question: "Что такое Middleware в Next.js и для чего используется?",
    difficulty: "middle",
    tags: ["middleware", "edge", "auth", "routing"],
    answer: `Middleware — код который выполняется перед каждым запросом, до того как страница рендерится. Работает на Edge Runtime (быстро, близко к пользователю).

Типичные применения:
— Авторизация (редирект на /login если нет токена)
— A/B тестирование (разные версии для разных пользователей)
— Геолокация (редирект на локальную версию)
— Переписывание URL (rewrites)
— Добавление заголовков

Файл middleware.ts — в корне проекта (рядом с /app).
config.matcher — паттерны маршрутов где запускать middleware.`,
    code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard');

  // Редирект неавторизованных с защищённых страниц
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Редирект авторизованных со страниц входа
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};`,
  },
  {
    id: "nj15",
    question: "Что такое Parallel Routes и когда их использовать?",
    difficulty: "middle",
    tags: ["parallel-routes", "routing", "app-router"],
    answer: `Parallel Routes позволяют рендерить несколько страниц в одном layout одновременно. Каждый "слот" — папка с @ перед именем.

Применения:
— Разделённые dashboard панели (статистика + список)
— Модальные окна поверх текущей страницы
— Независимая навигация в разных частях UI
— Условный рендеринг (показать одно из нескольких)

Каждый слот независимо обновляется при навигации и имеет свой loading.tsx / error.tsx.`,
    code: `// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,  // @analytics слот
  team,       // @team слот
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {team}
      </div>
    </div>
  );
}

// Структура папок:
// app/dashboard/
//   layout.tsx
//   page.tsx
//   @analytics/
//     page.tsx        → рендерится в {analytics}
//     loading.tsx
//   @team/
//     page.tsx        → рендерится в {team}

// default.tsx — fallback если слот не активен
// app/dashboard/@analytics/default.tsx
export default function Default() { return null; }`,
  },
  {
    id: "nj16",
    question: "Что такое Intercepting Routes?",
    difficulty: "middle",
    tags: ["intercepting-routes", "modal", "routing"],
    answer: `Intercepting Routes позволяют перехватить маршрут и показать его в другом контексте — например открыть /photo/123 в модалке, не уходя со страницы /gallery.

Прямой переход по URL — полная страница. Переход через <Link> — модалка поверх текущей страницы.

Синтаксис папок:
(.) — перехватить маршрут того же уровня
(..) — уровнем выше
(..)(..) — два уровня выше
(...) — от корня app/`,
    code: `// Галерея с фото в модалке
app/
  layout.tsx
  gallery/
    page.tsx              → /gallery (сетка фото)
    @modal/
      default.tsx         → null (модалка закрыта)
      (.)photo/[id]/
        page.tsx          → перехватывает /photo/[id] → модалка
  photo/[id]/
    page.tsx              → /photo/123 напрямую → полная страница

// app/gallery/@modal/(.)photo/[id]/page.tsx
export default async function PhotoModal({ params }) {
  const photo = await getPhoto(params.id);
  return (
    <Modal>
      <Image src={photo.url} alt={photo.title} fill />
    </Modal>
  );
}

// При клике в gallery — модалка
// При прямом /photo/123 — полная страница фото`,
  },
  {
    id: "nj17",
    question: "Как работает Metadata API в Next.js?",
    difficulty: "middle",
    tags: ["metadata", "seo", "opengraph"],
    answer: `Metadata API — декларативный способ задавать <head> теги (title, description, og:* и т.д.) в App Router. Два подхода:

1. Статический объект metadata — для фиксированных данных
2. Функция generateMetadata — для динамических (данные из БД/API)

Metadata наследуется и мёрджится от родительских layouts к дочерним page. Дочерние переопределяют родительские.`,
    code: `// Статическая metadata
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О нас',
  description: 'Страница о нашей компании',
  openGraph: {
    title: 'О нас — Acme',
    images: ['/og-about.png'],
  },
};

// Динамическая metadata
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}

// Шаблон в layout
export const metadata: Metadata = {
  title: {
    template: '%s | Acme',  // "О нас | Acme"
    default: 'Acme',
  },
};`,
  },
  {
    id: "nj18",
    question: "Как выполнять data fetching в Server Components — лучшие практики",
    difficulty: "middle",
    tags: ["data-fetching", "server-components", "async"],
    answer: `В App Router data fetching максимально простой — async/await прямо в компоненте.

Лучшие практики:
1. Fetch как можно ближе к месту использования данных
2. Параллельный fetch через Promise.all для независимых запросов
3. Request memoization — одинаковые fetch() в одном рендере дедуплицируются
4. Не передавай данные через много уровней — fetch там где нужно

Антипаттерн: последовательные запросы ("водопад") когда они могут быть параллельными.`,
    code: `// ✗ Водопад — каждый ждёт предыдущего (медленно)
async function Page() {
  const user = await getUser();
  const posts = await getPosts(user.id);  // ждёт user
  const comments = await getComments(posts[0].id);  // ждёт posts
  ...
}

// ✓ Параллельный fetch (если данные независимы)
async function Page({ params }) {
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getRecentPosts(),
  ]);
  return <Profile user={user} posts={posts} />;
}

// ✓ Preload паттерн — начать fetch ещё до рендера
function UserPage({ params }) {
  preloadUser(params.id);  // запускаем сразу
  return <Suspense><UserProfile id={params.id} /></Suspense>;
}

async function preloadUser(id: string) {
  void getUser(id);  // React cache() запомнит результат
}`,
  },
  {
    id: "nj19",
    question: "Что такое динамические функции и как они влияют на рендеринг?",
    difficulty: "middle",
    tags: ["dynamic", "cookies", "headers", "searchParams"],
    answer: `Некоторые функции делают маршрут динамическим — он будет рендериться при каждом запросе (не кешироваться статически):

— cookies() — читает cookie запроса
— headers() — читает заголовки запроса
— searchParams (пропс page.tsx) — параметры строки запроса
— connection() — принудительно динамический

Если страница не использует эти функции и все fetch кешированы — она может быть статически сгенерирована.

В Next.js 15 можно использовать "use cache" для изоляции динамических данных.`,
    code: `// Эта страница — ДИНАМИЧЕСКАЯ (из-за cookies())
import { cookies } from 'next/headers';

async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';
  return <div data-theme={theme}>...</div>;
}

// searchParams делает page.tsx динамическим
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const results = q ? await search(q) : [];
  return <SearchResults results={results} />;
}

// Явно задать статический рендеринг (игнорировать динамику)
export const dynamic = 'force-static';
// или динамический
export const dynamic = 'force-dynamic';`,
  },
  {
    id: "nj20",
    question: "Как реализовать защищённые маршруты с авторизацией?",
    difficulty: "middle",
    tags: ["auth", "middleware", "protected-routes"],
    answer: `Есть два основных подхода:

1. Middleware (рекомендуется для большинства случаев) — перехватывает запрос до рендера, редиректит неавторизованных. Выполняется на Edge — очень быстро.

2. Server Component проверка — проверить сессию внутри layout.tsx и редиректить. Подходит для тонкой гранулярности.

Нельзя защищать маршруты только на клиенте — данные уже придут в HTML.`,
    code: `// Подход 1: Middleware
// middleware.ts
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Подход 2: Server Component в layout
// app/dashboard/layout.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) redirect('/login');

  return <div>{children}</div>;
}`,
  },
  {
    id: "nj21",
    question: "Как работает on-demand revalidation через revalidatePath и revalidateTag?",
    difficulty: "middle",
    tags: ["revalidation", "cache", "isr"],
    answer: `On-demand revalidation инвалидирует кеш немедленно — не по таймеру а по событию (обновление данных, вебхук от CMS).

revalidatePath('/blog') — инвалидирует кеш конкретного маршрута
revalidateTag('posts') — инвалидирует все fetch с тегом 'posts'

Вызываются в Server Actions, Route Handlers или серверном коде.

revalidateTag — предпочтительный подход: инвалидирует только нужные данные, не весь маршрут.`,
    code: `// Помечаем fetch тегом
async function getPosts() {
  const res = await fetch('/api/posts', {
    next: { tags: ['posts'] }
  });
  return res.json();
}

// Server Action — после обновления данных
'use server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function updatePost(id: string, data: PostData) {
  await db.post.update({ where: { id }, data });

  revalidateTag('posts');          // все данные с тегом 'posts'
  revalidatePath('/blog');          // страница /blog
  revalidatePath('/blog/[slug]', 'page'); // все [slug] страницы
}

// Route Handler — для вебхука от CMS
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { tag, secret } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}`,
  },

  // ─────────────────────────── SENIOR ───────────────────────────
  {
    id: "nj22",
    question: "Что такое Streaming и как работает с Suspense?",
    difficulty: "senior",
    tags: ["streaming", "suspense", "performance"],
    answer: `Streaming — отправка HTML по частям по мере готовности данных. Браузер начинает рендерить страницу не дожидаясь самых медленных данных.

Принцип работы:
1. Next.js сразу отправляет статический shell (layout, заголовок)
2. Медленные части обёрнуты в <Suspense> — сначала показывается fallback
3. Когда данные готовы — React стримит их HTML и заменяет fallback

Преимущества:
— TTFB (Time to First Byte) не зависит от самого медленного запроса
— Пользователь видит контент быстрее
— Улучшается LCP (Largest Contentful Paint)`,
    code: `// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <Header />  {/* рендерится сразу */}

      <Suspense fallback={<RevenueCardSkeleton />}>
        <RevenueCard />  {/* медленный запрос */}
      </Suspense>

      <Suspense fallback={<TransactionsTableSkeleton />}>
        <TransactionsTable />  {/* другой медленный запрос */}
      </Suspense>
    </div>
  );
}

// RevenueCard — Server Component с медленным fetch
async function RevenueCard() {
  const revenue = await fetchRevenue(); // медленно
  return <Card data={revenue} />;
}

// Результат: header + skeleton сразу,
// потом карточки по мере готовности`,
  },
  {
    id: "nj23",
    question: "Что такое Partial Prerendering (PPR)?",
    difficulty: "senior",
    tags: ["ppr", "performance", "rendering", "experimental"],
    answer: `PPR — экспериментальная возможность Next.js, которая объединяет преимущества SSG и SSR в одном маршруте.

Принцип:
1. Статический shell страницы (layout, статический контент) — предгенерируется при билде и отдаётся мгновенно с CDN
2. Динамические части (обёрнуты в Suspense) — стримятся с сервера

Это компромисс: скорость статики + свежесть динамики на одной странице. Не нужно выбирать между SSG и SSR.

Статус: experimental в Next.js 14/15, включается в next.config.`,
    code: `// next.config.ts
const nextConfig = {
  experimental: {
    ppr: 'incremental',  // или true для всех маршрутов
  },
};

// app/shop/page.tsx
export const experimental_ppr = true;

import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <div>
      {/* Статическая часть — в HTML при билде */}
      <Header />
      <ProductCategories />

      {/* Динамическая часть — стримится при запросе */}
      <Suspense fallback={<CartSkeleton />}>
        <Cart />  {/* читает cookies() → динамический */}
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />  {/* персональные → динамические */}
      </Suspense>
    </div>
  );
}`,
  },
  {
    id: "nj24",
    question: "Edge Runtime vs Node.js Runtime — разница и применение",
    difficulty: "senior",
    tags: ["edge", "runtime", "performance", "middleware"],
    answer: `Node.js Runtime (по умолчанию):
— Полный Node.js API (fs, crypto, Buffer и т.д.)
— Доступ к npm пакетам без ограничений
— Запускается в регионе деплоя (может быть далеко от пользователя)
— Холодный старт: сотни мс

Edge Runtime:
— Ограниченный API (Web APIs: fetch, crypto, URL, Request/Response)
— Запускается в точках присутствия CDN, близко к пользователю
— Холодный старт: ~0мс (всегда "тёплый")
— Ограничение: нет Node.js модулей, файловой системы, Prisma

Middleware всегда работает на Edge Runtime.
API Routes и Server Components — по умолчанию Node.js.`,
    code: `// Edge Runtime для Route Handler
// app/api/geo/route.ts
export const runtime = 'edge';

export function GET(request: Request) {
  // Гео из заголовков Vercel/Cloudflare
  const country = request.headers.get('x-vercel-ip-country') ?? 'US';
  return Response.json({ country });
}

// Edge Middleware
// middleware.ts
import { NextResponse } from 'next/server';
// Автоматически Edge — нельзя использовать Prisma/fs

export function middleware(req: NextRequest) {
  const country = req.geo?.country ?? 'US';
  if (country === 'RU') {
    return NextResponse.rewrite(new URL('/ru', req.url));
  }
  return NextResponse.next();
}

// Явно Node.js Runtime
// app/api/heavy/route.ts
export const runtime = 'nodejs'; // по умолчанию`,
  },
  {
    id: "nj25",
    question: "Как оптимизировать Core Web Vitals в Next.js приложении?",
    difficulty: "senior",
    tags: ["performance", "cwv", "lcp", "cls", "fid"],
    answer: `Ключевые метрики и как их улучшить в Next.js:

LCP (Largest Contentful Paint) — скорость отрисовки главного элемента:
— priority на главное изображение (<Image priority />)
— Streaming для быстрого TTFB
— preloadResource для критических ресурсов

CLS (Cumulative Layout Shift) — смещение элементов:
— Всегда задавать width/height для <Image>
— Резервировать место для динамического контента (skeleton)
— font-display: optional или next/font

FID/INP — интерактивность:
— Уменьшить JS-бандл: Server Components, dynamic imports
— Избегать тяжёлых задач в главном потоке

Бандл: @next/bundle-analyzer для анализа`,
    code: `// 1. Приоритет для hero-изображения
<Image src="/hero.jpg" alt="Hero" fill priority />

// 2. next/font — нет сдвига шрифтов (CLS)
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// 3. Динамический импорт тяжёлых компонентов
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // только на клиенте (например canvas)
});

// 4. Разделить большие Server Actions
// ✗ один огромный бандл
import { heavyLib } from 'heavy-library';

// ✓ только нужное
const { specificFunction } = await import('heavy-library');

// 5. Script для сторонних скриптов
import Script from 'next/script';
<Script src="/analytics.js" strategy="lazyOnload" />`,
  },
  {
    id: "nj26",
    question: "Что такое React cache() и как работает request memoization?",
    difficulty: "senior",
    tags: ["cache", "memoization", "server-components", "performance"],
    answer: `React cache() — мемоизирует результат функции в рамках одного серверного рендера (одного запроса). Если та же функция с теми же аргументами вызывается несколько раз в одном рендере — второй раз возвращает кешированный результат.

Request Memoization — Next.js автоматически дедуплицирует одинаковые fetch() запросы в рамках одного рендера. Это позволяет вызывать fetch в нескольких компонентах без дублирования запросов.

Важно: memoization работает только в рамках одного запроса, не между запросами. Для долгосрочного кеша — Data Cache (fetch с revalidate).`,
    code: `import { cache } from 'react';

// cache() для DB запросов (не fetch)
export const getUser = cache(async (id: string) => {
  console.log('DB запрос для:', id);  // вызывается только 1 раз!
  return db.user.findUnique({ where: { id } });
});

// В нескольких компонентах в одном рендере — только 1 запрос
async function Header() {
  const user = await getUser('123');  // запрос к БД
  return <Avatar user={user} />;
}

async function Sidebar() {
  const user = await getUser('123');  // из кеша!
  return <UserMenu user={user} />;
}

// fetch автоматически мемоизируется Next.js
async function ComponentA() {
  const data = await fetch('/api/products');  // запрос
  ...
}
async function ComponentB() {
  const data = await fetch('/api/products');  // из memoization
  ...
}`,
  },
  {
    id: "nj27",
    question: "Как настроить i18n в Next.js App Router?",
    difficulty: "senior",
    tags: ["i18n", "localization", "middleware", "routing"],
    answer: `В App Router нет встроенного i18n (как в Pages Router). Стандартный подход — папка [locale] + middleware.

Шаги:
1. Структура: app/[locale]/page.tsx
2. Middleware — детектирует язык браузера, редиректит на /en или /uk
3. Словари — JSON-файлы с переводами
4. Утилита для переводов — простая функция или библиотека (next-intl)

next-intl — самая популярная библиотека: type-safe переводы, работает с Server и Client Components, URL routing.`,
    code: `// Структура
// app/[locale]/
//   layout.tsx
//   page.tsx

// middleware.ts
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'uk'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasLocale = locales.some(l =>
    pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`
  );

  if (hasLocale) return;

  // Детектировать язык браузера
  const headers = { 'accept-language': request.headers.get('accept-language') ?? 'en' };
  const languages = new Negotiator({ headers }).languages();
  const locale = match(languages, locales, 'en');

  return NextResponse.redirect(new URL(\`/\${locale}\${pathname}\`, request.url));
}

// С next-intl (проще)
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({
  locales: ['en', 'uk'],
  defaultLocale: 'en',
});`,
  },
  {
    id: "nj28",
    question: "Как работает Turbopack и чем отличается от Webpack?",
    difficulty: "senior",
    tags: ["turbopack", "webpack", "bundler", "performance"],
    answer: `Turbopack — новый бандлер написанный на Rust, разработанный Vercel. В Next.js 15 стал стабильным для dev-режима.

Ключевые отличия от Webpack:
— Скорость: Rust вместо JavaScript — в 10x+ быстрее HMR
— Инкрементальная компиляция: пересобирает только изменившиеся модули (и их зависимости)
— Нативный параллелизм: использует все CPU ядра
— Lazy bundling: собирает только то что реально импортируется

Статус в Next.js 15:
— next dev --turbopack — стабильно
— next build — в разработке (пока webpack по умолчанию)

Webpack по-прежнему поддерживается и используется для билда.`,
    code: `// Включить Turbopack для dev
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}

// или в next.config.ts
const nextConfig = {
  // Turbopack конфигурация (Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      'underscore': 'lodash',
    },
  },
};

// Webpack config (если нужны кастомные плагины — пока только webpack)
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new MyWebpackPlugin());
    return config;
  },
};`,
  },
  {
    id: "nj29",
    question: "Как реализовать оптимистичные обновления UI с Server Actions?",
    difficulty: "senior",
    tags: ["optimistic-ui", "server-actions", "useOptimistic"],
    answer: `Оптимистичное обновление — UI обновляется мгновенно, до получения ответа сервера. Если сервер вернул ошибку — откатываемся назад.

В React 19 / Next.js — хук useOptimistic. Принимает текущее состояние и функцию-редьюсер. addOptimistic() обновляет UI сразу, состояние откатывается автоматически после завершения action.`,
    code: `'use client';
import { useOptimistic } from 'react';
import { toggleLike } from './actions';

interface Post {
  id: string;
  likes: number;
  likedByMe: boolean;
}

function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, addOptimistic] = useOptimistic(
    post,
    (state: Post, liked: boolean) => ({
      ...state,
      likedByMe: liked,
      likes: liked ? state.likes + 1 : state.likes - 1,
    })
  );

  async function handleLike() {
    addOptimistic(!optimisticPost.likedByMe); // обновляем UI сразу

    try {
      await toggleLike(post.id); // запрос к серверу
    } catch {
      // useOptimistic автоматически откатит состояние при ошибке
    }
  }

  return (
    <button onClick={handleLike}>
      {optimisticPost.likedByMe ? '❤️' : '🤍'} {optimisticPost.likes}
    </button>
  );
}`,
  },
  {
    id: "nj30",
    question: "Как правильно обрабатывать ошибки в Server Actions?",
    difficulty: "senior",
    tags: ["error-handling", "server-actions", "zod", "validation"],
    answer: `Никогда не бросай ошибки из Server Actions (throw) — они не перехватываются клиентом как ожидается и могут утечь серверные детали.

Правильный подход — возвращать объект с ошибкой:

1. Возвращать { success, error } из action
2. Использовать useActionState для обработки состояния
3. Валидация с Zod до обращения к БД
4. redirect() и notFound() работают как исключения — они намеренные и не ошибки`,
    code: `// actions.ts
'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const CreatePostSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
});

export async function createPost(prevState: unknown, formData: FormData) {
  // Валидация
  const validated = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await db.post.create({ data: validated.data });
  } catch (e) {
    return { success: false, errors: { _form: ['Ошибка сервера'] } };
  }

  redirect('/blog');  // redirect — не ошибка, намеренное действие
}

// Компонент с useActionState
'use client';
import { useActionState } from 'react';

function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPost, null);

  return (
    <form action={action}>
      <input name="title" />
      {state?.errors?.title && <p>{state.errors.title[0]}</p>}
      <textarea name="content" />
      <button disabled={isPending}>Создать</button>
    </form>
  );
}`,
  },
];
