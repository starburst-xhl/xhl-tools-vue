# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript static site generator (SSG) project built with Vite and vite-ssg. It's a tools collection website that generates 14 static HTML pages for better SEO and performance. The project deploys to custom domain `tools.xhcy.cc` with root path `/`.

## Development Commands

### Development
```bash
npm run dev
```
Starts development server with hot-reload. Opens browser automatically.

### Build
```bash
npm run build          # Type-check + SSG build
npm run build-only     # SSG build without type-check
```
Generates static HTML files for all routes in `dist/` directory.

### Testing & Quality
```bash
npm run test:unit      # Run unit tests with Vitest
npm run lint           # Run ESLint with auto-fix
npm run type-check     # TypeScript type checking
```

### Deployment
```bash
npm run deploy         # Deploy dist/ to GitHub Pages
npm run preview        # Preview production build locally
```

## Architecture

### SSG Architecture

The project uses **vite-ssg** for static site generation. Key architectural decisions:

**Entry Point (src/main.ts)**:
- Uses `ViteSSG()` function instead of standard Vue app creation
- Exports `createApp` for server-side rendering during build
- Registers Pinia and Ant Design Vue as plugins in the initialization hook
- Routes are passed to ViteSSG, not registered to router instance

**Router Configuration (src/router/index.ts)**:
- Exports `routes` array instead of router instance (required for SSG)
- Uses `createWebHistory` with base path `/`
- Route structure: Root `/` → children: `/home`, `/tools` (with nested routes)
- Components use dynamic imports: `() => import('@/views/...')`

**Critical SSR Configuration**:
- `vite.config.ts` contains `ssr.noExternal` array for packages incompatible with SSR
- Currently includes: `ant-design-vue`, `@ant-design/icons-vue`, `@ant-design/icons-svg`, `crypto-js`
- These packages must be bundled for SSR instead of being externalized

### Component Architecture

**Layout Structure (src/App.vue)**:
- Single root layout with Ant Design Vue components
- `a-config-provider` wraps entire app for i18n and theming
- `HeadBar` component in header slot
- `RouterView` in main content area
- Theme tokens: primary color `#ff9b17`

**Route-Based Components**:
- `HeadBar.vue`: Top navigation bar, displays root-level routes
- `SideMenuPage.vue`: Side menu for `/tools` routes, dynamically generates menu from route children
- Both components use `useRouter()` and `useRoute()` composables instead of importing router instance

### Directory Structure

```
src/
├── main.ts              # SSG entry point with ViteSSG
├── App.vue              # Root layout component
├── router/index.ts      # Route definitions (exports `routes` array)
├── views/               # Page components
│   ├── HomePage.vue     # Landing page
│   └── Tools/           # Tool pages (12 tool routes)
├── components/          # Reusable components
│   ├── HeadBar.vue      # Top navigation
│   └── SideMenuPage.vue # Side navigation for tools
├── stores/              # Pinia state management
├── utils/               # Utility functions
│   ├── menu_utils.ts    # Menu generation helpers
│   ├── string_utils.ts  # String manipulation
│   ├── seo_utils.ts     # SEO meta tags and sitemap data
│   └── Tools/           # Tool-specific utilities
└── constants/           # Static constants
    └── tool-routes.json # Tool route config (SEO & sitemap)
```

## Important Development Patterns

### Working with Routes

When adding new tools, you need to update TWO places:

**1. Route Definition (`src/router/index.ts`)** - for page rendering:
```typescript
{
  path: 'your-tool',
  name: 'YourTool',
  component: () => import('@/views/Tools/YourTool.vue'),
  meta: {
    title: 'Your Tool Title',
    icon: 'IconName',
    description: 'Tool description for SEO'
  }
}
```

**2. Tool Route Config (`src/constants/tool-routes.json`)** - for SEO & sitemap:
```json
{
  "path": "/tools/your-tool",
  "title": "Your Tool Title",
  "description": "Tool description",
  "icon": "IconName",
  "category": "category-name",
  "priority": "0.7",
  "changefreq": "monthly"
}
```

> Note: `priority` affects SEO ranking (1.0=highest), `changefreq` tells search engines update frequency.

Routes are automatically rendered as static HTML during build, and sitemap is generated from `tool-routes.json`.

### Working with SSR/SSG

**Avoid Client-Only APIs in Initial Render**:
- Don't use `window`, `document`, or browser APIs in component setup
- Use `onMounted` lifecycle hook for client-only code
- SSG build runs in Node.js environment without browser globals

**Component Requirements**:
- Use `useRouter()` and `useRoute()` composables, never import router instance
- Avoid `createWebHashHistory()` - SSG requires `createWebHistory()`
- Components must work in both server and client environments

**Third-Party Packages**:
- If a package fails during SSG build, add it to `ssr.noExternal` array in `vite.config.ts`
- Common culprits: UI libraries, packages using `window`/`document`

### SSG Build Warnings

The warning "Build process still running after 15s. Force exit" is expected and harmless. It occurs because Node.js event loop doesn't exit cleanly after rendering. The build completes successfully with exit code 0.

## Node.js Environment

This project uses **fnm** (Fast Node Manager) to manage Node.js versions. Required version: **Node 22**.

Before running any npm commands, ensure you're using Node 22:
```bash
fnm use 22
```

## Deployment

The project is configured for GitHub Pages deployment:
- Base path: `/` (custom domain `tools.xhcy.cc`)
- Build output includes `.nojekyll` file to disable Jekyll processing
- Use `npm run deploy` to push `dist/` to `gh-pages` branch