/* eslint-disable no-console */
import {
  getPerson,
} from '@services/themovie'
import allSettled from '@utils/allSettled'
import { MOVIE_LANGUAGE } from '@constants'
import Bluebird from 'bluebird'
import { MovieCredits, MovieDB, } from '@services/themovie/types'
import connectDB from '@config/ormconfig'
import {
  createOrUpdatePersonData,
  findPersonByOriginalLanguageTMDB,
  generateInputDataForPerson
} from '@services/updater/personUpdater'
import {
  createOrUpdateMovieData,
  findMovieByOriginalLanguageTMDB,
  generateInputDataForMovie,
} from '@services/updater/movieUpdater'
import { Genre } from '@models'
import { repositories } from '@services/typeorm'
import { createOrUpdateCastData } from '@services/updater/castUpdater'
import {
  getArg,
  getData,
  getDate,
  GetMovieData,
  getMovieIdsForUpdates,
  GetPersonData,
  isNeedToUpdate,
  languages
} from "./helpers";
import {In} from "typeorm";

type UpdatedStats = {
  movies: Array<number>
  people: Array<number>
  cast: Array<string>
  videos: Array<number>
  peopleFromCast: Array<number>
}

const updatedStats = {
  movies: [],
  people: [],
  cast: [],
  videos: [],
  peopleFromCast: []
} as UpdatedStats

const argv = getArg;

const startDate = getDate(argv.startDate);
const endDate = getDate(argv.endDate);


const personProcess = async ({
  tmdbId,
 }: {
  tmdbId: number
  updateAll?: boolean
}): Promise<
  Array<{ id: number; language: MOVIE_LANGUAGE; tmdbId: number}>
> => {
  const peopleDataTMDB = await Bluebird.mapSeries(languages, async lng => ({
    personTMDB: await getPerson({ personId: tmdbId, language: lng }),
    existPerson: await repositories.person.findOne({ where: {tmdb_id: tmdbId, language: lng}}),
    language: lng,
  }))
  await new Promise(resolve => setTimeout(resolve, 200))

  const {data: originPersonData, isUseOriginal} = findPersonByOriginalLanguageTMDB(peopleDataTMDB, true)

  if (!originPersonData) {
    return []
  }

  const results = await allSettled(
    peopleDataTMDB.map(async ({ personTMDB, existPerson, language }) => {
      if (!personTMDB.imdb_id || personTMDB.imdb_id === '') {
        return null
      }

      const isNeed = isNeedToUpdate({ ...existPerson })

      if (!isNeed) {
        return { id: existPerson?.id, language: language, tmdbId, isUpdated: false }
      }

      const inputPersonData = await generateInputDataForPerson({
        personTMDB: personTMDB,
        originPerson: originPersonData,
        language,
        isUseOriginal
      })

      const { id } = await createOrUpdatePersonData(inputPersonData)

      updatedStats.people.push(tmdbId)

      return { id, language, tmdbId, isUpdated: true } ?? null
    })
  )

  return results.flat().filter(i => !!i?.id) as Array<{
    id: number
    language: MOVIE_LANGUAGE
    tmdbId: number
    isUpdated: boolean
  }>
}

const castProcess = async ({
  movieCastTMDB,
  moviesData
}: {
  movieCastTMDB: MovieCredits | null
  moviesData: Array<{id: number, lng: MOVIE_LANGUAGE, tmdbId: number}>
}): Promise<void> => {
  const cast = movieCastTMDB?.cast || [];

  const creditIds = cast.map((item) => item.credit_id);

  const credits = await repositories.cast.find({
    take: 10000,
    where: {
      credit_id: In(creditIds)
    }
  })

  await Bluebird.mapSeries(cast, async (castItem) => {
    const getPeopleForCast = async (): Promise<Array<{id: number, language: MOVIE_LANGUAGE}>> => {
      const findPersonCredit = credits.filter(i => castItem.id === i?.person?.tmdb_id);

      if (findPersonCredit.length === moviesData.length) {
          return findPersonCredit.map((cast) => ({id: cast.person.id, language: cast.person.language}));
      }

      console.log(`##ADDING People with TMDB ID ${castItem.id}`)
      const createdPeople = await personProcess({
        tmdbId: castItem.id
      });

      return createdPeople.map((person) => ({ id: person.id, language: person.language}))
    }

    const findPeople = await getPeopleForCast();

    await Bluebird.mapSeries((moviesData || []), async (movieData) => {
      const findCast = credits.find((i) => castItem.credit_id === i.credit_id && movieData.id === i?.movie?.id)

      if (isNeedToUpdate({...findCast, diffTimeAtDays:7 })) {
        const findPersonIdByLanguage = findPeople.find((person) => person.language === movieData.lng )?.id;

        if (findPersonIdByLanguage) {
          const { credit_id } = await createOrUpdateCastData({
            castTMDB: castItem,
            movieId: movieData.id,
            personId: findPersonIdByLanguage,
            language: movieData.lng,
          })

          updatedStats.cast.push(credit_id)
        } else {
          console.log('####ERROR: NO CREATE CAST')
        }
      }
    })
  })
}

export const movieProcess = async ({
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

const mainProcess = async (movieTmdbId: number) => {
  const data = await getData({
    movieTmdbId,
  }) as GetMovieData

  const { allGenres, movieCastTMDB, moviesTMDBData } = data
  console.log(`#MOVIE ID: ${movieTmdbId}`)
  const moviesData = await movieProcess({
    allGenres,
    moviesTMDBData,
  })

  await castProcess({
    moviesData,
    movieCastTMDB
  })

}

const doit = async (): Promise<void> => {
  console.log('START WORK....')
  const movieIds = await getMovieIdsForUpdates('movie', startDate, endDate)
  const movieIdsLength = movieIds.length

  if (movieIdsLength) {
    await Bluebird.mapSeries(movieIds, async (id, index) => {
      await mainProcess(id)
      await new Promise(resolve => setTimeout(resolve, 100))
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
