import themovieDB from '@config/themovieDB'
import { TheMoviePagination } from './types'

export type GetSimilar = {
    movieId: number
    language?: string
    page?: number
}

export type GetSimilarMoviesResponse = TheMoviePagination

const getSimilar = async ({
    movieId,
    page,
    language
}: GetSimilar): Promise<GetSimilarMoviesResponse> => {
    return await themovieDB({ url: `movie/${movieId}/similar`, language, params: { page } })
}

export default getSimilar
