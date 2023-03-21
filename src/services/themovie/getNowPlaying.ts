import themovieDB from '@config/themovieDB'
import {TheMoviePagination} from './types'

export type GetTopMovie = {
    region?: string
    language?: string
    page?: number
}

export type GetNowPlaying = TheMoviePagination

const getNowPlaying = async ({
    region,
    page,
    language
}: GetTopMovie): Promise<GetNowPlaying> => {
    return await themovieDB({url: `movie/now_playing`, language, params: {region, page}})
}

export default getNowPlaying
