# Next.js Ecommerce Store

[![CI](https://github.com/Kris1027/nextjs-ecommerce-store/actions/workflows/ci.yml/badge.svg)](https://github.com/Kris1027/nextjs-ecommerce-store/actions/workflows/ci.yml)

A production-ready **customer-facing ecommerce storefront** built with Next.js 16, React 19, TypeScript 5, and Stripe. Features server-side rendering, dynamic CSP with nonces, auto-generated API client from OpenAPI spec, JWT authentication with token rotation, multi-step checkout with Stripe payments, and 21 test suites.

---

## Tech Stack

| Category            | Technology                                            |
| ------------------- | ----------------------------------------------------- |
| **Framework**       | Next.js 16 (App Router, React 19, React Compiler)     |
| **Language**        | TypeScript 5 (strict mode)                            |
| **Styling**         | Tailwind CSS 4 + shadcn/ui + Base UI                  |
| **Icons**           | Phosphor Icons                                        |
| **Server State**    | TanStack React Query 5                                |
| **Client State**    | Zustand 5                                             |
| **Forms**           | React Hook Form 7 + Zod 4                             |
| **Payments**        | Stripe (React Stripe.js + Stripe.js)                  |
| **API Client**      | @hey-api/openapi-ts (auto-generated from Swagger)     |
| **Unit Tests**      | Vitest 4 + React Testing Library + MSW 2              |
| **E2E Tests**       | Playwright + axe-core (accessibility)                 |
| **CI/CD**           | GitHub Actions (lint, format, typecheck, test, build) |
| **Package Manager** | pnpm 10                                               |

---

## Features

### Product Catalog

- Home page with featured products, new arrivals, and category showcase
- Category browsing with filtering, sorting, and pagination
- Product detail pages with image gallery
- Full-text product search

### Shopping Cart

- Authenticated user cart (Zustand + API sync)
- Guest cart with localStorage persistence
- Add, update quantity, remove items
- Coupon application with live discount preview

### Multi-Step Checkout

- Step-by-step flow: Address → Shipping → Review → Payment
- Address selection from saved addresses or new address form
- Shipping method selection with pricing
- Order review with itemized totals (subtotal, tax, shipping, discounts)
- Stripe payment integration with PaymentIntent
- Success and failure result pages

### Authentication & Account

- Register, login, logout with JWT access/refresh tokens
- Email verification with tokenized links
- Password reset flow (forgot password, reset with token)
- Silent refresh on app load (seamless page reload)
- Multi-tab session sync via BroadcastChannel
- Profile management (name, email)
- Address book — CRUD for shipping/billing addresses with default selection
- Password change with current password verification

### Orders

- Order history with status filtering and pagination
- Order detail — items, shipping address, financial summary
- Order status timeline visualization
- Cancel orders (PENDING/CONFIRMED only)
- Refund request flow

### Reviews & Ratings

- Purchase-verified reviews (only buyers with paid orders can review)
- Star rating input component
- Review list with filtering by rating
- Review summary with rating distribution

### Notifications

- Notification bell with unread count
- Notification inbox with type and read status filters
- Mark as read (single and all)
- Notification preferences management

### UI/UX

- Mobile-first responsive design with 3-view breakpoint strategy (mobile / tablet / desktop)
- Fluid typography using CSS `clamp()` for smooth scaling across viewports
- Safe area support for notched devices (`viewport-fit=cover` + `env(safe-area-inset-*)`)
- Dark/light/system theme with persistence
- Responsive product grid (1 → 2 → 3 → 4 columns across breakpoints)
- Mobile navigation drawer with sheet component
- Loading skeletons matching page container layouts
- Toast notifications on all mutations (Sonner)
- Global error boundary + route-level error components
- Offline detection banner

### SEO & Performance

- Server-side rendering with ISR (60s revalidation)
- JSON-LD structured data (Organization, WebSite, Product, CollectionPage, BreadcrumbList)
- Dynamic OpenGraph images (1200×630) for root, product, and category pages
- Dynamic Twitter Card images (1200×600) for root, product, and category pages
- Title template with site name
- robots.txt and sitemap.xml generation (products use `updatedAt` for crawl freshness)
- React Compiler for automatic memoization
- Image optimization via Next.js Image + Cloudinary
- DNS prefetch and preconnect for external services

### PWA & Branding

- Web app manifest with store metadata and theme colors
- Dynamic PWA icons (192×192, 512×512) and Apple touch icon (180×180)
- Global error boundary for root layout failures

---

## Getting Started

### Prerequisites

- **Node.js** 22 LTS
- **pnpm** 10+
- **Backend** — [NestJS Ecommerce API](https://github.com/Kris1027/nestjs-ecommerce-api) running on `http://localhost:3000`

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Kris1027/nextjs-ecommerce-store.git
cd nextjs-ecommerce-store

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.development
# Edit .env.development — set API URLs and Stripe publishable key

# Generate API client from backend Swagger spec
pnpm api:generate

# Start development server (uses local backend)
pnpm dev

# Or start against production API
pnpm dev:prod
```

The store runs on **`http://localhost:3002`**.

---

## Scripts

| Command              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `pnpm dev`           | Start Next.js dev server with local backend (port 3002) |
| `pnpm dev:prod`      | Start Next.js dev server with production backend        |
| `pnpm build`         | Generate API client + Next.js production build          |
| `pnpm start`         | Run production build (port 3002)                        |
| `pnpm lint`          | ESLint checks                                           |
| `pnpm format`        | Prettier format all files                               |
| `pnpm format:check`  | Check formatting without writing                        |
| `pnpm typecheck`     | TypeScript type checking only                           |
| `pnpm api:generate`  | Generate API client from backend OpenAPI spec           |
| `pnpm test`          | Run unit tests (Vitest, watch mode)                     |
| `pnpm test:run`      | Run unit tests (single run)                             |
| `pnpm test:coverage` | Generate coverage report                                |
| `pnpm test:e2e`      | Run Playwright E2E tests                                |
| `pnpm test:e2e:ui`   | Run E2E tests with Playwright UI                        |
| `pnpm validate`      | Run all checks (lint, format, types, test, build)       |
| `pnpm analyze`       | Build with bundle analyzer                              |

---

## Project Structure

```
src/
├── api/
│   ├── generated/                # OpenAPI codegen output (gitignored)
│   └── client.ts                 # Configured fetch with auth interceptors
├── app/
│   ├── (auth)/                   # Login, register, password reset routes
│   ├── (main)/                   # Home, products, categories, search
│   ├── account/                  # Profile, addresses, orders, notifications
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Multi-step checkout + payment
│   ├── layout.tsx                # Root layout with providers
│   ├── error.tsx                 # Route-level error boundary
│   ├── global-error.tsx          # Root layout error boundary
│   ├── opengraph-image.tsx       # Dynamic OG image (1200×630)
│   ├── twitter-image.tsx         # Dynamic Twitter image (1200×600)
│   ├── icon.tsx                  # Dynamic PWA icon (192×192)
│   ├── apple-icon.tsx            # Dynamic Apple touch icon (180×180)
│   ├── manifest.ts               # PWA web app manifest
│   ├── robots.ts                 # SEO robots.txt
│   └── sitemap.ts                # SEO sitemap.xml
├── components/
│   ├── auth/                     # Auth forms (login, register, verify, reset)
│   ├── home/                     # Hero, featured products, new arrivals
│   ├── products/                 # Product card, filters, pagination, detail
│   ├── cart/                     # Cart contents, totals
│   ├── checkout/                 # Checkout steps, address form, payment
│   ├── account/                  # Profile, addresses, overview
│   ├── orders/                   # Order list, detail, status timeline
│   ├── notifications/            # Inbox, preferences, bell
│   ├── reviews/                  # Review list, card, star rating
│   ├── layout/                   # Header, footer, theme toggle, sidebar
│   ├── seo/                      # JSON-LD schema generators
│   ├── skeletons/                # Loading skeleton components
│   └── ui/                       # shadcn/ui primitives
├── config/
│   └── env.ts                    # Zod-validated environment variables
├── hooks/                        # useAuth, useCart, useDebounce, etc.
├── lib/                          # Utilities, query client, formatters
├── schemas/                      # Zod validation schemas
├── stores/                       # Zustand stores (auth, cart, checkout)
├── proxy.ts                      # Security middleware (CSP, headers, auth)
└── test/                         # Test setup, MSW handlers
```

---

## Testing

```bash
# Run all unit tests
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run E2E tests (requires backend running)
pnpm test:e2e
```

- **21 test suites** — stores, schemas, and components
- MSW v2 for API mocking
- Fresh QueryClient per test (no cache leakage)
- Playwright E2E with axe-core accessibility testing

---

## CI/CD

GitHub Actions runs **5 parallel jobs** on every PR and push to main:

| Job            | Description                         |
| -------------- | ----------------------------------- |
| **Lint**       | ESLint checks                       |
| **Format**     | Prettier format validation          |
| **Type Check** | TypeScript validation + API codegen |
| **Test**       | All Vitest tests + coverage upload  |
| **Build**      | Next.js production build            |

- pnpm dependency caching for fast runs
- Concurrency control (cancels stale PR runs)
- Build depends on all other jobs passing

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

| Variable                             | Description            |
| ------------------------------------ | ---------------------- |
| `NEXT_PUBLIC_API_URL`                | Backend API URL        |
| `NEXT_PUBLIC_SITE_URL`               | Store URL (for SEO)    |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

| File               | Mode                     | API Target                   |
| ------------------ | ------------------------ | ---------------------------- |
| `.env.development` | `pnpm dev`               | Local backend (localhost)    |
| `.env.production`  | `pnpm dev:prod` / Vercel | Production backend (Railway) |

All environment variables are validated at build time via Zod. The app will not build with missing or invalid configuration.

---

## Security

- Dynamic CSP with per-request nonces (script-src, style-src)
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- Access tokens stored in memory only (never localStorage/sessionStorage)
- Refresh tokens in httpOnly cookies (SameSite=Lax, Secure in production)
- Token rotation with reuse detection
- Multi-tab session sync (logout propagation via BroadcastChannel)
- 401 interceptor with automatic token refresh and request queue
- Zod validation on all user inputs and URL parameters
- Rate limit handling with Retry-After support
- Protected route middleware (auth-required and auth-redirect)
- TypeScript strict mode with no `any` types
- React Compiler-friendly patterns emphasizing purity and immutability

---

## License

Copyright (c) 2026 Krzysztof Obarzanek. **All Rights Reserved.**

This project is proprietary. No part of the source code may be copied, modified, distributed, or used without prior written permission. See [LICENSE](LICENSE) for details.
