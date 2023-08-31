import {MOVIE_LANGUAGE, TRENDING_TIME_WINDOW} from "@constants";
import {TV, TVSeason} from "@models";
import * as theMovieService from '@services/themovie'
import {tvUpdater} from "@services/updater";
import {GetTvById} from "@controllers/tv/types";
import {repositories} from "@services/typeorm";
import ApiError from "@errors";


export const getTrending = async ({ language = MOVIE_LANGUAGE.EN }: { language?: MOVIE_LANGUAGE }): Promise<Array<TV>> => {
  const data = await theMovieService.getTVTrending({
    language,
    timeWindow: TRENDING_TIME_WINDOW.WEEK,
  })

  const tvIds = data.results.map((tv) => tv.id);
  return await tvUpdater({ tvIds, language, updateAll: true });
}

export const getTvById = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetTvById): Promise<TV> => {
  const tv = await repositories.tv.findOne({ where: { language, imdb_id: imdbId}})
  if (!tv) {
    throw new ApiError('No found movie by id', 404)
  }

  return tv
}

export const getTvSeasons = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetTvById): Promise<Array<TVSeason>> => {
  if (imdbId && language) return []
  return []
}
