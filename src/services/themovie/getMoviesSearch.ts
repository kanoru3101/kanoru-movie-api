import themovieDB from '@config/themovieDB'
import { MultiSearch } from './types'

export type GetMoviesSearch = {
  query: string
  language?: string
  page?: number
}

const getMoviesSearch = async ({
  query,
  language,
  page = 1,
}: GetMoviesSearch): Promise<MultiSearch> => {
  return await themovieDB({
    url: `search/movie`,
    language,
    params: {
      query,
      page,
    },
  })
}

export default getMoviesSearch
