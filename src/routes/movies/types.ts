import { GetMovieByIdResponse } from '@controllers/movies/types'

export type GetMovie = {
  query: void
  body: void
  params: { movieId: number }
  response: { movie: GetMovieByIdResponse }
}
