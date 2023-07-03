/* eslint-disable no-console */
import connectDB from '@config/ormconfig'

import Bluebird from 'bluebird'

import { In } from 'typeorm'
import {
  createWorker,
  getArg,
  getData,
  getDate,
  GetPersonData,
  isNeedToUpdate,
  progressBar,
  updatedStatsState,
  updateWorkerStats,
} from './helpers'
import { MOVIE_LANGUAGE, WORKER_NAME, WORKER_STATUS } from '@constants'
import { repositories } from '@services/typeorm'
import {Worker} from '@models'

import {
  CombinedCredits,
} from '@services/themovie/types'

import allSettled from '@utils/allSettled'

import { createOrUpdateCastData } from '@services/updater/castUpdater'
import {
  createOrUpdatePersonData,
  findPersonByOriginalLanguageTMDB,
  generateInputDataForPerson,
} from '@services/updater/personUpdater'
import _ from 'lodash'
import { getJsonData } from './dailyHelpers'

const argv = getArg

const startDate = getDate(argv.startDate)
const workerId = argv.workerId
const startFrom = Number(argv.startFrom)
const numberWorkers = Number(argv.numberWorkers)
const updatedStats = { ...updatedStatsState }

export const personProcess = async ({
  peopleTMDBData,
}: {
  peopleTMDBData: GetPersonData['peopleTMDBData']
}): Promise<Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number }>> => {
  const { data: originPerson, isUseOriginal } =
    findPersonByOriginalLanguageTMDB(peopleTMDBData, true)

  if (!originPerson) {
    return []
  }

  const results = await allSettled(
    peopleTMDBData.map(async ({ personTMDB, language: lng }) => {
      if (!personTMDB || !personTMDB.imdb_id || personTMDB.imdb_id === '') {
        return null
      }

      const inputData = await generateInputDataForPerson({
        personTMDB: personTMDB,
        originPerson: originPerson,
        isUseOriginal: isUseOriginal,
        language: lng,
      })

      const { id, tmdb_id } = await createOrUpdatePersonData(inputData)

      updatedStats.people.push(tmdb_id)

      return { id, lng, tmdbId: tmdb_id } ?? null
    })
  )

  return results.flat().filter(i => !!i?.id) as Array<{
    id: number
    lng: MOVIE_LANGUAGE
    tmdbId: number
  }>
}

const castProcess = async ({
  peopleData,
  personCombinedCredits,
}: {
  personCombinedCredits: CombinedCredits | null
  peopleData: Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number }>
}): Promise<void> => {
  const cast = personCombinedCredits?.cast || []
  const crew = personCombinedCredits?.crew || []

  const creditIds = cast.map(item => item.credit_id)
  const movieTmdbIds = cast.map(item => item.id)


  const [credits, movies] = await Promise.all([
    await repositories.cast.find({
      take: 10000,
      where: {
        credit_id: In(creditIds),
      },
    }),
    await repositories.movie.find({
      take: 10000,
      where: {
        movie_db_id: In(movieTmdbIds)
      }
    })
  ])

  await Bluebird.mapSeries(cast, async castItem => {
    if (castItem.media_type === 'tv') {
      return;
    }
    await Bluebird.mapSeries(peopleData, async personData => {
      const findCast = credits.find((c) => castItem.credit_id === c.credit_id && personData.id === c?.person?.id)

      if (isNeedToUpdate({...findCast, diffTimeAtDays: 7})) {
        const movie = movies.find((movie) => movie.movie_db_id === castItem.id && personData.lng === movie.language)

        if (!movie) {
          return;
        }

        const { credit_id } = await createOrUpdateCastData({
          castTMDB: {
            adult: castItem.adult,
            gender: null,
            known_for_department: "Acting",
            cast_id: null,
            character: castItem.character,
            credit_id: castItem.credit_id,
            order: castItem.order,
            popularity: castItem.popularity
          },
          movieId: movie.id,
          personId: personData.id,
          language: personData.lng,
          options: {
            reload: true
          }
        })

        updatedStats.cast.push(credit_id)
      }
    })
  })
}

const mainProcess = async (personTmdbId: number) => {
  const data = (await getData({
    personTmdbId,
    getPersonCombinedCreditsData: true
  })) as GetPersonData

  const { personCombinedCredits, peopleTMDBData } = data

  const peopleData = await personProcess({ peopleTMDBData })

  await castProcess({
    peopleData,
    personCombinedCredits,
  })
}

const doit = async (workerData: Worker): Promise<void> => {
  console.log('START WORK....')
  const jsonListData = (await getJsonData({
    workerData,
    fileNameType: 'people',
  })) as Array<{ id: number }>

  progressBar.start(jsonListData.length, 0)

  const movieIdChunks = _.chunk(jsonListData, numberWorkers)

  await Bluebird.mapSeries(movieIdChunks, async (chunk, index) => {
    const indexWithChunk = index * chunk.length
    if (startFrom > indexWithChunk) {
      return;
    }

    progressBar.update((index + 1) * chunk.length, {
      ids: chunk.map(item => item.id),
      movies: [...new Set(updatedStats.movies)].length,
      videos: [...new Set(updatedStats.videos)].length,
      people: [...new Set(updatedStats.people)].length,
      cast: [...new Set(updatedStats.cast)].length,
    })

    await allSettled(
      chunk.map(async item => {
        await mainProcess(item.id)
        await new Promise(resolve => setTimeout(resolve, 100))
        await updateWorkerStats({
          previousWorkerData: workerData,
          stats: updatedStats,
          totalLength: jsonListData.length,
          currentIndex: indexWithChunk,
        })
      })
    )
  })

  progressBar.stop()
}

Promise.resolve()
connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`)
  })
  .then(() =>
    createWorker({
      workerId,
      name: WORKER_NAME.DAILY_TMDB_PEOPLE,
      startAt: startDate,
      finishAt: startDate,
    })
  )
  .then(async workerData => {
    try {
      await doit(workerData)
      await repositories.worker.update(
        {
          id: workerData.id,
        },
        {
          status: WORKER_STATUS.FINISHED,
        }
      )
    } catch (err: any) {
      console.log(err?.stack || err)
      await repositories.worker.update(
        {
          id: workerData.id,
        },
        {
          status: WORKER_STATUS.FAILED,
        }
      )
      process.exit(1)
    }
  })
  .catch(async err => {
    console.log(err?.stack || err)
    process.exit(1)
  })
  .then(() => {
    console.log('#FINISH')
    process.exit(0)
  })
