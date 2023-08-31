import {MOVIE_LANGUAGE} from "@constants";
import {TvEpisodeDB, TVSeasonEpisodeExternalIdsTMDB} from "@services/themovie/types";
import {TVEpisode, TVSeason} from "@models";
import {getTVSeason, getTVSeasonEpisode, getTVSeasonEpisodeExternalIds} from "@services/themovie";
import {repositories} from "@services/typeorm";
import moment from "moment";
import allSettled from "@utils/allSettled";
import {sortItemsByIds} from "@utils/sortResultsByIds";
import Bluebird from "bluebird";
import withTryCatch from "@utils/withTryCatch";
import {chooseData, chooseDataForTranslate} from "@utils/chooseData";
import {saveOrUpdateVideos} from "@services/video";

export type CreateOrUpdateEpisode = {
  imdb_id: string,
  tmdb_id: number,
  language: MOVIE_LANGUAGE,
  name: string
  overview: string
  poster_path?: string
  episode_number: number,
  air_date?: string
  vote_average: number
  videos: Array<{ id: number}>
}

export const fetchTVEpisodeData = async ({
  language,
  tinyErrors,
  tmdbId,
  seasonNumber,
  episodeNumber
}: {
  tmdbId: number
  episodeNumber: number
  seasonNumber: number
  language: MOVIE_LANGUAGE
  tinyErrors?: boolean
}): Promise<{
  tvEpisodeDataByLanguages: Array<{
    isReturn: boolean,
    language: MOVIE_LANGUAGE
    externalData: TVSeasonEpisodeExternalIdsTMDB | null
    episodeTMDB: TvEpisodeDB | null
    seasonData: TVSeason | null
  }>
}> => {
  const tvEpisodeDataByLanguages =
    await Bluebird.mapSeries(
      [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
      async (lng) => {
        const getEpisodeData = tinyErrors ? withTryCatch(getTVSeasonEpisode, null) : getTVSeasonEpisode
        const getExternalData = tinyErrors ? withTryCatch(getTVSeasonEpisodeExternalIds, null) : getTVSeasonEpisodeExternalIds

        return {
          isReturn: lng === language,
          language: lng,
          seasonData: await repositories.tvSeason.findOne({
            where: {
              language: lng,
              tv: { tmdb_id: tmdbId },
            },
            loadEagerRelations: false,
          }),
          externalData: await getExternalData({
            tvId: tmdbId,
            seasonNumber,
            episodeNumber,
          }),
          episodeTMDB: await getEpisodeData({
            tvId: tmdbId,
            seasonNumber,
            episodeNumber,
            language: lng
          })
        }
      }
    )

  return {
    tvEpisodeDataByLanguages
  }
}

export const findTvEpisodeByByOriginalLanguageTMDB = (tvEpisodeDataByLanguages: Array<{ language: MOVIE_LANGUAGE, episodeTMDB: TvEpisodeDB | null}>, useOriginTvEpisode: boolean): {
  data: TvEpisodeDB | null
  isUseOriginal: boolean
} => {
  const findTvEpisode = tvEpisodeDataByLanguages.find(
    ({ language }) => language === MOVIE_LANGUAGE.EN
  )?.episodeTMDB

  const originalTvSeasonData =
    findTvEpisode?.id && useOriginTvEpisode ? findTvEpisode : null

  return {
    data: originalTvSeasonData,
    isUseOriginal: !!findTvEpisode
  }
}


export const generateInputDataForTvEpisode = async ({
  imdbId,
  originEpisodeData,
  language,
  isUseOriginal,
  seasonData,
  episodeData,
}: {
  imdbId: string,
  originEpisodeData: TvEpisodeDB | null,
  language: MOVIE_LANGUAGE,
  isUseOriginal: boolean,
  seasonData: TVSeason,
  episodeData: TvEpisodeDB,
}) => {
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
    data: [episodeData]
  })

  return {
    tvSeason: { id: seasonData.id },
    imdb_id: imdbId,
    tmdb_id: episodeData.id,
    language,
    name: await chooseDataForTranslateWrapper(episodeData.name, originEpisodeData?.name),
    overview: await chooseDataForTranslateWrapper(episodeData.overview, originEpisodeData?.overview),
    poster_path: chooseDataWrapper(episodeData.still_path, originEpisodeData?.still_path),
    episode_number: episodeData.episode_number,
    air_date: chooseDataWrapper(episodeData.air_date, originEpisodeData?.air_date),
    vote_average: chooseDataWrapper(episodeData.vote_average, originEpisodeData?.vote_average),
    videos: videos.map(({ id }) => ({ id }))
  }

}

