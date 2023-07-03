/* eslint-disable no-console */
import {
  getMovie,
  getMovieChangeList,
  getMovieCredits,
  getPerson,
  getPersonChangeList,
  getPersonCombinedCredits,
  getPersonMoviesCredits,
} from '@services/themovie'
import { Genre, Worker } from '@models'
import {
  MovieCredits,
  MovieDB,
  PersonDB,
  PersonMovieCredits,
  CombinedCredits
} from '@services/themovie/types'
import { MOVIE_LANGUAGE, WORKER_NAME, WORKER_STATUS } from '@constants'
import withTryCatch from '@utils/withTryCatch'
import { getAllGenres } from '@services/genre'
import Bluebird from 'bluebird'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import moment from 'moment/moment'
import { repositories } from '@services/typeorm'
import {Presets, SingleBar } from 'cli-progress'
export const languages = [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA]

export type UpdatedStats = {
  movies: Array<number>
  people: Array<number>
  cast: Array<string>
  videos: Array<number>
  peopleFromCast: Array<number>
  errors: Array<any>
}

export const updatedStatsState = {
  movies: [],
  people: [],
  cast: [],
  videos: [],
  peopleFromCast: [],
  errors: []
} as UpdatedStats

export const getArg = yargs(hideBin(process.argv))
  .usage(
    'Usage: $0 --startDate [startDate] --endDate [endDate] --startFrom [startFrom] --workerId [workerId]'
  )
  .demandOption(['startDate', 'endDate', 'startFrom', 'workerId'])
  .alias('s', 'startDate')
  .alias('e', 'endDate')
  .alias('f', 'startFrom')
  .alias('w', 'workerId')
  .alias('n', 'numberWorkers')
  .default('startDate', moment().subtract(1, 'day').toString())
  .default('endDate', moment().toString())
  .default('startFrom', '0')
  .default('numberWorkers', '1')
  .default('workerId', null).argv as {
  startDate: string
  endDate: string
  startFrom: string
  numberWorkers: string
  workerId?: number | null
}

export const getDate = (date: string): string => date.replace(/"/g, '')

export const isNeedToUpdate = ({
  id,
  updated_at,
  diffTimeAtDays = 1,
}: {
  id?: number
  updated_at?: Date
  diffTimeAtDays?: number
}) => {
  if (id && updated_at) {
    const personMoment = moment(new Date(updated_at))
    const nowMoment = moment(new Date())

    return nowMoment.diff(personMoment, 'days') > diffTimeAtDays
  }

  return true
}

export const progressBar = new SingleBar(
  {
    format: `[{bar}] {percentage}% | ETA: {eta} | {value}/{total} | movies:{movies} | videos:{videos} | people:{people} | cast:{cast}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  },
  Presets.shades_grey
)

export const getMovieIdsForUpdates = async (
  type: 'movie' | 'person',
  startDate: string,
  endDate: string
): Promise<Array<number>> => {
  const allChanges = []
  console.log('GET PAGES')

  let data
  if (type === 'movie') {
    data = await getMovieChangeList({
      start_date: startDate,
      end_date: endDate,
    })
  } else {
    data = await getPersonChangeList({
      start_date: startDate,
      end_date: endDate,
    })
  }

  const totalPages = data.total_pages

  allChanges.push(...data.results.map(({ id }) => id))

  if (data.total_results > 0 && totalPages > 1) {
    for (let i = 2; i < totalPages; i++) {
      console.log(`#GETTING PAGES: (${i}|${totalPages})`)
      let results
      if (type === 'movie') {
        results = await getMovieChangeList({
          start_date: startDate,
          end_date: endDate,
        })
      } else {
        results = await getPersonChangeList({
          start_date: startDate,
          end_date: endDate,
        })
      }

      await new Promise(resolve => setTimeout(resolve, 100))

      allChanges.push(...results.results.map(({ id }) => id))
    }
  }

  const allChangesLength = [...new Set(allChanges)].length
  console.log(`FOUND: ${allChangesLength} changes at ${type.toUpperCase()}`)
  return [...new Set(allChanges)]
}

type MovieDataResult = {
  allGenres: Array<Genre>
  movieCastTMDB: MovieCredits | null
  moviesTMDBData: Array<{ movieTMDB: MovieDB | null; language: MOVIE_LANGUAGE }>
}

type PersonDataResult = {
  peopleTMDBData: Array<{
    personTMDB: PersonDB | null
    language: MOVIE_LANGUAGE
  }>
  personCast: PersonMovieCredits | null
  personCombinedCredits: CombinedCredits | null
}

export type GetMovieData = MovieDataResult & {
  personTMDB?: never
}

