# Guide: add a new feature (resource)

This is the recipe you follow tomorrow. It walks through adding a brand-new
resource — **`products`** — across every layer, mirroring the existing
`users` feature one-to-one. Copy `users`, rename, adjust the fields.

> **Mental model.** A feature is one vertical slice through the layers:
>
> ```
> page  →  organism (table + modal)  →  service hooks  →  lib/api  →  (mock | backend)
>          UI kit (atoms/molecules)        constants (urls, query-keys, routes)
> ```
>
> Build it **bottom-up**: types → constants → service → mock → organism → page → route.

The fastest path: **copy the matching `users` file, then edit.** Every step
below names the file to copy from.

---

## 1. Types — `src/services/products/types.ts`

Copy `src/services/users/types.ts`. Define the response DTO (what the API
returns), the request DTO (what you send on create/update), and the delete
response.

```ts
export type ProductStatus = 'draft' | 'published' | 'archived'

export type ProductResponseDto = {
  id: string
  name: string
  price: number
  status: ProductStatus
  created_at: string
}

export type ProductRequestDto = {
  name: string
  price: number
  status: ProductStatus
}

export type DeleteProductResponse = {
  status: string
  id: string
}
```

## 2. Constants — endpoints, query keys, routes

**`src/constants/urls.ts`** — add the endpoint group:

```ts
export const URLS = {
  // ...existing
  products: {
    get: '/products',
    create: '/products',
    getById: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
}
```

**`src/constants/query-keys.ts`** — add cache keys:

```ts
export const QUERY_KEYS = {
  // ...existing
  PRODUCTS: 'PRODUCTS',
  PRODUCT: 'PRODUCT',
}
```

**`src/constants/routes.ts`** — add the route:

```ts
export const ROUTES = {
  // ...existing
  PRODUCTS: '/products',
}
```

## 3. Service — `src/services/products/queries.ts`

Copy `src/services/users/queries.ts` and replace `Product`→your resource. The
shape: a `productsKeys` object that owns every cache key, one hook per
operation, and each mutation invalidating through that object. **You don't
touch this file again when you wire a real backend** — it already uses the real
`useGet`/`useCreate`/… hooks.

> **Why one hook per operation?** A component that only deletes should not
> subscribe to the list query. Splitting reads from writes keeps each consumer
> paying for exactly what it uses.

```ts
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import type {
  DeleteProductResponse,
  ProductRequestDto,
  ProductResponseDto,
} from './types'
import { QUERY_KEYS, URLS } from '@/constants'
import {
  useCreate,
  useDelete,
  useGet,
  useGetOne,
  useUpdatePut,
  type EnabledQuery,
  type ResponseDataWithPagination,
} from '@/lib/api'
import type { Callbacks } from '@/types'

export const productsKeys = {
  all: [QUERY_KEYS.PRODUCTS] as const,
  list: (search: string) => [QUERY_KEYS.PRODUCTS, search] as const,
  detail: (id: string) => [QUERY_KEYS.PRODUCT, id] as const,
}

const useInvalidateProducts = () => {
  const queryClient = useQueryClient()
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: productsKeys.all }),
    [queryClient]
  )
}

export const useProductsQuery = (options?: EnabledQuery) => {
  const { search } = useLocation()

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGet<ResponseDataWithPagination<ProductResponseDto>>(
    productsKeys.list(search),
    URLS.products.get,
    { enabledLoad: options?.enabledLoad ?? true }
  )

  return { products, isLoadingProducts, isProductsError, refetchProducts }
}

export const useProductQuery = (id: string, enabled?: boolean) => {
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useGetOne<ProductResponseDto>(
    productsKeys.detail(id),
    URLS.products.getById(id),
    enabled
  )
  return { product, isLoadingProduct, isProductError }
}

export const useCreateProduct = () => {
  const invalidate = useInvalidateProducts()
  const { mutate, isPending: isCreating } = useCreate<
    ProductRequestDto,
    ProductResponseDto
  >(URLS.products.create)

  const createProduct = (
    data: ProductRequestDto,
    callbacks?: Callbacks<ProductResponseDto>
  ) =>
    mutate(data, {
      onSuccess: (res) => {
        invalidate()
        callbacks?.onSuccess?.(res)
      },
      onError: (e) => callbacks?.onError?.(e),
    })

  return { createProduct, isCreating }
}

// useUpdateProduct / useDeleteProduct follow the same pattern —
// copy them from src/services/users/queries.ts.
```

