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
    results: Array<{
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
    }>,
  }
}


export type TheMoviePagination = {
  page: number,
  total_results: number,
  total_pages: number,
  results: MovieListResultObject[],
}

export type MovieListResultObject = {
  poster_path: string | null
  adult: boolean
  overview: string
  release_date: string
  genre_ids: number[],
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

export type MovieCredits = {
  id: number,
  cast: Array<{
    adult: boolean
    gender: number | null
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path: string | null
    cast_id: number
    character: string
    credit_id: string
    order: number
  }>
  crew: Array<{
    adult: boolean
    gender: number | null
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path: string | null
    credit_id: string
    department: string
    job: string
  }>
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