export const createOrUpdateTVEpisodeData = async (
  episodeData: CreateOrUpdateEpisode
): Promise<TVEpisode> => {
  const findTvEpisode = await repositories.tvEpisode.findOne({
    where: {
      tmdb_id: episodeData.tmdb_id,
      language: episodeData.language,
      episode_number: episodeData.episode_number,
    }
  })

  console.log("####1", {
    findTvEpisode,
    episodeData
  })

  return await repositories.tvEpisode.save({
    ...findTvEpisode,
    ...episodeData
  })
}

export const createOrUpdateTVEpisode = async ({
  episodeNumber,
  seasonNumber,
  language,
  tvTmdbId,
  useOriginEpisode = true,
  tinyErrors = false,
}: {
  episodeNumber: number,
  tvTmdbId: number
  seasonNumber: number
  language: MOVIE_LANGUAGE
  useOriginEpisode?: boolean
  tinyErrors?: boolean
}): Promise<TVEpisode | null> => {
  const { tvEpisodeDataByLanguages } = await fetchTVEpisodeData({
    language,
    tinyErrors,
    tmdbId: tvTmdbId,
    seasonNumber,
    episodeNumber
  })

  const { data: originEpisodeData, isUseOriginal } = findTvEpisodeByByOriginalLanguageTMDB(
    tvEpisodeDataByLanguages,
    useOriginEpisode
  )

  const episodesData = await allSettled(
    tvEpisodeDataByLanguages.map(async (data) => {
      const {isReturn, language, episodeTMDB, externalData, seasonData} = data

      if (!episodeTMDB || !externalData?.imdb_id || !seasonData?.id) {
        return { isReturn: false, language }
      }

      const inputData = await generateInputDataForTvEpisode({
        imdbId: externalData.imdb_id,
        originEpisodeData,
        language,
        isUseOriginal,
        seasonData,
        episodeData: episodeTMDB,
      })

      const { id } = await createOrUpdateTVEpisodeData(inputData)

      return { id, isReturn, language }

    })
  )

  const episodeIdForReturn = episodesData
    .filter(({ isReturn }) => isReturn)
    .map(({ id }) => id)[0]

  if (!episodeIdForReturn) {
    return null;
  }

  return (await repositories.tvEpisode.findOneBy({ id: episodeIdForReturn}))
}

export default async ({
  tvTmdbId,
  seasonNumber,
  language,
  updateAll = false,
}: {
  seasonNumber: number
  tvTmdbId: number
  language: MOVIE_LANGUAGE
  updateAll: boolean,
}): Promise<Array<TVEpisode>> => {
  const episodesForUpdate = []

  const [seasonTMDB, episodesData] = await Promise.all([
    await getTVSeason({
      tvId: tvTmdbId,
      seasonNumber,
      appendToResponse: false
    }),
    await repositories.tvEpisode.find({
      where: {
        tvSeason: { season_number: seasonNumber, tv: { tmdb_id: tvTmdbId }}
      },
      relations: ['videos'],
      loadEagerRelations: false,
    })
  ])
  const episodes = seasonTMDB.episodes
  const episodeNumbers = episodes.map((episode) => episode.episode_number)


  if (updateAll || !episodesData.length) {
    episodesForUpdate.push(...episodeNumbers)
  } else {
    episodes.forEach((episode) => {
      const findEpisode = episodesData.find((episodeData) => episodeData.episode_number === episode.episode_number)

      if (!findEpisode) {
        episodesForUpdate.push(episode.episode_number)
      } else {
        const movieMoment = moment(new Date(findEpisode.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(movieMoment, 'days') > 5) {
          episodesForUpdate.push(episode.episode_number)
        }
      }
    })
  }

  const updatedData = await allSettled(
    episodesForUpdate.map((episodeNumber) => createOrUpdateTVEpisode({
      episodeNumber,
      seasonNumber,
      language,
      tvTmdbId,
    }))
  )

  const updatedEpisodes = updatedData.filter((tvEpisode): tvEpisode is TVEpisode => tvEpisode !== null)

  const results = [
    ...episodesData,
    ...updatedEpisodes
  ]

  return sortItemsByIds(
    episodeNumbers,
    results,
    (tv) => tv.episode_number
  )
}
