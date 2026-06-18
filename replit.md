# Craftora

A full-stack handmade goods marketplace where local artisans sell food, crafts, jewelry, and pottery to buyers in their community. Styled as a warm, mobile-first app (phone-shell UI inside the browser).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/craftora run dev` — run the React frontend (port 26124, proxied at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter routing, TanStack Query, shadcn/ui, Tailwind CSS
- API: Express 5 with JWT auth (bcryptjs + jsonwebtoken)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `lib/db/src/schema/` — Drizzle ORM table definitions (users, sellers, products, cart, orders, reviews, wishlist)
- `artifacts/api-server/src/routes/` — Express route handlers per domain
- `artifacts/api-server/src/middlewares/auth.ts` — JWT auth middleware (requireAuth, requireSeller, optionalAuth)
- `artifacts/craftora/src/pages/` — React page components (9 screens)
- `artifacts/craftora/src/lib/auth.tsx` — AuthContext + setAuthTokenGetter setup
- `artifacts/craftora/src/components/BottomNav.tsx` — bottom tab navigation

## Architecture decisions

- **Contract-first API**: OpenAPI spec → Orval codegen → typed hooks and Zod validators. Never write raw fetch calls on the frontend.
- **JWT via `setAuthTokenGetter`**: The custom-fetch reads `craftora_token` from localStorage and attaches `Authorization: Bearer` to every request. No cookies.
- **Role-based access**: `requireSeller` middleware guards seller-only routes (dashboard, product CRUD, profile update). Frontend route guards redirect unauthorized users to /auth.
- **queryKey required**: All query hooks must pass `queryKey` explicitly when also passing `enabled`. This is enforced by TypeScript.
- **Emoji in products**: Products store an `emoji` field used as a visual placeholder when no `imageUrl` is set.

## Product

Craftora has 9 screens:
1. **Splash** (`/`) — Hero + Get Started / Log In
2. **Auth** (`/auth`) — Buyer/Seller role tabs, email/phone toggle, JWT login/register
3. **Home** (`/home`) — Category filter, featured products, top-rated list, bottom nav
4. **Product Detail** (`/product/:id`) — Reviews, handmade process, add to cart
5. **Seller Profile** (`/seller/:id`) — Follow/unfollow, products list, story
6. **Checkout** (`/checkout`) — Cart items, delivery address, payment method, place order
7. **Orders** (`/orders`) — Active/Past tabs with tracking timeline
8. **Seller Dashboard** (`/dashboard`) — Earnings, orders, product inventory toggle
9. **Review** (`/review/:productId`) — 5-star rating + comment form

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After adding new tables to `lib/db/src/schema/`, run `pnpm run typecheck:libs` before running `pnpm --filter @workspace/api-server run typecheck`. Stale lib declarations cause false TS2305 errors.
- `pnpm --filter @workspace/db run push` applies schema changes to the dev database.
- `UserRole` and `RegisterInputRole` types are exported from `@workspace/api-client-react` from the generated types.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
