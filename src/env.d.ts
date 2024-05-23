/// <reference types="vite/client" />
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP: string
  readonly VITE_BUILD_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
