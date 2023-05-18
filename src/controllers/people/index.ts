import { MOVIE_LANGUAGE } from '@constants'
import { repositories } from '@services/typeorm'
import ApiError from '@errors'
import {Cast, Person} from '@models'
import { GetByImdb } from '@controllers/people/types'
import {personCastUpdater} from "@services/updater";

export const getPersonByImdb = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetByImdb): Promise<Person> => {
  const person = await repositories.person.findOne({
    where: { language, imdb_id: imdbId },
    loadEagerRelations: false
  })
  if (!person) {
    throw new ApiError('No found person by id', 404)
  }

  return person;
}

export const getPersonMovies = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: GetByImdb): Promise<Array<Cast>> => {
  const person = await repositories.person.findOne({
    where: { imdb_id: imdbId, language},
    loadEagerRelations: false
  })

  if (!person) {
    throw new ApiError('No found person by id', 404)
  }

  return personCastUpdater({
    language,
    personTmdbId: person.tmdb_id,
    addNewMovies: true
  })
}
