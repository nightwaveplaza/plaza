import { PlayerState } from '@app/types/types.ts';
import { ref } from 'vue';
import { isMobile } from '@app/utils/helpers.ts';
import { useSleepTimer } from '@app/composables/useSleepTimer.ts';

const state = ref(PlayerState.IDLE);

let playerNativeEventRegistered = false;

export function usePlayerPlayback() {
  const { sleepTime } = useSleepTimer();

  // Register mobile specific events
  if (isMobile() && !playerNativeEventRegistered) {
    window.addEventListener('player:playing', ((e: CustomEvent) => {
      state.value = e.detail ? PlayerState.PLAYING : PlayerState.IDLE;
    }) as EventListener);

    window.addEventListener('player:buffering', (() => {
      state.value = PlayerState.LOADING;
    }) as EventListener);

    window.addEventListener('player:sleeptime', ((e: CustomEvent) => {
      sleepTime.value = e.detail;
    }) as EventListener);

    playerNativeEventRegistered = true;
  }

  return { state, sleepTime };
}
