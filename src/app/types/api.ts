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

export interface BackgroundResponse {
  data: BackgroundImage
}

export interface HistoryResponse extends PaginatedResponse {
  data: {
    played_at: number
    song: Song
  }[],
  meta_extra: {
    from_date: number,
    to_date: number
  }
}

export interface News {
  id: number
  text: string
  author: string
  created_at: number
}

export interface NewsResponse extends PaginatedResponse {
  data: News[]
}

export interface NewsLatestResponse {
  data: News
}

export interface RatingsResponse extends PaginatedResponse {
  data: {
    song: Song
    likes: number
  }[],
}

export interface Song {
  'id': string,
  'artist': string,
  'album': string,
  'title': string,
  'length': string,
  'artwork_src': string,
  'artwork_sm_src': string,
  'preview_src': string
}

interface PaginatedResponse {
  'meta': {
    'current_page': number,
    'from': number,
    'last_page': number,
    'path': string,
    'per_page': number,
    'to': number,
    'total': number
  },
  'data': {}[]
}
