import themovieDB from '@config/themovieDB'
import ApiError from '@errors'
import { MovieDB } from './types'

export type GetMovie = {
  movieId: number
  language?: string
}

const getMovie = async ({
  movieId,
  language,
}: GetMovie): Promise<MovieDB> => {
  if (!movieId) {
    throw new ApiError('Missing movieId')
  }

  return await themovieDB({ url: `movie/${movieId}`, language, appendToResponse: ['videos'] })
}

export default getMovie
