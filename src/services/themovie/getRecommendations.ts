import themovieDB from '@config/themovieDB'
import { TheMoviePagination } from './types'

export type GetRecommendation = {
    movieId: number
    language?: string
    page?: number
}

export type GetTopRateMovieResponse = TheMoviePagination

const getRecommendations = async ({
    movieId,
    page,
    language
}: GetRecommendation): Promise<GetTopRateMovieResponse> => {

    return await themovieDB({ url: `movie/${movieId}/recommendations`, language, params: { page } })
}

export default getRecommendations
