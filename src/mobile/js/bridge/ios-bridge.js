import * as uuid from 'uuid'

const CallbackKey = 'ios-callback'

/**
 * Для iOS придется использоваться async функции и Promise для получения
 * результата выполнения функции
 */
export const iOSBridge = {
  getStatus: () => sendMessage('getStatus'),
  requestUiUpdate: () => sendMessage('requestUiUpdate'),
  audioPlay: () => sendMessage('audioPlay'),
  audioStop: () => sendMessage('audioStop'),
  setSleepTimer: (time) => sendMessage('setSleepTimer', [`${time}`]),
  getAuthToken: () => sendMessage('getAuthToken'),
  setAuthToken: (token) => sendMessage('setAuthToken', [token]),
  getAudioQuality: () => sendMessage('getAudioQuality'),
  setAudioQuality: (lowQuality) => sendMessage('setAudioQuality',
    [`${lowQuality}`]),
  toggleFullscreen: () => sendMessage('toggleFullscreen'),
  openDrawer: () => sendMessage('openDrawer'),
  getUserAgent: () => sendMessage('getUserAgent'),
  getAppVersion: () => sendMessage('getAppVersion'),
  setBackground: (background) => sendMessage('setBackground', [background]),
  setReaction: (score) => sendMessage('setReaction', [`${score}`]),
  getReaction: () => sendMessage('getReaction'),
}

function sendMessage (name, args) {

  if (window.webkit && window.webkit.messageHandlers &&
    window.webkit.messageHandlers.plaza) {
    const callbackId = uuid.v4()

    window.webkit.messageHandlers.plaza.postMessage({
      name, args: args || [], callbackId,
    })

    if (!window[CallbackKey]) {
      window[CallbackKey] = {}
    }

    return new Promise(function (resolve, reject) {
      window[CallbackKey][callbackId] = (result, errorMessage) => {
        if (errorMessage) {
          reject(new Error(errorMessage))
        } else {
          resolve(result)
        }
      }
    })
  } else {
    console.error(`Unable to send message to iOS. Message handler not found`)
  }
}
