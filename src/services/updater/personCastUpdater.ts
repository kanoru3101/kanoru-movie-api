import {Cast} from "@models";
import {MOVIE_LANGUAGE} from "@constants";
import {MovieCredits, PersonMovieCredits} from "@services/themovie/types";
import {getMovieCredits, getPersonMoviesCredits} from "@services/themovie";
import {repositories} from "@services/typeorm";
import moment from "moment";
import Bluebird from "bluebird";
import {In} from "typeorm";
import allSettled from "@utils/allSettled";
import {chooseDataForTranslate} from "@utils/chooseData";
import {movieUpdater} from "@services/updater/index";

export type PeronCastUpdater = {
  personTmdbId: number
  language: MOVIE_LANGUAGE,
  updateAll?: boolean
  addNewMovies?: boolean
}

export type CreateOrUpdatePersonCastData = {
  movieId: number
  personId: number
  language: MOVIE_LANGUAGE
  castTMDB: MovieCredits['cast'][0],
}

export const createOrUpdatePersonCastData = async ({
  movieId,
  personId,
  castTMDB,
  language
}: CreateOrUpdatePersonCastData): Promise<Cast> => {
  const chooseDataForTranslateWrapper = async (
    mainText: string,
    secondaryText?: string | null
  ) => {
    const options = {
      isUseOriginal: false,
      originalLanguage: MOVIE_LANGUAGE.EN,
      language,
    }
    return await chooseDataForTranslate(options, mainText, secondaryText)
  }

  const [findCast, character ] = await Promise.all([
    await repositories.cast.findOne({
      where: { credit_id: castTMDB.credit_id, person: {id: personId}, movie: {id: movieId } },
    }),
    await chooseDataForTranslateWrapper(
      castTMDB.character || '',
    ),
  ])

  const castData = {
    credit_id: castTMDB.credit_id,
    person: personId,
    movie: movieId,
    character: character,
    gender: castTMDB.gender,
    order: castTMDB.order,
    adult: castTMDB.adult,
    known_for_department: castTMDB.known_for_department,
    cast_id: castTMDB.cast_id
  } as unknown as Cast

  return await repositories.cast.save({
    ...findCast,
    ...castData,
  })
}


export default async ({
  personTmdbId,
  language,
  addNewMovies = false,
  updateAll = false
}: PeronCastUpdater): Promise<Array<Cast>> => {
  const castForUpdate: PersonMovieCredits['cast'] = []

  const [castTmdb, personCast] = await Promise.all([
    await getPersonMoviesCredits({
      personId: personTmdbId,
      language
    }),
    await repositories.cast.find({
      where: {
        person: {
          tmdb_id: personTmdbId,
          language
        }
      },
      take: 1000,
    })
  ])

  const personCastTmdb = castTmdb?.cast || []

  if (updateAll || (!personCast.length && personCastTmdb.length > 0)) {
    castForUpdate.push(...personCastTmdb);
  } else {
    personCastTmdb.forEach((castItemTMDB) => {
      const findCast = personCast.find((pc) => pc.credit_id === castItemTMDB.credit_id);

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

  const movieTMDBIds = castForUpdate.map((item) => item.id)

  const movieCreditData = await Bluebird.mapSeries(
    movieTMDBIds,
    async movieTmdbId => {
      const data = await getMovieCredits({
        movieId: movieTmdbId
      })

      return {
        movieId: movieTmdbId,
        data: data.cast.find((item) => item.id === personTmdbId) || null
      }
    }
  )

  const peopleByLanguage = await Bluebird.mapSeries(
    [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
    async lng => ({
      isReturn: lng === language,
      language: lng,
      personData: await repositories.person.findOne({
        where: { tmdb_id: personTmdbId, language: lng}
      }),
      moviesData: await repositories.movie.find({
        where: { tmdb_id: In(movieTMDBIds), language: lng},
        take: 1000
      })
    })
  )

  await Bluebird.mapSeries(
    peopleByLanguage,
    async ({ isReturn, language, personData, moviesData}) => {
      if (!personData) {
        return { isReturn: false, language }
      }

      await allSettled(
        castForUpdate.map(async (castTMDB) => {
          let findMovie = moviesData.find(
            movie => movie.tmdb_id === castTMDB.id
          )

          if (addNewMovies && !findMovie) {
            // eslint-disable-next-line no-console
            console.log(
              `###CREATING_MOVIE_FOR_PERSON_TMDB(${personTmdbId}) - MOVIE_TMDB(${castTMDB.id})`
            )
            const createdMovie = await movieUpdater({
              movieIds: [castTMDB.id],
              language,
            })
            findMovie = createdMovie[0]
          }

          const findCast = movieCreditData.find(movieCast => movieCast.movieId === findMovie?.tmdb_id)?.data || null

          if (!findMovie || !personData?.id || !movieCreditData || !findCast) return null

          await createOrUpdatePersonCastData({
            movieId: findMovie.id,
            personId: personData.id,
            castTMDB: findCast,
            language
          })
        })
      )

      return { isReturn, language }
    })


  return await repositories.cast.find({
    where: { person: { tmdb_id: personTmdbId, language} },
    take: 1000,
    order: {
      movie: {
        release_date: "DESC"
      }
    },
    relations: ['person', 'movie', 'movie.genres'],
    loadEagerRelations: false,
  })
}
