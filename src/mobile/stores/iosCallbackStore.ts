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
    execute (data: string) {
      const callback = JSON.parse(data)

      if (Object.prototype.hasOwnProperty.call(this.callbacks, callback.id)) {
        if (callback.error) {
          this.callbacks[callback.id]!(null, 'Callback parse error')
        } else {
          this.callbacks[callback.id]!(callback.result, undefined)
        }
      }
    },

    clear (callbackId: string) {
      delete this.callbacks[callbackId]
    }
  },
})
