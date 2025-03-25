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

export interface UserProfile {
  username: string,
  token: string,
  email?: string
}

export interface UserLogin {
  username: string,
  password: string
}

export interface UserRegister {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface UserEdit {
  current_password: string,
  password?: string,
  email?: string
}

export interface UserReset {
  email: string,
  captcha_response?: string
}

export interface UserResetConfirm {
  token: string,
  password: string
}

export interface FavoritesResponse {
  per_page: number
  pages: number
  count: number
  favorites: {
    id: number
    created_at: number
    song: {
      id: string
      artist: string
      title: string
      artwork_src: string
    }
  }[]
}

export interface ReactResponse {
  score: number
  songId: string
  reactions: number
}

export interface UserResponse {
  username: string
  email: string
}

export interface StatusResponse {
  song: {
    id: string
    artist: string
    title: string
    album: string
    position: number
    length: number
    artwork_src: string
    artwork_sm_src: string
    reactions: number
  }
  listeners: number
  updated_at: number
}

export type EventBus = {
  closeWindow: string;
  openWindow: string;
  resume: void;
  isBuffering: void;
  isPlaying: boolean;
  sleepTime: number;
  iosCallback: string;
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

  getAuthToken (): string

  setAuthToken (token: string): void

  setAudioQuality (quality: boolean): void

  toggleFullscreen (): void

  openDrawer (): void

  getUserAgent (): string

  getAppVersion (): string

  setBackground (background: string): void

  setLanguage (lang: string): void
}