**Always surface `isError` and `refetch` from a list hook.** The `Table`
molecule takes `isError` / `onRetry` and renders a distinct error state; a
component that ignores them shows "no results" when the request actually
failed, which is the single most common lie in a CRUD UI.

**`src/services/products/index.ts`:**

```ts
export * from './queries'
export type * from './types'
```

**`src/services/index.ts`** — add `export * from './products'`.

## 4. Mock data — `src/mocks/`

Add a `products` array to `src/mocks/db.ts` and handlers to
`src/mocks/handlers.ts`. Copy the five `users` handlers (list / getById /
create / update / delete) and swap the path + array. This is the **only**
fake-data step — it disappears when you switch to a real backend.

```ts
// db.ts
export const db = {
  users: seedUsers(),
  products: [
    {
      id: '1',
      name: 'Starter plan',
      price: 19,
      status: 'published',
      created_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Pro plan',
      price: 49,
      status: 'draft',
      created_at: '2024-01-02',
    },
  ],
}
```

```ts
// handlers.ts — push these into the mockHandlers array
{ method: 'get', pattern: /^\/products$/, resolve: ({ params }) => {
    const search = (params.search ?? '').toLowerCase()
    const page = Number(params.page ?? 1)
    const limit = Number(params.limit ?? 10)
    let result = db.products
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search))
    return paginate(result, page, limit)
}},
{ method: 'get', pattern: /^\/products\/([^/]+)$/, resolve: ({ match }) =>
    db.products.find((p) => p.id === match[1]) ?? null },
{ method: 'post', pattern: /^\/products$/, resolve: ({ body }) => {
    const p = { id: nextId(), created_at: new Date().toISOString(), ...(body as object) }
    db.products.unshift(p as never)
    return p
}},
{ method: 'put', pattern: /^\/products\/([^/]+)$/, resolve: ({ match, body }) => {
    const i = db.products.findIndex((p) => p.id === match[1])
    if (i === -1) return null
    db.products[i] = { ...db.products[i], ...(body as object), id: match[1] }
    return db.products[i]
}},
{ method: 'delete', pattern: /^\/products\/([^/]+)$/, resolve: ({ match }) => {
    db.products = db.products.filter((p) => p.id !== match[1])
    return { status: 'success', id: match[1] }
}},
```

> The mock adapter matches `method` + `pattern` against the request path.
> List route (`/^\/products$/`) and detail route (`/^\/products\/([^/]+)$/`)
> are distinct because of the trailing `$`.

## 5. Organism — table + modal

Copy the whole folders and rename:

- `src/organisms/UserTable/` → `ProductTable/`
  - `*.data.tsx` — the TanStack column definitions (header + `cell` renderers).
  - `*.tsx` — search + `<Table>` + `<Pagination>` + row actions + delete modal.
  - `*.tokens.ts` — the Tailwind class strings.
- `src/organisms/UserModal/` → `ProductModal/`
  - `*.schema.ts` — the **zod** schema + `defaultValues`.
  - `*.tsx` — react-hook-form form inside `<Modal>`.

Then register them in **`src/organisms/index.ts`** (export the Modal before the
Table — the Table imports the Modal through the barrel):

```ts
export * from './ProductModal'
export * from './ProductTable'
```

Inside the table/modal, the only edits are: the service hooks
(`useProductsQuery`, `useDeleteProduct`, …), the columns, and the form fields.

## 6. Page — `src/pages/products.tsx`

Copy `src/pages/users.tsx`:

