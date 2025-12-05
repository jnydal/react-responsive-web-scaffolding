
# Style & UI Guidelines – Sukker Frontend

## Design System

We use:

- **Tailwind CSS** for utility-first styling.
- **Flowbite React** components as base building blocks (buttons, modals, forms, navigation, etc.).   

## Responsive Design

The application must be fully responsive and mobile-first.  
Tailwind’s responsive utilities (sm:, md:, lg:, xl:) must be used to ensure layouts adapt correctly to phone, tablet and desktop screen sizes.

Flowbite React components should be used where possible, as they provide responsive defaults out of the box.

All new pages and components must be tested at common breakpoints:
- mobile (360–414px)
- tablet (768px)
- small desktop (1024px)
- large desktop (1280px+)

### Styling Rules

- Prefer Tailwind classes via `className`.
- Do **not** use `style={{ ... }}` inline styles except for rare dynamic cases that cannot be expressed via Tailwind.
- Global styles live in `src/styles/global.css` using Tailwind layers and a few custom classes. :contentReference[oaicite:20]{index=20}  

---

## Component Types & Composition

### Container vs Presentational Components

- **Container components** (pages, feature-level components):
  - Live under `src/features/<featureName>/components/`.
  - Can use `useAppSelector`, `useAppDispatch`, RTK Query hooks.
  - Handle data loading, orchestration, and pass props to presentational components.

- **Presentational components**:
  - Also under `components/` (feature or global).
  - Must be **pure**, stateless where possible.
  - Receive all data and callbacks via typed props.

Composition hierarchy:

- Pages → Features → Components  
  (pages aggregate feature components; features aggregate smaller components).   

---

## Forms & Validation

- Use **React Hook Form + Zod** for all data-submitting forms:
  - Authentication flows
  - Profile editing
  - Messaging/composing content
  - Search forms that hit the backend
- Validation:
  - Perform schema validation at form level (Zod).
  - Do **not** put validation logic in Redux reducers.
- Local state (`useState`) is allowed for:
  - One-field UI controls (search inputs, simple filters).
  - Purely local, non-submitting controls.

---

## Coding Style

### General

- TypeScript everywhere for React and Redux code.
- Only function components + hooks; **no class components**.   
- Prefer **named exports** over default exports for components, hooks, and utilities.

### Naming

- Components: `PascalCase` (e.g. `UserProfileCard`).
- Custom hooks: start with `use` (e.g. `useUserProfile`).
- File names: `kebab-case` (e.g. `user-profile-card.tsx`, `user-api.service.ts`). :contentReference[oaicite:23]{index=23}  

### Formatting & Types

- ESLint + Prettier defaults:
  - 2-space indentation
  - Semicolons enabled
  - Single quotes
- Avoid `any`; prefer explicit and narrow types/interfaces.
- Use early returns and keep branching shallow.
- Comments explain **why**, not **what**.

---

## Error Handling & UX

- For backend errors:
  - Do not expose raw error messages from the server.
  - Show generic, user-friendly messages, with more detail in logs only.
- For form errors:
  - Use React Hook Form’s error messages tied to fields.
  - Provide clear labels and inline error text.

---

## Security & HTML

- Avoid `dangerouslySetInnerHTML` unless strictly necessary.
- If it must be used:
  - Sanitize input using a trusted library.
- Do not log or display raw HTML from untrusted sources.

---

## Accessibility (a11y) – UI Conventions

We rely on Flowbite’s built-in accessibility but must still ensure: :contentReference[oaicite:24]{index=24}  

- All images have meaningful `alt` text.
- Proper heading hierarchy (`h1 > h2 > h3`).
- Inputs have a label (`<label>` or `aria-label`).
- Links/buttons have descriptive text (no generic “click here”).
- Focus is managed correctly for modals/dialogs (focus trap, return focus).
- Respect `prefers-reduced-motion` for animations.

---

## Testing Style

- Use React Testing Library:
  - Test behaviour and user-visible outcomes.
  - Avoid testing implementation details.
- Test slices and selectors in isolation for Redux logic.

