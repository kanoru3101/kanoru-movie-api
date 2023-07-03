/* eslint-disable no-console */
import _ from 'lodash'
import Bluebird from 'bluebird'

import connectDB from '@config/ormconfig'
import {
  createWorker,
  getArg,
  getData,
  getDate,
  GetMovieData,
  progressBar,
  updatedStatsState,
  updateWorkerStats,
} from './helpers'
import { MOVIE_LANGUAGE, WORKER_NAME, WORKER_STATUS } from '@constants'
import { repositories } from '@services/typeorm'

import { Genre, Worker } from '@models'
import { MovieDB } from '@services/themovie/types'
import {
  createOrUpdateMovieData,
  findMovieByOriginalLanguageTMDB,
  generateInputDataForMovie,
} from '@services/updater/movieUpdater'
import allSettled from '@utils/allSettled'
import { getJsonData } from './dailyHelpers'

const argv = getArg

const startDate = getDate(argv.startDate)
const workerId = argv.workerId
const startFrom = Number(argv.startFrom)
const numberWorkers = Number(argv.numberWorkers)
const updatedStats = { ...updatedStatsState }

const movieProcess = async ({
  allGenres,
  moviesTMDBData,
}: {
  allGenres: Array<Genre>
  moviesTMDBData: Array<{ movieTMDB: MovieDB | null; language: MOVIE_LANGUAGE }>
}): Promise<Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number }>> => {
  const { data: originMovie, isUseOriginal } = findMovieByOriginalLanguageTMDB(
    moviesTMDBData,
    true
  )

  if (!originMovie) {
    return []
  }

  const results = await allSettled(
    moviesTMDBData.map(async ({ movieTMDB, language: lng }) => {
      if (!movieTMDB || !movieTMDB.imdb_id || movieTMDB.imdb_id === '') {
        return null
      }

      const inputData = await generateInputDataForMovie({
        movieData: movieTMDB,
        originalMovieData: originMovie,
        allGenres,
        movieId: movieTMDB.id,
        isUseOriginal: isUseOriginal,
        language: lng,
      })

      updatedStats.videos.push(
        ...(inputData?.videos?.map(({ id }) => id) || [])
      )

      const { id } = await createOrUpdateMovieData(inputData)

      updatedStats.movies.push(movieTMDB.id)

      return { id, lng, tmdbId: movieTMDB.id } ?? null
    })
  )

  return results.flat().filter(i => !!i?.id) as Array<{
    id: number
    lng: MOVIE_LANGUAGE
    tmdbId: number
  }>
}

// const personProcess = async ({
//   tmdbId,
// }: {
//   tmdbId: number
//   updateAll?: boolean
// }): Promise<
//   Array<{ id: number; language: MOVIE_LANGUAGE; tmdbId: number }>
// > => {
//   const peopleDataTMDB = await Bluebird.mapSeries(languages, async lng => ({
//     personTMDB: await getPerson({ personId: tmdbId, language: lng }),
//     existPerson: await repositories.person.findOne({
//       where: { tmdb_id: tmdbId, language: lng },
//     }),
//     language: lng,
//   }))
//   await new Promise(resolve => setTimeout(resolve, 200))
//
//   const { data: originPersonData, isUseOriginal } =
//     findPersonByOriginalLanguageTMDB(peopleDataTMDB, true)
//
//   if (!originPersonData) {
//     return []
//   }
//
//   const results = await allSettled(
//     peopleDataTMDB.map(async ({ personTMDB, existPerson, language }) => {
//       if (!personTMDB.imdb_id || personTMDB.imdb_id === '') {
//         return null
//       }
//
//       const isNeed = isNeedToUpdate({ ...existPerson })
//
//       if (!isNeed) {
//         return {
//           id: existPerson?.id,
//           language: language,
//           tmdbId,
//           isUpdated: false,
//         }
//       }
//
//       const inputPersonData = await generateInputDataForPerson({
//         personTMDB: personTMDB,
//         originPerson: originPersonData,
//         language,
//         isUseOriginal,
//       })
//
//       const { id } = await createOrUpdatePersonData(inputPersonData)
//
//       updatedStats.people.push(tmdbId)
//
//       return { id, language, tmdbId, isUpdated: true } ?? null
//     })
//   )
//
//   return results.flat().filter(i => !!i?.id) as Array<{
//     id: number
//     language: MOVIE_LANGUAGE
//     tmdbId: number
//     isUpdated: boolean
//   }>
// }
// const castProcess = async ({
//   movieCastTMDB,
//   moviesData,
// }: {
//   movieCastTMDB: MovieCredits | null
//   moviesData: Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number }>
// }): Promise<void> => {
//   const cast = movieCastTMDB?.cast || []
//
//   const creditIds = cast.map(item => item.credit_id)
//
//   const credits = await repositories.cast.find({
//     take: 10000,
//     where: {
//       credit_id: In(creditIds),
//     },
//   })
//
//   await Bluebird.mapSeries(cast, async castItem => {
//     const getPeopleForCast = async (): Promise<
//       Array<{ id: number; language: MOVIE_LANGUAGE }>
//     > => {
//       const findPersonCredit = credits.filter(
//         i => castItem.id === i?.person?.tmdb_id
//       )
//
//       if (findPersonCredit.length === moviesData.length) {
//         return findPersonCredit.map(cast => ({
//           id: cast.person.id,
//           language: cast.person.language,
//         }))
//       }
//       const createdPeople = await personProcess({
//         tmdbId: castItem.id,
//       })
//
//       return createdPeople.map(person => ({
//         id: person.id,
//         language: person.language,
//       }))
//     }
//
//     const findPeople = await getPeopleForCast()
//
//     await Bluebird.mapSeries(moviesData || [], async movieData => {
//       const findCast = credits.find(
//         i => castItem.credit_id === i.credit_id && movieData.id === i?.movie?.id
//       )
//
//       if (isNeedToUpdate({ ...findCast, diffTimeAtDays: 7 })) {
//         const findPersonIdByLanguage = findPeople.find(
//           person => person.language === movieData.lng
//         )?.id
//
//         if (findPersonIdByLanguage) {
//           const { credit_id } = await createOrUpdateCastData({
//             castTMDB: castItem,
//             movieId: movieData.id,
//             personId: findPersonIdByLanguage,
//             language: movieData.lng,
//           })
//
//           updatedStats.cast.push(credit_id)
//         }
//       }
//     })
//   })
// }

const mainProcess = async (movieTmdbId: number) => {
  const data = (await getData({
    movieTmdbId,
    getMovieCastData: false,
  })) as GetMovieData

  const { allGenres, moviesTMDBData } = data

  await movieProcess({
    allGenres,
    moviesTMDBData,
  })

  // await castProcess({
  //   moviesData,
  //   movieCastTMDB,
  // })
}

const doit = async (workerData: Worker): Promise<void> => {
  console.log('START WORK....')
  const jsonListData = (await getJsonData({
    workerData,
    fileNameType: 'movies',
  })) as Array<{ id: number }>

  progressBar.start(jsonListData.length, 0)

  const movieIdChunks = _.chunk(jsonListData, numberWorkers)

  await Bluebird.mapSeries(movieIdChunks, async (chunk, index) => {
    const indexWithChunk = index * chunk.length
    if (startFrom > indexWithChunk) {
      return
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
      name: WORKER_NAME.DAILY_TMDB_MOVIES,
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
