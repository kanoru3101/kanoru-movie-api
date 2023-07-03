import themovieDB from '@config/themovieDB'
import {MovieCredits} from './types'

export type GetMovieCredits = {
    movieId: number
    language?: string
}

export type GetMovieCreditsResponse = MovieCredits

const getMovieCredits = async ({
  movieId,
  language
}: GetMovieCredits): Promise<GetMovieCreditsResponse> => {
    return await themovieDB({ url: `movie/${movieId}/credits`, language })
}

export default getMovieCredits
