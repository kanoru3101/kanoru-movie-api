/* eslint-disable no-console */
import moment from 'moment'
import yargs from 'yargs'
import {
  getCredit,
  getMovie,
  getMovieCredits,
  getPerson,
  getPersonChangeList,
  getPersonMoviesCredits,
} from '@services/themovie'
import allSettled from '@utils/allSettled'
import { MOVIE_LANGUAGE } from '@constants'
import Bluebird from 'bluebird'
import { MovieCredits, MovieDB, PersonDB } from '@services/themovie/types'
import { translate } from '@services/translate'
import connectDB from '@config/ormconfig'
import _ from 'lodash'
import { hideBin } from 'yargs/helpers'
import { createOrUpdatePersonData } from '@services/updater/personUpdater'
import { getAllGenres } from '@services/genre'
import {
  createOrUpdateMovie,
  createOrUpdateMovieData,
  findMovieByOriginalLanguageTMDB,
  generateInputDataForMovie,
} from '@services/updater/movieUpdater'
import { Genre } from '@models'
import { repositories } from '@services/typeorm'
import { createOrUpdateCastData } from '@services/updater/castUpdater'
import withTryCatch from '@utils/withTryCatch'

const languages = [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA]

type UpdatedStats = {
  movies: Array<number>
  people: Array<number>
  cast: Array<string>
  videos: Array<number>
  moviesFromPersonCast: Array<number>
  peopleFromCast: Array<number>
}

const updatedStats = {
  movies: [],
  people: [],
  cast: [],
  videos: [],
  moviesFromPersonCast: [],
  peopleFromCast: []
} as UpdatedStats

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --startDate [startDate] --endDate [endDate]')
  .demandOption(['startDate', 'endDate'])
  .alias('s', 'startDate')
  .alias('e', 'endDate')
  .default('startDate', moment().subtract(1, 'day').toString())
  .default('endDate', moment().toString()).argv as {
  startDate?: string
  endDate?: string
}

