import type { BackgroundImage, History, News, Rating, Song, User } from '@app/types/models.ts'

interface PaginatedCollection<T> {
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

interface ApiResource<T> {
  data: T
}

export interface ResultResource {
  result: string
}

/**
 * Backgrounds
 */
export interface BackgroundCollection {
  data: BackgroundImage[]
}

export interface BackgroundResponse extends ApiResource<BackgroundImage> {}

/**
 * History
 */
export interface HistoryCollection extends PaginatedCollection<History> {
  // additional
  date_range: {
    from_date: number
    to_date: number
  }
}

/**
 * News
 */
export interface NewsCollection extends PaginatedCollection<News> {
}

export interface NewsLatestResource extends ApiResource<News> {
}

/**
 * Ratings
 */
export interface RatingsCollection extends PaginatedCollection<Rating> {}

/**
 * Songs
 */
export interface SongResource extends ApiResource<Song> {
  stats: {
    likes: string,
    first_played_at: number | null
  },
  current_user?: {
    favorite_id: number | null
  }
}

/**
 * Status
 */
export interface StatusResource {
  song: Song
  listeners: number
  updated_at: number
  reactions: number
  position: number
}

/**
 * User
 */
export interface UserResource {
  data: User,
  current_reaction: null | number
}

export interface UserLoginResource {
  data: User,
  token: string | null
}

export interface UserFavoritesCollection extends PaginatedCollection<{
  id: number
  song: Song,
  created_at: number
}> {}
