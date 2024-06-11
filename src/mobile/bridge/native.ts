import { AndroidBridge } from './android-bridge'
import { iOSBridge } from './ios-bridge.cjs'

/**
 * Общий API для взаимодействия с Android и iOS
 */
export const Native = {
  audioPlay: () => CurrentBridge().audioPlay(),
  audioStop: () => CurrentBridge().audioStop(),
  setSleepTimer: (time: number) => CurrentBridge().setSleepTimer(time),
  getAuthToken: () => CurrentBridge().getAuthToken(),
  setAuthToken: (token: string) => CurrentBridge().setAuthToken(token),
  getAudioQuality: () => CurrentBridge().getAudioQuality(),
  setAudioQuality: (lowQuality: boolean) => CurrentBridge().setAudioQuality(lowQuality),
  toggleFullscreen: () => CurrentBridge().toggleFullscreen(),
  openDrawer: () => CurrentBridge().openDrawer(),
  getUserAgent: () => CurrentBridge().getUserAgent(),
  getAppVersion: () => CurrentBridge().getAppVersion(),
  setBackground: (background: string) => CurrentBridge().setBackground(background),
}

const CurrentBridge = () => {
  const isAndroid = (typeof AndroidInterface !== 'undefined')
  return isAndroid ? AndroidBridge : iOSBridge
}
