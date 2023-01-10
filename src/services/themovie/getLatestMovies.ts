import themovieDB from '@config/themovieDB'
import { Movie } from './types'

export type GetLatestMovies = {
  language?: string
}

export type GetLatestMoviesResponse = Movie

const getLatestMovie = async ({
  language
}: GetLatestMovies): Promise<GetLatestMoviesResponse> => {

  return await themovieDB({ url: `movie/latest`, language})
}

export default getLatestMovie
