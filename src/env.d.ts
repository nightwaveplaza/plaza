/// <reference types="vite/client" />
import type { ifcAndroidInterface } from '@app/types/types.ts';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    webkit?: {
      messageHandlers?: {
        ios_app?: {
          postMessage: (message: { method: string; args: any[] }) => Promise<any>;
        };
      };
    };
  }

  let AndroidInterface: ifcAndroidInterface;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP: string;
  readonly VITE_BUILD_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
