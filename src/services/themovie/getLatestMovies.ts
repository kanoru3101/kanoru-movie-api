import themovieDB from '@config/themovieDB'
import { MovieDB } from './types'

export type GetLatestMovies = {
  language?: string
}

export type GetLatestMoviesResponse = MovieDB

const getLatestMovie = async ({
  language
}: GetLatestMovies): Promise<GetLatestMoviesResponse> => {

  return await themovieDB({ url: `movie/latest`, language})
}

export default getLatestMovie
