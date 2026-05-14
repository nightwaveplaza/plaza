import { PlayerState } from '@app/types/types.ts';
import { ref, watch } from 'vue';
import { Native } from '@mobile/bridge/native.ts';
import { isMobile } from '@app/utils/helpers.ts';
import { useEventListener } from '@vueuse/core';

const state = ref(PlayerState.IDLE);
const sleepTime = ref(0);

let playerNativeEventRegistered = false;

export function usePlayerPlayback() {
  // Register mobile specific events
  if (isMobile() && !playerNativeEventRegistered) {
    useEventListener(window, 'player:playing', (e: CustomEvent) => {
      state.value = e.detail ? PlayerState.PLAYING : PlayerState.IDLE;
    });

    useEventListener(window, 'player:buffering', () => {
      state.value = PlayerState.LOADING;
    });

    useEventListener(window, 'player:sleeptime', (e: CustomEvent) => {
      sleepTime.value = e.detail;
    });

    watch(
      () => sleepTime.value,
      (t: number) => {
        Native.setSleepTimer(t);
      },
    );

    playerNativeEventRegistered = true;
  }

  return { state, sleepTime };
}
