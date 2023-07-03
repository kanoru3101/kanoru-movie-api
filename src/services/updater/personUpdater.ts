import { getMovieCredits, getPerson } from '@services/themovie'
import { repositories } from '@services/typeorm'
import allSettled from '@utils/allSettled'
import { Person } from '@models'
import { MOVIE_LANGUAGE } from '@constants'
import { In } from 'typeorm'
import moment from 'moment'
import Bluebird from 'bluebird'
import { PersonDB } from '@services/themovie/types'
import { chooseData, chooseDataForTranslate } from '@utils/chooseData'
import {sortItemsByIds} from "@utils/sortResultsByIds";

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
  useOriginPerson?: boolean
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

export const createOrUpdatePersonData = async (
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

export const generateInputDataForPerson = async ({
  personTMDB,
  originPerson,
  language,
  isUseOriginal,
}: {
  personTMDB: PersonDB
  originPerson: PersonDB | null
  language: MOVIE_LANGUAGE
  isUseOriginal: boolean
}): Promise<Person> => {
  const chooseDataWrapper = <T>(mainText: T, secondaryText?: T): T =>
    chooseData(isUseOriginal, mainText, secondaryText)

  const chooseDataForTranslateWrapper = async (
    mainText: string,
    secondaryText?: string | null
  ) => {
    const options = {
      isUseOriginal,
      originalLanguage: MOVIE_LANGUAGE.EN,
      language,
    }
    return await chooseDataForTranslate(options, mainText, secondaryText)
  }

  return {
    tmdb_id: personTMDB.id,
    imdb_id: personTMDB.imdb_id,
    language: language,
    name: await chooseDataForTranslateWrapper(personTMDB.name),
    biography: await chooseDataForTranslateWrapper(
        personTMDB.biography,
        originPerson?.biography
      ),
    birthday: personTMDB?.birthday,
    deathday: personTMDB?.deathday,
    known_for_department: personTMDB.known_for_department,
    gender: personTMDB.gender,
    popularity: personTMDB.popularity,
    place_of_birth: await chooseDataForTranslateWrapper(
      personTMDB.place_of_birth || '',
      originPerson?.place_of_birth
    ),
    adult: personTMDB.adult,
    profile_path:
      personTMDB?.profile_path &&
      `https://image.tmdb.org/t/p/original${personTMDB.profile_path}`,
    homepage: chooseDataWrapper(personTMDB.homepage, originPerson?.homepage),
    also_known_as: chooseDataWrapper(
      personTMDB.also_known_as,
      originPerson?.also_known_as
    ),
  } as unknown as Person
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

export const findPersonByOriginalLanguageTMDB = (
  personDataByLanguages: Array<{
    language: MOVIE_LANGUAGE
    personTMDB: PersonDB | null
  }>,
  useOriginPerson: boolean
): {
  data: PersonDB | null
  isUseOriginal: boolean
} => {
  const findPerson = personDataByLanguages.find(
    ({ language }) => language === MOVIE_LANGUAGE.EN
  )?.personTMDB

  const originalPersonData =
    findPerson?.id && useOriginPerson ? findPerson : null

  return {
    data: originalPersonData,
    isUseOriginal: !!findPerson,
  }
}

const createOrUpdatePerson = async ({
  personTMDBId,
  language,
  useOriginPerson = true,
}: CreateOrUpdatePerson): Promise<Person | null> => {
  const personDataByLanguages = await Bluebird.mapSeries(
    [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
    async lng => ({
      isReturn: lng === language,
      language: lng,
      personTMDB: await getPerson({ personId: personTMDBId, language: lng }),
    })
  )

  const { data: originPersonData, isUseOriginal } =
    findPersonByOriginalLanguageTMDB(personDataByLanguages, useOriginPerson)

  const peopleData = await allSettled(
    personDataByLanguages.map(async data => {
      const { isReturn, language, personTMDB } = data

      if (!personTMDB.imdb_id) {
        return { isReturn: false, language }
      }

      const inputPersonData = await generateInputDataForPerson({
        personTMDB: personTMDB,
        originPerson: originPersonData,
        language,
        isUseOriginal,
      })

      const { id } = await createOrUpdatePersonData(inputPersonData)

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

  const results = [
    ...people,
    ...updatedPeople.filter((person): person is Person => person !== null),
  ]

  return sortItemsByIds(
    personTMDBIds,
    results,
    (person) => person.tmdb_id
  )
}
