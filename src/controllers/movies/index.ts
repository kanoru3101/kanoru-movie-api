import {MOVIE_LANGUAGE, TRENDING_MEDIA_TYPE, TRENDING_TIME_WINDOW} from '@constants/theMovieDB';
import {GetMovieById, GetMovieByIdResponse, Movies} from './types'
import * as themovieService from '@services/themovie'
import { movieUpdater } from '@services/updater';
import {Movie} from "@models";
import {repositories} from "@services/typeorm";
import ApiError from "@errors";

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
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetMovieById): Promise<GetMovieByIdResponse> => {
  const movie = await repositories.movie.findOne({ where: { language, imdb_id: imdbId}})
  if (!movie) {
    throw new ApiError('No found movie by id', 404)
  }

  return movie
}

export const getRecommendationMovies = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetMovieById): Promise<Movies> => {
  const movie = await repositories.movie.findOne({
    where: { language, imdb_id: imdbId}
  })

  if (!movie) {
    throw new ApiError('No found movie by id', 404)
  }


  const themovieRecommendations = await themovieService.getRecommendations({
    movieId: movie.movie_db_id,
    language,
  })

  return movieUpdater({
    movieIds: themovieRecommendations.results.map((movie) => movie.id),
    language
  });
}


export const getSimilarMovies = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetMovieById): Promise<Movies> => {
  const movie = await repositories.movie.findOne({
    where: { language, imdb_id: imdbId}
  })

  if (!movie) {
    throw new ApiError('No found movie by id', 404)
  }

  const themovieSimilar = await themovieService.getRecommendations({
    movieId: movie.movie_db_id,
    language,
  })

  return movieUpdater({
    movieIds: themovieSimilar.results.map((movie) => movie.id),
    language
  });
}
