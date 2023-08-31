import themovieDB from '@config/themovieDB'
import {TheTVPagination} from "@services/themovie/types";
import {TRENDING_TIME_WINDOW} from "@constants";

export type TrendingResponse = TheTVPagination

export type GetTVTrending = {
  language?: string,
  timeWindow: TRENDING_TIME_WINDOW,
}

const getTvTrending = async ({
  timeWindow,
  language
}: GetTVTrending): Promise<TrendingResponse> => {
  return await themovieDB({ url: `/trending/tv/${timeWindow}`, language })
}

export default getTvTrending
