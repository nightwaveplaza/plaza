/// <reference types="vite/client" />
import type { ifcAndroidInterface } from '@app/types/types.ts'
import type { SocketEventMap } from '@app/types'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
    webkit: {
      messageHandlers: {
        plaza: {
          postMessage: { (data: { name: string, args: Array<string>, callbackId: string }): void }
        }
      }
    };
  }

  let AndroidInterface: ifcAndroidInterface
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP: string
  readonly VITE_BUILD_PATH: string
  readonly VITE_TURNSTILE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
