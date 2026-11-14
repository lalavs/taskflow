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
- Автотестов нет; сломанные проверки — `D-01` (`npm run lint`), `D-02` (`npx tsc --noEmit`)
