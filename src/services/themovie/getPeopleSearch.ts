import themovieDB from '@config/themovieDB'
import { MultiSearch } from './types'

export type GetPeopleSearch = {
  query: string
  language?: string
  page?: number
}

const getPeopleSearch = async ({
  query,
  language,
  page = 1,
}: GetPeopleSearch): Promise<MultiSearch> => {
  return await themovieDB({
    url: `search/person`,
    language,
    params: {
      query,
      page,
    },
  })
}

export default getPeopleSearch
