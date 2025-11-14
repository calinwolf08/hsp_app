# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit 2 application with Better Auth for authentication, PostgreSQL database, and Tailwind CSS 4 for styling. It uses Svelte 5 and TypeScript with strict type checking enabled.

## Commands

### Development
- `npm run dev` - Start development server
- `npm run dev -- --open` - Start dev server and open in browser

### Building & Preview
- `npm run build` - Create production build
- `npm run preview` - Preview production build (runs on port 4173)

### Code Quality
- `npm run check` - Run svelte-check for type checking
- `npm run check:watch` - Run svelte-check in watch mode
- `npm run format` - Format all files with Prettier
- `npm run lint` - Check formatting with Prettier

### Testing
- `npm run test:unit` - Run Vitest unit tests in watch mode
- `npm run test:unit -- --run` - Run unit tests once (CI mode)
- `npm run test:e2e` - Run Playwright e2e tests
- `npm run test` - Run both unit and e2e tests

## Architecture

### Authentication System (Better Auth)
The app uses Better Auth with custom PostgreSQL schema mappings:

- **Server-side auth**: `src/lib/auth.ts` - Configures Better Auth with snake_case database field mappings (e.g., `first_name`, `created_at`, `user_id`)
- **Client-side auth**: `src/lib/auth-client.ts` - Svelte auth client using `PUBLIC_BASE_URL` env variable
- **SvelteKit integration**: `src/routes/hooks.server.ts` - Global handle function that:
  - Retrieves session from request headers
  - Stores session in `event.locals.session`
  - Delegates auth API routes to Better Auth via `svelteKitHandler`

### Authentication Flow
- `src/routes/+layout.server.ts` - Root layout loader that:
  - Defines public routes (currently only `/login`)
  - Redirects unauthenticated users to login with `redirectTo` query param
  - Makes user data available to all pages via `locals.session`

### Type System
- `src/app.d.ts` - Extends SvelteKit's `App.Locals` interface with `session` typed as `{ session: Session, user: User } | null`

### Database Configuration
The app connects to PostgreSQL using environment variables:
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`
- Better Auth manages tables: `users`, `sessions`, `accounts`, `verifications`
- Uses snake_case naming convention for all database fields

### Test Configuration
Vitest is configured with two test environments:
- **Client tests** (`src/**/*.svelte.{test,spec}.{js,ts}`): Run in browser using Playwright with Chromium, exclude server code
- **Server tests** (`src/**/*.{test,spec}.{js,ts}`): Run in Node.js, exclude Svelte component tests

Playwright e2e tests are in `e2e/` directory and run against the built production app.

### Environment Variables
Required env vars (see `.env.example`):
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` - Better Auth configuration
- `PUBLIC_BASE_URL` - Public-facing base URL for auth client
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_DATABASE` - PostgreSQL connection
- `DATABASE_URL` - Full database connection string (optional)

### Styling
- Tailwind CSS 4 via `@tailwindcss/vite` plugin
- Utility classes available: `@tailwindcss/typography`, `tailwind-merge`, `tailwind-variants`, `tw-animate-css`
- Use `clsx` for conditional class names

### Page Constants
Route paths are centralized in `src/lib/constants.ts` as `PageSlugs` object (e.g., `PageSlugs.login`, `PageSlugs.home`)

## Feature Organization Pattern

Features are organized in `src/lib/features/` using a feature-based folder structure:

```
src/lib/features/
└── [feature-name]/
    ├── [feature-name]-copy.ts    # All user-visible text for the feature
    ├── components/                # Feature-specific components
    │   └── *.svelte
    └── [other feature files]      # Types, utilities, etc.
```

### Copy Management

All user-visible text is extracted into feature-specific copy files:

**File format**: TypeScript files with exported constants (`[feature-name]-copy.ts`)

**Structure**: Nested by component, organized hierarchically:
```typescript
export const featureCopy = {
  componentName: {
    title: "...",
    description: "...",
    fields: {
      fieldName: {
        label: "...",
        placeholder: "...",
        errors: {
          required: "...",
          invalid: "..."
        }
      }
    }
  }
};
```

**Import pattern**: Import everything as a namespace:
```typescript
import { featureCopy } from '../feature-copy';
// Usage: featureCopy.componentName.title
```

**Scope**: Include all user-visible text (labels, messages, buttons, descriptions) and field-specific error messages. Exclude accessibility-only text (ARIA labels) and URLs (use `PageSlugs` from `src/lib/constants.ts`).

**Example**: See `src/lib/features/login/login-copy.ts` for reference implementation.

### Component Organization

**Feature-specific components**: Place in `src/lib/features/[feature-name]/components/` when they are only used within that feature.

**Shared/reusable components**: Only promote to shared location when the component is actually used across multiple features. Favor feature-specific components to avoid premature abstraction.

**UI components**: shadcn-svelte components live in `src/lib/components/ui/` and follow shadcn conventions.

## UI Design System

### Colors

**Primary color**: Custom blue (`#304461`) integrated with shadcn's primary color system via CSS variables in `src/app.css`.

**Custom palette** (defined in `src/app.css`):
- `--color-blue`: `#304461` (primary)
- `--color-dark-orange`: `#BA6A44`
- `--color-light-orange`: `#EB966E`
- `--color-dark-yellow`: `#D7A338`
- `--color-light-yellow`: `#EFD286`
- `--color-dark-grey`: `#7B9896`
- `--color-light-grey`: `#B6CFCD`
- `--color-dark-red`: `#592211`
- `--color-light-red`: `#D19B99`
- `--color-dark-green`: `#7B8F50`
- `--color-light-green`: `#AEC086`

Use Tailwind classes: `bg-blue`, `bg-light-orange`, `text-blue`, etc.

### Typography

**Fonts**:
- Headings (h1-h6): Montserrat
- Body text: Avenir Light

Configured in `src/app.css` via `@layer base`.

### Buttons

Custom button variant for primary actions:
- Variant: `primary`
- Style: `bg-light-orange text-black hover:bg-white rounded-xl`
- Usage: `<Button variant="primary">Text</Button>`

Standard shadcn variants (default, secondary, outline, ghost, link, destructive) are also available.

### Cards

Use `rounded-xl` for card components to match the design system.
