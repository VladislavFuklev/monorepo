import type { Question } from "./types";

export const javascriptQuestions: Question[] = [
  // ─── Junior (8) ───────────────────────────────────────────────────────────
  {
    id: "js-1",
    question: "Что такое hoisting в JavaScript?",
    difficulty: "junior",
    tags: ["hoisting", "var", "let"],
    answer: `Hoisting (поднятие) — механизм JavaScript, при котором объявления переменных и функций перемещаются в начало своей области видимости на этапе компиляции, до выполнения кода.

Function declarations поднимаются полностью — функцию можно вызвать до её объявления в коде.
var-переменные поднимаются, но инициализируются значением undefined до фактической строки присваивания.
let и const тоже поднимаются, но попадают в Temporal Dead Zone (TDZ): обращение к ним до объявления бросает ReferenceError.
class-объявления ведут себя как let — поднимаются, но остаются в TDZ.`,
    code: `// Function declaration — работает
console.log(greet()); // "Hello"
function greet() { return "Hello"; }

// var — поднимается с undefined
console.log(x); // undefined (не ReferenceError)
var x = 5;
console.log(x); // 5

// let — Temporal Dead Zone
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;`,
  },
  {
    id: "js-2",
    question: "Чем отличаются var, let и const?",
    difficulty: "junior",
    tags: ["var", "let", "const", "scope"],
    answer: `var имеет функциональную область видимости (function scope) и поднимается в начало функции. Повторное объявление var внутри блока (if, for) не создаёт новую переменную — она видна во всей функции. Это источник классических багов с циклами.

let и const имеют блочную область видимости (block scope) и находятся в TDZ до объявления. let позволяет переприсваивать значение, const — нет (но мутировать объект/массив внутри const можно). const требует обязательной инициализации при объявлении.

Правило: используй const по умолчанию, let — когда нужно переприсвоение, var — никогда в современном коде.`,
    code: `var a = 1;
var a = 2; // OK, повторное объявление разрешено

let b = 1;
// let b = 2; // SyntaxError

const c = { x: 1 };
c.x = 2;       // OK — мутация объекта
// c = {};     // TypeError — переприсвоение запрещено

// var в цикле — классический баг
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}

// let в цикле — правильно
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0 1 2
}`,
  },
  {
    id: "js-3",
    question: "Что такое замыкание (closure)?",
    difficulty: "junior",
    tags: ["closure", "scope", "lexical"],
    answer: `Замыкание — это функция вместе с её лексическим окружением: набором переменных, которые были в области видимости в момент создания функции. Функция «замыкает» эти переменные и имеет к ним доступ даже после того, как внешняя функция завершила выполнение.

Замыкания создаются каждый раз при создании функции. Они широко используются для инкапсуляции данных (приватные переменные), фабричных функций, мемоизации и модульного паттерна.

Важно помнить: все замыкания в цикле с var разделяют одну и ту же переменную, поэтому для корректной работы нужен let или IIFE.`,
    code: `// Счётчик через замыкание
function makeCounter() {
  let count = 0; // "закрыта" внутри возвращаемых функций

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount:  () => count,
  };
}

const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
counter.getCount();  // 1

// count недоступен снаружи — инкапсуляция!
console.log(count);  // ReferenceError`,
  },
  {
    id: "js-4",
    question: "В чём разница между == и ===?",
    difficulty: "junior",
    tags: ["equality", "coercion", "types"],
    answer: `=== (строгое равенство) сравнивает значение И тип без какого-либо приведения типов. Если типы разные — сразу возвращает false.

== (нестрогое равенство) перед сравнением выполняет type coercion по сложным правилам: числа и строки, булевы значения, null и undefined обрабатываются по-разному. Это приводит к неочевидному поведению.

null == undefined → true, но null === undefined → false. Сравнение с NaN всегда false, даже NaN == NaN. Практическое правило: всегда используй === и явно приводи типы, если нужно сравнить значения разных типов.`,
    code: `// Нестрогое равенство — неочевидные результаты
console.log(0 == false);    // true  (false → 0)
console.log("" == false);   // true  ("" → 0, false → 0)
console.log(null == undefined); // true
console.log(null == 0);     // false (особый случай)
console.log("5" == 5);      // true  ("5" → 5)

// Строгое равенство — предсказуемо
console.log(0 === false);   // false
console.log("" === false);  // false
console.log(null === undefined); // false
console.log("5" === 5);     // false

// NaN — особый случай
console.log(NaN == NaN);    // false
console.log(Number.isNaN(NaN)); // true — правильная проверка`,
  },
  {
    id: "js-5",
    question: "Что такое null и undefined?",
    difficulty: "junior",
    tags: ["null", "undefined", "types"],
    answer: `undefined означает, что переменная объявлена, но ей не было присвоено значение. JavaScript автоматически присваивает undefined: необъявленным переменным (не присвоенным), параметрам функции без аргумента, отсутствующим свойствам объекта, функциям без return.

null — явное, намеренное отсутствие значения (объектного типа). Разработчик сам присваивает null, чтобы показать "здесь нет объекта". Например, getElementById возвращает null, если элемент не найден.

typeof undefined === "undefined", но typeof null === "object" — это историческая ошибка JavaScript с первых версий, которую нельзя исправить из соображений обратной совместимости. Для проверки на null используй строгое сравнение: value === null.`,
    code: `let a;
console.log(a);            // undefined
console.log(typeof a);     // "undefined"

let b = null;
console.log(b);            // null
console.log(typeof b);     // "object" (!)

// Проверки
console.log(a == null);    // true  (undefined == null)
console.log(b == null);    // true
console.log(a === null);   // false
console.log(b === null);   // true

// Nullish coalescing (??) — реагирует только на null/undefined
const value = null ?? "default"; // "default"
const zero  = 0    ?? "default"; // 0 (в отличие от ||)`,
  },
  {
    id: "js-6",
    question: "Как работают map, filter, reduce?",
    difficulty: "junior",
    tags: ["array", "map", "filter", "reduce"],
    answer: `Все три метода не мутируют исходный массив и возвращают новое значение — это функциональные, иммутабельные операции.

map трансформирует каждый элемент массива через коллбэк и возвращает новый массив той же длины. filter проверяет каждый элемент предикатом и возвращает новый массив только из элементов, вернувших true. reduce сворачивает массив в одно значение, накапливая результат в аккумуляторе.

Методы можно чейнить: сначала filter, затем map, затем reduce. Начальное значение аккумулятора в reduce — второй аргумент (рекомендуется всегда указывать явно).`,
    code: `const orders = [
  { id: 1, product: "Ноутбук", price: 80000, paid: true },
  { id: 2, product: "Мышь",    price: 1500,  paid: false },
  { id: 3, product: "Монитор", price: 30000, paid: true },
];

// map — трансформация
const names = orders.map(o => o.product);
// ["Ноутбук", "Мышь", "Монитор"]

// filter — фильтрация
const paid = orders.filter(o => o.paid);
// [{ id:1, ... }, { id:3, ... }]

// reduce — агрегация
const total = orders.reduce((sum, o) => sum + o.price, 0);
// 111500

// Чейнинг: сумма только оплаченных заказов
const paidTotal = orders
  .filter(o => o.paid)
  .reduce((sum, o) => sum + o.price, 0);
// 110000`,
  },
  {
    id: "js-7",
    question: "Что такое деструктуризация?",
    difficulty: "junior",
    tags: ["destructuring", "es6"],
    answer: `Деструктуризация — синтаксис ES6 для извлечения значений из массивов или свойств из объектов в отдельные переменные в более лаконичной форме.

Объектная деструктуризация сопоставляет по именам ключей. Можно задавать псевдонимы через двоеточие, дефолтные значения через =, и вложенную деструктуризацию для глубоких объектов. Переменные с именами, совпадающими с ключами объекта, создаются автоматически.

Массивная деструктуризация сопоставляет по позиции. Можно пропускать элементы, использовать rest-элемент для хвоста. Применяется в React для useState, в функциях для параметров. Деструктуризацию можно использовать прямо в параметрах функции.`,
    code: `// Объектная деструктуризация
const user = { name: "Alice", age: 30, city: "Moscow" };
const { name, age, city: location } = user; // псевдоним
const { name: n, role = "guest" } = user;   // дефолтное значение

// Вложенная деструктуризация
const { address: { street } } = { address: { street: "Ленина" } };

// Массивная деструктуризация
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
// first=1, third=3, rest=[4,5]

// В параметрах функции
function greet({ name, age = 0 }: { name: string; age?: number }) {
  return \`\${name} (\${age})\`;
}

// Swap переменных
let a = 1, b = 2;
[a, b] = [b, a]; // a=2, b=1`,
  },
  {
    id: "js-8",
    question: "Что такое spread и rest операторы?",
    difficulty: "junior",
    tags: ["spread", "rest", "es6"],
    answer: `Оба оператора используют синтаксис ..., но работают в противоположных направлениях.

Spread (распыление) разворачивает итерируемый объект в отдельные элементы. Используется для копирования массивов и объектов (поверхностное), объединения коллекций, передачи элементов массива как аргументов функции, клонирования и слияния объектов (аналог Object.assign).

Rest (сборка) — собирает оставшиеся элементы в массив. Используется в параметрах функции для приёма переменного числа аргументов (замена arguments), в деструктуризации для захвата "хвоста". Rest-параметр должен быть последним в списке параметров.`,
    code: `// SPREAD — разворачивает
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];      // [1, 2, 3, 4, 5]
const copy = [...arr1];             // поверхностная копия

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };    // { a:1, b:2, c:3 }
const merged = { ...obj1, b: 99 }; // { a:1, b:99 } — переопределение

Math.max(...arr1); // то же что Math.max(1, 2, 3)

// REST — собирает
function sum(...numbers: number[]) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10

// Rest в деструктуризации
const [head, ...tail] = [1, 2, 3, 4];
// head=1, tail=[2, 3, 4]

const { a, ...others } = { a: 1, b: 2, c: 3 };
// a=1, others={ b:2, c:3 }`,
  },

  // ─── Middle (10) ──────────────────────────────────────────────────────────
  {
    id: "js-9",
    question: "Что такое Event Loop?",
    difficulty: "middle",
    tags: ["event-loop", "async", "concurrency"],
    answer: `JavaScript — однопоточный язык: в один момент времени выполняется только один кусок кода. Event Loop — механизм, позволяющий JavaScript не блокироваться на асинхронных операциях.

Компоненты системы: Call Stack (стек вызовов, выполняет синхронный код), Web APIs (браузерные API — setTimeout, fetch, DOM events — работают вне стека), Microtask Queue (очередь микрозадач: Promise.then, queueMicrotask, MutationObserver), Macrotask Queue (очередь макрозадач: setTimeout, setInterval, I/O).

Алгоритм Event Loop: выполнить весь синхронный код (опустошить Call Stack) → выполнить все микрозадачи (полностью опустошить Microtask Queue, включая новые, добавленные во время выполнения) → взять одну макрозадачу и выполнить её → снова проверить микрозадачи → и так по кругу. Поэтому Promise.then всегда выполняется раньше setTimeout(fn, 0).`,
    code: `console.log("1 — синхронно");

setTimeout(() => console.log("2 — macrotask"), 0);

Promise.resolve()
  .then(() => console.log("3 — microtask"))
  .then(() => console.log("4 — microtask 2"));

queueMicrotask(() => console.log("5 — microtask (queueMicrotask)"));

console.log("6 — синхронно");

// Порядок вывода:
// 1 — синхронно
// 6 — синхронно
// 3 — microtask
// 5 — microtask (queueMicrotask)
// 4 — microtask 2
// 2 — macrotask`,
  },
  {
    id: "js-10",
    question: "Что такое Promise и как он работает?",
    difficulty: "middle",
    tags: ["promise", "async", "es6"],
    answer: `Promise — объект, представляющий результат асинхронной операции, которая ещё не завершена. У промиса три состояния: pending (ожидание), fulfilled (выполнен успешно), rejected (завершён с ошибкой). Переход из pending необратим.

Методы экземпляра: .then(onFulfilled, onRejected) — обработка успеха/ошибки, возвращает новый промис; .catch(onRejected) — сокращение для .then(null, fn); .finally(fn) — выполняется при любом исходе без аргументов.

Статические методы для работы с несколькими промисами: Promise.all([...]) — ждёт все, отклоняется при первой ошибке; Promise.allSettled([...]) — ждёт все, возвращает статус каждого; Promise.race([...]) — берёт результат первого завершившегося; Promise.any([...]) — берёт первый fulfilled, ошибка только если все rejected.`,
    code: `// Создание промиса
const fetchUser = (id: number) =>
  new Promise<{ name: string }>((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ name: "Alice" });
      else reject(new Error("Invalid id"));
    }, 1000);
  });

// Цепочка
fetchUser(1)
  .then(user => user.name.toUpperCase())
  .then(name => console.log(name))       // "ALICE"
  .catch(err => console.error(err))
  .finally(() => console.log("done"));

// Promise.all — параллельное выполнение
const [u1, u2] = await Promise.all([fetchUser(1), fetchUser(2)]);

// Promise.allSettled — не падает при ошибке
const results = await Promise.allSettled([fetchUser(1), fetchUser(-1)]);
// [{ status: "fulfilled", value: ... }, { status: "rejected", reason: ... }]`,
  },
  {
    id: "js-11",
    question: "Чем async/await отличается от Promise.then?",
    difficulty: "middle",
    tags: ["async", "await", "promise"],
    answer: `async/await — синтаксический сахар над промисами, введённый в ES2017. Под капотом async-функция по-прежнему работает через промисы — async функция всегда возвращает Promise, даже если внутри return примитив.

await приостанавливает выполнение текущей async-функции (не всего потока!) до разрешения промиса, затем возвращает его значение. Это делает асинхронный код визуально похожим на синхронный, что облегчает чтение и отладку.

Обработка ошибок: с .then/.catch цепочки могут быть громоздкими при множестве зависимых шагов. С async/await используется обычный try/catch. Важно: несколько независимых await-запросов лучше запускать параллельно через Promise.all, а не последовательно — иначе теряется преимущество асинхронности.`,
    code: `// Promise.then — цепочка
function loadData() {
  return fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .catch(err => console.error(err));
}

// async/await — линейный код
async function loadData() {
  try {
    const user     = await fetchUser(1);
    const posts    = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    return comments;
  } catch (err) {
    console.error(err);
  }
}

// Параллельный запуск (правильно)
async function parallel() {
  const [user, config] = await Promise.all([
    fetchUser(1),
    fetchConfig(),
  ]);
  return { user, config };
}`,
  },
  {
    id: "js-12",
    question: "Что такое this в JavaScript?",
    difficulty: "middle",
    tags: ["this", "context", "binding"],
    answer: `this — ссылка на контекст выполнения функции. Ключевое отличие от других языков: значение this определяется не при объявлении функции, а при её вызове (за исключением стрелочных функций).

Четыре правила привязки (по убыванию приоритета): 1) new binding — при вызове через new, this указывает на новый объект; 2) explicit binding — явная привязка через call/apply/bind; 3) implicit binding — метод вызван как свойство объекта (obj.method()), this === obj; 4) default binding — обычный вызов функции, this === undefined (strict mode) или globalThis.

Стрелочная функция не имеет собственного this — она захватывает this из лексического окружения в момент создания. Это делает их идеальными для колбэков в методах классов. Потеря контекста — частый баг: const fn = obj.method; fn() теряет this.`,
    code: `const obj = {
  name: "Alice",
  greet()       { return this.name; },             // implicit binding
  greetArrow:   () => this?.name,                  // undefined — нет своего this
};

obj.greet();       // "Alice"
obj.greetArrow();  // undefined

// Потеря контекста
const fn = obj.greet;
fn();              // undefined (strict) / глобал

// Исправление через bind
const bound = obj.greet.bind(obj);
bound();           // "Alice"

// new binding
function Person(name: string) {
  this.name = name; // this — новый объект
}
const p = new Person("Bob"); // p.name === "Bob"

// Стрелка в классе — безопасный колбэк
class Timer {
  ticks = 0;
  start() {
    setInterval(() => this.ticks++, 1000); // this сохранён
  }
}`,
  },
  {
    id: "js-13",
    question: "Что такое call, apply и bind?",
    difficulty: "middle",
    tags: ["call", "apply", "bind", "this"],
    answer: `Все три метода Function.prototype используются для явной (explicit) привязки this — они позволяют вызвать функцию с произвольным контекстом.

call(thisArg, arg1, arg2, ...) — немедленно вызывает функцию, передавая this и аргументы через запятую.
apply(thisArg, [arg1, arg2]) — то же самое, но аргументы передаются массивом. Полезно когда аргументы уже в массиве (например Math.max.apply(null, arr)).
bind(thisArg, arg1, ...) — не вызывает функцию, а возвращает новую функцию с жёстко привязанным this. Поддерживает частичное применение (partial application): можно предустановить не только this, но и первые аргументы.`,
    code: `function introduce(greeting: string, punctuation: string) {
  return \`\${greeting}, я \${this.name}\${punctuation}\`;
}

const user = { name: "Alice" };

// call — аргументы через запятую
introduce.call(user, "Привет", "!");    // "Привет, я Alice!"

// apply — аргументы массивом
introduce.apply(user, ["Здравствуйте", "."]);  // "Здравствуйте, я Alice."

// bind — возвращает новую функцию
const boundIntro = introduce.bind(user, "Привет");
boundIntro("!");   // "Привет, я Alice!"
boundIntro("?");   // "Привет, я Alice?"

// Практический пример: Math.max с массивом
const nums = [3, 1, 4, 1, 5, 9];
Math.max.apply(null, nums);  // 9
Math.max(...nums);            // 9 (современный способ через spread)`,
  },
  {
    id: "js-14",
    question: "Что такое прототипное наследование?",
    difficulty: "middle",
    tags: ["prototype", "inheritance", "oop"],
    answer: `В JavaScript каждый объект имеет внутреннее свойство [[Prototype]] — ссылку на другой объект (или null). При попытке доступа к свойству JS сначала ищет его в самом объекте, затем рекурсивно поднимается по цепочке прототипов до null. Это и есть прототипное наследование.

Object.create(proto) создаёт объект с указанным прототипом. Синтаксис class (ES6) — лишь синтаксический сахар над прототипами: extends настраивает [[Prototype]], super вызывает родительский конструктор.

hasOwnProperty(key) / Object.hasOwn(obj, key) проверяет, является ли свойство собственным (не унаследованным). for...in перечисляет и собственные, и унаследованные enumerable-свойства — поэтому рекомендуют Object.keys() для перебора только собственных.`,
    code: `// Прямая работа с прототипами
const animal = {
  type: "Animal",
  describe() { return \`Я \${this.name}, тип: \${this.type}\`; }
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.type = "Dog";
dog.describe(); // "Я Rex, тип: Dog"

// Цепочка: dog → animal → Object.prototype → null
Object.getPrototypeOf(dog) === animal; // true

// class — синтаксический сахар
class Animal {
  constructor(public name: string) {}
  describe() { return \`Я \${this.name}\`; }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name); // вызов Animal конструктора
  }
  describe() { return super.describe() + \`, порода: \${this.breed}\`; }
}

const d = new Dog("Rex", "Labrador");
d instanceof Dog;    // true
d instanceof Animal; // true`,
  },
  {
    id: "js-15",
    question: "Чем отличаются microtask и macrotask?",
    difficulty: "middle",
    tags: ["event-loop", "microtask", "macrotask"],
    answer: `Macrotask (задача) — единица работы, которую Event Loop берёт по одной за итерацию. К macrotask относятся: setTimeout, setInterval, setImmediate (Node.js), MessageChannel, события UI (click, load). После выполнения одной macrotask браузер может перерисовать страницу.

Microtask (микрозадача) — более приоритетная задача, которая выполняется сразу после завершения текущего синхронного кода или macrotask, до следующей macrotask. К microtask относятся: Promise.then/catch/finally, queueMicrotask(), MutationObserver, async/await (await создаёт microtask).

Критически важно: после каждой macrotask движок полностью опустошает очередь microtask, включая новые микрозадачи, добавленные в процессе. Это означает, что бесконечный цикл через Promise.then заморозит страницу, тогда как через setTimeout — нет.`,
    code: `// Демонстрация порядка выполнения
console.log("start");         // 1 — синхронно

setTimeout(() => {
  console.log("macrotask 1"); // 5
  Promise.resolve().then(() => console.log("micro inside macro")); // 6
}, 0);

setTimeout(() => {
  console.log("macrotask 2"); // 7 — только после всех microtasks от macrotask 1
}, 0);

Promise.resolve()
  .then(() => console.log("micro 1"))  // 3
  .then(() => console.log("micro 2")); // 4

console.log("end");           // 2

// Вывод: start → end → micro 1 → micro 2 → macrotask 1 → micro inside macro → macrotask 2`,
  },
  {
    id: "js-16",
    question: "Что такое Symbol?",
    difficulty: "middle",
    tags: ["symbol", "es6", "primitive"],
    answer: `Symbol — примитивный тип данных, введённый в ES6. Каждый Symbol уникален: Symbol('id') !== Symbol('id') даже с одинаковым описанием. Описание (первый аргумент) только для отладки.

Основные применения: уникальные ключи свойств объектов без риска коллизий с другими библиотеками; встроенные well-known symbols для настройки поведения объектов (Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance, Symbol.toStringTag).

Символьные свойства не видны в for...in, Object.keys(), JSON.stringify() — они "полупривaтные". Для доступа к ним используют Object.getOwnPropertySymbols(). Symbol.for(key) создаёт глобальный символ из реестра — одинаковый ключ возвращает тот же символ (отличие от Symbol()).`,
    code: `const id = Symbol("id");
const id2 = Symbol("id");
console.log(id === id2); // false — всегда уникальны

const user = {
  name: "Alice",
  [id]: 42,          // символьный ключ
};

console.log(user[id]);       // 42
console.log(Object.keys(user)); // ["name"] — Symbol не виден!

// Well-known Symbol: кастомный итератор
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let cur = this.from;
    return {
      next: () =>
        cur <= this.to
          ? { value: cur++, done: false }
          : { value: undefined, done: true },
    };
  },
};

console.log([...range]); // [1, 2, 3, 4, 5]

// Symbol.toPrimitive
const money = {
  amount: 100,
  [Symbol.toPrimitive](hint: string) {
    return hint === "string" ? "100 руб." : this.amount;
  },
};
console.log(\`\${money}\`); // "100 руб."
console.log(+money);    // 100`,
  },
  {
    id: "js-17",
    question: "Что такое WeakMap и WeakSet?",
    difficulty: "middle",
    tags: ["weakmap", "weakset", "memory", "gc"],
    answer: `WeakMap и WeakSet — коллекции, хранящие слабые (weak) ссылки на объекты. "Слабая" значит: если на объект больше нет других ссылок, сборщик мусора может его удалить, даже если он ещё числится в WeakMap/WeakSet.

WeakMap принимает только объекты в качестве ключей и не препятствует их сборке мусором. Методы: get, set, has, delete. WeakSet хранит уникальные объекты. Оба не итерируемы и не имеют свойства size — именно потому, что состав может меняться в любой момент из-за GC.

Основной use case — кэширование данных, связанных с объектами (DOM-узлами, экземплярами классов), без утечек памяти: когда объект удаляется, его запись в WeakMap автоматически исчезает. WeakRef (ES2021) позволяет хранить слабую ссылку явно и проверять, жив ли объект через .deref().`,
    code: `// WeakMap — кэш метаданных без утечек
const cache = new WeakMap<object, string>();

function process(element: HTMLElement) {
  if (cache.has(element)) return cache.get(element)!;

  const result = element.textContent ?? "";
  cache.set(element, result); // когда element удалится из DOM → запись исчезнет
  return result;
}

// WeakSet — отслеживание "посещённых" объектов
const visited = new WeakSet<object>();

function visit(node: object) {
  if (visited.has(node)) return; // уже обработан
  visited.add(node);
  // ... обработка
}

// WeakRef (ES2021)
let obj: object | null = { data: "important" };
const ref = new WeakRef(obj);

obj = null; // убираем сильную ссылку
// GC может теперь удалить объект

const deref = ref.deref();
if (deref) {
  console.log("Объект ещё жив:", deref);
} else {
  console.log("Объект собран GC");
}`,
  },
  {
    id: "js-18",
    question: "Что такое event delegation?",
    difficulty: "middle",
    tags: ["events", "delegation", "bubbling"],
    answer: `Event delegation (делегирование событий) — паттерн, при котором вместо навешивания отдельного обработчика на каждый дочерний элемент вешается один обработчик на общего родителя. Это работает благодаря event bubbling: события "всплывают" от элемента-источника вверх по DOM-дереву.

Внутри обработчика event.target указывает на элемент, который фактически получил событие (источник), тогда как event.currentTarget — на элемент с обработчиком. event.target.closest(selector) удобен для поиска ближайшего нужного предка.

Преимущества: меньше обработчиков → меньше памяти; работает с динамически добавляемыми элементами без переподписки; централизованная логика. Ограничение: не все события всплывают (focus, blur, scroll — не всплывают; есть замены focusin/focusout).`,
    code: `// Без делегирования — обработчик на каждой кнопке
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", handleClick); // много обработчиков
});

// С делегированием — один обработчик на контейнере
const list = document.getElementById("todo-list")!;

list.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // Определяем тип действия
  if (target.matches(".delete-btn")) {
    const item = target.closest("li");
    item?.remove();
    return;
  }

  if (target.matches(".complete-btn")) {
    const item = target.closest("li");
    item?.classList.toggle("completed");
  }
});

// Динамически добавленные элементы работают автоматически!
function addItem(text: string) {
  list.insertAdjacentHTML(
    "beforeend",
    \`<li>\${text} <button class="delete-btn">✕</button></li>\`
  );
}`,
  },

  // ─── Senior (7) ───────────────────────────────────────────────────────────
  {
    id: "js-19",
    question: "Что такое генераторы (generators)?",
    difficulty: "senior",
    tags: ["generator", "iterator", "es6"],
    answer: `Генератор — специальная функция, объявляемая с function* (звёздочка), которая может приостанавливать своё выполнение через yield и возобновлять его при следующем вызове .next(). Вызов генераторной функции не выполняет тело, а возвращает объект-итератор.

.next() возвращает { value, done }: value — то, что передано в yield (или return), done: false до конца, done: true после return. Можно передавать значение обратно в генератор через .next(value) — оно становится результатом yield-выражения внутри. .throw(err) бросает ошибку внутри генератора, .return(val) завершает его.

Применения: ленивые/бесконечные последовательности без загрузки всего в память; кастомные итераторы; управление потоком выполнения (библиотека co, redux-saga); async generators (async function*) для потоковой обработки данных.`,
    code: `// Бесконечная последовательность Фибоначчи
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2

// Берём первые 8 чисел
const first8 = [...take(fibonacci(), 8)]; // [0,1,1,2,3,5,8,13]

function* take<T>(iter: Generator<T>, n: number): Generator<T> {
  for (const val of iter) {
    if (n-- <= 0) return;
    yield val;
  }
}

// Двусторонняя коммуникация
function* calculator() {
  let result = 0;
  while (true) {
    const input: number = yield result;
    result += input;
  }
}

const calc = calculator();
calc.next();       // запуск, { value: 0, done: false }
calc.next(10);     // { value: 10, done: false }
calc.next(5);      // { value: 15, done: false }`,
  },
  {
    id: "js-20",
    question: "Что такое Proxy и Reflect?",
    difficulty: "senior",
    tags: ["proxy", "reflect", "metaprogramming"],
    answer: `Proxy — объект-обёртка, перехватывающий фундаментальные операции над целевым объектом (target) через набор handler-функций — ловушек (traps). Основные ловушки: get, set, has (in оператор), deleteProperty, apply (вызов функции), construct (new), ownKeys, getPrototypeOf.

Reflect — объект со статическими методами, повторяющими операции объектной модели (Reflect.get, Reflect.set и т.д.). Используется внутри ловушек Proxy для "стандартного" поведения без рекурсии, а также как альтернатива низкоуровневым Object операциям.

Применения: валидация данных при присвоении; логирование/трейсинг доступа к свойствам; реактивные системы (именно Proxy используется в Vue 3 для реактивности); виртуальные объекты и DSL; защита от случайного доступа к несуществующим свойствам.`,
    code: `// Валидация через Proxy
function createValidated<T extends object>(
  target: T,
  validators: Partial<Record<keyof T, (v: unknown) => boolean>>
): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      const validate = validators[prop as keyof T];
      if (validate && !validate(value)) {
        throw new TypeError(\`Invalid value for \${String(prop)}: \${value}\`);
      }
      return Reflect.set(obj, prop, value);
    },
  });
}

const user = createValidated(
  { name: "", age: 0 },
  {
    age: (v) => typeof v === "number" && v >= 0 && v <= 150,
  }
);

user.age = 25;   // OK
user.age = -1;   // TypeError: Invalid value for age: -1

// Логирующий Proxy
function withLogging<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop) {
      console.log(\`GET \${String(prop)}\`);
      return Reflect.get(obj, prop);
    },
    set(obj, prop, value) {
      console.log(\`SET \${String(prop)} = \${value}\`);
      return Reflect.set(obj, prop, value);
    },
  });
}`,
  },
  {
    id: "js-21",
    question: "Как работает garbage collection в JavaScript?",
    difficulty: "senior",
    tags: ["gc", "memory", "v8", "performance"],
    answer: `JavaScript использует автоматическое управление памятью через сборщик мусора (GC). Основной алгоритм в V8 — mark-and-sweep: GC периодически обходит граф объектов начиная с "корней" (глобальный объект, переменные в стеке вызовов), помечает все достижимые объекты, затем очищает недостижимые. Это решает проблему циклических ссылок, которую не мог обработать старый алгоритм reference counting.

V8 использует поколенческий GC: объекты создаются в Young Generation (new space), где Minor GC (Scavenger) работает часто и быстро. Объекты, пережившие несколько сборок, переезжают в Old Generation, где Major GC (Mark-Sweep + Mark-Compact) работает реже, но дороже. Incremental и concurrent маркировка снижают паузы.

Основные источники утечек памяти: забытые setInterval/setTimeout; глобальные переменные; DOM-узлы, на которые есть ссылки в JS (detached DOM); замыкания, удерживающие большие объекты. WeakMap/WeakRef позволяют ссылаться на объекты, не препятствуя их сборке.`,
    code: `// Утечка памяти — detached DOM node
function leak() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  document.body.removeChild(div); // убрали из DOM...

  return () => div.textContent;   // ...но замыкание держит ссылку на div!
}

// Утечка — забытый интервал
function startPolling() {
  const data: number[] = [];
  const id = setInterval(() => {
    data.push(Math.random()); // data растёт вечно
  }, 100);
  // clearInterval(id) никогда не вызывается!
}

// Правильно — WeakRef для необязательного кэша
const resultCache = new WeakMap<object, WeakRef<object>>();

function getCached(key: object) {
  return resultCache.get(key)?.deref(); // undefined если собрано GC
}

// FinalizationRegistry — колбэк после сборки
const registry = new FinalizationRegistry((label: string) => {
  console.log(\`\${label} was garbage collected\`);
});

let target: object | null = {};
registry.register(target, "my object");
target = null; // при следующей сборке → "my object was garbage collected"`,
  },
  {
    id: "js-22",
    question: "Чем отличаются ESM и CommonJS?",
    difficulty: "senior",
    tags: ["esm", "cjs", "modules", "node"],
    answer: `CommonJS (CJS) — система модулей Node.js: require() для импорта, module.exports для экспорта. Загрузка синхронная и динамическая — require() можно вызвать в любом месте кода. Экспортируемые значения — это копия на момент вызова require, что делает circular dependencies сложными. Нет нативной поддержки tree-shaking.

ESM (ECMAScript Modules) — стандарт ES2015: import/export. Статический анализ: импорты и экспорты должны быть на верхнем уровне модуля и не могут быть условными (только import() — динамический). Экспорты — live bindings: изменение экспортируемой переменной видно во всех импортёрах. Асинхронная загрузка. Поддерживает top-level await.

В Node.js: .mjs или "type": "module" в package.json → ESM; .cjs или "type": "commonjs" → CJS. Интероп: ESM может импортировать CJS как default, но не наоборот (require() не понимает ESM). Bundler-ы (webpack, rollup, vite) транспилируют ESM в CJS для старых сред.`,
    code: `// CommonJS
const fs = require("fs");                    // синхронно
const { readFile } = require("fs");

module.exports = { myFunc };
module.exports.helper = helperFunc;

// Динамический require — работает
if (condition) {
  const plugin = require(\`./plugins/\${name}\`);
}

// ESM
import fs from "fs";                         // статический, верхний уровень
import { readFile } from "fs";
import type { ReadFileOptions } from "fs";   // только тип (TypeScript)

export function myFunc() {}
export default class MyClass {}

// Динамический ESM import() — возвращает Promise
const module = await import(\`./plugins/\${name}\`);

// Live binding — отличие от CJS
// counter.mjs
export let count = 0;
export function increment() { count++; }

// main.mjs
import { count, increment } from "./counter.mjs";
increment();
console.log(count); // 1 — live binding видит изменение!`,
  },
  {
    id: "js-23",
    question: "Что такое currying и partial application?",
    difficulty: "senior",
    tags: ["currying", "functional", "closure"],
    answer: `Currying — трансформация функции с несколькими аргументами f(a, b, c) в цепочку функций с одним аргументом f(a)(b)(c). Позволяет создавать специализированные функции путём частичного применения. Широко используется в функциональных библиотеках (Ramda, fp-ts).

Partial application — создание новой функции с некоторыми предустановленными аргументами. Отличие от currying: partial application фиксирует сразу несколько аргументов и не обязана давать унарные функции. Function.prototype.bind() — встроенный механизм partial application.

Практическая ценность: создание переиспользуемых конфигурированных функций; point-free стиль (функции без явного упоминания аргументов); мемоизация с замыканием конфига; удобные предустановленные операторы для map/filter.`,
    code: `// Currying вручную
function add(a: number) {
  return function(b: number) {
    return a + b;
  };
}
const add5 = add(5);
add5(3); // 8
add5(10); // 15

// Универсальная функция curry
function curry<T extends unknown[], R>(fn: (...args: T) => R) {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    }
    return (...more: unknown[]) => curried(...args, ...more);
  };
}

const multiply = curry((a: number, b: number, c: number) => a * b * c);
const double   = multiply(2);        // partial: a=2
const sixTimes = multiply(2)(3);     // partial: a=2, b=3
sixTimes(4);                         // 24

// Partial application через bind
function log(level: string, message: string) {
  console.log(\`[\${level}] \${message}\`);
}
const logError = log.bind(null, "ERROR");
const logInfo  = log.bind(null, "INFO");

logError("Connection failed"); // [ERROR] Connection failed
logInfo("Server started");     // [INFO] Server started`,
  },
  {
    id: "js-24",
    question: "Что такое иммутабельность и как её достичь?",
    difficulty: "senior",
    tags: ["immutability", "functional", "object"],
    answer: `Иммутабельность — принцип, при котором объект после создания не изменяется; вместо мутации создаётся новый объект с нужными изменениями. Это упрощает отладку, делает изменения предсказуемыми и явными, облегчает сравнение по ссылке (===) в React для оптимизации ре-рендеров.

Object.freeze() делает объект поверхностно иммутабельным: нельзя добавлять/удалять/изменять свойства первого уровня. Вложенные объекты не замораживаются — нужна глубокая заморозка. structuredClone() создаёт глубокую копию объекта (ES2022), но не работает с функциями и классами.

Immer — популярная библиотека, позволяющая писать "мутирующий" код, а под капотом через Proxy создающая иммутабельный результат. Используется в Redux Toolkit. В TypeScript тип Readonly<T> и as const на уровне типов предотвращают случайную мутацию.`,
    code: `// Поверхностная заморозка
const config = Object.freeze({ db: { host: "localhost" }, port: 3000 });
config.port = 8080;        // тихо игнорируется (строгий режим → TypeError)
config.db.host = "remote"; // РАБОТАЕТ — глубокий объект не заморожен!

// Иммутабельное обновление вручную (spread)
const state = { user: { name: "Alice", age: 30 }, count: 0 };

const newState = {
  ...state,
  user: { ...state.user, age: 31 }, // глубокое обновление
  count: state.count + 1,
};

// Immer — читаемые мутации
import { produce } from "immer";

const nextState = produce(state, draft => {
  draft.user.age = 31;   // выглядит как мутация...
  draft.count++;          // ...но state не изменился!
});

// TypeScript: Readonly
type Config = Readonly<{
  host: string;
  port: number;
  db: Readonly<{ name: string }>;
}>;

// structuredClone — глубокое копирование
const deep = structuredClone({ a: { b: { c: 1 } } });
deep.a.b.c = 99; // исходник не тронут`,
  },
  {
    id: "js-25",
    question: "Что такое Observable и в чём отличие от Promise?",
    difficulty: "senior",
    tags: ["observable", "rxjs", "async", "stream"],
    answer: `Promise представляет одно асинхронное значение: однажды resolved/rejected, он заканчивается. Eager — начинает выполнение немедленно при создании, независимо от того, есть ли подписчик. Нельзя отменить.

Observable (RxJS) — ленивый поток из нуля или более значений во времени. Lazy: код не выполняется без вызова .subscribe(). Поддерживает отмену через unsubscribe(). Может эмитить множество значений (события, WebSocket-сообщения, HTTP retry). Позволяет применять операторы (pipe) для трансформации потока.

Ключевые операторы: map, filter, switchMap (отменяет предыдущий, берёт новый), mergeMap (параллельно), concatMap (последовательно), debounceTime (ждёт паузы), distinctUntilChanged (только при изменении), takeUntil (завершить по другому Observable), catchError. Angular использует Observable повсеместно (HttpClient, Router events).`,
    code: `import { Observable, fromEvent, interval } from "rxjs";
import { map, filter, debounceTime, switchMap, takeUntil } from "rxjs/operators";

// Promise — одно значение
const promise = fetch("/api/user"); // сразу начинает запрос!
const user = await promise;

// Observable — поток, ленивый
const observable = new Observable<number>(subscriber => {
  let i = 0;
  const id = setInterval(() => subscriber.next(i++), 1000);
  return () => clearInterval(id); // teardown при отписке
});

const sub = observable.subscribe(v => console.log(v)); // 0, 1, 2...
setTimeout(() => sub.unsubscribe(), 3500); // отменяем через 3.5 сек

// Типичный RxJS паттерн: поиск по мере набора
const searchInput = document.getElementById("search") as HTMLInputElement;
const results$ = fromEvent(searchInput, "input").pipe(
  map((e: Event) => (e.target as HTMLInputElement).value),
  filter(query => query.length > 2),
  debounceTime(300),                         // ждём паузу 300мс
  distinctUntilChanged(),                    // только если изменилось
  switchMap(query => fetch(\`/api?q=\${query\`).then(r => r.json())),
  // switchMap отменяет предыдущий запрос при новом вводе!
);

results$.subscribe(results => renderResults(results));`,
  },
];
