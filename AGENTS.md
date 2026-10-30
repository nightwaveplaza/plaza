# AGENTS.md

Guidance for AI coding agents working in the **Nightwave Plaza** frontend repository.

## Overview

Frontend for **Nightwave Plaza** ([https://plaza.one](https://plaza.one)), a 24/7 vaporwave online radio station. It is a Vue 3 + TypeScript + Vite SPA styled as a retro Windows desktop (draggable windows, taskbar, start menu). The same codebase builds two targets that share most code but differ in entry point and audio playback implementation.

## Commands

```bash
yarn dev            # Vite dev server (requires VITE_APP set, see below)
yarn build          # Production build to VITE_BUILD_PATH (default dist/)
yarn build-tsc      # Type-check with vue-tsc, then build
yarn watch          # Rebuild on change (NODE_ENV=development)
yarn lint           # ESLint over .vue/.ts/.js etc.
yarn preview        # Preview a production build
```

- **Verification:** There is no unit test suite. After making changes, verify your work with `yarn lint` and `npx vue-tsc --noEmit` (or `yarn build-tsc`).
- **TypeScript:** `tsconfig.json` is strict (`strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`).

## Build targets — `VITE_APP` is required

`vite.config.ts` reads `VITE_APP` and throws if unset. It selects the Vite `root` as `src/<VITE_APP>/`:

- **`VITE_APP=app`** — the web app (`src/app`). `base: '/'`, uses `vue-router` (history mode).
- **`VITE_APP=mobile`** — a webview embedded in the native Android/iOS apps (`src/mobile`). `base: ''`, no router, adds `@vitejs/plugin-legacy` (targets Chrome ≥51 / iOS ≥12) in production builds. Not a standalone app.

Set the target via `.env` (copy `.env.example`). Key vars: `VITE_API_URL` (backend, `[https://api.plaza.one](https://api.plaza.one)`), `VITE_APP`, `VITE_BUILD_PATH`. `import.meta.env.VITE_APP` is checked at runtime by `isMobile()` in `src/app/utils/helpers.ts` — use this helper to branch web vs. mobile behavior.

**Path aliases** (both Vite and tsconfig): `@app/*` → `src/app/*`, `@mobile/*` → `src/mobile/*`, `@locales/*` → `src/locales/*`. `hls.js` is aliased to its light build.

## Architecture

### Two entry points, shared components
`src/app/app.ts` and `src/mobile/app.ts` both create the Vue app and register the four component plugin bundles from `src/app/components/{basic,extra,player,windows}` (each folder's `index.ts` is a Vue plugin registering its components globally). Do not manually import globally registered components inside `.vue` files. The web entry also installs `vue-router`; mobile does not. Both mount `<App>` (from `src/app/views/App.vue` or `src/mobile/App.vue`).

### State management: composables as singletons
There is **no Vuex or Pinia**. Shared state uses module-level `ref`s declared at the top of composable files in `src/app/composables/` — because ES modules are singletons, every caller of `useWindows()`, `useAuth()`, `useNowPlayingStatus()`, `useAppSettings()`, etc. shares the same reactive state. When adding cross-component state, follow this pattern (declare reactive state outside the exported composable function).

### Windows / desktop UI
`useWindows()` (`composables/useWindows.ts`) manages an open-windows map keyed by id, z-index stacking, minimize/restore, and drag position. Window definitions (title key, size, icon, header buttons) live in `registry` in `utils/windowsConfig.ts`, keyed by the `Win` enum. Window content components live in `src/app/components/windows/Window*.vue`, registered globally as `window-<win>`.
**To add a window:** add a `Win` enum value + `registry` entry in `windowsConfig.ts` + a `Window*.vue` component registered in `components/windows/index.ts`.

### Audio playback — web vs. native
Playback is abstracted so UI components remain target-agnostic:
- **Web** (`composables/player/useAudioPlayer.ts`): manages an HTML5 `<audio>` element, streams HLS via `hls.js` (falls back to `mp3`/`mp3_low` from `radio.plaza.one`), drives the MediaSession API and document title, and runs the canvas visualizer (`useVisual`).
- **Mobile** (`composables/useNativeAudioPlayer.ts`): delegates play/stop to the native layer via the bridge; no in-webview audio element.

Now-playing metadata, listener count, and reactions arrive over Laravel Reverb (Echo) — see `services/initAppSocket.ts` (connects to `wss://plaza.one/echo`, public channel `status`, events `status` / `listeners` / `reactions`, writes into `useNowPlayingStatus` / `useSocketStore`). The Reverb app key is `VITE_REVERB_APP_ID`. On mobile, the socket connects/disconnects in response to `app:start` / `app:stop` window events fired by the native layer.

### Native bridge (mobile)
`src/mobile/bridge/native.ts` exposes a `Native` object that dispatches to `AndroidBridge` or `iOSBridge` depending on whether `AndroidInterface` is defined on `window`. This is the boundary for all webview↔native calls (play/stop audio, auth token, sleep timer, fullscreen, background, theme color, language, app version). Native → JS events are consumed via `composables/useNativeEvents.ts`.

### API layer
`src/app/api/index.ts` is a thin Axios wrapper (typed `get/post/put/delete`) with `withCredentials` cookie auth for web. Interceptors unwrap `response.data`, and on HTTP **419** transparently refresh the CSRF cookie (`/auth/csrf-cookie`) and retry once. On **mobile**, auth uses a Bearer token instead — `setApiToken()` stores it and pushes it to the native layer; the request interceptor attaches `Authorization: Bearer`. Per-resource calls live in `api/*.api.ts`. Wrap calls with `useApi()` (`composables/useApi.ts`) to get `{ data, error, isLoading, execute }` state.

### i18n
Uses `vue-i18n` with locales in `src/locales/*.json` managed via **Crowdin** (`crowdin.yml`). Default & fallback locale is `en-US`. A custom `postTranslation` hook in `_i18n.ts` falls back to the English string when a translation is empty. **Never hand-edit translated locale files** — only edit `src/locales/en-US.json`.

### Nginx routes generation
`scripts/generate-nginx-routes.mjs` (run via `yarn nginx-routes` during Docker build) parses `src/app/router/routes.ts` and emits `dist/generated-routes.conf` (`map $uri$spa_match`) so nginx knows which paths are SPA routes. New web routes added to `routes.ts` are picked up automatically at container build time.

## Conventions

- **Vue components:** Use `<script setup lang="ts">` with typed `defineProps<...>()` and `defineEmits<...>()`. Follow the existing tag order and formatting enforced by Prettier (`.prettierrc`) and ESLint.
- **No relative import paths:** Always use `@app`, `@mobile`, or `@locales` aliases (enforced by ESLint). Keep explicit `.ts` / `.vue` extensions on imports (`allowImportingTsExtensions` is enabled).
- **Unused variables:** Prefix intentionally unused function arguments with `_`.
- **Styles:** SCSS lives under `src/app/styles` and `src/mobile/styles` (`ui/` holds retro Windows widget styles).

### Comments
- Comment only non-obvious logic — do not comment self-explanatory code.
- Write brief, plain English comments without flowery language.
- Start comments with a capital letter and omit trailing periods.
- Describe the code as it is now (e.g., `// Done this way because...`), never the editing history or diff (`// Changed A to B...`).

## CI / Release

`.github/workflows/build.yml` pulls Crowdin translations and builds OTA webview bundles for the mobile target on pushes to `master` and `app-v*` / `web-v*` tags.
