import {MOVIE_LANGUAGE, TV_STATUSES, TV_TYPES} from "@constants";
import {Genre, TV} from "@models";
import {repositories} from "@services/typeorm";
import {In} from "typeorm";
import moment from "moment";
import allSettled from "@utils/allSettled";
import {sortItemsByIds} from "@utils/sortResultsByIds";
import {CreateOrUpdateTVProps} from "@services/updater/types";
import {TvDB, TVExternalIdsTMDB} from "@services/themovie/types";
import Bluebird from "bluebird";
import withTryCatch from "@utils/withTryCatch";
import {getTV, getTVExternalIds} from "@services/themovie";
import {getAllGenres, getGenresForRelations} from "@services/genre";
import {chooseData, chooseDataForTranslate} from "@utils/chooseData";
import {saveOrUpdateVideos} from "@services/video";
import {updateQueue} from "@services/worker";

export const findTvByOriginalLanguageTMDB = (tvDataByLanguages: Array<{ language: MOVIE_LANGUAGE, tvTMDB: TvDB | null}>, useOriginMovie: boolean): {
  data: TvDB | null
  isUseOriginal: boolean
} => {
  const findTv = tvDataByLanguages.find(
    ({ language }) => language === MOVIE_LANGUAGE.EN
  )?.tvTMDB

  const originalTvData =
    findTv?.id && useOriginMovie ? findTv : null

  return {
    data: originalTvData,
    isUseOriginal: !!findTv
  }
}

