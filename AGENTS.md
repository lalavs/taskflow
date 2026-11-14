<!-- BEGIN:nextjs-agent-rules -->

This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may differ from your training data. Verify the `next` API against the installed version (`node_modules/next` types, 16.1.6) and the official documentation before writing code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project Overview

TaskFlow — доска заметок: карточки на бесконечном полотне с панорамированием и зумом, вход через Google, ИИ-действия над
текстом карточки. Стек: Next.js 16 App Router + TypeScript, Tailwind 4, Prisma 7 + PostgreSQL, NextAuth, Zustand, dnd-kit,
axios, OpenAI через OpenRouter. Знания о проекте — в `memory-bank/`, карта документов — `memory-bank/index.md`.

Слои (`@/*` → `src/*`):

- `src/app/**` — роуты App Router: `page.tsx`, `layout.tsx`, клиентские корни (`BoardClient.tsx`) и `api/**/route.ts` как
  HTTP-граница
- `src/entities/<entity>/api/*.api.ts` — вызовы своих роутов через `axios`; `src/entities/<entity>/model/*.repo.ts` —
  запросы Prisma
- `src/components/{ui,layout}` — переиспользуемые компоненты; `src/store` — Zustand-сторы; `src/hooks` — хуки
- `src/lib` — `auth` (NextAuth), `db` (Prisma Client), `ai` (OpenRouter); `src/types` — общие типы

Новая функциональность раскладывается по этим слоям: страница читает данные на сервере через `*.repo.ts`, мутации живут
в `route.ts` и вызываются из `*.api.ts`.

## Код

- Server Components по умолчанию; `'use client'` — только для интерактивности и браузерных API, минимальным островом
  (эталон — `src/app/board/BoardClient.tsx`). Данные читаются на сервере через `*.repo.ts`, а не повторным запросом с клиента.
- Next.js 16: динамические сегменты приходят асинхронно (`const { id } = await params` в route handler); перед
  использованием незнакомого API сверяйся с типами установленного пакета `next`. Каталога `node_modules/next/dist/docs`
  в 16.1.6 нет.
- Строгая типизация без `any` (`unknown` для неизвестного типа); `tsconfig.json` включает `noUncheckedIndexedAccess`. Типы
  пропсов — локальный `interface <Component>Props`, общие сущности — в `src/types`. Без необоснованных `as` и `!`
  (существующие `!` в `src/lib/auth.ts` — долг, в новом коде так не пишем).
- API-роут: `auth()` → 401 `{ error: 'Unauthorized' }` → работа → `NextResponse.json(...)`; исключения ловятся `try/catch`,
  логируются `console.error(error)` и возвращаются как 500 `{ error: '<что не удалось>' }`. Тело запроса проверяй до записи в БД.
- Один файл — один экспортируемый компонент или модуль, ≤200 строк для `src/**` (сейчас максимум 138).
- Имена: компоненты и типы — PascalCase (`NoteCard`, `Board`), функции и хуки — camelCase (`usePageActions`), файлы
  компонентов — `NoteCard.tsx`, хуки — `useAI.ts`, слои сущностей — `note.api.ts`, `note.repo.ts`, `ai.service.ts`,
  сторы — `boardStore.ts`, страницы и роуты — по соглашению App Router.
- Стили — Tailwind-утилиты в разметке и `clsx` для условных классов; CSS-модулей нет.
- Комментарий — «почему», а не «что»: если знающему синтаксис читать нечего — комментарий лишний. Без `console.log`,
  мёртвых блоков и временных флагов; `console.error` в `catch` — принятый в проекте способ логирования ошибок.
- Сначала соглашения проекта, потом новые подходы; новые абстракции и зависимости — при обоснованной необходимости.

## Команды

