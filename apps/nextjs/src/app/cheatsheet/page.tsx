"use client";

import { useState } from "react";
import Link from "next/link";

type Group = "all" | "routing" | "rendering" | "data" | "performance";

interface Concept {
  id: string;
  name: string;
  group: Exclude<Group, "all">;
  summary: string;
  signature: string;
  input: string;
  output: string;
  example: string;
}

const concepts: Concept[] = [
  // ── Routing ────────────────────────────────────────────────────────────────
  {
    id: "file-conventions",
    name: "File Conventions",
    group: "routing",
    summary: "Специальные файлы в app/ директории определяют сегменты роутера",
    signature: "app/[segment]/page.tsx | layout.tsx | loading.tsx | error.tsx | not-found.tsx",
    input: "app/dashboard/page.tsx",
    output: "Route: /dashboard",
    example: `app/
  layout.tsx          // корневой layout (всегда рендерится)
  page.tsx            // маршрут /
  loading.tsx         // Suspense fallback для сегмента
  error.tsx           // граница ошибок ("use client" required)
  not-found.tsx       // 404 для сегмента
  dashboard/
    layout.tsx        // вложенный layout
    page.tsx          // маршрут /dashboard
    [id]/
      page.tsx        // маршрут /dashboard/123`,
  },
  {
    id: "dynamic-routes",
    name: "Dynamic Routes",
    group: "routing",
    summary: "Динамические сегменты: [slug], [...slug], [[...slug]]",
    signature: "app/[slug]/page.tsx → params: { slug: string }",
    input: "app/blog/[slug]/page.tsx",
    output: "/blog/hello-world → params.slug = 'hello-world'",
    example: `// Single segment
// app/blog/[slug]/page.tsx
export default function Post({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>;
}

// Catch-all: /docs/a/b/c → params.slug = ['a','b','c']
// app/docs/[...slug]/page.tsx

// Optional catch-all: / and /a/b/c both match
// app/docs/[[...slug]]/page.tsx

// generateStaticParams — pre-render at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}`,
  },
  {
    id: "parallel-routes",
    name: "Parallel & Intercepting Routes",
    group: "routing",
    summary: "@slot — одновременный рендер нескольких страниц в одном layout",
    signature: "app/@modal/(.)photo/[id]/page.tsx",
    input: "layout.tsx props: { children, modal }",
    output: "Два независимых сегмента в одном layout",
    example: `// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}   {/* рендерится параллельно */}
    </>
  );
}

// app/@modal/(.)photo/[id]/page.tsx
// (.) — перехватывает /photo/[id] на том же уровне
// (..) — на уровень выше
// (...) — с корня

export default function PhotoModal({ params }: { params: { id: string } }) {
  return <Dialog><Photo id={params.id} /></Dialog>;
}`,
  },
  {
    id: "middleware",
    name: "Middleware",
    group: "routing",
    summary: "Выполняется перед каждым запросом — auth, redirect, rewrite, headers",
    signature: "middleware.ts → export default function middleware(req: NextRequest)",
    input: "NextRequest с URL, cookies, headers",
    output: "NextResponse.next() | redirect() | rewrite()",
    example: `// middleware.ts (корень проекта)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Добавляем заголовок
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};`,
  },
  // ── Rendering ──────────────────────────────────────────────────────────────
  {
    id: "server-components",
    name: "Server Components",
    group: "rendering",
    summary: "По умолчанию в app/ — async, прямой доступ к БД/FS, 0 JS в бандле",
    signature: "export default async function Page() { const data = await fetch(...) }",
    input: "Нет хуков, нет event handlers, нет browser API",
    output: "HTML + RSC payload, нет client-side JS",
    example: `// Прямой запрос к БД — без API route
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany();   // работает на сервере

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

// Доступ к cookies/headers внутри Server Component
import { cookies, headers } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
}`,
  },
  {
    id: "client-components",
    name: "Client Components",
    group: "rendering",
    summary: "'use client' — хуки, события, browser API, интерактивность",
    signature: '"use client" directive at the top of the file',
    input: "useState, useEffect, onClick, window, localStorage...",
    output: "Гидратируется в браузере, входит в JS-бандл",
    example: `"use client";

import { useState } from "react";

// Client Component — может принимать Server Component как children
export function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}

// ✓ Паттерн: передавай данные через props, не импортируй серверный код
// app/page.tsx (Server) → <Counter initialCount={await getCount()} />

// ✗ Нельзя импортировать server-only модули в Client Component
// import { db } from "@/lib/db"  // ошибка`,
  },
  {
    id: "rendering-strategies",
    name: "Rendering Strategies",
    group: "rendering",
    summary: "SSG / SSR / ISR / PPR — контролируются через fetch и route segment config",
    signature: "fetch(url, { cache, next: { revalidate } }) | export const dynamic",
    input: "cache: 'force-cache' | 'no-store' | revalidate: number",
    output: "Static | Dynamic | Incremental | Partial Prerendering",
    example: `// SSG — статика, кешируется навсегда (Next.js 15: default)
fetch(url, { cache: "force-cache" });

// SSR — каждый запрос
fetch(url, { cache: "no-store" });
// или:
export const dynamic = "force-dynamic";

// ISR — обновляется каждые N секунд
fetch(url, { next: { revalidate: 60 } });
// или segment-level:
export const revalidate = 60;

// PPR (Partial Prerendering) — статическая оболочка + динамические дырки
// next.config.ts
export default { experimental: { ppr: true } };

// Динамическая часть оборачивается в Suspense
<Suspense fallback={<Skeleton />}>
  <DynamicCart />   {/* рендерится по запросу */}
</Suspense>`,
  },
  {
    id: "streaming",
    name: "Streaming & Suspense",
    group: "rendering",
    summary: "loading.tsx и <Suspense> стримят HTML по частям — UI не блокируется",
    signature: "<Suspense fallback={<Skeleton />}><AsyncComponent /></Suspense>",
    input: "Медленные async Server Components",
    output: "Instant shell + progressive hydration",
    example: `// app/dashboard/loading.tsx — автоматический Suspense для сегмента
export default function Loading() {
  return <DashboardSkeleton />;
}

// Гранулярный контроль через <Suspense>
export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      {/* Быстрое */}
      <StatsCard />

      {/* Медленное — не блокирует рендер страницы */}
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChart />   {/* async Server Component */}
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <LatestInvoices />
      </Suspense>
    </main>
  );
}`,
  },
  // ── Data ───────────────────────────────────────────────────────────────────
  {
    id: "fetch-caching",
    name: "fetch & Caching",
    group: "data",
    summary: "Next.js расширяет fetch — встроенное дедуплирование и теги для ревалидации",
    signature: "fetch(url, { cache, next: { revalidate, tags } })",
    input: "URL + опции кеша",
    output: "Кешированный/свежий ответ + автодедупликация в рамках рендера",
    example: `// Дедупликация: один и тот же запрос вызывается 2 раза
// в рамках одного render — реально выполняется один раз
async function getUser(id: string) {
  return fetch(\`/api/users/\${id}\`, {
    next: { tags: [\`user-\${id}\`] },   // тег для on-demand revalidation
  }).then(r => r.json());
}

// On-demand revalidation по тегу (из Server Action)
import { revalidateTag } from "next/cache";
revalidateTag(\`user-\${id}\`);

// По пути
import { revalidatePath } from "next/cache";
revalidatePath("/dashboard/users");

// react cache() — дедупликация для не-fetch запросов
import { cache } from "react";
const getUser = cache(async (id: string) => db.user.findUnique({ where: { id } }));`,
  },
  {
    id: "server-actions",
    name: "Server Actions",
    group: "data",
    summary: "Async-функции с 'use server' — вызываются с клиента, выполняются на сервере",
    signature: '"use server" | async function action(formData: FormData)',
    input: "FormData или обычные аргументы с клиента",
    output: "Мутация + revalidation без API route",
    example: `// actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.post.create({ data: { title } });
  revalidatePath("/posts");
}

// Использование в форме (Server Component)
export default function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}

// useActionState — pending + error в Client Component
"use client";
import { useActionState } from "react";
const [state, formAction, isPending] = useActionState(createPost, null);`,
  },
  {
    id: "route-handlers",
    name: "Route Handlers",
    group: "data",
    summary: "app/api/**/route.ts — REST endpoints, поддерживают все HTTP-методы",
    signature: "export async function GET/POST/PUT/DELETE(req: Request)",
    input: "Request с URL, body, headers",
    output: "Response (JSON, text, redirect, stream...)",
    example: `// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 10);
  const users = await db.user.findMany({ take: limit });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await db.user.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}`,
  },
  // ── Performance ────────────────────────────────────────────────────────────
  {
    id: "image-component",
    name: "Image Component",
    group: "performance",
    summary: "<Image> — автоматический WebP/AVIF, lazy loading, CLS prevention",
    signature: '<Image src alt width height | fill priority />',
    input: "src: string | StaticImport, alt, width + height или fill",
    output: "Оптимизированный <img> с srcSet, sizes, loading=lazy",
    example: `import Image from "next/image";

// Фиксированный размер
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority            // LCP-изображение — не lazy
/>

// Fill — заполняет родительский контейнер (position: relative)
<div className="relative h-64 w-full">
  <Image
    src={product.imageUrl}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>

// Статический импорт — size известен автоматически
import avatar from "@/public/avatar.png";
<Image src={avatar} alt="Avatar" placeholder="blur" />`,
  },
  {
    id: "metadata-api",
    name: "Metadata API",
    group: "performance",
    summary: "Статический объект metadata или async generateMetadata для динамического SEO",
    signature: "export const metadata: Metadata | export async function generateMetadata()",
    input: "params, searchParams, parent metadata",
    output: "<title>, <meta>, <link rel='canonical'>, Open Graph",
    example: `// app/layout.tsx — статические метаданные
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | My App", default: "My App" },
  description: "Приложение для...",
  openGraph: {
    images: ["/og-image.jpg"],
  },
};

// app/blog/[slug]/page.tsx — динамические
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}`,
  },
  {
    id: "link-prefetch",
    name: "Link & Navigation",
    group: "performance",
    summary: "<Link> автоматически prefetch-ит страницы в viewport — SPA-навигация без reload",
    signature: '<Link href="/path" prefetch={true | false} replace scroll>',
    input: "href: string | UrlObject, prefetch, replace, scroll",
    output: "SPA-переход + prefetched RSC payload",
    example: `import Link from "next/link";
import { useRouter } from "next/navigation";

// Базовое использование
<Link href="/dashboard">Dashboard</Link>

// Программная навигация
const router = useRouter();
router.push("/dashboard");
router.replace("/login");   // без записи в history
router.back();

// Prefetch отключён (большие страницы, требующие авторизации)
<Link href="/admin" prefetch={false}>Admin</Link>

// Динамический href
<Link href={{ pathname: "/blog/[slug]", query: { slug: post.slug } }}>
  {post.title}
</Link>

// usePathname — активный пункт меню
import { usePathname } from "next/navigation";
const pathname = usePathname();
const isActive = pathname === href;`,
  },
];

