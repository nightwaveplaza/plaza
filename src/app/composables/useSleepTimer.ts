import { effectScope, ref, watch } from 'vue';
import { Native } from '@mobile/bridge/native.ts';

const sleepTime = ref(0);
let isInitialized = false;

export function useSleepTimer() {
  if (!isInitialized) {
    const scope = effectScope(true);

    scope.run(() => {
      watch(sleepTime, (t: number) => {
        Native.setSleepTimer(t);
      });
    });

    isInitialized = true;
  }

  return { sleepTime };
}
