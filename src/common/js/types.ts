export interface ifcWindow {
  name: string,
  form: string,
  // alerts
  text?: string,
  type?: string,
  id?: string,
  title?: string
}

export interface ifcBackground {
  image?: BackgroundImage,
  color: string,
  index: number,
  mode: enBackgroundMode
}

export enum enBackgroundMode {
  RANDOM,
  SINGLE,
  SOLID
}

export interface BackgroundImage {
  id: number,
  filename: string
  author: string
  author_link: string
  source: string
  source_link: string
  num: string
  src: string
  video_src: string
}

export interface ifcUserProfile {
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

export interface HistoryResponse {
  per_page: number
  pages: number
  count: number
  from_date: number
  to_date: number
  songs: {
    played_at: number
    id: string
    artist: string
    title: string
  }[]
}

export interface RatingsResponse {
  per_page: number
  pages: number
  count: number
  songs: {
    id: string
    artist: string
    title: string
    likes: number
  }[]
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

export type StatusResponse = {
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

export type NewsLatestResponse = {
  id: number
  updated_at: number
}

export type NewsResponse = {
  per_page: number
  pages: number
  count: number
  articles: {
    text: string
    author: string
    created_at: number
  }[]
}

export type SongResponse = {
  id: string
  artist?: string
  title?: string
  album?: string
  position?: number
  length?: number
  artwork_src?: string
  artwork_sm_src?: string
  likes?: number
  first_played_at?: number
  favorite_id?: number
  preview_src?: string
}
