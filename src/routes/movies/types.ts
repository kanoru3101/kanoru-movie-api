import { GetMovieByIdResponse } from '@controllers/movies/types'
import {Movie} from "@models";

export type GetMovie = {
  query: void
  body: void
  params: { movieId: number }
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

