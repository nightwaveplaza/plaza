import { defineStore } from 'pinia'

interface State {
  callbacks: {
    [key: string]: {
      <T> (result: T | PromiseLike<T>, errorMessage: undefined | string): void
    }
  }
}

export const useIosCallbackStore = defineStore('iosCallbackStore', {
  state: (): State => ({
    callbacks: {},
  }),

  actions: {
    execute (callbackId: string, params: string | number | boolean | void) {
      if (Object.prototype.hasOwnProperty.call(this.callbacks, callbackId)) {
        if (typeof params === 'string') {
          const res = JSON.parse(params)
          this.callbacks[callbackId]!(res.result, res.error)
        } else {
          this.callbacks[callbackId]!(null, 'Callback parse error')
        }
      }
    },
  },
})
