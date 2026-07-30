# PetMatch AI — Frontend

Frontend for PetMatch AI, built on top of the existing PetMatch AI backend
(Node.js / Express / TypeScript / PostgreSQL / Prisma / JWT / Cloudinary).

This is currently **architecture only** — routing, state management, and API
plumbing are wired up, but no real pages/components/UI have been built yet.
Every route renders a temporary `PlaceholderPage`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- TanStack Query
- Axios
- Redux Toolkit
- React Hook Form + Zod
- Framer Motion
- React Hot Toast
- Lucide React

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend URL
npm run dev
```

## Folder structure

```
src/
  api/            Axios client + API-layer helpers
  app/            Redux store config + typed hooks
  assets/         Static assets (images, icons)
  components/     Shared/reusable UI components (empty for now)
  constants/      Route paths, storage keys, and other app-wide constants
  features/       Redux slices, grouped by feature (e.g. auth)
  hooks/          Shared custom hooks (empty for now)
  layouts/        Reusable page shells (MainLayout, AuthLayout, DashboardLayout)
  lib/            Third-party client configuration (React Query, etc.)
  pages/          Page components (currently just PlaceholderPage)
  routes/         Route tree, route guards
  types/          Shared TypeScript types
  utils/          Shared utility functions (empty for now)
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the PetMatch AI backend API |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Notes on current state

- **Auth**: `features/auth/authSlice.ts` holds `{ user, token }` in Redux and
  persists the token to `localStorage`. There's no login page yet — this is
  just the state container the login form will dispatch into.
- **Axios**: `api/axiosClient.ts` attaches the stored JWT to every request and
  clears the session + redirects to `/login` on a 401 response.
- **Routing**: `routes/AppRouter.tsx` defines the full route tree (public,
  auth, and protected/dashboard routes) using `createBrowserRouter`.
  `routes/ProtectedRoute.tsx` guards dashboard routes behind the Redux auth
  token.
- **React Query**: configured in `lib/queryClient.ts` with 1-minute stale time
  and window-focus refetching disabled; wired into `main.tsx` alongside the
  Redux provider and devtools.
