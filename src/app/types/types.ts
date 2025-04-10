export interface Window {
  name: string,
  component: string,
  isMinimized: boolean,
  title?: string,
  params?: AlertWindowParams | SongWindowParams
}

export interface AlertWindowParams {
  type: string,
  title: string,
  text: string
}

export interface SongWindowParams {
  songId: string
}

export type EventBus = {
  closeWindow: string
  openWindow: string
  onResume: void
  isBuffering: void
  isPlaying: boolean
  sleepTime: number
  iosCallback: string

  socketConnect: void
  socketDisconnect: void
  socketReconnectFailed: void
  onStatusUpdate: string
  onListenersUpdate: number
  onReactionsUpdate: number
}

export enum PlayerState {
  IDLE = 0,
  LOADING = 1,
  PLAYING = 2
}

export interface ifcAndroidInterface {
  audioPlay (): void

  audioStop (): void

  setSleepTimer (time: number): void

  onReady (): void

  socketReconnect (): void

  getAuthToken (): string

  setAuthToken (token: string): void

  setAudioQuality (quality: boolean): void

  toggleFullscreen (): void

  openDrawer (): void

  getUserAgent (): string

  getAppVersion (): string

  setBackground (background: string): void

  setLanguage (lang: string): void

  setThemeColor (color: string): void
}
