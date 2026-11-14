# Дефекты и долги

`ID` не перенумеровывается; закрытая запись переезжает в «Закрытые», а не удаляется. Формат: `D-NN` — суть, путь к коду.

## Открытые

- **D-01** — `npm run lint` падает до линтинга: `eslint.config.mjs` спредит `eslint-config-prettier` (объект, не массив)
- **D-02** — `npx tsc --noEmit` падает: `prisma.config.ts` не находит `prisma/config`, пакета `prisma` нет в `devDependencies`
- **D-03** — IDOR: `PATCH` и `DELETE /api/notes/[id]` не проверяют `userId` — любой авторизованный меняет и удаляет чужие карточки
  (`src/app/api/notes/[id]/route.ts`)
- **D-04** — `POST /api/ai` без `auth()` и `try/catch`: ошибка модели возвращает 200 и пустой `{ result }`
  (`src/app/api/ai/route.ts`, `src/lib/ai/ai.service.ts`)
- **D-05** — тела `PATCH`-запросов не валидируются, значения уходят в Prisma как есть (`notes/[id]`, `board/view`)
- **D-06** — нет каталога `prisma/migrations`: история схемы не инициализирована, дрейф не отслеживается
- **D-07** — `user.email!` в `src/lib/auth.ts`; типы сессии дописаны вручную в `src/types/next-auth.d.ts`
- **D-08** — нет скрипта `typecheck`: проверка типов запускается только как `npx tsc --noEmit` (`package.json`)
- **D-09** — `@auth/prisma-adapter` установлен, но не подключён: сессия на JWT (`package.json`, `src/lib/auth.ts`)
- **D-10** — лендинг обещает «Kanban Boards» и «Real-time updates», в коде этого нет (`src/app/(landing)/components/*`)
- **D-11** — `useDebounce` не очищает таймер при размонтировании (`src/hooks/useDebounce.ts`)
- **D-12** — несуществующий Tailwind-класс `transition-color` (`src/app/board/components/AIActions.tsx`)
- **D-13** — ошибка ИИ-запроса всплывает неперехваченной: в `useAI` только `try/finally`, без `catch` (`src/hooks/useAI.ts`)

## Закрытые
