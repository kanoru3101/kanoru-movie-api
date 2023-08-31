import {MOVIE_LANGUAGE} from "@constants";
import {TvSeasonDB} from "@services/themovie/types";
import {getTV, getTVSeason} from "@services/themovie";
import Bluebird from "bluebird";
import {repositories} from "@services/typeorm";
import moment from "moment/moment";
import allSettled from "@utils/allSettled";
import withTryCatch from "@utils/withTryCatch";
import {TV, TVSeason} from "@models";
import {chooseData, chooseDataForTranslate} from "@utils/chooseData";
import {saveOrUpdateVideos} from "@services/video";
import {sortItemsByIds} from "@utils/sortResultsByIds";
import {updateQueue} from "@services/worker";

export type CreateOrUpdateSeason = {
  tmdb_id: number
  language: MOVIE_LANGUAGE
  name: string
  overview: string
  poster_path?: string
  season_number: number
  air_date?: string
  vote_average: number
  videos: Array<{ id: number}>
}

export const findTvSeasonByOriginalLanguageTMDB = (tvSeasonDataByLanguages: Array<{ language: MOVIE_LANGUAGE, seasonTMDB: TvSeasonDB | null}>, useOriginTvSeason: boolean): {
  data: TvSeasonDB | null
  isUseOriginal: boolean
} => {
  const findTvSeason = tvSeasonDataByLanguages.find(
    ({ language }) => language === MOVIE_LANGUAGE.EN
  )?.seasonTMDB

  const originalTvSeasonData =
    findTvSeason?.id && useOriginTvSeason ? findTvSeason : null

  return {
    data: originalTvSeasonData,
    isUseOriginal: !!findTvSeason
  }
}