| Команда                                    | Назначение                                                        |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `npm run dev`                              | dev-сервер, порт 3000 — гаси после задачи                         |
| `npm run build`                            | production-сборка в `.next/`                                      |
| `npm start`                                | запуск собранного приложения                                      |
| `npm run lint`                             | ESLint 9, flat config `eslint.config.mjs`                         |
| `npm run lint:fix`                         | ESLint с `--fix`                                                  |
| `npx tsc --noEmit`                         | проверка типов (скрипта `typecheck` в `package.json` нет)         |
| `npm run format`                           | Prettier по всему репозиторию, включая `.md` — запускай осознанно |
| `npx prettier --write` / `--check <файлы>` | точечное форматирование изменённых файлов                         |
| `npx prisma generate`                      | генерация Prisma Client (выполняется в `postinstall`)             |
| `npx prisma migrate dev`                   | миграции схемы — только с разрешения пользователя                 |

Пакетный менеджер — pnpm (`pnpm-lock.yaml`, раскладка `node_modules/.pnpm`), но CLI `pnpm` в среде недоступна: скрипты
запускаются через `npm run`, установка и обновление пакетов — только по согласованию.
Форматирование — `.prettierrc` (`printWidth: 150`, одинарные кавычки, `trailingComma: all`); `.gitattributes` в проекте
нет, EOL — LF по умолчанию Prettier. Изменённые файлы форматируй точечно и проверяй `npx prettier --check <файлы>`.
Списки оформляй через `-` с отступами для вложенности — символ `•` Prettier схлопывает в абзац.

## Проверки

- Минимум после изменений: `npm run lint`, `npx tsc --noEmit`, `npm run build`; поведение проверяется запуском
  `npm run dev` и прохождением затронутого сценария.
- Автотестов в проекте нет: Jest, Playwright, Stryker и Testing Library не установлены, каталогов `__tests__/` и `tests/`
  нет. Не выдумывай `npm test`, `npm run e2e`, `npm run mutate` — таких скриптов не существует.
- Внедрение тестового стека — только с согласования (новые зависимости); после согласования соглашения (каталог, имя
  `<модуль>.test.ts(x)`, моки `@/*`) фиксируются здесь же.
- Не сообщай о пройденных проверках, которых не запускал.

## Данные

База — PostgreSQL, доступ через Prisma 7 (`@prisma/adapter-pg`) и `DATABASE_URL` из `.env` (файл не читать и не выводить).
Схема — `prisma/schema.prisma` (`User`, `Note`, `BoardView`), конфиг — `prisma.config.ts`, клиент — `src/lib/db.ts`.
Потребители — `src/app/api/notes/**`, `src/app/api/board/view/route.ts`, страница `src/app/board/page.tsx`.
Каталога `prisma/migrations` пока нет — история миграций не инициализирована. Без явного разрешения: `prisma migrate dev/reset`,
`prisma db push`, ручные DDL/DROP и любые операции, меняющие данные в подключённой базе.

## Известные ограничения окружения

Оба дефекта существуют до правок и не являются регрессией ваших изменений. Не обходи их заглушками, `@ts-expect-error`,
удалением конфига или правкой `package.json` без согласования — фиксируй как известное ограничение.

- `npm run lint` падает до линтинга: `eslint.config.mjs` спредит `eslint-config-prettier` (`...prettier`), а версия 10
  экспортирует объект, а не массив — `TypeError: prettier is not iterable`.
- `npx tsc --noEmit` падает на `prisma.config.ts`: `TS2307: Cannot find module 'prisma/config'` — пакета `prisma` нет в
  `devDependencies`, он доступен только транзитивно.

## Memory Bank

`memory-bank/index.md` — карта документов и маршрутизация; открывай его первым и читай только нужные документы.
Документы: `projectbrief.md` (границы и инварианты), `techContext.md` (HTTP-контракт и окружение), `systemPatterns.md`
(решения и поток данных), `defects.md` (открытые дефекты и долги).
`memory-bank/maintenance.md` и `memory-bank/activeContextRules.md` подгружай только при обновлении банка.
Если документация противоречит коду — выясни причину, а не предполагай; состояние проекта в документах не хранится
(источник — код и `git log`), архитектуру и технические решения фиксируй при их изменении.