export const fetchTVData = async ({
  tvId,
  tinyErrors,
  language,
}: {
  language: MOVIE_LANGUAGE
  tvId: number
  tinyErrors?: boolean
}): Promise<{
  tvDataByLanguages: Array<{
    tvExternalIds: TVExternalIdsTMDB | null
    isReturn: boolean,
    language: MOVIE_LANGUAGE
    tvTMDB: TvDB | null
  }>
  allGenres: Array<Genre>
}> => {
  const [ tvDataByLanguages, allGenres] = await Promise.all([
    await Bluebird.mapSeries(
      [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
      async lng => {
        const getTvQuery = tinyErrors ? withTryCatch(getTV, null): getTV
        const getTvExternalIds = tinyErrors ? withTryCatch(getTVExternalIds, null): getTVExternalIds

        return {
          isReturn: lng === language,
          language: lng,
          tvExternalIds: await getTvExternalIds({ tvId }),
          tvTMDB: await getTvQuery({ tvId, language: lng }),
        }
      }
    ),
    getAllGenres(),
  ])

  return {
    tvDataByLanguages,
    allGenres,
  }
}

export const generateInputDataForTV = async ({
  tvData,
  originalTvData,
  allGenres,
  tvId,
  language,
  isUseOriginal,
  imdbId,
}: {
  tvData: TvDB
  originalTvData: TvDB | null
  tvId: number
  language: MOVIE_LANGUAGE
  isUseOriginal: boolean
  allGenres: Array<Genre>
  imdbId: string
}) => {
  const chooseDataWrapper = <T>(mainText: T, secondaryText?: T): T =>
    chooseData(isUseOriginal, mainText, secondaryText)

  const chooseDataForTranslateWrapper = async (
    mainText: string,
    secondaryText?: string | null,
  ): Promise<string> => {
    const options = {
      isUseOriginal,
      originalLanguage: originalTvData?.original_language,
      language,
    }

    if (mainText && mainText != "") {
      return mainText
    }

    return await chooseDataForTranslate(options, mainText, secondaryText)
  }


  const videos = await saveOrUpdateVideos({
    data: [tvData]
  })

  return {
    tmdb_id: tvId,
    imdb_id: imdbId,
    language,
    title: await chooseDataForTranslateWrapper(
      tvData.name,
      originalTvData?.name
    ),
    overview: await chooseDataForTranslateWrapper(
      tvData.overview,
      originalTvData?.overview
    ),
    original_title: tvData.original_name,
    original_language: tvData.original_language,
    adult: tvData.adult,
    backdrop_path:
      tvData?.backdrop_path &&
      `https://image.tmdb.org/t/p/original${tvData.backdrop_path}`,
    in_production: tvData.in_production,
    homepage: chooseDataWrapper(
      tvData.homepage,
      originalTvData?.homepage
    ),
    popularity: chooseDataWrapper(
      tvData.popularity,
      originalTvData?.popularity
    ),
    poster_path:
      tvData?.poster_path &&
      `https://image.tmdb.org/t/p/original${tvData.poster_path}`,
    first_air_date: tvData.first_air_date,
    last_air_date: tvData.last_air_date,
    number_of_episodes: tvData.number_of_episodes,
    number_of_seasons: tvData.number_of_seasons,
    runtime: chooseDataWrapper(tvData?.episode_run_time?.[0], originalTvData?.episode_run_time?.[0]),
    status: chooseDataWrapper(tvData.status, originalTvData?.status) as TV_STATUSES,
    tagline: await chooseDataForTranslateWrapper(
      tvData.tagline,
      originalTvData?.tagline
    ),
    type: tvData.type as TV_TYPES,
    vote_average: chooseDataWrapper(
      tvData.vote_average,
      originalTvData?.vote_average
    ),
    vote_count: chooseDataWrapper(
      tvData.vote_count,
      originalTvData?.vote_count
    ),
    genres: getGenresForRelations({
      allGenres,
      genres: tvData.genres,
      language
    }),
    videos: videos.map(video => ({ id: video.id })),
  }
}

export type CreateOrUpdateTv = {
  tmdb_id: number
  imdb_id: string
  language: MOVIE_LANGUAGE
  title: string
  overview: string
  original_title: string
  original_language: string
  adult: boolean
  backdrop_path: string
  in_production: boolean
  homepage: string
  popularity: number
  poster_path: string
  first_air_date: string
  last_air_date: string
  number_of_episodes: number
  number_of_seasons: number
  runtime?: number
  status?: TV_STATUSES
  tagline?: string
  type?: TV_TYPES
  vote_average?: number
  vote_count?: number;
}

export const createOrUpdateTvData = async (
  tvData: CreateOrUpdateTv
): Promise<TV> => {
  const findTv = await repositories.tv.findOne({
    where: {tmdb_id: tvData.tmdb_id, language: tvData.language},
    relations: ['genres', 'videos', 'seasons'],
    loadEagerRelations: false,
  })

  return await repositories.tv.save({
    ...findTv,
    ...tvData,
  })
}

export const createOrUpdateTV = async ({
  tvId,
  language,
  useOriginTv = true,
  tinyErrors = false,
}: CreateOrUpdateTVProps): Promise<TV | null> => {
  const { tvDataByLanguages, allGenres } = await fetchTVData({
    language,
    tinyErrors,
    tvId
  })

  const { data: originTvData, isUseOriginal} = findTvByOriginalLanguageTMDB(tvDataByLanguages, useOriginTv)

  const tvsData = await allSettled(
    tvDataByLanguages.map(async data => {
      const { isReturn, language, tvTMDB, tvExternalIds } = data

      if (!tvTMDB || !tvExternalIds?.imdb_id) {
        return { isReturn: false, language }
      }

      const inputData = await generateInputDataForTV({
        tvData: tvTMDB,
        originalTvData: originTvData,
        allGenres,
        tvId,
        language,
        isUseOriginal,
        imdbId: tvExternalIds.imdb_id
      })

      const { id } = await createOrUpdateTvData(inputData)

      return { id, isReturn, language }
    })
  )

  const tvIdForReturn = tvsData
    .filter(({ isReturn }) => isReturn)
    .map(({id}) => id)[0]

  if (!tvIdForReturn) {
    return null
  }

  return (await repositories.tv.findOne({
    where: { id: tvIdForReturn},
    relations: ['genres', 'videos', 'seasons'],
    loadEagerRelations: false,
  })) as TV
}

export default async ({
  tvIds,
  language,
  updateAll = false,
}: {
  tvIds: Array<number>
  language: MOVIE_LANGUAGE
  updateAll?: boolean
}): Promise<Array<TV>> => {
  const tvIdsForUpdate = []

  const tvs = await repositories.tv.find({
    where: {tmdb_id: In(tvIds), language },
    take: 100,
    relations: ['genres', 'videos', 'seasons'],
    loadEagerRelations: false,
  })

  if (updateAll || !tvs.length) {
    tvIdsForUpdate.push(...tvIds)
  } else {
    tvIds.forEach(tvId => {
      const tv = tvs.find((tv) => tv.tmdb_id === tvId)
      if (!tv) {
        tvIdsForUpdate.push(tvId)
      } else {
        const movieMoment = moment(new Date(tv.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(movieMoment, 'days') > 5) {
          tvIdsForUpdate.push(tvId)
        }
      }
    })
  }

  const updatedData = await allSettled(
    tvIdsForUpdate.map(tvId => createOrUpdateTV({ tvId, language}))
  )

  const updatedTVs = updatedData.filter((tv): tv is TV => tv !== null)

  await updateQueue.addBulk(updatedTVs.map((tv) => ({
    name: 'tvSeasons',
    data: {
      tvTmdbId: tv.tmdb_id,
      language: tv.language
    }
  })))

  const results = [
    ...tvs,
    ...updatedTVs
  ]

  return sortItemsByIds(
    tvIds,
    results,
    (tv) => tv.tmdb_id
  )
}
