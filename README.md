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
> how to add UI components, write tests, and switch to a real backend.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4000
```

The app starts in **mock mode** (`VITE_USE_MOCK=true`). Sign in with any email
and password — credentials are pre-filled on the login screen.

## Scripts

| Script                  | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the dev server                           |
| `npm run build`         | Type-check + production build                  |
| `npm run preview`       | Preview the production build                   |
| `npm run typecheck`     | `tsc --noEmit`                                 |
| `npm run lint`          | ESLint, including the layer-boundary rules     |
| `npm run format`        | Prettier check                                 |
| `npm run test`          | Vitest, once                                   |
| `npm run test:watch`    | Vitest, watching                               |
| `npm run test:coverage` | Coverage report                                |
| `npm run validate`      | lint + format + typecheck + test — the CI gate |

A `pre-commit` hook (husky + lint-staged) formats and lints staged files; the
[CI workflow](.github/workflows/ci.yml) runs the full gate plus a build.

## Architecture

```
src/
├── ui/                 # In-project UI kit (the "design system")
│   ├── atoms/          #   Button, Input, Select, Text, Status, Spinner
│   └── molecules/      #   SearchInput, Table, Modal, Pagination, Sidebar…
├── organisms/          # Feature blocks: Authorization, Header, UserTable, UserModal
├── templates/          # Page shells: main-layout, pages-layout, auth-layout
├── pages/              # Route components (auth, home, users, not-found, error)
├── router/             # createBrowserRouter + Protected/Public routes
├── services/           # Data layer per feature (auth, users) — React Query hooks
├── lib/api/            # axios instance, base query/mutation hooks, mock adapter
├── mocks/              # In-memory DB + request handlers (mock mode only)
├── store/              # Zustand stores (auth, sidebar, theme)
├── providers/          # QueryProvider, ThemeProvider
├── constants/          # routes, urls, query-keys, sidebar list
├── hooks/              # useDebounce, useClickOutside, useSetParams, useTheme
├── tokens/             # Design tokens (brand ramps + semantic roles) → Tailwind
├── utils/              # cn (tailwind-merge), date
├── types/              # Shared cross-cutting types
├── test/               # Test setup + render helpers
└── _shared/            # App-wide singletons (Toaster, ErrorBoundary)
```

**Layering rule:** `pages → templates/organisms → ui (molecules → atoms)`.
Data flows through `services → lib/api`. Lower layers never import from higher
ones — and this is **enforced by ESLint**, not by convention: each layer
declares what it may not import in `eslint.config.mjs`, so a violation fails
`npm run lint` instead of being noticed in review.

### The example feature (`users`)

Everything for the Users screen demonstrates one full vertical slice you can
copy for a new resource:

- `services/users` — one typed React Query hook per operation
  (`useUsersQuery`, `useUserQuery`, `useCreateUser`, `useUpdateUser`,
  `useDeleteUser`), so a component only subscribes to what it uses
- `organisms/UserTable` — search, table, pagination, row actions, error + empty
  states
- `organisms/UserModal` — react-hook-form + zod create/edit form
- `pages/users.tsx` — composes the above inside `PagesLayout`

The `auth` service + `Authorization` organism show the same pattern for a form
that talks to the store.

## Design language: Ant Design

The UI kit is styled to **Ant Design v5** — its palettes, 32px control heights,
6px radii, `#fafafa` table headers, tag chips, outlined pagination and the navy
`#001529` Sider. No `antd` dependency: it is the project's own kit wearing AntD's
design language, so you keep the atomic-design structure, the tests and the
layer rules.

Two color layers, one source of truth each:

- **Brand ramps** — `src/tokens/colors.ts`. AntD's palettes as fixed hues
  (`bg-primary-10`, `bg-success-30`) that mean the same thing in any theme.
- **Semantic roles** — `src/tokens/semantic.ts`. The job a color does:
  `bg-canvas`, `bg-surface`, `text-content`, `text-content-muted`,
  `border-line`, `bg-tone-danger`, `bg-destructive`, `text-accent-text`. Each
  role has a light and a dark value (AntD's default and dark algorithms);
  `tailwind.config.ts` turns them into CSS custom properties on `:root` /
  `.dark`.

Because components use roles, **dark mode needs no `dark:` classes** — the
entire UI kit is written once. The header toggle switches themes, the choice
persists, `system` follows the OS, and an inline script in `index.html` applies
it before first paint so a dark reload never flashes white.

### Where this deviates from AntD, and why

Contrast is not eyeballed: `src/tokens/semantic.test.ts` computes the WCAG ratio
for every foreground/background pair in both themes and fails below AA. Three of
Ant Design's own pairings do not clear it, so each takes the neighbouring step
from the _same_ AntD palette — visually near-identical, measurably readable:

| Role                | AntD             | Here             | Why                    |
| ------------------- | ---------------- | ---------------- | ---------------------- |
| Primary button fill | blue-6 `#1677FF` | blue-7 `#0958D9` | white label was 4.10:1 |
| Danger button fill  | red-5 `#FF4D4F`  | red-7 `#CF1322`  | white label was 3.27:1 |
| Tag label           | palette step 7   | step 8           | ~3.4:1 on its own chip |

For the same reason `accent` (a fill behind white text) and `accent-text` (the
accent _as_ text on a surface) are separate roles — in dark mode no single blue
can satisfy both. If you would rather have AntD's exact blue and accept 4.10:1,
change `accent` in `src/tokens/semantic.ts` and move that pair into
`largeTextPairs` in the test.

## Mock data → real backend

Requests are intercepted by a small axios adapter (`src/lib/api/mock`) that
matches them against handlers in `src/mocks/handlers.ts`. Handlers can also fail
on purpose (`throw new MockHttpError(500)`), which is how the error states and
the token-refresh path are exercised. The service layer uses the **real**
`useGet`/`useCreate`/… hooks against `URLS`, so nothing in services or organisms
changes when you go live:

1. Set `VITE_USE_MOCK=false` in `.env`
2. Point `VITE_BASE_URL` at your API
3. Delete `src/mocks/` once every endpoint is real

Auth is already complete for a real backend: the request interceptor attaches
the bearer token, and the error interceptor performs a **silent refresh** on
`401` — one shared refresh for all requests that failed together, the original
request replayed, and the session cleared if the refresh fails.

## Testing

Vitest + Testing Library, with `src/test/utils.tsx` supplying the router and
query-cache wrappers. The suite is small on purpose — it demonstrates the level
to write at, rather than chasing coverage:

- pure logic (`twMerge`, palette contrast, pagination maths)
- component behaviour and accessibility (focus trap, table states, button)
- the mock API contract (`mocks/handlers.test.ts`)
- service integration against the real axios path (`services/users`)
- the refresh/401 interceptor, including concurrent requests

```bash
npm run test
```

## Conventions

- **Component folder** = `Component.tsx` + `Component.tokens.ts` (Tailwind class
  strings) + `Component.types.ts` + `index.ts` barrel.
- **Path alias** `@/*` → `src/*`.
- **Colors** come from tokens — semantic for structure, ramps for brand. Never a
  raw hex in a component.
- **List hooks expose `isError` and `refetch`**, and tables render a real error
  state; "empty" must never stand in for "failed".
