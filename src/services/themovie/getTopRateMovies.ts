import themovieDB from '@config/themovieDB'
import { TheMoviePagination } from './types'

export type GetTopMovie = {
  region?: string
  language?: string
  page?: number
}

export type GetTopRateMovieResponse = TheMoviePagination

const getTopRateMovies = async ({
  region,
  page,
  language
}: GetTopMovie): Promise<GetTopRateMovieResponse> => {

  return await themovieDB({ url: `movie/top_rated`, language, params: { region, page } })
}

export default getTopRateMovies
