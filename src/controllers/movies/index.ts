import { GetMovieById, GetMovieByIdResponse } from './types'
import * as themovieService from '../../services/themovie/index'

export const getMovieById = async ({
  movieId,
}: GetMovieById): Promise<GetMovieByIdResponse> => {
  if (movieId) {
    return await themovieService.getMovie({ movieId, language: 'en' })
  }

  return null
}