const groupMeta: Record<Exclude<Group, "all">, { label: string; color: string; bg: string; border: string }> = {
  routing:     { label: "Routing",     color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200" },
  rendering:   { label: "Rendering",   color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  data:        { label: "Data",        color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  performance: { label: "Performance", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
};

export default function NextJsCheatsheetPage() {
  const [group, setGroup] = useState<Group>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = concepts.filter((c) => {
    const matchGroup = group === "all" || c.group === group;
    const s = search.toLowerCase();
    const matchSearch = !s || c.name.toLowerCase().includes(s) || c.summary.toLowerCase().includes(s);
    return matchGroup && matchSearch;
  });

  return (
    <div>
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 px-6 py-20 text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 40%, #6366f1 1px, transparent 1px), radial-gradient(circle at 75% 60%, #818cf8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              ← Вопросы
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              ⚡ Quiz
            </Link>
          </div>

          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-xl bg-white/10 px-3 py-1.5 text-2xl font-black tracking-tight">N</span>
            <h1 className="text-5xl font-black tracking-tight">Шпаргалка</h1>
          </div>
          <p className="mt-3 max-w-xl text-lg text-white/70">
            14 ключевых концепций Next.js 15 — роутинг, рендеринг, данные и оптимизация.
            Держи под рукой на собесе.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", "routing", "rendering", "data", "performance"] as Group[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g)}
                className={[
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-all",
                  group === g
                    ? "bg-white text-slate-800 shadow"
                    : "bg-white/10 text-white hover:bg-white/20",
                ].join(" ")}
              >
                {g === "all" ? "Все" : groupMeta[g].label}
                <span className="ml-1.5 opacity-70">
                  {g === "all" ? concepts.length : concepts.filter((c) => c.group === g).length}
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
          className="mb-6 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm shadow-sm outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-400"
        />

        <div className="space-y-3">
          {filtered.map((c) => {
            const meta = groupMeta[c.group];
            const isOpen = openId === c.id;

            return (
              <div
                key={c.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${isOpen ? meta.border : "border-gray-200"}`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : c.id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-base font-black text-gray-900">{c.name}</code>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{c.summary}</p>
                  </div>
                  <svg
                    className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-gray-100 px-5 pb-6 pt-4">
                    <div>
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">Сигнатура</p>
                      <pre className="overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 text-xs text-gray-100">
                        <code>{c.signature}</code>
                      </pre>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className={`rounded-xl border p-3 ${meta.border} ${meta.bg}`}>
                        <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${meta.color}`}>Вход / Условие</p>
                        <code className="text-xs text-gray-700">{c.input}</code>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Результат</p>
                        <code className="text-xs font-semibold text-gray-900">{c.output}</code>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-400">Пример</p>
                      <pre className="overflow-x-auto rounded-xl bg-gray-900 p-5 text-xs leading-relaxed text-gray-100">
                        <code>{c.example}</code>
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