export const fetchTvSeasonData = async ({
  tmdbId,
  tinyErrors,
  seasonNumber,
  language,
}: {
  tmdbId: number
  seasonNumber: number
  language: MOVIE_LANGUAGE
  tinyErrors?: boolean
}): Promise<{
  tvSeasonDataByLanguages: Array<{
    isReturn: boolean,
    language: MOVIE_LANGUAGE
    seasonTMDB: TvSeasonDB | null
    tvData: TV | null
  }>
}> => {
  const tvSeasonDataByLanguages =
    await Bluebird.mapSeries(
    [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
      async (lng) => {
        const getTVSeasonData = tinyErrors ? withTryCatch(getTVSeason, null) : getTVSeason

        return {
          isReturn: lng === language,
          language: lng,
          tvData: await repositories.tv.findOne({
            where: {
              language: lng,
              tmdb_id: tmdbId,
            },
            loadEagerRelations: false,
          }),
          seasonTMDB: await getTVSeasonData({
            tvId: tmdbId,
            seasonNumber,
            language: lng,
          })
        }
      }
    )

  return {
    tvSeasonDataByLanguages
  }
}

export const generateInputDataForTvSeason = async ({
  seasonData,
  originalSeasonData,
  language,
  isUseOriginal,
  tvDataId,
}: {
  seasonData: TvSeasonDB,
  originalSeasonData: TvSeasonDB | null,
  isUseOriginal: boolean,
  language: MOVIE_LANGUAGE,
  tvDataId: number
})=> {
  const chooseDataWrapper = <T>(mainText: T, secondaryText?: T): T =>
    chooseData(isUseOriginal, mainText, secondaryText)

  const chooseDataForTranslateWrapper = async (
    mainText: string,
    secondaryText?: string | null,
  ): Promise<string> => {
    const options = {
      isUseOriginal,
      originalLanguage: MOVIE_LANGUAGE.EN,
      language,
    }

    if (mainText && mainText != "") {
      return mainText
    }

    return await chooseDataForTranslate(options, mainText, secondaryText)
  }

  const videos = await saveOrUpdateVideos({
    data: [seasonData]
  })

  return {
    tv: { id: tvDataId },
    tmdb_id: seasonData.id,
    language,
    name: await chooseDataForTranslateWrapper(seasonData.name, originalSeasonData?.name),
    overview: await chooseDataForTranslateWrapper(seasonData.overview, originalSeasonData?.overview),
    poster_path: chooseDataWrapper(seasonData.poster_path, originalSeasonData?.poster_path),
    season_number: seasonData.season_number,
    air_date: chooseDataWrapper(seasonData.air_date, originalSeasonData?.air_date),
    vote_average: chooseDataWrapper(seasonData.vote_average, originalSeasonData?.vote_average),
    videos: videos.map(({ id }) => ({ id }))
  }
}

export const createOrUpdateTVSeasonData = async (
  seasonData: CreateOrUpdateSeason
): Promise<TVSeason> => {
  const findTvSeason = await repositories.tvSeason.findOne({
    where: {
      tmdb_id: seasonData.tmdb_id,
      language: seasonData.language,
      season_number: seasonData.season_number,
    }
  })

  return await repositories.tvSeason.save({
    ...findTvSeason,
    ...seasonData
  })
}

export const createOrUpdateTVSeason = async ({
  tvTmdbId,
  seasonNumber,
  language,
  useOriginSeasonTv = true,
  tinyErrors = false,
}: {
  tvTmdbId: number
  seasonNumber: number
  language: MOVIE_LANGUAGE
  useOriginSeasonTv?: boolean
  tinyErrors?: boolean
}): Promise<TVSeason | null> => {
  const { tvSeasonDataByLanguages } = await fetchTvSeasonData({
    language,
    tinyErrors,
    tmdbId: tvTmdbId,
    seasonNumber
  })

  const { data: originSeasonData, isUseOriginal } = findTvSeasonByOriginalLanguageTMDB(
    tvSeasonDataByLanguages,
    useOriginSeasonTv
  )


  const seasonsData = await allSettled(
    tvSeasonDataByLanguages.map(async (data) => {
      const { isReturn, language, seasonTMDB, tvData } = data

      if (!seasonTMDB || !tvData?.id) {
        return { isReturn: false, language }
      }

      const inputData = await generateInputDataForTvSeason({
        seasonData: seasonTMDB,
        originalSeasonData: originSeasonData,
        language,
        isUseOriginal,
        tvDataId: tvData.id,
      })

      const { id } = await createOrUpdateTVSeasonData(inputData)

      return { id, isReturn, language }
    })
  )

  const seasonIdForReturn = seasonsData
    .filter(({ isReturn }) => isReturn)
    .map(({ id }) => id)[0]

  if (!seasonIdForReturn) {
    return null;
  }

  return (await repositories.tvSeason.findOneBy({ id: seasonIdForReturn }))
}

export default async ({
  tvTmdbId,
  language,
  updateAll = true,
}: {
  tvTmdbId: number
  language: MOVIE_LANGUAGE
  updateAll: boolean,
}): Promise<Array<TVSeason>> => {
  const seasonForUpdates = []

  const [tvTMDB, seasonsData] = await Promise.all([
    await getTV({tvId: tvTmdbId, appendToResponse: false }),
    await repositories.tvSeason.find({
      where: { tv: {tmdb_id: tvTmdbId} },
      relations: ['episodes', 'videos'],
      loadEagerRelations: false,
    })
  ])
  const seasons = tvTMDB.seasons
  const seasonNumbers = seasons.map((season) => season.season_number)


  if (updateAll || !seasonsData.length) {
    seasonForUpdates.push(...seasonNumbers)
  } else {
    seasons.forEach((season) => {
      const findSeason = seasonsData.find((seasonData) => seasonData.season_number === season.season_number)

      if (!findSeason || (findSeason?.episodes?.length || 0) !== season.episode_count) {
        seasonForUpdates.push(season.season_number)
      } else {
        const movieMoment = moment(new Date(findSeason.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(movieMoment, 'days') > 5) {
          seasonForUpdates.push(season.season_number)
        }
      }
    })
  }

  const updatedData = await allSettled(
    seasonForUpdates.map((seasonNumber) => createOrUpdateTVSeason({
      seasonNumber,
      language,
      tvTmdbId,
    }))
  )

  const updatedSeasons = updatedData.filter((tvSeason): tvSeason is TVSeason => tvSeason !== null)

  // await updateQueue.addBulk(updatedSeasons.map((tvSeason) => ({
  //   data: {
  //     tvTmdbId: tvTmdbId,
  //     seasonNumber: tvSeason.season_number,
  //     language: tvSeason.language,
  //   },
  //   name: 'tvEpisodes'
  // })))

  const results = [
    ...seasonsData,
    ...updatedSeasons
  ]

  return sortItemsByIds(
    seasonNumbers,
    results,
    (tv) => tv.season_number
  )
}
