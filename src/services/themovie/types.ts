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
  original_language: string
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
