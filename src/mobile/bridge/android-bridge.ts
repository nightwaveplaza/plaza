interface ifcAndroidInterface {
  requestUiUpdate (): void

  audioPlay (): void

  audioStop (): void

  setSleepTimer (time: number): void

  getAuthToken (): string

  setAuthToken (token: string): void

  getAudioQuality (): boolean

  setAudioQuality (quality: boolean): void

  toggleFullscreen (): void

  openDrawer (): void

  getUserAgent (): string

  getVersion (): string

  setBackground (background: string): void
}

declare var AndroidInterface: ifcAndroidInterface

export const AndroidBridge = {
  requestUiUpdate: () => AndroidInterface.requestUiUpdate(),
  audioPlay: () => AndroidInterface.audioPlay(),
  audioStop: () => AndroidInterface.audioStop(),
  setSleepTimer: (time: number) => AndroidInterface.setSleepTimer(time),
  getAuthToken: () => Promise.resolve(AndroidInterface.getAuthToken()),
  setAuthToken: (token: string) => AndroidInterface.setAuthToken(token),
  getAudioQuality: () => Promise.resolve(AndroidInterface.getAudioQuality()),
  setAudioQuality: (lowQuality: boolean) => AndroidInterface.setAudioQuality(
    lowQuality),
  toggleFullscreen: () => AndroidInterface.toggleFullscreen(),
  openDrawer: () => AndroidInterface.openDrawer(),
  getUserAgent: () => Promise.resolve(AndroidInterface.getUserAgent()),
  getAppVersion: () => Promise.resolve(AndroidInterface.getVersion()),
  setBackground: (background: string) => AndroidInterface.setBackground(
    background),
}