```tsx
import { useState } from 'react'
import { PlusIcon } from '@/assets/icons'
import { ProductModal, ProductTable } from '@/organisms'
import { PagesLayout } from '@/templates'
import { Button } from '@/ui'

export const ProductsPage = () => {
  const [openAdd, setOpenAdd] = useState(false)
  return (
    <PagesLayout
      title={<h1 className="text-2xl font-bold text-content">Products</h1>}
      actions={
        <Button icon={PlusIcon} onClick={() => setOpenAdd(true)}>
          Add product
        </Button>
      }
      content={<ProductTable />}
      modal={
        openAdd && (
          <ProductModal
            mode="add"
            open={openAdd}
            onClose={() => setOpenAdd(false)}
          />
        )
      }
    />
  )
}
```

Add `export * from './products'` to **`src/pages/index.ts`**.

## 7. Route + sidebar

**`src/router/index.tsx`** — lazy-load the page and add a child route under
`MainLayout`:

```tsx
const ProductsPage = lazy(() =>
  import('@/pages').then((m) => ({ default: m.ProductsPage }))
)
// inside children: [...]
{ path: 'products', element: suspense(<ProductsPage />) },
```

**`src/constants/sidebar-list.tsx`** — add a nav item (pick an icon from
`src/assets/icons`):

```tsx
{ label: 'Products', href: ROUTES.PRODUCTS, icon: BoxIcon },
```

## 8. Verify

```bash
npm run validate      # lint + format + typecheck + tests, the same gate as CI
npm run dev           # click through: list, search, paginate, add, edit, delete
```

Check both themes with the toggle in the header — semantic tokens make that
free, but a hardcoded color will show up immediately.

That's the whole loop. The `users` feature is your reference implementation for
every one of these steps.

---

## Adding a UI kit component

- **Atom** (e.g. a `Badge`): create `src/ui/atoms/Badge/` with
  `Badge.tsx`, `Badge.tokens.ts` (Tailwind strings), `Badge.types.ts`,
  `index.ts`; then add `export * from './Badge'` to `src/ui/atoms/index.ts`.
  Atoms may only import other atoms + `cn` from `@/utils`.
- **Molecule** (composes atoms): same folder shape under
  `src/ui/molecules/`, register in `src/ui/molecules/index.ts`. Import atoms
  from `@/ui/atoms`.

### Colors: semantic first

The kit follows **Ant Design v5**: 32px controls (`h-control`), 6px radii
(`rounded`), `shadow-card` / `shadow-modal` elevation and AntD's palettes.

There are two color layers, and picking the right one is what makes a component
work in dark mode without a single `dark:` class.

`accent` is a _fill_ that carries white text; `accent-text` is the accent used
_as_ text or an icon. They differ in dark mode — use the right one.

| Use                                     | When                                                                                | Examples                                                                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Semantic** (`src/tokens/semantic.ts`) | anything structural — backgrounds, text, borders, status chips, destructive actions | `bg-surface`, `bg-canvas`, `text-content`, `text-content-muted`, `border-line`, `bg-tone-danger`, `text-accent-text`, `bg-destructive` |
| **Brand ramp** (`src/tokens/colors.ts`) | a hue that must stay itself in both themes                                          | `bg-primary-10`, `bg-info-30`                                                                                                          |

Never a raw hex. `src/tokens/semantic.test.ts` asserts WCAG AA contrast for every
foreground/background pair, so adding a token means adding it to that list too.
It also fails if a semantic token is named after a ramp — `theme.colors` spreads
the ramps first, so a semantic `danger` would silently wipe out `danger-10..50`
(this is why the destructive token is called `destructive`).

### Layer rules are enforced

`eslint.config.mjs` declares which layers each folder may import. A UI component
that reaches into `@/services`, or a page imported from an organism, fails
`npm run lint` — you do not have to remember the diagram.

## Testing a new feature

Vitest + Testing Library are wired up; `src/test/utils.tsx` provides the
providers every component assumes.

Pick the cheapest level that can catch the bug:

| Level                 | Use for                                      | Example in this repo                                       |
| --------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Pure function         | formatting, pagination maths, palette rules  | `src/utils/twMerge.test.ts`, `src/tokens/semantic.test.ts` |
| Component             | states, keyboard behaviour, accessible names | `src/ui/molecules/Modal/Modal.test.tsx`                    |
| Handler               | the mock API contract itself                 | `src/mocks/handlers.test.ts`                               |
| Service (integration) | URL, query key and response shape lining up  | `src/services/users/queries.test.tsx`                      |

