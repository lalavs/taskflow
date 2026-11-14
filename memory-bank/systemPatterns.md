# System patterns — TaskFlow

## Поток данных

1. `/board` — Server Component: `auth()` → `redirect('/')` → `getAllNotes(userId)` и `getBoardView(userId)` из `*.repo.ts`
2. `BoardClient` — клиентский корень: данные один раз пишутся в Zustand (`cardStore`, `boardStore`) в `useEffect`, дальше
   источник состояния для UI — сторы
3. Мутации: оптимистичное изменение стора → `entities/*/api` (axios) → `route.ts` → Prisma; ответ сервера стор не перезаписывает
4. Лендинг `(landing)/page.tsx` — серверная страница, клиентский остров — `Header` (сессия, вход и выход)
5. ИИ: `NoteCard` → `hooks/useAI` → `entities/ai/api` → `POST /api/ai` → `lib/ai/ai.service` (OpenRouter); результат попадает
   в стор и сохраняется тем же debounce, что и ручная правка текста

## Решения и причины

- **Prisma 7 + `@prisma/adapter-pg`**: в 7.x клиент требует драйвер-адаптер; singleton в `globalThis` — чтобы HMR не плодил пулы
- **`upsert` вместо пары POST/PATCH**: `id` известен клиенту заранее, отдельный роут создания не нужен
- **`upsert` при чтении доски**: запись `BoardView` появляется без отдельного шага инициализации
- **Zustand вместо TanStack Query**: кэш и инвалидация не нужны, вся доска — один клиентский снимок; TanStack Query удалён намеренно
- **Порог активации drag**: без него dnd-kit съедает клик и двойной клик по карточке; значение — UX-правила в `projectbrief.md`
- **Координаты полотна**: `delta` при drag делится на `zoom`, смещение карточек масштабируется вручную — иначе при зуме ≠ 1
  карточка уходит от курсора
- **Сохранение по событиям**: карточка сохраняется в `handleDragEnd`, текст и зум — debounce 500 мс; так меньше запросов при
  наборе текста и прокрутке колесом
- **`Board` сохраняется целиком**: `updateBoardView` делает `boardView.update` с полным объектом, частичных PATCH нет

## Ловушки БД

- Нет `prisma/migrations`: изменения схемы применяются вне репозитория (`defects.md`)
- `Note` без `createdAt`/`updatedAt`: нет сортировки и «последних изменений»
- `BoardView.userId` уникален — вторая доска на пользователя невозможна по схеме
- `PATCH /api/notes/[id]` ожидает все поля `NoteContent`: при `upsert` пропущенное поле даёт ошибку Prisma, а не частичное обновление
- `height` — пиксели, снятые со `scrollHeight` на момент ввода: зависят от ширины карточки и шрифта
