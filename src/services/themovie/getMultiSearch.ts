import themovieDB from '@config/themovieDB'
import { MultiSearch } from './types'

export type GetMultiSearch = {
  query: string
  language?: string
  page?: number
}

const getMultiSearch = async ({
  query,
  language,
  page = 1,
}: GetMultiSearch): Promise<MultiSearch> => {
  return await themovieDB({
    url: `search/multi`,
    language,
    params: {
      query,
      page,
    },
  })
}

export default getMultiSearch
