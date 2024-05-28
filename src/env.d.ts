/// <reference types="vite/client" />
import type {Emitter, EventType} from "mitt";
import type {ifcAndroidInterface} from "@app/types/types.ts";


declare const __APP_VERSION__: string

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    emitter: Emitter<Record<EventType, unknown>>;
  }

  let AndroidInterface: ifcAndroidInterface;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP: string
  readonly VITE_BUILD_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface WindowInterface {
  emitter?: Emitter<Record<EventType, any>>
}
