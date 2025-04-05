import { PlayerState } from '@app/types/types.ts'
import { ref } from 'vue'

const state = ref(PlayerState.IDLE)
const sleepTime = ref(0)

export function usePlayerPlayback() {

  const setState = (s: PlayerState) => {
    state.value = s
  }

  const setSleepTime = (t: number) => {
    sleepTime.value = t
  }

  return { state, setState, sleepTime, setSleepTime }
}
