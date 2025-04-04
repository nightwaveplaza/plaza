import { ref } from 'vue'

interface CallbackInterface {
  [key: string]: {
    <T> (result: T | PromiseLike<T>, errorMessage: undefined | string): void
  }
}

const callbacks = ref<CallbackInterface>({})

export function useIosCallbacks() {
  const execute = (data: string) => {
    const callback = JSON.parse(data)

    if (callback.id in callbacks.value) {
      if (callback.error) {
        callbacks.value[callback.id]!(null, 'Callback parse error')
      } else {
        callbacks.value[callback.id]!(callback.result, undefined)
      }
    }
  }

  const clear = (callbackId: string) => {
    delete callbacks.value[callbackId]
  }

  return {
    execute, clear, callbacks
  }
}
