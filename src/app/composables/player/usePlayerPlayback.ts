import { PlayerState } from '@app/types/types.ts';
import { ref } from 'vue';
import { Native } from '@mobile/bridge/native.ts';
import { isMobile } from '@app/utils/helpers.ts';

const state = ref(PlayerState.IDLE);
const sleepTime = ref(0);

export function usePlayerPlayback() {
  const setSleepTime = (t: number): void => {
    sleepTime.value = t;

    if (isMobile()) {
      Native.setSleepTimer(t);
    }
  };

  const updateSleepTime = (t: number): void => {
    sleepTime.value = t;
  };

  return { state, sleepTime, setSleepTime, updateSleepTime };
}
