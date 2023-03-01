import { TRENDING_MEDIA_TYPE, TRENDING_TIME_WINDOW } from '@constants/theMovieDB';
import { GetMovieById, GetMovieByIdResponse } from './types'
import * as themovieService from '@services/themovie'
import { TrendingResponse } from '@services/themovie/getTrending';
import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies';
import {createOrUpdateGenres} from "@services/genre";
import {createOrUpdateMovie} from "@services/movie";
import allSettled from "@utils/allSettled";

export const getTopRate =async (): Promise<GetTopRateMovieResponse> => {
  return await themovieService.getTopRateMovies({ language: 'en' })
};

export const getTrending = async (): Promise<TrendingResponse> => {
  const data = await themovieService.getTrending({
    language: 'en',
    timeWindow: TRENDING_TIME_WINDOW.WEEK,
    mediaType: TRENDING_MEDIA_TYPE.ALL
  })
  await createOrUpdateGenres()

  const movieIds = data.results.map((movie) => movie.id).slice(0,1);
  const updateMovies = await allSettled(movieIds.map(movieId => createOrUpdateMovie({movieId})));

  data.results = data.results.map((item) => {
    const backdrop_path = `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    return {...item, backdrop_path }
  })

  return data;
};

export const getMovieById = async ({
  movieId,
}: GetMovieById): Promise<GetMovieByIdResponse> => {
  if (movieId) {
    return await themovieService.getMovie({ movieId, language: 'en' })
  }

  return null
}
