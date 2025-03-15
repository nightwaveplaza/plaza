import { defineStore } from 'pinia'
import { PlayerState } from '@app/types/types.ts'
import { ref } from 'vue'

export const usePlayerPlaybackStore = defineStore('playerPlaybackStore', () =>{
  const state = ref(PlayerState.IDLE)
  const sleepTime = ref(0)

  return { state, sleepTime }
})
