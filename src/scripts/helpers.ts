/* eslint-disable no-console */
import {
  getMovie,
  getMovieCredits,
  getPersonChangeList,
} from '@services/themovie'
import { Genre } from '@models'
import { MovieCredits, MovieDB } from '@services/themovie/types'
import { MOVIE_LANGUAGE } from '@constants'
import withTryCatch from '@utils/withTryCatch'
import { getAllGenres } from '@services/genre'
import Bluebird from 'bluebird'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import moment from 'moment/moment'

export const languages = [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA]

export const getArg = yargs(hideBin(process.argv))
  .usage('Usage: $0 --startDate [startDate] --endDate [endDate]')
  .demandOption(['startDate', 'endDate'])
  .alias('s', 'startDate')
  .alias('e', 'endDate')
  .default('startDate', moment().subtract(1, 'day').toString())
  .default('endDate', moment().toString()).argv as {
  startDate: string
  endDate: string
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

export const getMovieIdsForUpdates = async (
  startDate: string,
  endDate: string
): Promise<Array<number>> => {
  const allChanges = []
  console.log('GET PAGES')
  const { results, total_results, total_pages } = await getPersonChangeList({
    start_date: startDate,
    end_date: endDate,
  })
  const totalPages = total_pages
  allChanges.push(...results.map(({ id }) => id))

  if (total_results > 0 && total_pages > 1) {
    for (let i = 2; i < total_pages; i++) {
      console.log(`#GETTING PAGES: (${i}|${totalPages})`)
      const { results } = await getPersonChangeList({
        page: i,
        start_date: startDate,
        end_date: endDate,
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      allChanges.push(...results.map(({ id }) => id))
    }
  }

  const allChangesLength = [...new Set(allChanges)].length
  console.log(`FOUND: ${allChangesLength} changes at Movies`)
  return [...new Set(allChanges)]
}

export const getData = async ({
  movieTmdbId,
  getAllGenresData = true,
  getMovieData = true,
  getMovieCastData = true,
}: {
  movieTmdbId: number
  getAllGenresData?: boolean
  getMovieData?: boolean
  getMovieCastData?: boolean
}): Promise<{
  allGenres: Array<Genre>
  movieCastTMDB: MovieCredits | null
  moviesTMDBData: Array<{ movieTMDB: MovieDB | null; language: MOVIE_LANGUAGE }>
}> => {
  const wrappedGetAllGenres = withTryCatch(getAllGenres, [])
  const wrappedGetMovieCredits = withTryCatch(getMovieCredits, null)
  const wrappedGetMovie = withTryCatch(getMovie, null)

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
  }
}
