import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies'
import { TrendingResponse } from '@services/themovie/getTrending'
import { MovieDB } from '@services/themovie/types'

export type GetMovieById = {
  movieId: number
}

export type GetMovieByIdResponse = MovieDB | null

export type GetMovies = {
  trending: TrendingResponse
  topRate: GetTopRateMovieResponse,
}
