interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP: string
  readonly VITE_BUILD_PATH: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
