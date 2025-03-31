interface PaginatedResponse<T> {
  meta: {
    current_page: number
    from: number
    last_page: number
    path: string
    per_page: number
    to: number
    total: number
  },
  data: T[]
}

interface ResourceResponse<T> {
  data: T
}

export interface BackgroundImage {
  id: number,
  filename: string
  author: string
  author_link: string
  source: string
  source_link: string
  src: string
  video_src: string
}

export interface BackgroundsResponse {
  data: BackgroundImage[]
}

export interface BackgroundResponse extends ResourceResponse<BackgroundImage> {}

export interface History {
  played_at: number
  song: Song
}

export interface HistoryResponse extends PaginatedResponse<History> {
  date_range: {
    from_date: number
    to_date: number
  }
}

export interface News {
  id: number
  text: string
  author: string
  created_at: number
}

export interface NewsResponse extends PaginatedResponse<News> {}

export interface NewsLatestResponse extends ResourceResponse<News> {}

export interface Rating {
  song: Song,
  likes: number
}

export interface RatingsResponse extends PaginatedResponse<Rating> {}

export interface Song {
  id: string
  artist: string
  album: string
  title: string
  length: number
  artwork_src: string
  artwork_sm_src: string
  preview_src: string
}

export interface SongResponse extends ResourceResponse<Song> {
  stats: {
    likes: string,
    first_played_at: number | null
  },
  current_user?: {
    favorite_id: number | null
  }
}

export interface UserLoginForm {
  username: string,
  password: string
}

export interface User {
  id: number
  username: string
  email: string
}

export interface UserLoginResponse {
  data: User,
  token: string
}

export interface UserFavoritesResponse extends PaginatedResponse<{
  id: number
  song: Song,
  created_at: number
}> {

}

export interface UserPasswordForm {
  current_password: string,
  password: string
}

export interface UserEmailForm {
  current_password: string,
  email: string
}

export interface UserRegisterForm {
  username: string,
  email: string,
  password: string,
  captcha_response: string
}

export interface ResultResponse {
  result: string // success
}

export interface StatusResponse {
  song: Song
  listeners: number
  updated_at: number
  reactions: number
  position: number
}
