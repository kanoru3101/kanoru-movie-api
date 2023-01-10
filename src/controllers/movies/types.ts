import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies'
import { TrendingResponse } from '@services/themovie/getTrending'
import { Movie } from '@services/themovie/types'

export type GetMovieById = {
  movieId: number
}

export type GetMovieByIdResponse = Movie | null

export type GetMovies = {
  trending: TrendingResponse
  topRate: GetTopRateMovieResponse,
}
