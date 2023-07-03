export enum LANGUAGES {
  EN = 'en',
  UA = 'ua'
}

export enum MOVIE_STATUSES {
  RUMORED = 'Rumored',
  PLANNED = 'Planned',
  IN_PRODUCTION = 'In Production',
  POST_PRODUCTION = 'Post Production',
  RELEASED = 'Released',
  CANCELED = 'Canceled',
}

export enum WORKER_STATUS {
  CREATED= 'created',
  STARTED = 'started',
  PROCESSING = 'processing',
  FINISHED = 'finished',
  FAILED = 'failed'
}

export enum WORKER_NAME {
  UPDATE_MOVIES = 'update_movies',
  UPDATE_PEOPLE = 'update_people',
  DAILY_TMDB_MOVIES = 'daily_tmdb_movies',
  DAILY_TMDB_PEOPLE = 'daily_tmdb_people'
}

export enum SEARCH_FILTERS {
  ALL = 'all',
  MOVIES = 'movies',
  PEOPLE = 'people'
}
