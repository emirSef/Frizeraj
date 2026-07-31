# Salon CRM

A modern CRM for hair salons — manage clients, appointments, staff and services.

This repository currently contains the **project architecture only**. Features are
built on top of the foundation described below.

## Tech stack

- **[Next.js 15](https://nextjs.org)** (App Router) + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)**
- **[Supabase](https://supabase.com)** — Postgres database, Auth and Storage
- **[TanStack Query](https://tanstack.com/query)** — server state / data fetching
- **[React Hook Form](https://react-hook-form.com)** + **[Zod](https://zod.dev)** — forms & validation
- **[TanStack Table](https://tanstack.com/table)** — data grids
- **ESLint** + **Prettier** — linting & formatting

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See [`.env.example`](./.env.example). Variables are validated at runtime in
[`src/lib/env.ts`](./src/lib/env.ts) with Zod, so the app fails fast with a clear
message if anything is missing.

| Variable                        | Scope  | Description                          |
| ------------------------------- | ------ | ------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | client | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | Supabase anon/public key             |
| `SUPABASE_SERVICE_ROLE_KEY`     | server | Privileged key (never sent to client)|
| `NEXT_PUBLIC_APP_URL`           | client | Base URL of the app                  |

## Project structure

```
src/
  app/            # App Router routes, layouts, providers wiring
  components/
    ui/           # shadcn/ui primitives
    providers/    # Theme + React Query + Tooltip + Toaster
    shared/       # Reusable app components (DataTable, PageHeader, ...)
  features/       # Self-contained feature modules (added incrementally)
  lib/            # Infrastructure: supabase clients, env, query client, constants
  hooks/          # Global reusable React hooks
  services/       # Data-access layer conventions built on Supabase
  types/          # Shared types + generated Supabase database types
  utils/          # Pure, framework-agnostic helpers
```

### Feature module convention

Each feature is self-contained and composed from the shared foundation:

```
features/<feature>/
  components/    UI specific to the feature
  hooks/         React Query hooks (useClients, useCreateClient, ...)
  services/      Data access built on @/lib/supabase
  schemas/       Zod schemas + inferred types
  types.ts       Feature-local types
  index.ts       Public surface of the feature
```

### Supabase clients

- `@/lib/supabase/client` — browser client for Client Components
- `@/lib/supabase/server` — async server client for Server Components / Actions
- `@/lib/supabase/middleware` — session refresh, wired in `src/middleware.ts`

### Database

The schema lives in versioned migrations under [`supabase/migrations`](./supabase/migrations):

| File                            | Contents                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| `*_init_schema.sql`             | Enums, `users`/`clients`/`services`/`appointments`, indexes, FKs, `updated_at` triggers, grants |
| `*_rls_and_auth.sql`            | RLS policies, `current_user_role()` helper, new-user profile trigger |

`supabase/seed.sql` seeds a set of sample services for local development.

**Apply the schema** — either link the Supabase CLI to your project and push:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

…or run it locally with `npx supabase start` + `npx supabase db reset`.

Regenerate database types after schema changes:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server               |
| `npm run build`        | Production build                   |
| `npm run start`        | Start the production server        |
| `npm run lint`         | Run ESLint                         |
| `npm run lint:fix`     | Run ESLint with autofix            |
| `npm run format`       | Format the codebase with Prettier  |
| `npm run format:check` | Check formatting                   |
| `npm run typecheck`    | Type-check without emitting        |
