import themovieDB from '@config/themovieDB'
import { TheMoviePagination } from './types'
import { TRENDING_MEDIA_TYPE, TRENDING_TIME_WINDOW } from '@constants/theMovieDB'


export type Trending = {
  language?: string,
  timeWindow: TRENDING_TIME_WINDOW,
  mediaType: TRENDING_MEDIA_TYPE,
}

export type TrendingResponse = TheMoviePagination

const getTrending = async ({
  language,
  mediaType,
  timeWindow,
}: Trending): Promise<TrendingResponse> => {
  return await themovieDB({ url: `trending/${mediaType}/${timeWindow}`, language })
}

export default getTrending
