import { GetMovieByIdResponse } from '@controllers/movies/types'
import {Movie} from "@models";

export type GetMovie = {
  query: void
  body: void
  params: { imdbId: string }
  response: GetMovieByIdResponse
}

export type GetTrending = {
  query: void
  body: void
  params: void
  response: Movie[]
}

export type GetTopRate = {
  query: void
  body: void
  params: void
  response: Movie[]
}

export type GetNowPlaying = {
  query: void
  body: void
  params: void
  response: Movie[]
}

export type GetRecommendations = {
  query: void
  body: void
  params: { imdbId: string }
  response: Movie[]
}

