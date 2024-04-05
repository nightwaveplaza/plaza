import { defineStore } from 'pinia'

interface State {
  playing: boolean,
  sleepTime: number
}

export const useNativeStateStore = defineStore('nativeStateStore', {
  state: (): State => ({
    playing: false,
    sleepTime: 0
  }),
})
