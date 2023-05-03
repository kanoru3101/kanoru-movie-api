import { MOVIE_LANGUAGE } from '@constants'
import { repositories } from '@services/typeorm'
import ApiError from '@errors'
import { Person } from '@models'
import { getByImdb } from '@controllers/people/types'

export const getPersonByImdb = async ({
  imdbId,
  language = MOVIE_LANGUAGE.EN,
}: getByImdb): Promise<Person> => {
  const person = await repositories.person.findOne({
    where: { language, imdb_id: imdbId },
  })
  if (!person) {
    throw new ApiError('No found person by id', 404)
  }

  return person
}
