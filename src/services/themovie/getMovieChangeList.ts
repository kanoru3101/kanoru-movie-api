import themovieDB from '@config/themovieDB'

export type GetMovie = {
  page?: number
  start_date?: string
  end_date?: string
}

type Response = {
  results: Array<{
    id: number
    adult: boolean | null
  }>
  page: number
  total_pages: number
  total_results: number
}

const getMovieChangeList = async ({
  page = 1,
  start_date = '',
  end_date = '',
}: GetMovie): Promise<Response> => {
  return await themovieDB({
    url: `movie/changes`,
    params: {
      page,
      start_date,
      end_date,
    },
  })
}

export default getMovieChangeList
