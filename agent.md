# Agent Spec – Sukker Frontend

## Purpose

You are maintaining and extending a new React frontend for **Sukker**, a dating service.  
The frontend communicates **only** with the backend service **sukker-api** using JSON-based HTTP endpoints defined in `sukker-api-openapi.json`. :contentReference[oaicite:1]{index=1}

Your job is to:

- Implement new pages, flows and components based on sketches, wireframes and process descriptions.
- Keep the architecture, folder structure and coding style **consistent** over time.
- Use the **existing patterns** in this repo and the rules in `architecture.md`, `style.md` and `nfr.md` as your source of truth.

If there is any conflict between:
1. Existing code
2. `agent.md`
3. `architecture.md`, `style.md`, `nfr.md`

…then **prefer existing code patterns**, but otherwise follow `agent.md` first, then `architecture.md`, then `style.md` and `nfr.md`.

---

## Tech Stack

Always assume and use this stack:

- **Build**: Vite
- **UI**: React 18, function components + hooks
- **Language**: TypeScript
- **State**: Redux Toolkit + RTK Query
- **Routing**: React Router v6 (nested routes)
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS + Flowbite React components
- **Testing**: Jest, React Testing Library, Cypress   

---

## Backend / API

- Backend is **Sukker API**, described by `sukker-api-openapi.json`.  
- Base URL (prod): `https://api.sukker.no`. :contentReference[oaicite:3]{index=3}  
- The OpenAPI spec defines endpoints for domains such as `auth`, `user`, `matchSearch`, `blog`, `forum`, `chat`, `events`, `product`, etc.   

**Rules:**

1. Do **not** call `fetch` or `axios` directly in components.
2. All HTTP must go through:
   - `src/services/api-client.ts`, and
   - RTK Query APIs in `src/services/api/`, or
   - Thunks that also use the shared `apiClient`. :contentReference[oaicite:5]{index=5}  
3. When you need a new backend interaction, locate the endpoint in `sukker-api-openapi.json` and:
   - Add/extend an RTK Query slice in `src/services/api/…`
   - Create/adjust TypeScript types and Zod schemas as needed.
4. Treat OpenAPI response schemas as **authoritative** where they exist; otherwise define local types that match the current backend behaviour.

---

## High-Level Architecture Rules

You **must** follow the architecture described in `architecture.md`. In short:   

- Use a **feature-based** structure under `src/features/`.
- Global/shared stuff lives in:
  - `src/components/` (reusable UI)
  - `src/services/` (HTTP and API)
  - `src/hooks/` (reusable hooks)
  - `src/routes/` (top-level route config)
  - `src/layouts/` (layouts)
  - `src/styles/` (global CSS)
  - `src/utils/` (small pure helpers)
- Global state (auth, profile, lists, settings, cached data) lives in Redux.
- Local, ephemeral UI state lives in component `useState`/`useReducer`.

---

## How to Implement a New Feature / Page

When you get a new sketch / wireframe / flow, follow this checklist:

1. **Create / extend feature folder**

   - Under `src/features/<featureName>/`:
     - `components/` – presentational + container components
     - `redux/` – slice, thunks, selectors
     - `hooks/` – feature-specific hooks
     - `types/` – TS interfaces & types
     - (optional) `urlState.ts` or other helpers for query params, etc.   

2. **Wire backend**

   - Find or add the relevant endpoint in `src/services/api/<domain>.ts` using RTK Query.
   - Use `apiClient` as the base for RTK Query’s `baseQuery`.
   - Expose typed hooks (`useGetXQuery`, `useUpdateXMutation`, etc.)

3. **Add routes**

   - Define feature-specific routes in `src/features/<featureName>/routes.tsx`.
   - Use semantic URLs and constants (e.g. `export const PROFILE_ROUTE = "/profile";`).
   - Register them in `src/routes/index.tsx` and use the correct layout (`MainLayout`, `AuthLayout`, `PublicLayout`). :contentReference[oaicite:8]{index=8}  

4. **Implement UI**

   - Use Flowbite React components and Tailwind classes.
   - Container components:
     - Use RTK Query hooks and/or `useAppSelector` / `useAppDispatch`.
   - Presentational components:
     - Receive data and callbacks via props only; no direct store access.

5. **Forms & validation**

   - Use React Hook Form + Zod for all forms that submit to the backend.
   - Local state is allowed for simple one-field controls that don’t go to the backend.

6. **State & communication**

   - Parent → child: props.
   - Child → parent: typed callback props.
   - Sibling ↔ sibling: shared parent state or Redux; never direct coupling. :contentReference[oaicite:9]{index=9}  

7. **Tests**

   - Add or extend Jest/RTL tests for reducers, selectors and important components.
   - Add/extend E2E tests for critical flows (e.g. login, profile update, match search) when needed.

---


## Backend API Specification
The Sukker backend API is fully defined in the file `sukker-api-openapi.json`.  
The agent must always refer to this OpenAPI specification when generating:
- RTK Query endpoints
- Request/response TypeScript types
- Error handling tied to status codes
- API integration logic
- Form contracts for backend-driven validation

Never guess API shapes. Always read from the OpenAPI spec unless the user explicitly overrides it in a prompt.


---

## Agent Behaviour Rules

When generating or editing code:

1. **Always respect the folder structure and layering** from `architecture.md`.
2. **Always use TypeScript** and typed hooks (`useAppSelector`, `useAppDispatch`, custom hooks prefixed with `use`).
3. **Never** call `fetch`, `axios` or `apiClient` directly from components; use RTK Query or thunks instead. :contentReference[oaicite:10]{index=10}  
4. Use **small, composable components** over monolithic ones.
5. Favor **clarity over cleverness**; keep branching shallow and use early returns.
6. Add comments only to explain **why**, not **what**.
7. When you are unsure between multiple valid options, **prefer consistency** with existing code and these docs.
8. When importing TypeScript-only types from any library (including `@reduxjs/toolkit` and `@reduxjs/toolkit/query`), you must always use `import type`. Type-only exports must never be imported as runtime values.
  - Example:
  ```ts
  import { createSlice } from '@reduxjs/toolkit';
  import type { PayloadAction } from '@reduxjs/toolkit';

  import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
  import type { BaseQueryFn } from '@reduxjs/toolkit/query';
  ```
  

