import { repositories } from '@services/typeorm'
import { getMovieCredits } from '@services/themovie'
import { In } from 'typeorm'
import moment from 'moment/moment'
import allSettled from '@utils/allSettled'
import Bluebird from 'bluebird'
import { MOVIE_LANGUAGE } from '@constants'
import { Cast } from '@models'
import { MovieCredits } from '@services/themovie/types'
import {translate} from "@services/translate";

export type CastUpdaterProps = {
  movieTmdbId: number
  language: MOVIE_LANGUAGE
  updateAll?: boolean
}

export type UpdateCast = {
  adult: boolean
  gender: number | null
  known_for_department: string
  popularity: number
  cast_id: number | null
  character: string
  credit_id: string
  order: number
}

export type CreateOrUpdateCastData = {
  castTMDB: UpdateCast
  movieId: number
  personId: number
  language: MOVIE_LANGUAGE
  movieLanguage?: MOVIE_LANGUAGE
  options?: { reload?: boolean }
}
export const createOrUpdateCastData = async ({
  castTMDB,
  movieId,
  personId,
  language,
  movieLanguage,
  options = {}
}: CreateOrUpdateCastData): Promise<Cast> => {
  const [findCast, character] = await Promise.all([
    repositories.cast.findOne({
      where: { credit_id: castTMDB.credit_id, person: {id: personId}, movie: {id: movieId } },
    }),
    (movieLanguage === MOVIE_LANGUAGE.EN && language === MOVIE_LANGUAGE.EN) ? castTMDB.character : translate({
      sourceLang: 'auto',
      targetLang: language,
      text: castTMDB.character
    })
  ])

  const castData = {
    credit_id: castTMDB.credit_id,
    person: personId,
    movie: movieId,
    character: character,
    gender: castTMDB.gender,
    popularity: castTMDB.popularity,
    order: castTMDB.order,
    adult: castTMDB.adult,
    known_for_department: castTMDB.known_for_department
  } as unknown as Cast

  return await repositories.cast.save({
    ...findCast,
    ...castData,
  }, options)
}

export default async ({
  movieTmdbId,
  language,
  updateAll = false,
}: CastUpdaterProps): Promise<Array<Cast>> => {
  const castForUpdate: MovieCredits['cast'] = []

  const [cast, movieCredits] = await Promise.all([
    repositories.cast.find({
      where: { movie: { tmdb_id: movieTmdbId, language } },
      take: 1000,
    }),
    getMovieCredits({ movieId: movieTmdbId }),
  ])

  const castFromTMDB = movieCredits?.cast || []

  if (updateAll || (!cast.length && castFromTMDB.length > 0)) {
    castForUpdate.push(...castFromTMDB)
  } else {
    castFromTMDB.forEach(castItemTMDB => {
      const findCast = cast.find(c => c.credit_id === castItemTMDB.credit_id)

      if (!findCast) {
        castForUpdate.push(castItemTMDB)
      } else {
        const castMoment = moment(new Date(findCast.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(castMoment, 'days') > 7) {
          castForUpdate.push(castItemTMDB)
        }
      }
    })
  }

  const personTMDBIds = castForUpdate.map(item => item.id)

  const moviesByLanguage = await Bluebird.mapSeries(
    [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
    async lng => ({
      isReturn: lng === language,
      language: lng,
      movieData: await repositories.movie.findOne({
        where: { tmdb_id: movieTmdbId, language: lng },
      }),
      peopleData: await repositories.person.find({
        where: { tmdb_id: In(personTMDBIds), language: lng },
        take: 1000,
      }),
    })
  )

  await Bluebird.mapSeries(
    moviesByLanguage,
    async ({ isReturn, language, peopleData, movieData }) => {
      if (!movieData) {
        return { isReturn: false, language }
      }
      await allSettled(
        castForUpdate.map(async castTMDB => {
          const findPerson = peopleData.find(
            person => person.tmdb_id === castTMDB.id
          )

          if (!findPerson || !movieData?.id) return {}

          await createOrUpdateCastData({
            castTMDB,
            movieId: movieData.id,
            personId: findPerson.id,
            language,
          })
        })
      )

      return { isReturn, language }
    }
  )

  return await repositories.cast.find({
    where: { movie: { tmdb_id: movieTmdbId, language } },
    take: 1000,
    order: {
      order: "ASC"
    },
    relations: {
      movie: true,
      person: true,
    },
  })
}
