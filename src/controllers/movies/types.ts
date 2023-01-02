import { Movie } from '@services/themovie/types'

export type GetMovieById = {
  movieId: number
}

export type GetMovieByIdResponse = Movie | null
