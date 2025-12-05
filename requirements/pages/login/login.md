# Page Spec – Login

> **Image reference:** `./login.png`  
> This document describes the behaviour and UI of the Sukker **Login** page.  
> Cursor: follow this spec together with `agent.md`, `architecture.md`, `style.md` and `nfr.md`.

---

## 1. Purpose

The Login page lets an existing Sukker user authenticate with their **email/username + password** and gain access to the authenticated area of the app.

It should:

- Be consistent with the visual design from `login.png`.
- Use the shared **Auth** mechanisms (Redux / RTK Query / AuthLayout).
- Provide clear, non-intrusive validation and error feedback.

---

## 2. Route & Placement

- **Route path:** `/login`
- **Layout:** use `AuthLayout` from `src/layouts/AuthLayout.tsx`.
- **Feature folder:** implement the page under:

  ```txt
  src/features/auth/
    components/
    pages/
      LoginPage.tsx
    hooks/
    routes.tsx
