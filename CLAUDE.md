# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**xhl-tools-vue** is a Vue 3 + TypeScript + Vite Static Site Generation (SSG) application that serves as a tools and utilities web portal. It's deployed to GitHub Pages at `/xhl-tools-vue/`.

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Full build with type checking and SSG |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run deploy` | Deploy to GitHub Pages |

## Architecture

### Tech Stack
- Vue 3 (Composition API with `<script setup>`)
- TypeScript
- Vite + Vite SSG
- Pinia (state management)
- Ant Design Vue 4.x (UI components)
- Vue Router 4
- Vitest (testing)

### Key Features
- Static Site Generation for fast loading
- Multiple tool categories (Codec, Encryption, Numbers, Media)
- Fuse.js fuzzy search
- Dynamic side menu navigation
- Responsive design with Ant Design Vue

### Important Files

| Path | Purpose |
|------|---------|
| `src/router/index.ts` | Route configuration and dynamic menu generation |
| `src/utils/tool_constants.ts` | Tool definitions and metadata |
| `src/views/Tools/` | Tool page components organized by category |
| `vite.config.ts` | Build configuration with GitHub Pages base path |

### Adding New Tools

Tools are organized in `src/views/Tools/` by category. Register new tools in:
1. `src/utils/tool_constants.ts` - Add tool metadata
2. `src/router/index.ts` - Add route configuration
