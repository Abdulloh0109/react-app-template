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

Copy `src/services/users/queries.ts` and replace `User`→`Product`,
`users`→`products`, `USERS`→`PRODUCTS`. The shape stays identical: one
`useProducts()` hook returning the list plus `create/update/delete` and a
`useGetProductById` factory. **You don't touch this file again when you wire a
real backend** — it already uses the real `useGet`/`useCreate`/… hooks.

```ts
import { useLocation } from 'react-router-dom'
import type {
  DeleteProductResponse,
  ProductRequestDto,
  ProductResponseDto,
} from './types'
import { QUERY_KEYS, URLS } from '@/constants'
import {
  useCreate, useDelete, useGet, useGetOne, useUpdatePut,
  type EnabledQuery, type ResponseDataWithPagination,
} from '@/lib/api'
import { client } from '@/providers'
import type { Callbacks } from '@/types'

export const useProducts = (options?: EnabledQuery) => {
  const { search } = useLocation()

  const { data: products, isLoading: isLoadingProducts } = useGet<
    ResponseDataWithPagination<ProductResponseDto>
  >([QUERY_KEYS.PRODUCTS, search], URLS.products.get, {
    enabledLoad: options?.enabledLoad ?? true,
  })

  const useGetProductById = (id: string, enabled?: boolean) => {
    const { data: product, isLoading: isLoadingProduct } =
      useGetOne<ProductResponseDto>(
        [QUERY_KEYS.PRODUCT, id], URLS.products.getById(id), enabled
      )
    return { product, isLoadingProduct }
  }

  const invalidate = () =>
    client.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })

  const { mutate: createMutate, isPending: isCreating } =
    useCreate<ProductRequestDto, ProductResponseDto>(URLS.products.create)

  const createProduct = (data: ProductRequestDto, cb?: Callbacks<ProductResponseDto>) =>
    createMutate(data, {
      onSuccess: (res) => { invalidate(); cb?.onSuccess?.(res) },
      onError: (e) => cb?.onError?.(e),
    })

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdatePut<ProductRequestDto, ProductResponseDto>()

  const updateProduct = (id: string, data: ProductRequestDto, cb?: Callbacks<ProductResponseDto>) =>
    updateMutate({ url: URLS.products.update(id), item: data }, {
      onSuccess: (res) => {
        invalidate()
        client.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT, id] })
        cb?.onSuccess?.(res)
      },
      onError: (e) => cb?.onError?.(e),
    })

  const { mutate: deleteMutate } = useDelete<DeleteProductResponse>()

  const deleteProduct = (id: string, cb?: Callbacks<DeleteProductResponse>) =>
    deleteMutate(URLS.products.delete(id), {
      onSuccess: (res) => { invalidate(); cb?.onSuccess?.(res) },
      onError: (e) => cb?.onError?.(e),
    })

  return {
    products, isLoadingProducts, useGetProductById,
    createProduct, updateProduct, deleteProduct, isCreating, isUpdating,
  }
}
```

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
    { id: '1', name: 'Starter plan', price: 19, status: 'published', created_at: '2024-01-01' },
    { id: '2', name: 'Pro plan',     price: 49, status: 'draft',     created_at: '2024-01-02' },
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

Inside the table/modal, the only edits are: the service hook (`useProducts`),
the columns, and the form fields.

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
      title={<h1 className="text-2xl font-bold text-dark-20">Products</h1>}
      actions={<Button icon={PlusIcon} onClick={() => setOpenAdd(true)}>Add product</Button>}
      content={<ProductTable />}
      modal={openAdd && (
        <ProductModal mode="add" open={openAdd} onClose={() => setOpenAdd(false)} />
      )}
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
npm run typecheck     # catches missing exports / type drift
npm run dev           # click through: list, search, paginate, add, edit, delete
```

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
- Use design tokens, not raw hex: classes like `bg-primary-10`, `text-dark-30`,
  `fill-danger-10` come from `src/tokens/colors.ts` via `tailwind.config.ts`.
  Change brand colors there once and everything follows.

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

Auth: the `requestInterceptor` attaches `Bearer <accessToken>` from the store;
the `errorInterceptor` clears the session on `401`. Add token-refresh logic in
`src/lib/api/interceptors/error.ts` when your backend supports it.

## Common tasks — where to look

| I want to…                       | File / API                                              |
| -------------------------------- | ------------------------------------------------------- |
| Show a toast                     | `import { toast } from '@/_shared'` → `toast.success()` |
| Validate a form                  | zod schema + `zodResolver` (see any `*.schema.ts`)      |
| Read/Write URL query params      | `useSetParams()` from `@/hooks`                         |
| Debounce an input                | `useDebounce()` from `@/hooks`                          |
| Global state                     | `useAuthStore` / `useSidebarStore` from `@/store`       |
| Protect / gate a route           | `<ProtectedRoute>` / `<PublicRoute>` in `src/router`    |
| Merge Tailwind classes safely    | `cn()` from `@/utils`                                   |
| Add an env variable              | declare it in `src/vite-env.d.ts`, read `import.meta.env` |

## Troubleshooting

- **Import resolves to `undefined`** — usually a barrel cycle. Import the
  component from its direct path (`@/ui/atoms/Spinner`) instead of the barrel,
  or reference it only inside JSX (render time), not at module top-level.
- **`No mock handler for … `** (in the console) — you called an endpoint with
  no matching handler; add one in `src/mocks/handlers.ts` or check the path.
- **Tailwind class does nothing** — it must be a real token (`bg-primary-10`,
  not `bg-brandblue`) and the file must be under `src/**` so Tailwind's
  `content` glob sees it.
