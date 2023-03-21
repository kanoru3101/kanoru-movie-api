import {MOVIE_LANGUAGE, TRENDING_MEDIA_TYPE, TRENDING_TIME_WINDOW} from '@constants/theMovieDB';
import {GetMovieById, GetMovieByIdResponse} from './types'
import * as themovieService from '@services/themovie'
import { movieUpdater } from '@services/updater';
import {Movie} from "@models";

export const getTopRate =async ({ language = MOVIE_LANGUAGE.EN }: { language?: MOVIE_LANGUAGE }): Promise<Movie[]> => {
  const themovieData = await themovieService.getTopRateMovies({ language })
  return await movieUpdater({
    movieIds: themovieData.results.map((movie) => movie.id),
    language }
  );
};

export const getTrending = async ({ language = MOVIE_LANGUAGE.EN }: { language?: MOVIE_LANGUAGE }): Promise<Movie[]> => {
  const data = await themovieService.getTrending({
    language,
    timeWindow: TRENDING_TIME_WINDOW.WEEK,
    mediaType: TRENDING_MEDIA_TYPE.ALL
  })

  const movieIds = data.results.map((movie) => movie.id);
  return await movieUpdater({ movieIds, language });
};

export const getNowPlaying = async ({ language = MOVIE_LANGUAGE.EN }: { language?: MOVIE_LANGUAGE }): Promise<Movie[]> => {
  const data = await themovieService.getNowPlaying({
    language,
  })

  const movieIds = data.results.map((movie) => movie.id);
  return await movieUpdater({ movieIds, language });
};

export const getMovieById = async ({
  movieId,
}: GetMovieById): Promise<GetMovieByIdResponse> => {
  if (movieId) {
    return await themovieService.getMovie({ movieId, language: 'en' })
  }

  return null
}
