import { type Ref, ref, type UnwrapRef } from 'vue'

interface CallbackInterface {
  [key: string]: {
    <T> (result: T | PromiseLike<T>, errorMessage: undefined | string): void
  }
}

const callbacks = ref<CallbackInterface>({})

export function useIosCallbacks(): {
  execute: (data: string) => void;
  clear: (callbackId: string) => void;
  callbacks: Ref<UnwrapRef<CallbackInterface>>
} {
  const execute = (data: string): void => {
    const callback = JSON.parse(data)

    if (callback.id in callbacks.value) {
      if (callback.error) {
        callbacks.value[callback.id]!(null, 'Callback parse error')
      } else {
        callbacks.value[callback.id]!(callback.result, undefined)
      }
    }
  }

  const clear = (callbackId: string): void => {
    delete callbacks.value[callbackId]
  }

  return {
    execute, clear, callbacks
  }
}
