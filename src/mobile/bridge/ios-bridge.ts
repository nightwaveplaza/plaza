import * as uuid from 'uuid'
import { useIosCallbackStore } from '@mobile/stores/iosCallbackStore.ts'

export const iOSBridge = {
  audioPlay: ()
    : Promise<void> => sendMessage<void>('audioPlay', []),
  audioStop: ()
    : Promise<void> => sendMessage<void>('audioStop', []),
  setSleepTimer: (time: number)
    : Promise<void> => sendMessage<void>('setSleepTimer', [`${time}`]),
  getAuthToken: ()
    : Promise<string> => sendMessage<string>('getAuthToken', []),
  setAuthToken: (token: string)
    : Promise<void> => sendMessage<void>('setAuthToken', [token]),
  setAudioQuality: (lowQuality: boolean)
    : Promise<void> => sendMessage<void>('setAudioQuality', [`${lowQuality}`]),
  toggleFullscreen: ()
    : Promise<void> => sendMessage<void>('toggleFullscreen', []),
  openDrawer: ()
    : Promise<void> => sendMessage<void>('openDrawer', []),
  getUserAgent: ()
    : Promise<string> => sendMessage<string>('getUserAgent', []),
  getAppVersion: ()
    : Promise<string> => sendMessage<string>('getAppVersion', []),
  setBackground: (background: string)
    : Promise<void> => sendMessage<void>('setBackground', [background]),
  setLanguage: (lang: string)
    : Promise<void> => sendMessage<void>('setAudioQuality', [lang]),
}

/**
 * @param name
 * @param args
 */
function sendMessage<T>(name: string, args: Array<string>): Promise<T> {
  const iosCallbackStore = useIosCallbackStore()

  if (!window.webkit?.messageHandlers?.plaza) {
    return Promise.reject(`Unable to send message to iOS. Message handler not found`)
  }

  const callbackId = uuid.v4()

  window.webkit.messageHandlers.plaza.postMessage({
    name, args: args || [], callbackId,
  })

  return new Promise<T>(function (resolve, reject) {
    iosCallbackStore.callbacks[callbackId] = (result, errorMessage): void => {
      if (errorMessage) {
        reject(new Error(errorMessage))
      } else {
        resolve(<T>result)
      }
    }
  })
}
