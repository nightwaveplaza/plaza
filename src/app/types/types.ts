import { Win, type WindowHeaderButtons } from '@app/types/enums.ts'

export interface WindowConfig {
  width: number,
  height?: number,

  titleKey?: string,
  title?: string,

  headerButtons?: WindowHeaderButtons[],
  isAlert?: boolean,
  icon?: string
}

export interface WindowState extends WindowConfig {
  id: string,
  component: string,

  x: number,
  y: number,
  isMinimized: boolean,
  zIndex: number,

  params?: AlertWindowParams | SongWindowParams,
}

export interface AlertWindowParams {
  type: string,
  text: string
}

export interface SongWindowParams {
  songId: string
}

export type EventBus = {
  closeWindow: string
  openWindow: Win
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
