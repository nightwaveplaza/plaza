import { defineStore } from 'pinia'
import { PlayerState } from '@app/types/types.ts'

interface State {
  state: PlayerState,
  sleepTime: number
}

export const usePlayerPlaybackStore = defineStore('playerPlaybackStore', {
  state: (): State => ({
    state: PlayerState.IDLE,
    sleepTime: 0
  })
})
