# Tech context — TaskFlow

Версии, скрипты и зависимости — `package.json`; правила кода и команды — `AGENTS.md`. Здесь контракты и ловушки окружения.

## HTTP-контракт

| Метод и путь                       | Тело                                         | Ответ                                    | Примечание                                         |
| :--------------------------------- | :------------------------------------------- | :--------------------------------------- | :------------------------------------------------- |
| `GET /api/notes`                   | —                                            | `Note[]`                                 | только заметки пользователя сессии                 |
| `PATCH /api/notes/[id]`            | `NoteContent`: `x`, `y`, `content`, `height` | `Note`                                   | `upsert` по `id` — создаёт карточку, если её нет   |
| `DELETE /api/notes/[id]`           | —                                            | `{ success: true }`                      |                                                    |
| `GET /api/board/view`              | —                                            | `Board`: `x`, `y`, `zoom`                | создаёт запись доски, если её нет                  |
| `PATCH /api/board/view`            | `Board` целиком                              | `Board`                                  | частичного обновления нет                          |
| `POST /api/ai`                     | `{ text, action: 'improve' \| 'summarize' }` | `{ result }`; `400 { error: 'No text' }` | без авторизации; ошибка модели — 200 и пустой `{}` |
| `GET/POST /api/auth/[...nextauth]` | —                                            | NextAuth                                 | Google-провайдер, `pages.signIn = '/'`             |

- Защищённые роуты: `auth()` → `401 { error: 'Unauthorized' }`; исключение → `console.error(error)` и `500 { error }`
- Клиент ходит в свои роуты только через `src/entities/*/api/*.api.ts` (axios, относительные пути)

## Next.js 16

- `params` в route handler — `Promise`, читается через `await`; каталога `node_modules/next/dist/docs` в 16.1.6 нет
- `middleware.ts` (`withAuth`) закрывает только `/board/:path*`: `/api/**` проверяют сессию самостоятельно
- `next.config.ts`: `reactStrictMode` и `images.remotePatterns` для `lh3.googleusercontent.com` (аватар Google)
- Сессия — JWT: пользователь создаётся в `jwt`-колбэке по email, `session.user.id` дотипирован в
  `src/types/next-auth.d.ts`; adapter Prisma не подключён (см. `defects.md`, `D-09`)

## Окружение и данные

- `.env` (не читать и не выводить) содержит `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENROUTER_API_KEY`
- Prisma 7 + `@prisma/adapter-pg`: подключение и singleton — `src/lib/db.ts`, конфиг CLI — `prisma.config.ts` (берёт `DATABASE_URL`)
- Prisma Client генерируется в `postinstall`; каталога `prisma/migrations` нет — история схемы не инициализирована
- Пакетный менеджер — pnpm (`pnpm-lock.yaml`, `node_modules/.pnpm`), но CLI `pnpm` в среде недоступна: скрипты через `npm run`
- Сломанные проверки — `D-01` (`npm run lint`), `D-02` (`npx tsc --noEmit`)

## Тесты

- Jest 30 + `next/jest` (SWC-трансформ, без `ts-node` и Babel): конфиг `jest.config.mjs` (JSDoc-типы), окружение `jsdom`;
  `jest.setup.ts` подключает `@testing-library/jest-dom`
- Юнит- и компонентные тесты лежат рядом с модулем: `src/**/*.test.ts(x)`, стек `@testing-library/react` + `user-event`,
  алиас `@/*` маппится в `moduleNameMapper`
- E2E — Playwright (`@playwright/test`) в `e2e/*.spec.ts`, конфиг `playwright.config.ts`: chromium, `baseURL`
  `http://localhost:3000`, `webServer` поднимает `npm run dev`; браузер ставится `npx playwright install chromium`
- Мутации — Stryker (`stryker.config.json`, плагин `@stryker-mutator/jest-runner`): `mutate` — `src/hooks/**`, `src/store/**`,
  отчёт `reports/mutation/index.html`. `plugins` задан явно: при pnpm-раскладке автопоиск `@stryker-mutator/*` не срабатывает
- Скрипты: `npm test`, `npm run test:coverage`, `npm run test:e2e`, `npm run test:mutate`
- Ловушка: `testMatch` задаётся относительно (`**/*.test.{ts,tsx}` при `roots: ['<rootDir>/src']`), а не как
  `<rootDir>/src/**` — иначе песочница Stryker в `.stryker-tmp` не матчится (glob не пересекает сегмент с точкой) и прогон
  падает с «No tests were found»
