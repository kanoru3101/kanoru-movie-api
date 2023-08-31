import {LANGUAGES, MOVIE_LANGUAGE, MOVIE_VIDEO_TYPE} from "@constants";

export type MovieDB = {
  adult: boolean
  backdrop_path: string
  belongs_to_collection?: {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
  } | null
  budget: number
  genres: Array<{
    id: number
    name: string
  }>
  homepage: string
  id: number
  imdb_id: string
  original_language: MOVIE_LANGUAGE
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: Array<{
    id: number
    logo_path: string
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  release_date: string // "2015-05-13",
  revenue: number
  runtime: number
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  videos?: {
    results: Array<VideoDB>,
  }
}

export type TvDB = {
  adult: boolean
  backdrop_path: string
  created_by: Array<{
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path: string
  }>
  episode_run_time: Array<number>
  first_air_date: string
  genres: Array<{
    id: number
    name: string
  }>
  homepage: string
  id: number
  in_production: boolean
  languages: Array<string>
  last_air_date: string
  last_episode_to_air?: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path: string
  }
  name: string
  next_episode_to_air: string
  number_of_episodes: number
  number_of_seasons: number
  origin_country: Array<string>
  original_language: MOVIE_LANGUAGE
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: Array<{
    id: number
    logo_path: string
    name: string
    origin_country: string
  }>
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  seasons: Array<{
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
  }>
  status: string
  tagline: string
  type: string
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  vote_average: number
  vote_count: number
  videos?: {
    results: Array<VideoDB>,
  }
}

export type TvSeasonDB = {
  _id: string
  air_date?: string
  episodes: Array<TvEpisodeDB>
  name: string
  overview: string
  id: number
  poster_path?: string
  season_number: number
  vote_average: number
  videos?: {
    results: Array<VideoDB>,
  }
}

export type TvEpisodeDB = {
  air_date?: string
  episode_number: number
  id: number
  name: string
  overview: string
  production_code?: string
  runtime?: number
  season_number: number
  still_path: string
  vote_average: number
  vote_count: number
  guest_stars: Array<CastDB>
  crew: Array<CrewDB>
  videos?: {
    results: Array<VideoDB>,
  }
}

export type VideoDB = {
  iso_639_1: MOVIE_LANGUAGE,
  iso_3166_1: LANGUAGES,
  name: string,
  key: string,
  site: string, // YouTube, etc...
  size: number,
  type: MOVIE_VIDEO_TYPE,
  official: boolean,
  published_at: string, // "2023-01-07T00:20:13.000Z"
  id: string,
}

export type TheMoviePagination = {
  page: number,
  total_results: number,
  total_pages: number,
  results: Array<MovieListResultObject>,
}

export type TheTVPagination = {
  page: number,
  total_results: number,
  total_pages: number,
  results: Array<TvListResultObject>,
}

export type TvListResultObject = {
  adult: boolean
  backdrop_path: string | null
  id: number
  name: string
  original_title: string
  original_language: string
  overview: string
  poster_path: string | null
  media_type: string
  genre_ids: Array<number>
  popularity: number
  first_air_date: string | null
  vote_count: number
  vote_average: number
  origin_country: Array<string>
}

export type MovieListResultObject = {
  poster_path: string | null
  adult: boolean
  overview: string
  release_date: string
  genre_ids: Array<number>,
  id: number,
  original_title: string
  original_language: string
  title: string
  backdrop_path: string | null
  popularity: number
  vote_count: number
  video: boolean
  vote_average: number
}

export type GenreDB = {
  id: number
  name: string
}

export type Credit = {
  credit_type: 'cast' | 'crew',
  department: string,
  job: string,
  media: {
    id: number,
    name: string
    original_name: string,
    character: string,
    episodes: Array<{
      air_date: string,
      poster_path: string,
      season_number: string,
    }>
  }
  media_type: 'movie' | 'tv'
  id: string,
  person: {
    name: string,
    id: number
  }
}

export type CombinedCredits = {
  id: number
  cast: Array<{
    adult: boolean
    backdrop_path?: string
    genre_ids: Array<number>
    id: number
    original_language: MOVIE_LANGUAGE
    original_title: string
    overview: string
    popularity: number
    poster_path?: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
    character: string
    credit_id: string
    order: number
    media_type: 'movie' | 'tv'
  }>
  crew: Array<{
    adult: boolean
    backdrop_path?: string
    gender: number | null
    id: number
    original_language: MOVIE_LANGUAGE
    original_title: string
    overview: string
    popularity: number
    poster_path?: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
    credit_id: string
    department: string
    job: string
    media_type: "movie" | 'tv'
  }>,
}

export type CrewDB = {
  department: string
  job: string
  credit_id: string
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
}

export type CastDB = {
  character: string
  credit_id: string
  adult: boolean
  gender: number | null
  id: number
  known_for_department: string
  original_name: string
  popularity: number
  profile_path: string | null
  name: string
  order: number
}

export type MovieCredits = {
  id: number,
  cast: Array<CastDB & { cast_id: number }>
  crew: Array<CrewDB>
}

export type PersonMovieCredits = {
  id: number
  cast: Array<{
    character: string
    credit_id: string
    release_date: string
    vote_count: number
    video: boolean
    adult: boolean
    vote_average: number
    title: string
    genre_ids: Array<number>
    original_language: string
    original_title: string
    popularity: number
    id: number
    backdrop_path: string | null
    poster_path: string | null
    overview: string
    order: number
  }>
  crew: Array<{
    id: number
    department: string
    original_language: string
    original_title: string
    job: string
    overview: string
    vote_count: number
    video: boolean
    backdrop_path: string | null
    poster_path: string | null
    title: string
    popularity: number
    genre_ids: Array<number>
    adult: boolean
    vote_average: number
    release_date: string
    credit_id: string
  }>
}

export type PersonDB = {
  id: number
  birthday: string | null
  deathday: string | null
  known_for_department: string
  name: string
  also_known_as: Array<string>
  gender: number
  biography: string
  popularity: number
  place_of_birth: string | null
  profile_path: string | null
  adult: boolean
  imdb_id: string
  homepage: null | string
}

export type MultiSearch = {
  page: number
  total_pages: number
  total_results: number
  results: Array<{
    adult: boolean
    backdrop_path: string
    id: number
    title: string
    original_language: string
    original_title: string
    overview: string
    poster_path: string
    genre_ids: Array<number>
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
    media_type: 'movie' | 'tv' | 'person'
  }>
}

export type TVExternalIdsTMDB = {
  id: number
  imdb_id?: string
  freebase_mid?: string
  freebase_id?: string
  tvdb_id?: string
  tvrage_id?: number
  wikidata_id?: string
  facebook_id?: string
  instagram_id?: string
  twitter_id?: string
}

export type TVSeasonExternalIdsTMDB = {
  id: number
  freebase_mid?: string
  freebase_id?: string
  tvdb_id?: string
  tvrage_id?: number
  wikidata_id?: string
}

export type TVSeasonEpisodeExternalIdsTMDB = {
  id: number
  imdb_id?: string
  freebase_mid?: string
  freebase_id?: string
  tvdb_id?: string
  tvrage_id?: number
  wikidata_id?: string
}

