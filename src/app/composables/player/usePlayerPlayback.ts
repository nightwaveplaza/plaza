import { PlayerState } from '@app/types/types.ts'
import { type Ref, ref, type UnwrapRef } from 'vue'
import { Native } from '@mobile/bridge/native.ts'
import { isMobile } from '@app/utils/helpers.ts'

const state = ref(PlayerState.IDLE)
const sleepTime = ref(0)

export function usePlayerPlayback(): {
  state: Ref<UnwrapRef<PlayerState>>;
  setState: (s: PlayerState) => void;
  sleepTime: Ref<UnwrapRef<number>>;
  setSleepTime: (t: number) => void;
  updateSleepTime: (t: number) => void
} {

  const setState = (s: PlayerState): void => {
    state.value = s
  }

  const setSleepTime = (t: number): void => {
    sleepTime.value = t

    if (isMobile()) {
      Native.setSleepTimer(t)
    }
  }

  const updateSleepTime = (t: number): void => {
    sleepTime.value = t
  }

  return { state, setState, sleepTime, setSleepTime, updateSleepTime }
}
