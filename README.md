# React App Template

A production-shaped **React 19 + Vite + TypeScript** starter built around
**atomic design**. It clones the architecture of a real admin app but ships with
an **in-project UI kit** (no external design-system dependency) and a **mock API
layer** so it runs end-to-end with zero backend.

Use it to start a new project from a stable, opinionated skeleton instead of
from scratch — then replace the example feature (`users`) with your own.

> 📘 **Building tomorrow?** [`docs/ADD_A_FEATURE.md`](docs/ADD_A_FEATURE.md) is a
> step-by-step, copy-paste cookbook for adding a new resource across every
> layer (types → constants → service → mock → organism → page → route), plus
> how to add UI components and switch to a real backend.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4000
```

The app starts in **mock mode** (`VITE_USE_MOCK=true`). Sign in with any email
and password — credentials are pre-filled on the login screen.

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Type-check + production build        |
| `npm run preview`   | Preview the production build         |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm run lint`      | ESLint                               |
| `npm run format`    | Prettier check                       |

## Architecture

```
src/
├── ui/                 # In-project UI kit (the "design system")
│   ├── atoms/          #   Button, Input, Text, Status, Spinner
│   └── molecules/      #   SearchInput, Table, Modal, Pagination, Sidebar…
├── organisms/          # Feature blocks: Authorization, Header, UserTable, UserModal
├── templates/          # Page shells: main-layout, pages-layout, auth-layout
├── pages/              # Route components (auth, home, users, not-found)
├── router/             # createBrowserRouter + Protected/Public routes
├── services/           # Data layer per feature (auth, users) — React Query hooks
├── lib/api/            # axios instance, base query/mutation hooks, mock adapter
├── mocks/              # In-memory DB + request handlers (mock mode only)
├── store/              # Zustand stores (auth, sidebar)
├── providers/          # QueryProvider (React Query)
├── constants/          # routes, urls, query-keys, sidebar list
├── hooks/              # useDebounce, useClickOutside, useSetParams
├── tokens/             # Design tokens (colors, typography) → Tailwind theme
├── utils/              # cn (tailwind-merge), storage, date
├── types/              # Shared cross-cutting types
└── _shared/            # App-wide singletons (Toaster)
```

**Layering rule:** `pages → templates/organisms → ui (molecules → atoms)`.
Data flows through `services → lib/api`. Lower layers never import from higher
ones.

### The example feature (`users`)

Everything for the Users screen demonstrates one full vertical slice you can
copy for a new resource:

- `services/users` — typed React Query hooks (`useUsers`) for list + CRUD
- `organisms/UserTable` — search, table, pagination, row actions
- `organisms/UserModal` — react-hook-form + zod create/edit form
- `pages/users.tsx` — composes the above inside `PagesLayout`

The `auth` service + `Authorization` organism show the same pattern for a form
that talks to the store.

## Mock data → real backend

Requests are intercepted by a small axios adapter (`src/lib/api/mock`) that
matches them against handlers in `src/mocks/handlers.ts`. The service layer uses
the **real** `useGet`/`useCreate`/… hooks against `URLS`, so nothing in services
or organisms changes when you go live:

1. Set `VITE_USE_MOCK=false` in `.env`
2. Point `VITE_BASE_URL` at your API
3. Delete `src/mocks/` once every endpoint is real

## Conventions

- **Component folder** = `Component.tsx` + `Component.tokens.ts` (Tailwind class
  strings) + `Component.types.ts` + `index.ts` barrel.
- **Path alias** `@/*` → `src/*`.
- **Design tokens** live in `src/tokens` and feed both `tailwind.config.ts` and
  the `cn()` merge helper — change brand colors in one place.

No tests or Storybook are included by design — add them when the project needs
them.
