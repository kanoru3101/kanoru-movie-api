import {getMovieCredits, getPerson,} from '@services/themovie'
import {repositories} from '@services/typeorm'
import allSettled from '@utils/allSettled'
import {Person} from '@models'
import {MOVIE_LANGUAGE} from '@constants'
import {In} from 'typeorm'
import moment from 'moment'
import Bluebird from 'bluebird'
import {translate} from "@services/translate";

export type PersonUpdaterProps =
  | {
      personTmdbIds: Array<number>
      movieTmdbId?: never
      language: MOVIE_LANGUAGE
      updateAll?: boolean
    }
  | {
      personTmdbIds?: never
      movieTmdbId: number
      language: MOVIE_LANGUAGE
      updateAll?: boolean
    }

type GetPersonTMDBIds = {
  personTmdbIds?: Array<number>
  movieTmdbId?: number
}

export type CreateOrUpdatePerson = {
  personTMDBId: number
  language: MOVIE_LANGUAGE
}

export type PersonDataProps = {
  tmdb_id: number
  imdb_id: string
  language: MOVIE_LANGUAGE
  name: string
  biography: string
  gender: number
  popularity: number
  place_of_birth: string | null
  adult: boolean
  profile_path: string | null
  homepage: string | null
  also_known_as: string[]
}

const createOrUpdatePersonData = async (
  personData: PersonDataProps
): Promise<Person> => {
  const findPerson = await repositories.person.findOne({
    where: {
      tmdb_id: personData.tmdb_id,
      language: personData.language,
    },
  })

  return await repositories.person.save({
    ...findPerson,
    ...personData,
  })
}

const getPersonTMDBIds = async ({
  movieTmdbId,
  personTmdbIds,
}: GetPersonTMDBIds): Promise<Array<number>> => {
  if (personTmdbIds) {
    return personTmdbIds
  }

  if (movieTmdbId) {
    const { cast } = await getMovieCredits({ movieId: movieTmdbId })

    return cast.map(item => item.id)
  }

  return []
}

const createOrUpdatePerson = async ({
  personTMDBId,
  language,
}: CreateOrUpdatePerson): Promise<Person | null> => {
  const personDataByLanguages = await Bluebird.mapSeries(
    [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
    async lng => ({
      isReturn: lng === language,
      language: lng,
      personData: await getPerson({ personId: personTMDBId, language: lng }),
    })
  )

  const peopleData = await allSettled(
    personDataByLanguages.map(async data => {
      const { isReturn, language, personData } = data
      let personName = personData.name;
      if (!personData.imdb_id) {
        return { isReturn: false, language }
      }

      if (language !== MOVIE_LANGUAGE.EN) {
        personName = await translate({
          sourceLang: MOVIE_LANGUAGE.EN,
          targetLang: language,
          text: personName
        })
      }

      const inputData = {
        tmdb_id: personData.id,
        imdb_id: personData.imdb_id,
        language,
        name: personName,
        biography: personData.biography,
        gender: personData.gender,
        popularity: personData.popularity,
        place_of_birth: personData.place_of_birth,
        adult: personData.adult,
        profile_path:
          personData?.profile_path &&
          `https://image.tmdb.org/t/p/original${personData.profile_path}`,
        homepage: personData.homepage,
        also_known_as: personData.also_known_as,
      }

      const { id } = await createOrUpdatePersonData(inputData)
      return { id, isReturn, language }
    })
  )

  const personIdForReturn = peopleData
    .filter(({ isReturn }) => isReturn)
    .map(({ id }) => id)[0]

  if (!personIdForReturn) {
    return null
  }

  return (await repositories.person.findOneBy({
    id: personIdForReturn,
  })) as Person
}
export default async ({
  personTmdbIds,
  movieTmdbId,
  language,
  updateAll = false,
}: PersonUpdaterProps): Promise<Array<Person>> => {
  const peopleIdsForUpdate: number[] = []

  const personTMDBIds = await getPersonTMDBIds({
    personTmdbIds,
    movieTmdbId,
  })

  const people = await repositories.person.find({
    where: {
      tmdb_id: In(personTMDBIds),
    },
    take: 1000,
  })

  if (updateAll) {
    peopleIdsForUpdate.push(...personTMDBIds)
  } else {
    personTMDBIds.forEach(personTMDBId => {
      const person = people.find(p => p.tmdb_id === personTMDBId)

      if (!person) {
        peopleIdsForUpdate.push(personTMDBId)
      } else {
        const personMoment = moment(new Date(person.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(personMoment, 'days') > 1) {
          peopleIdsForUpdate.push(personTMDBId)
        }
      }
    })
  }

  const updatedPeople = await allSettled(
    peopleIdsForUpdate.map(personTMDBId =>
      createOrUpdatePerson({ personTMDBId, language })
    )
  )

  return [
    ...people,
    ...updatedPeople.filter((person): person is Person => person !== null),
  ]
}