const startDate = argv?.startDate?.replace(/"/g, '')
const endDate = argv?.endDate?.replace(/"/g, '')

const isNeedToUpdate = ({
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

const processForPerson = async ({
  tmdbId,
}: {
  tmdbId: number
}): Promise<
  Array<{ id: number; lng: MOVIE_LANGUAGE; tmdbId: number; isUpdated: boolean }>
> => {
  const peopleDataTMDB = await Bluebird.mapSeries(languages, async lng => ({
    personTMDB: await getPerson({ personId: tmdbId, language: lng }),
    lng,
  }))

  const originPerson = peopleDataTMDB.find(
    ({ lng }) => lng === MOVIE_LANGUAGE.EN
  )?.personTMDB as PersonDB

  if (!originPerson) {
    return []
  }

  const results = await allSettled(
    peopleDataTMDB.map(async ({ personTMDB, lng }) => {
      if (!personTMDB.imdb_id || personTMDB.imdb_id === '') {
        return null
      }

      const existPerson = await repositories.person.findOne({
        where: {
          tmdb_id: personTMDB.id,
          language: lng,
        },
      })

      const isNeed = isNeedToUpdate({ ...existPerson })

      if (!isNeed) {
        return { id: existPerson?.id, lng, tmdbId, isUpdated: false }
      }

      const personInputData = {
        tmdb_id: personTMDB.id,
        imdb_id: personTMDB.imdb_id,
        language: lng,
        name: await translate({
          sourceLang: MOVIE_LANGUAGE.EN,
          targetLang: lng,
          text: personTMDB.name || '',
        }),
        biography:
          personTMDB.biography ||
          (await translate({
            sourceLang: MOVIE_LANGUAGE.EN,
            targetLang: lng,
            text: originPerson.biography,
          })),
        birthday: personTMDB?.birthday,
        deathday: personTMDB?.deathday,
        known_for_department: personTMDB.known_for_department,
        gender: personTMDB.gender,
        popularity: personTMDB.popularity,
        place_of_birth: await translate({
          sourceLang: MOVIE_LANGUAGE.EN,
          targetLang: lng,
          text: personTMDB.place_of_birth || originPerson.place_of_birth || '',
        }),
        adult: personTMDB.adult,
        profile_path:
          personTMDB?.profile_path &&
          `https://image.tmdb.org/t/p/original${personTMDB.profile_path}`,
        homepage: personTMDB.homepage || originPerson.homepage,
        also_known_as: personTMDB.also_known_as || originPerson.also_known_as,
      }

      const { id } = await createOrUpdatePersonData(personInputData)

      updatedStats.people.push(tmdbId)

      return { id, lng, tmdbId, isUpdated: true } ?? null
    })
  )

  return results.flat().filter(i => !!i?.id) as Array<{
    id: number
    lng: MOVIE_LANGUAGE
    tmdbId: number
    isUpdated: boolean
  }>
}
const processForMovie = async ({
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

const peopleProcess = async ({
  peopleIds,
}: {
  peopleIds: Array<number>
}): Promise<{
  data: Array<{
    id: number
    tmdbId: number
    lng: MOVIE_LANGUAGE
  }>
  stats: {
    processed: number
    en: number
    ua: number
    isUpdated: number
  }
}> => {
  const peopleStats = {
    processed: 0,
    en: 0,
    ua: 0,
    isUpdated: 0,
  }

  const peopleData = await Bluebird.mapSeries(
    _.chunk(peopleIds, 5),
    async peopleIds => {
      const results = await allSettled(
        peopleIds.map(async id => {
          console.log(`#PERSON ID: ${id}`)
          const personData = await processForPerson({ tmdbId: id })
          return personData.flat()
        })
      )

      await new Promise(resolve => setTimeout(resolve, 200))

      peopleStats.processed += results.length
      peopleStats.en += results
        .flat()
        .filter(({ lng }) => lng === MOVIE_LANGUAGE.EN).length

      peopleStats.ua += results
        .flat()
        .filter(({ lng }) => lng === MOVIE_LANGUAGE.UA).length

      const updatedPerson = results
        .flat()
        .filter(({ isUpdated }) => isUpdated)
        .map(({ id }) => id)

      peopleStats.isUpdated += [...new Set(updatedPerson)].length

      return results.flat().map(({ id, lng, tmdbId }) => ({
        id,
        tmdbId,
        lng,
      }))
    }
  )

  return {
    data: peopleData.flat(),
    stats: peopleStats,
  }
}

const castProcess = async ({
  people,
  movies,
  cast,
}: {
  people: Array<{ id: number; tmdbId: number; lng: MOVIE_LANGUAGE }>
  movies: Array<{ id: number; tmdbId: number; lng: MOVIE_LANGUAGE }>
  cast: MovieCredits['cast']
}): Promise<void> => {
  await Bluebird.mapSeries(cast, async castItem => {
    const castPersonId = castItem.id

    await Bluebird.mapSeries(
      movies,
      async ({ id: movieId, tmdbId: movieTmdbId, lng: movieLng }) => {
        const castFromDB = await repositories.cast.find({
          where: { movie: { movie_db_id: movieTmdbId, language: movieLng } },
          take: 1000,
        })

        const findCast = castFromDB.find(
          c => c.credit_id === castItem.credit_id
        )
        const isNeedUpdate = isNeedToUpdate({ diffTimeAtDays: 7, ...findCast })

        if (!isNeedUpdate) {
          return { isUpdated: false, lng: movieLng }
        }

        const findPerson = people.find(
          ({ lng, tmdbId }) => lng === movieLng && castPersonId === tmdbId
        )

        const idsForPeople = [] as Array<number>

        findPerson?.id && idsForPeople.push(findPerson.id)

        if (!findPerson) {
          const createPerson = await processForPerson({ tmdbId: castItem.id})

          if (createPerson) {
            idsForPeople.push(...createPerson?.map(({ id }) => id) || [])
            updatedStats.peopleFromCast.push(...createPerson?.map(({ id }) => id) || []);
          }
        }



        await Bluebird.mapSeries(idsForPeople, async (personId) => {
          const { credit_id } = await createOrUpdateCastData({
            castTMDB: castItem,
            movieId: movieId,
            personId: personId,
            language: movieLng,
          })

          credit_id && updatedStats.cast.push(credit_id)
        })
      }
    )
  })
}

const getMovieData = async ({
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

const mainProcess = async (movieTmdbId: number) => {
  const { allGenres, movieCastTMDB, moviesTMDBData } = await getMovieData({
    movieTmdbId,
  })

  const moviesData = await processForMovie({
    allGenres,
    moviesTMDBData,
  })

  console.log('#Adding People For Movie')
  const movieCastData = movieCastTMDB?.cast || []
  const castPeopleIds = movieCastData.map(castItem => castItem.id)

  const peopleData = await peopleProcess({
    peopleIds: castPeopleIds,
  })

  await castProcess({
    people: peopleData.data,
    movies: moviesData,
    cast: movieCastData,
  })
}

const getMovieIdsForUpdates = async (): Promise<Array<number>> => {
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

const doit = async (): Promise<void> => {
  console.log('#########', startDate, endDate)
  console.log('START WORK....')
  const movieIds = await getMovieIdsForUpdates()
  const movieIdsLength = movieIds.length

  if (movieIdsLength) {
    await Bluebird.mapSeries(
      _.chunk(movieIds, 1),
      async (changesIds, index) => {
        await allSettled(
          changesIds.map(async id => {
            console.log(`#MOVIE ID: ${id}`)
            return await mainProcess(id)
          })
        )

        await new Promise(resolve => setTimeout(resolve, 50))

        console.log(
          `##RESULTS:
\t PROGESS ${index + 1}/${movieIdsLength} 
\t MOVIES: ${[...new Set(updatedStats.movies)].length}
\t MOVIES FROM CAST: ${
[...new Set(updatedStats.moviesFromPersonCast)].length
}
\t PEOPLE: ${[...new Set(updatedStats.people)].length}
\t PEOPLE: ${[...new Set(updatedStats.peopleFromCast)].length}
\t CAST: ${[...new Set(updatedStats.cast)].length}
\t VIDEOS: ${[...new Set(updatedStats.videos)].length}
      `
        )
      }
    )
  }
}

Promise.resolve()
console.log(process.argv)
connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`)
  })
  .then(doit)
  .catch(err => {
    console.log(err?.stack || err)
    process.exit(1)
  })
  .then(() => {
    console.log('#FINISH')
    process.exit(0)
  })
