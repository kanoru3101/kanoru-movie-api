/* eslint-disable no-console */
import connectDB from '@config/ormconfig'
import {
  createWorker,
  getArg,
  getData,
  getDate,
  getMovieIdsForUpdates,
  GetPersonData,
  printStats,
  updatedStatsState,
  updateWorkerStats,
} from './helpers'
import Bluebird from 'bluebird'

import {
  createOrUpdatePersonData,
  findPersonByOriginalLanguageTMDB,
  generateInputDataForPerson,
} from '@services/updater/personUpdater'
import allSettled from '@utils/allSettled'
import { MOVIE_LANGUAGE, WORKER_NAME, WORKER_STATUS } from '@constants'
import { personCastUpdater } from '@services/updater'
import { repositories } from '@services/typeorm'
import { Worker } from '@models'

const updatedStats = { ...updatedStatsState }

const argv = getArg

const startDate = getDate(argv.startDate)
const endDate = getDate(argv.endDate)
const startFrom = Number(argv.startFrom)
const workerId = argv.workerId

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
}: {
  peopleData: Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number }>
}): Promise<void> => {
  await Bluebird.mapSeries(peopleData, async personData => {
    const result = await personCastUpdater({
      language: personData.lng,
      personTmdbId: personData.tmdbId,
      addNewMovies: true,
    })

    updatedStats.movies.push(...result.map(data => data.movie.tmdb_id))
    updatedStats.cast.push(...result.map(data => data.credit_id))
  })
}

const mainProcess = async (personTmdbId: number) => {
  const data = (await getData({
    personTmdbId,
    getPersonMoviesData: false,
  })) as GetPersonData

  const { peopleTMDBData } = data

  const peopleData = await personProcess({ peopleTMDBData })

  await castProcess({
    peopleData,
  })
}

const doit = async (workerData: Worker): Promise<void> => {
  console.log('START WORK....')

  const movieIds = await getMovieIdsForUpdates('person', startDate, endDate)
  const movieIdsLength = movieIds.length

  if (movieIdsLength) {
    await Bluebird.mapSeries(movieIds, async (id, index) => {
      if (startFrom > index) {
        return
      }

      await mainProcess(id)
      await new Promise(resolve => setTimeout(resolve, 100))

      await updateWorkerStats({
        previousWorkerData: workerData,
        stats: updatedStats,
        totalLength: movieIdsLength,
        currentIndex: index,
      })

      printStats({
        currentIndex: index,
        stats: updatedStats,
        totalLength: movieIdsLength,
      })

      console.log(`########## RESULTS"
        progress: ${index + 1}/${movieIdsLength},
        movies: ${[...new Set(updatedStats.movies)].length}
        videos: ${[...new Set(updatedStats.videos)].length}
        people: ${[...new Set(updatedStats.people)].length}
        cast: ${[...new Set(updatedStats.cast)].length}
      `)
    })
  }
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
      name: WORKER_NAME.UPDATE_PEOPLE,
      startAt: startDate,
      finishAt: endDate,
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
  .catch(err => {
    console.log(err?.stack || err)
    process.exit(1)
  })
  .then(() => {
    console.log('#FINISH')
    process.exit(0)
  })
