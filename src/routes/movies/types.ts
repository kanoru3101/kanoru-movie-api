import { GetMovieByIdResponse } from '@controllers/movies/types'
import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies'
import { TrendingResponse } from '@services/themovie/getTrending'

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
  response: TrendingResponse
}

export type GetTopRate = {
  query: void
  body: void
  params: void
  response: GetTopRateMovieResponse
}

