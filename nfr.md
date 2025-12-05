# Non-Functional Requirements – Sukker Frontend

This document describes performance, security, testing, logging and accessibility requirements that must be respected for all implementations and refactorings.

---

## Performance

- Avoid unnecessary re-renders:
  - Keep components small and focused.
  - Use memoization (`React.memo`, `useMemo`, `useCallback`) sparingly and only when profiling indicates benefit.   
- State:
  - Keep Redux state normalized and minimal.
  - Use memoized selectors (Reselect) for derived data.
- Code splitting:
  - Lazy-load routes where appropriate using React.lazy/Suspense.
  - Avoid large bundle sizes by splitting heavy features or third-party libraries.
- Network:
  - Use RTK Query caching and invalidation effectively to avoid redundant requests.

---

## Security & Privacy

### Transport & API

- All production API calls must use **HTTPS**.
- API URLs must come from environment variables (e.g. `VITE_API_BASE_URL`), not hardcoded.   
- Frontend code must never embed secrets, credentials or tokens.

### Auth

- Auth tokens are stored in **secure httpOnly cookies**, managed by the backend (Sukker API).
- Tokens must never be stored in Redux, Context or localStorage, and must not be exposed to JS.   

### Data Handling

- Avoid privacy violations:
  - Do not log personal data (PII) to console or logs.
  - Do not store PII in Redux unless absolutely required.
- Input validation:
  - All user input should go through Zod schemas when sent to the backend.
  - Never trust raw user-generated HTML or text.

### Third-Party Scripts

- Use npm packages instead of remotely loaded `<script>` tags.
- Avoid including external scripts unless explicitly approved.

---

## Logging & Error Reporting

- Use centralized logging utilities instead of raw `console.log` in production code.
- Error boundaries:
  - Wrap appropriate parts of the tree with error boundaries.
  - Show user-friendly fallback UIs on errors.
- Integrate with an error reporting service (e.g. Sentry) where configured:
  - Report unhandled exceptions and key application errors.
- Strip debug logs from production builds where possible. :contentReference[oaicite:28]{index=28}  

---

## Testing Strategy

- **Unit tests**:
  - Jest for utilities, reducers, selectors and pure logic.
- **Component tests**:
  - React Testing Library for components and hooks.
  - Focus on behaviour and rendered output, not internal implementation.   
- **End-to-end tests**:
  - Cypress.

Coverage should focus on:

- Business-critical paths (e.g. login, registration, subscription/payment, messaging).
- Core navigation and routing.
- Regression-prone areas.

---

## Accessibility

- Follow the UI accessibility rules in `style.md`.
- For new features, ensure:
  - Keyboard navigation works for all interactive elements.
  - Forms are usable with screen readers.
  - Modals, dropdowns and overlays manage focus correctly.
  - Color contrast is sufficient for text and interactive elements.

---

## Observability & Maintainability

- Code must remain readable:
  - Avoid complex, deeply nested logic.
  - Prefer smaller functions and components.
- When adding complex flows:
  - Add inline documentation (comments) explaining **why** the flow is structured as it is.
  - Add tests to protect the behaviour.

---

## API Reliability

- Treat the Sukker API (as per `sukker-api-openapi.json`) as the backend contract.   
- Handle common error codes gracefully (400, 401, 403, 404, 500).
- For 401/403:
  - Trigger auth-related flows (e.g. redirect to login) via the auth slice / AuthContext.
- For 500 series errors:
  - Show generic error messages and log details via the logging mechanism.

