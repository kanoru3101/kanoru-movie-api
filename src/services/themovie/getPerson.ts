import themovieDB from '@config/themovieDB'
import {PersonDB} from './types'

export type GetPerson = {
    personId: number
    language?: string
}

export type GetPersonResponse = PersonDB

const getPerson = async ({
  personId,
  language,
}: GetPerson): Promise<GetPersonResponse> => {
  return await themovieDB({ url: `person/${personId}`, language })
}

export default getPerson
