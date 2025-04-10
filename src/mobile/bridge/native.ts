import { AndroidBridge } from './android-bridge'
import { iOSBridge } from './ios-bridge.js'

export const Native = {
  audioPlay: ()
    : void | Promise<void> => CurrentBridge().audioPlay(),
  audioStop: ()
    : void | Promise<void> => CurrentBridge().audioStop(),
  setSleepTimer: (time: number)
    : void | Promise<void> => CurrentBridge().setSleepTimer(time),
  onReady: ()
    : void | Promise<void> => CurrentBridge().onReady(),
  socketReconnect: ()
    : void | Promise<void> => CurrentBridge().socketReconnect(),
  getAuthToken: ()
    : Promise<string> => CurrentBridge().getAuthToken(),
  setAuthToken: (token: string)
    : void | Promise<void> => CurrentBridge().setAuthToken(token),
  setAudioQuality: (lowQuality: boolean)
    : void | Promise<void> => CurrentBridge().setAudioQuality(lowQuality),
  toggleFullscreen: ()
    : void | Promise<void> => CurrentBridge().toggleFullscreen(),
  openDrawer: ()
    : void | Promise<void> => CurrentBridge().openDrawer(),
  getUserAgent: ()
    : Promise<string> => CurrentBridge().getUserAgent(),
  getAppVersion: ()
    : Promise<string> => CurrentBridge().getAppVersion(),
  setBackground: (background: string)
    : void | Promise<void> => CurrentBridge().setBackground(background),
  setLanguage: (lang: string)
    : void | Promise<void> => CurrentBridge().setLanguage(lang),
  setThemeColor: (color: string)
    : void | Promise<void> => CurrentBridge().setThemeColor(color)
}

const CurrentBridge = (): typeof AndroidBridge | typeof iOSBridge => {
  const isAndroid = (typeof AndroidInterface !== 'undefined')
  return isAndroid ? AndroidBridge : iOSBridge
}