export type GetPersonData = PersonDataResult & {
  movieTMDB?: never
}

export const getData = async ({
  movieTmdbId,
  personTmdbId,
  getAllGenresData = true,
  getMovieData = true,
  getMovieCastData = true,
  getPersonMoviesData = true,
  getPersonCombinedCreditsData = false
}: {
  movieTmdbId?: number
  personTmdbId?: number
  getAllGenresData?: boolean
  getMovieData?: boolean
  getMovieCastData?: boolean
  getPersonMoviesData?: boolean
  getPersonCombinedCreditsData?: boolean
}): Promise<GetMovieData | GetPersonData | void> => {
  const wrappedGetAllGenres = withTryCatch(getAllGenres, [])
  const wrappedGetMovieCredits = withTryCatch(getMovieCredits, null)
  const wrappedGetMovie = withTryCatch(getMovie, null)
  const wrappedGetPerson = withTryCatch(getPerson, null)
  const wrapperPersonCredits = withTryCatch(getPersonMoviesCredits, null)
  const wrapperPersonCombinedCredits = withTryCatch(getPersonCombinedCredits, null)

  if (movieTmdbId !== undefined) {
    const [allGenres, movieCastTMDB, moviesTMDBData] = await Promise.all([
      getAllGenresData ? await wrappedGetAllGenres() : [],
      getMovieCastData
        ? await wrappedGetMovieCredits({ movieId: movieTmdbId })
        : null,
      await Bluebird.mapSeries(languages, async lng => ({
        movieTMDB: getMovieData
          ? await wrappedGetMovie({ movieId: movieTmdbId, language: lng })
          : null,
        language: lng,
      })),
    ])

    return {
      allGenres,
      movieCastTMDB,
      moviesTMDBData,
      personTMDB: undefined,
    }
  }

  if (personTmdbId !== undefined) {
    const [peopleTMDBData, personCast, personCombinedCredits] = await Promise.all([
      await Bluebird.mapSeries(languages, async lng => ({
        personTMDB: getMovieData
          ? await wrappedGetPerson({ personId: personTmdbId, language: lng })
          : null,
        language: lng,
      })),
      getPersonMoviesData
        ? await wrapperPersonCredits({ personId: personTmdbId })
        : null,
      getPersonCombinedCreditsData ? await  wrapperPersonCombinedCredits({
        personId: personTmdbId
      }): null
    ])

    return {
      peopleTMDBData,
      personCast,
      personCombinedCredits,
      movieTMDB: undefined,
    }
  }

  return undefined
}

export const printStats = ({
  stats,
  totalLength,
  currentIndex,
}: {
  stats: UpdatedStats
  totalLength: number
  currentIndex: number
}) => {
  console.log(`########## RESULTS"
        progress: ${currentIndex + 1}/${totalLength},
        movies: ${[...new Set(stats.movies)].length}
        videos: ${[...new Set(stats.videos)].length}
        people: ${[...new Set(stats.people)].length}
        cast: ${[...new Set(stats.cast)].length}
      `)
}

export const updateWorkerStats = async ({
  previousWorkerData,
  stats,
  totalLength,
  currentIndex,
}: {
  previousWorkerData: Worker
  stats: UpdatedStats
  totalLength: number
  currentIndex: number
}): Promise<Worker> => {
  return await repositories.worker.save({
    ...previousWorkerData,
    status: WORKER_STATUS.PROCESSING,
    data: {
      total: totalLength,
      progress: currentIndex + 1,
      movies:
        (previousWorkerData?.data?.movies ?? 0) +
        [...new Set(stats.movies)].length,
      videos:
        (previousWorkerData?.data?.movies ?? 0) +
        [...new Set(stats.videos)].length,
      people:
        (previousWorkerData?.data?.movies ?? 0) +
        [...new Set(stats.people)].length,
      cast:
        (previousWorkerData?.data?.movies ?? 0) +
        [...new Set(stats.cast)].length,
    },
  })
}

export const createWorker = async ({
  name,
  workerId,
  startAt,
  finishAt
}: {
  workerId?: number | null
  name: WORKER_NAME
  startAt: string,
  finishAt: string
}): Promise<Worker> => {
  if (workerId) {
    const findWorker = await repositories.worker.findOne({
      where: { id: workerId },
    })

    if (findWorker) {
      return findWorker
    }
  }

  const inputData = {
    name: name,
    status: WORKER_STATUS.STARTED,
    data: {
      total: 0,
      progress: 0,
      movies: 0,
      people: 0,
      cast: 0,
      videos: 0,
    },
    started_at: startAt,
    finished_at: finishAt
  }

  return await repositories.worker.save(inputData)
}
