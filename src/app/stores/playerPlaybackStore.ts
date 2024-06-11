import { defineStore } from 'pinia'

interface State {
  playing: boolean,
  sleepTime: number
}

export const usePlayerPlaybackStore = defineStore('playerPlaybackStore', {
  state: (): State => ({
    playing: false,
    sleepTime: 0
  }),
})
