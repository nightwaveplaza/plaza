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
  image?: ifcBackgroundImage,
  color: string,
  index: number,
  mode: enBackgroundMode
}

export enum enBackgroundMode {
  RANDOM,
  SINGLE,
  SOLID
}

export interface ifcBackgroundImage {
  id:	number,
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

export interface ifcUserLogin {
  username: string,
  password: string
}

export interface ifcUserRegister {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface ifcUserEdit {
  current_password: string,
  password?: string,
  email?: string
}

export interface ifcUserReset {
  email: string,
  captcha_response?: string
}

export interface ifcUserResetConfirm {
  token: string,
  password: string
}

export interface ifcHistoryResponse {
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

export interface ifcRatingsResponse {
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

export interface ifcFavoritesResponse {
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

export interface ifcReactResponse {
  score: number
  songId: string
  reactions: number
}

export interface ifcUserResponse {
  username: string,
  email: string
}