Service tests run against the **real** axios instance with the mock adapter
attached, so they exercise the same path the app does:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { createHookWrapper } from '@/test/utils'
import { resetDb } from '@/mocks'

beforeEach(() => resetDb())

it('loads the first page', async () => {
  const { wrapper } = createHookWrapper('/products')
  const { result } = renderHook(() => useProductsQuery(), { wrapper })

  await waitFor(() => expect(result.current.products).toBeDefined())
  expect(result.current.products?.data).toHaveLength(10)
})
```

Cover the error path too — swap `API.defaults.adapter` for one that throws (see
`queries.test.tsx`), or `throw new MockHttpError(500)` from the handler.

```bash
npm run test           # once
npm run test:watch     # while developing
npm run test:coverage  # v8 coverage report
```

## Switching from mock to a real backend

Nothing in `services/` or `organisms/` changes — they already call the real
API hooks. Just:

1. `.env` → `VITE_USE_MOCK="false"`
2. `.env` → `VITE_BASE_URL="https://your-api/"`
3. Make sure your API returns the `ResponseDataWithPagination<T>` shape for
   lists (see `src/lib/api/types.ts`) — or adjust that type + the `useGet`
   generic to match your backend.
4. Once every endpoint is live, delete `src/mocks/` and the mock wiring in
   `src/lib/api/axios.ts`.

Auth: the `requestInterceptor` attaches `Bearer <accessToken>` from the store.
The `errorInterceptor` already implements silent refresh — on a `401` it calls
`URLS.auth.refresh` once, replays the original request, and shares that single
refresh across every request that failed at the same time. If your backend
rotates refresh tokens it will pick the new one up automatically; if the refresh
fails, the session is cleared and the user lands on sign-in. Point
`URLS.auth.refresh` at your endpoint and adjust the response shape in
`requestNewAccessToken` if it differs.

## Common tasks — where to look

| I want to…                    | File / API                                                       |
| ----------------------------- | ---------------------------------------------------------------- |
| Show a toast                  | `import { toast } from '@/_shared'` → `toast.success()`          |
| Validate a form               | zod schema + `zodResolver` (see any `*.schema.ts`)               |
| Read/Write URL query params   | `useSetParams()` from `@/hooks`                                  |
| Debounce an input             | `useDebounce()` from `@/hooks`                                   |
| Global state                  | `useAuthStore` / `useSidebarStore` from `@/store`                |
| Protect / gate a route        | `<ProtectedRoute>` / `<PublicRoute>` in `src/router`             |
| Merge Tailwind classes safely | `cn()` from `@/utils`                                            |
| Add an env variable           | declare it in `src/vite-env.d.ts`, read `import.meta.env`        |
| Read or toggle the theme      | `useTheme()` from `@/hooks`                                      |
| Catch a render crash          | `<ErrorBoundary>` from `@/_shared`, `errorElement` in the router |
| Make a mock endpoint fail     | `throw new MockHttpError(500)` in a handler                      |
| Render a table's 4 states     | `<Table isLoading isError onRetry emptyText emptyHint>`          |

## Troubleshooting

- **Import resolves to `undefined`** — usually a barrel cycle. Import the
  component from its direct path (`@/ui/atoms/Spinner`) instead of the barrel,
  or reference it only inside JSX (render time), not at module top-level.
- **`No mock handler for … `** (in the console) — you called an endpoint with
  no matching handler; add one in `src/mocks/handlers.ts` or check the path.
- **Tailwind class does nothing** — it must be a real token (`bg-surface`,
  `bg-primary-10`, not `bg-brandblue`) and the file must be under `src/**` so
  Tailwind's `content` glob sees it.
- **`no-restricted-imports` error** — you crossed a layer boundary. Either move
  the code to the right layer or pass the value in as a prop; edit
  `eslint.config.mjs` only if the architecture itself is changing.
- **A color looks wrong in dark mode** — you used a ramp shade
  (`text-dark-30`) where a semantic token belongs (`text-content-muted`).
