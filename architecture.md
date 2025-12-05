# Architecture – Sukker Frontend

## Overview
The Sukker frontend is a **single-page application** built with React 18 (hooks only) and a **feature-based architecture**. It communicates exclusively with the **Sukker API** as defined in `sukker-api-openapi.json`.

Server state and side effects are centralized via **Redux Toolkit** and **RTK Query**, with a single shared HTTP client.

---

## Folder Structure

Top-level `src/` structure:

```
src/
  app/        # App entry, providers, store setup
  features/   # Feature-based modules (profile, search, messages, etc.)
  components/ # Global reusable UI components
  services/   # Global API clients & utilities
    api/      # RTK Query API slices
    api-client.ts
  hooks/      # Global reusable hooks
  routes/     # Route definitions & composition
  layouts/    # Layout components (MainLayout, AuthLayout, etc.)
  styles/     # Global Tailwind/CSS
  assets/     # Static assets (images, icons, fonts)
  utils/      # Small pure helper functions
```

### Feature Structure

Each feature lives under `src/features/<featureName>/`:

```
src/features/<featureName>/
  components/   # UI components (containers + presentational)
  redux/        # Slice, thunks, selectors
  hooks/        # Feature-specific hooks
  types/        # TS types, interfaces
  routes.tsx    # (optional) feature route definitions
  urlState.ts   # (optional) query param helpers
```

**Rules:**

- Features own their UI and internal wiring.
- Shared logic goes to `src/hooks` or `src/utils` if it is reused across features.
- Do **not** create `services/` folders inside features; HTTP is centralized.

---

## State Management

### Global vs Local State

Use **Redux Toolkit** for:

- Authenticated user & auth status
- Feature domain state (profile, messages, search, etc.)
- Lists, collections, pagination
- Application settings
- Cached server data (via RTK Query)

Use **local React state** (`useState` / `useReducer`) only when:

- The state is ephemeral (modal open/close, filters, selects, tabs, input state)
- The state has no meaning outside the component
- It does not need to persist across pages or features

### Component Communication

- **Parent → Child**: props only
- **Child → Parent**: typed callback props
- **Sibling ↔ Sibling**:
  - Shared parent state, or
  - Redux for global/shared state

---

## Context Usage

React Context is used **only** for cross-cutting concerns:

- Theming
- Router (React Router)
- Global layout state
- Auth (thin façade over Redux)

No other context providers should be added.

---

## Data Fetching and HTTP

### Central HTTP Layer

All raw HTTP is done through:

```
src/services/api-client.ts
```

and wrapped by RTK Query API slices in:

```
src/services/api/
```

Rules:

- Never call `fetch`, `axios` or `apiClient` directly in components.
- All HTTP goes through RTK Query or thunks using `apiClient`.

### RTK Query

RTK Query handles:

- Server state
- Caching
- Invalidation
- Automatic refetching

API slices should follow backend domain boundaries.

### Thunks

Use thunks only for:

- Multi-step flows
- Combining multiple API calls
- Client-side workflows needing Redux integration

### API Specification Source of Truth
The backend API structure is defined in `sukker-api-openapi.json`.  
All RTK Query slices, service functions, and TypeScript types must be aligned with this specification.


---

## Auth Architecture

- Tokens stored in **secure httpOnly cookies** only.
- Redux stores user/profile/auth status, not tokens.
- AuthContext exposes helpers but uses Redux as source of truth.

---

## Routing & Layouts

Uses React Router v6 with nested routing.

### Routes Folder

`src/routes/` contains the top-level router.  
Features may define their own `routes.tsx` inside the feature folder.

### Layouts

Located in `src/layouts/`:

- `MainLayout`
- `AuthLayout`
- `PublicLayout`

### URL & Query Params

- `useParams()` for path params
- `useSearchParams()` for query params
- Complex query logic → `urlState.ts` inside feature

---

## App Initialization

`src/app/` configures:

- Redux store
- RTK Query API services
- Router
- Global providers (Auth, Theme, etc.)

---

## Cross-Cutting Concerns

### Utilities

Lives in `src/utils/`, must be pure functions.

### Global Hooks

Lives in `src/hooks/`, used across multiple features.

---

## Error Boundaries

Place boundaries around route groups, feature modules and critical UI.

---

## Summary

This architecture ensures:

- Predictable structure  
- Consistent CursorAI generation  
- Clean API integration  
- High maintainability  

Cursor follows priority:

1. Existing code  
2. `agent.md`  
3. `architecture.md`  
4. `style.md`  
5. `nfr.md`
