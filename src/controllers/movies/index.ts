import { TRENDING_MEDIA_TYPE, TRENDING_TIME_WINDOW } from '@constants/theMovieDB';
import { GetMovieById, GetMovieByIdResponse } from './types'
import * as themovieService from '@services/themovie'
import { TrendingResponse } from '@services/themovie/getTrending';
import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies';


export const getTopRate =async (): Promise<GetTopRateMovieResponse> => {
  return await themovieService.getTopRateMovies({ language: 'en' })
};

export const getTrending =async (): Promise<TrendingResponse> => {
  return await themovieService.getTrending({
    language: 'en',
    timeWindow: TRENDING_TIME_WINDOW.WEEK,
    mediaType: TRENDING_MEDIA_TYPE.ALL
  })
};

export const getMovieById = async ({
  movieId,
}: GetMovieById): Promise<GetMovieByIdResponse> => {
  if (movieId) {
    return await themovieService.getMovie({ movieId, language: 'en' })
  }

  return null
}
