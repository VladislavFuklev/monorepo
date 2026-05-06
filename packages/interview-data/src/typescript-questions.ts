import type { Question } from "./types";

export const typescriptQuestions: Question[] = [
  {
    id: "ts1",
    question: "В чём разница между type и interface?",
    difficulty: "junior",
    tags: ["type", "interface", "basics"],
    answer: `Оба описывают форму объекта, но есть ключевые отличия:

interface:
• Может быть расширен через extends и объединён через declaration merging
• Только для объектов (нельзя описать примитив или union)
• Лучше подходит для публичных API библиотек (merging позволяет пользователям расширять)

type:
• Может описывать любой тип: примитивы, union, tuple, mapped types
• Нет declaration merging
• Более мощный и гибкий для сложных типов

Рекомендация: interface для объектов и классов, type для всего остального.`,
    code: `// Только interface поддерживает declaration merging
interface User { name: string; }
interface User { age: number; }  // OK — User теперь { name, age }

// Только type поддерживает union и tuple
type ID = string | number;
type Pair = [string, number];
type Nullable<T> = T | null;

// Оба расширяются
interface Admin extends User { role: string; }
type Admin = User & { role: string; };`,
  },
  {
    id: "ts2",
    question: "Чем отличаются any, unknown и never?",
    difficulty: "junior",
    tags: ["any", "unknown", "never", "type safety"],
    answer: `any — отключает проверку типов полностью. Можно делать что угодно. Избегай в production-коде.

unknown — типобезопасная альтернатива any. Значение можно получить, но нельзя использовать без проверки типа (narrowing). Используй для внешних данных (JSON, ответы API).

never — тип, который никогда не существует. Функция с never никогда не возвращает значение (бросает ошибку или бесконечный цикл). Используется в exhaustive checks.`,
    code: `// any — небезопасно
const x: any = "hello";
x.toFixed(2); // TS молчит, но runtime error

// unknown — безопасно
const y: unknown = JSON.parse(data);
y.toFixed(2);           // ошибка TS!
if (typeof y === 'number') y.toFixed(2); // OK

// never — exhaustive check
type Shape = 'circle' | 'square';
function area(shape: Shape): number {
  switch (shape) {
    case 'circle':  return Math.PI;
    case 'square':  return 1;
    default:
      const _exhaustive: never = shape; // ошибка если добавим новый Shape и забудем обработать
      throw new Error('Unknown shape');
  }
}`,
  },
  {
    id: "ts3",
    question: "Что такое дженерики (Generics)?",
    difficulty: "middle",
    tags: ["generics", "reusability", "type parameters"],
    answer: `Дженерики — параметрический полиморфизм: пишешь код один раз, он работает с любым типом при сохранении типобезопасности. Тип становится параметром.

Без дженериков пришлось бы писать отдельные функции для каждого типа или использовать any (теряя типизацию).

Дженерики можно ограничивать через extends: T extends string означает "T должен быть подтипом string".`,
    code: `// Без дженериков — дублирование или any
function firstNumber(arr: number[]): number { return arr[0]; }
function firstString(arr: string[]): string { return arr[0]; }

// С дженериком — один раз, для любого типа
function first<T>(arr: T[]): T {
  return arr[0];
}

const n = first([1, 2, 3]);    // T = number
const s = first(['a', 'b']);   // T = string

// Ограничение дженерика
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const name = getProperty({ name: 'Alice', age: 30 }, 'name'); // string
// getProperty(obj, 'missing') — ошибка TS`,
  },
  {
    id: "ts4",
    question: "Utility types: Partial, Required, Pick, Omit, Record, Readonly",
    difficulty: "middle",
    tags: ["utility types", "Partial", "Pick", "Omit", "Record"],
    answer: `Встроенные дженерики для трансформации типов:

Partial<T> — все поля опциональны
Required<T> — все поля обязательны
Readonly<T> — все поля readonly (нельзя мутировать)
Pick<T, K> — выбрать только поля K из T
Omit<T, K> — убрать поля K из T
Record<K, V> — объект с ключами K и значениями V
NonNullable<T> — убрать null и undefined из T
ReturnType<F> — тип возвращаемого значения функции F`,
    code: `interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string }

type UserWithoutPassword = Omit<User, 'password'>;
// { id, name, email }

type UserUpdate = Partial<Omit<User, 'id'>>;
// { name?: string; email?: string; password?: string }

type UserMap = Record<string, User>;
// { [key: string]: User }

type ReturnType<T extends (...args: unknown[]) => unknown> =
  T extends (...args: unknown[]) => infer R ? R : never;`,
  },
  {
    id: "ts5",
    question: "Что такое type narrowing / type guards?",
    difficulty: "middle",
    tags: ["narrowing", "type guards", "typeof", "instanceof"],
    answer: `Narrowing — сужение типа в определённой ветке кода. TypeScript анализирует условия и сужает тип переменной.

Способы сужения:
• typeof — для примитивов
• instanceof — для классов
• in — для проверки свойства объекта
• Discriminated union — поле-дискриминатор
• User-defined type guard — функция с is

TypeScript делает это автоматически через control flow analysis.`,
    code: `// typeof
function format(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase(); // string
  return value.toFixed(2); // number
}

// instanceof
function process(value: Date | string) {
  if (value instanceof Date) return value.getFullYear(); // Date
  return new Date(value).getFullYear(); // string
}

// in
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(animal: Cat | Dog) {
  if ('meow' in animal) animal.meow(); // Cat
  else animal.bark(); // Dog
}

// User-defined type guard
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value;
}`,
  },
  {
    id: "ts6",
    question: "Что такое discriminated unions?",
    difficulty: "middle",
    tags: ["discriminated union", "union types", "pattern matching"],
    answer: `Discriminated union — union-тип, где каждый вариант имеет общее поле-дискриминатор (литеральный тип). TypeScript использует его для автоматического сужения.

Это основа type-safe state machines. Вместо одного объекта с кучей опциональных полей — отдельные типы для каждого состояния.`,
    code: `type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render(state: RequestState<User>) {
  switch (state.status) {
    case 'idle':    return <Placeholder />;
    case 'loading': return <Spinner />;
    case 'success': return <Profile user={state.data} />;   // data доступен
    case 'error':   return <Error msg={state.error} />;     // error доступен
  }
}

// Нельзя обратиться к data в ветке loading — TS защищает`,
  },
  {
    id: "ts7",
    question: "Что такое mapped types?",
    difficulty: "senior",
    tags: ["mapped types", "keyof", "advanced types"],
    answer: `Mapped types — создание нового типа путём итерации по ключам существующего типа. Синтаксис: { [K in keyof T]: ... }.

Это то, как реализованы все utility types в TypeScript (Partial, Readonly, Record и др.).

Можно добавлять/убирать модификаторы (+?, -?, +readonly, -readonly) и трансформировать типы значений.`,
    code: `// Partial реализован так:
type Partial<T> = { [K in keyof T]?: T[K] };

// Readonly:
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Nullable — все поля могут быть null:
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Только методы объекта:
type Methods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K]
};

// Геттеры:
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};
// Getters<{name: string}> → { getName: () => string }`,
  },
  {
    id: "ts8",
    question: "Что такое conditional types?",
    difficulty: "senior",
    tags: ["conditional types", "infer", "advanced types"],
    answer: `Conditional types — типы с условием вида T extends U ? X : Y. Работают как тернарный оператор для типов.

Распределяются по union-типам автоматически: если T — union, условие проверяется для каждого члена отдельно.

Используются для извлечения типов, фильтрации union-типов, реализации utility types.`,
    code: `// Базовый синтаксис
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Распределение по union
type NonNullable<T> = T extends null | undefined ? never : T;
type C = NonNullable<string | null | undefined>; // string

// Извлечение типа Promise
type Awaited<T> = T extends Promise<infer R> ? R : T;
type D = Awaited<Promise<string>>; // string

// Фильтрация ключей
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];`,
  },
  {
    id: "ts9",
    question: "Что такое ключевое слово infer?",
    difficulty: "senior",
    tags: ["infer", "conditional types", "type inference"],
    answer: `infer — ключевое слово для "захвата" типа внутри conditional type. Объявляет переменную типа прямо в условии, доступную только в ветке true.

Это мощный инструмент для извлечения типов из других типов: тип элемента массива, тип возврата функции, типы аргументов и т.д.`,
    code: `// Тип элемента массива
type ElementType<T> = T extends (infer E)[] ? E : never;
type E = ElementType<string[]>; // string

// Тип возврата функции (так реализован ReturnType)
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;
type R = ReturnType<() => number>; // number

// Типы аргументов
type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;
type P = Parameters<(a: string, b: number) => void>; // [string, number]

// Первый аргумент
type FirstArg<T> = T extends (first: infer F, ...rest: unknown[]) => unknown ? F : never;
type F = FirstArg<(x: string, y: number) => void>; // string`,
  },
  {
    id: "ts10",
    question: "Что такое template literal types?",
    difficulty: "senior",
    tags: ["template literal", "string types", "advanced types"],
    answer: `Template literal types — типы, создаваемые из строковых литералов по аналогии с template literals в JS. Позволяют описывать точные строковые паттерны на уровне типов.

Распределяются по union: \`${"'a' | 'b'"}_end\` = 'a_end' | 'b_end'.

Используются для типизации CSS свойств, событий DOM, ключей объектов и т.д.`,
    code: `type Direction = 'top' | 'right' | 'bottom' | 'left';
type Padding = \`padding-\${Direction}\`;
// 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'

type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // 'onClick'

// Геттеры и сеттеры
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface User { name: string; age: number; }
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }`,
  },
  {
    id: "ts11",
    question: "Оператор satisfies — зачем нужен?",
    difficulty: "senior",
    tags: ["satisfies", "TypeScript 4.9", "type checking"],
    answer: `satisfies (TypeScript 4.9) — проверяет что значение соответствует типу, но вместо широкого типа сохраняет узкий инференс.

Проблема: если написать const x: SomeType = value, TypeScript расширяет тип до SomeType и теряет конкретные литеральные типы. satisfies проверяет соответствие, но тип остаётся конкретным.`,
    code: `type Palette = Record<string, string | [number, number, number]>;

// Без satisfies — теряем конкретные типы
const palette: Palette = {
  red: [255, 0, 0],
  green: '#00ff00',
};
palette.red;        // string | [number, number, number]  — неудобно!
palette.red.map;    // ошибка — может быть string

// С satisfies — проверка + конкретные типы
const palette2 = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Palette;
palette2.red;       // [number, number, number]  — конкретный тип!
palette2.red.map;   // OK
palette2.blue;      // ошибка — нет в объекте`,
  },
  {
    id: "ts12",
    question: "Что такое as const и зачем использовать?",
    difficulty: "middle",
    tags: ["as const", "const assertion", "literal types"],
    answer: `as const — const assertion, превращающий мутабельный тип в readonly с литеральными типами вместо широких.

Без as const: строка "hello" имеет тип string. С as const — тип "hello" (литеральный).

Особенно полезно для конфигураций, lookup-объектов, массивов значений — когда нужно что TypeScript знал точные значения, а не только их тип.`,
    code: `// Без as const
const config = {
  endpoint: '/api',    // тип: string (широкий)
  retries: 3,          // тип: number
  methods: ['GET', 'POST'], // тип: string[]
};

// С as const
const config = {
  endpoint: '/api',    // тип: '/api' (литеральный)
  retries: 3,          // тип: 3
  methods: ['GET', 'POST'], // тип: readonly ['GET', 'POST']
} as const;

// Создание union из объекта
const ROLES = { admin: 'admin', user: 'user', guest: 'guest' } as const;
type Role = typeof ROLES[keyof typeof ROLES]; // 'admin' | 'user' | 'guest'`,
  },
  {
    id: "ts13",
    question: "Как работает structural typing в TypeScript?",
    difficulty: "middle",
    tags: ["structural typing", "duck typing", "compatibility"],
    answer: `TypeScript использует структурную типизацию (duck typing): совместимость определяется структурой, а не явным объявлением типа. Если объект имеет все нужные поля — он совместим с типом.

В отличие от номинальной типизации (Java, C#), где нужно явно указывать implements / extends.

Это позволяет передавать объекты с "лишними" полями (они разрешены), но не с "недостающими".`,
    code: `interface Named { name: string; }

function greet(x: Named) {
  console.log(x.name);
}

// Лишние поля — OK (структурно совместим)
const user = { name: 'Alice', age: 30 };
greet(user); // OK — user имеет name

// Объектный литерал — excess property check
greet({ name: 'Alice', age: 30 }); // ошибка! лишнее поле age

// Почему: при литерале TS делает extra property check — защита от опечаток
// При передаче переменной — только structural check`,
  },
  {
    id: "ts14",
    question: "Что такое declaration merging?",
    difficulty: "senior",
    tags: ["declaration merging", "interface", "module augmentation"],
    answer: `Declaration merging — когда TypeScript объединяет несколько деклараций с одинаковым именем в одну. Работает для interface, namespace, enum.

Самый полезный кейс — module augmentation: расширение сторонних библиотек без изменения их кода. Например, добавить кастомные поля в Request Express или в типы process.env.`,
    code: `// Расширение интерфейса (из разных файлов)
interface Window { myCustomProp: string; }
// Теперь window.myCustomProp типизирован

// Module augmentation — расширяем типы Express
declare module 'express' {
  interface Request {
    user?: { id: string; role: string };
  }
}
// Теперь req.user типизирован во всём проекте

// Типизация process.env
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    API_KEY: string;
  }
}
// process.env.DATABASE_URL — string (не string | undefined)`,
  },
  {
    id: "ts15",
    question: "Intersection types (&) vs Union types (|)",
    difficulty: "junior",
    tags: ["intersection", "union", "type composition"],
    answer: `Union (|) — "или". Значение может быть одним из перечисленных типов. Доступны только общие свойства (без narrowing).

Intersection (&) — "и". Значение должно соответствовать всем типам одновременно. Доступны свойства всех типов.

Union для вариантов состояния. Intersection для композиции типов (миксины, расширение).`,
    code: `type A = { name: string };
type B = { age: number };

// Union — одно из двух
type AorB = A | B;
const x: AorB = { name: 'Alice' };       // OK
const y: AorB = { age: 30 };             // OK
// x.age — ошибка без narrowing (может быть A, у которого нет age)

// Intersection — оба сразу
type AandB = A & B;
const z: AandB = { name: 'Alice', age: 30 }; // OK — обязательно оба поля
z.name; // OK
z.age;  // OK

// Практика: расширение через intersection
type WithTimestamps<T> = T & { createdAt: string; updatedAt: string };
type UserWithTimestamps = WithTimestamps<User>;`,
  },
  {
    id: "ts16",
    question: "Enums vs const enums vs union of literals",
    difficulty: "middle",
    tags: ["enum", "const enum", "union", "compilation"],
    answer: `enum — компилируется в реальный JS объект. Можно итерировать, использовать как значение.
const enum — инлайнится в компиляции (нет JS объекта). Быстрее, меньше бандл. Не работает с isolatedModules.
Union literals — только тип, нет рантайм-объекта. Наиболее безопасный и простой вариант.

Рекомендация: prefer union literals → const enum → enum. Enum использовать только когда нужен рантайм-объект для итерации.`,
    code: `// enum — компилируется в объект
enum Direction { Up = 'UP', Down = 'DOWN' }
// JS: var Direction = { Up: 'UP', Down: 'DOWN', UP: 'Up', ... }

// const enum — инлайнится
const enum Status { Active = 'active', Inactive = 'inactive' }
// JS: использование Status.Active → просто 'active' (объекта нет)

// Union literals — рекомендуется
type Direction = 'UP' | 'DOWN';
const directions = ['UP', 'DOWN'] as const;
type Direction = typeof directions[number]; // 'UP' | 'DOWN'

// Итерация (если нужна) — только через enum или as const массив
Object.values(Direction); // enum
directions.forEach(...)   // as const array`,
  },
  {
    id: "ts17",
    question: "Что такое readonly и чем отличается от const?",
    difficulty: "junior",
    tags: ["readonly", "const", "immutability"],
    answer: `const — JavaScript, для переменных. Запрещает переприсваивание переменной, но не мутацию объекта/массива.

readonly — TypeScript, для полей объектов и параметров типов. Запрещает мутацию на уровне типов (только в TypeScript, не в runtime).

Readonly<T> — utility type, делающий все поля readonly.
readonly в массивах: readonly number[] / ReadonlyArray<number>.`,
    code: `// const — нельзя переприсвоить переменную
const user = { name: 'Alice' };
user = { name: 'Bob' };   // ошибка TS + JS
user.name = 'Bob';        // OK! (объект мутабелен)

// readonly — нельзя мутировать поле
interface User {
  readonly id: string;
  name: string;
}
const u: User = { id: '1', name: 'Alice' };
u.id = '2';   // ошибка TS
u.name = 'Bob'; // OK

// readonly массив
function process(items: readonly string[]) {
  items.push('x'); // ошибка TS
  items[0] = 'y';  // ошибка TS
  return items.map(x => x); // OK (map не мутирует)
}`,
  },
  {
    id: "ts18",
    question: "Что такое strict режим в TypeScript?",
    difficulty: "junior",
    tags: ["strict", "tsconfig", "configuration"],
    answer: `strict: true в tsconfig включает группу флагов строгой проверки:

• strictNullChecks — null и undefined не присвоить другим типам без явной проверки
• noImplicitAny — запрет неявного any
• strictFunctionTypes — строгая проверка типов функций-параметров
• strictPropertyInitialization — все поля класса должны инициализироваться в конструкторе
• strictBindCallApply — проверка типов для bind/call/apply
• noImplicitThis — запрет неявного this: any

Всегда включай strict: true. Это базовый минимум для типобезопасного кода. Остальные флаги (noUncheckedIndexedAccess, exactOptionalPropertyTypes) — дополнительное ужесточение.`,
    code: `// Без strictNullChecks
let name: string = null; // OK — опасно!

// Со strictNullChecks (strict: true)
let name: string = null;         // ошибка
let name: string | null = null;  // OK
name.toUpperCase();              // ошибка — может быть null
if (name) name.toUpperCase();   // OK — narrowing

// noImplicitAny
function parse(data) { ... }          // ошибка — data: any неявно
function parse(data: unknown) { ... } // OK`,
  },
  {
    id: "ts19",
    question: "keyof и typeof операторы",
    difficulty: "middle",
    tags: ["keyof", "typeof", "type operators"],
    answer: `keyof T — создаёт union из всех ключей типа T.
typeof x — получает TypeScript-тип JavaScript-значения.

Совместно используются для создания типов из значений (особенно из as const объектов), для функций принимающих ключи объекта и т.д.`,
    code: `interface User { id: string; name: string; age: number; }

// keyof — union ключей
type UserKey = keyof User; // 'id' | 'name' | 'age'

// typeof — тип значения
const defaultUser = { id: '0', name: 'Guest', age: 0 };
type DefaultUser = typeof defaultUser; // { id: string; name: string; age: number }

// Вместе — доступ к типу поля по ключу
type ValueOf<T, K extends keyof T> = T[K];
type UserAge = ValueOf<User, 'age'>; // number

// Практика: типобезопасный getter
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const age = get(user, 'age');   // number
get(user, 'missing');           // ошибка TS`,
  },
  {
    id: "ts20",
    question: "Что такое type narrowing через as и почему это опасно?",
    difficulty: "middle",
    tags: ["type assertion", "as", "type safety"],
    answer: `Type assertion (as) — ты говоришь TypeScript "я знаю лучше, это точно этот тип". TS отключает проверку и доверяет тебе. Это не runtime-приведение (cast), только компиляторная инструкция.

Опасность: если ты ошибся — runtime error без предупреждения TS.

Когда допустимо: после явной проверки, при работе с DOM-элементами, при интеграции с внешними API где тип известен точно.

Альтернатива: type guard функции (is) — безопаснее, потому что проверяют в runtime.`,
    code: `// Опасно — слепое приведение
const input = document.getElementById('name') as HTMLInputElement;
input.value = 'Alice'; // OK для TS, но если элемент не input — runtime error

// Безопаснее — проверка перед assert
const el = document.getElementById('name');
if (el instanceof HTMLInputElement) {
  el.value = 'Alice'; // narrowing — TS знает точный тип
}

// Non-null assertion (!)  — тоже type assertion
const el2 = document.getElementById('name')!; // "я уверен что не null"
// Используй только когда 100% уверен что элемент существует

// Type guard — runtime проверка
function isHTMLInput(el: Element): el is HTMLInputElement {
  return el.tagName === 'INPUT';
}`,
  },
];
