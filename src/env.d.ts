/// <reference types="vite/client" />
import type { ifcAndroidInterface } from '@app/types/types.ts'

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    emitter: Emitter<EventBus>;
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
  readonly VITE_CRYPTO_USDT_TRON: string
  readonly VITE_CRYPTO_USDT_ETH: string
  readonly VITE_CRYPTO_USDT_TON: string
  readonly VITE_CRYPTO_ETH: string
  readonly VITE_CRYPTO_BTC: string
  readonly VITE_CRYPTO_TON: string

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
