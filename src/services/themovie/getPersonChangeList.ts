import themovieDB from '@config/themovieDB'

export type GetPersons = {
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

const getPersonChangeList = async ({
  page = 1,
  start_date = '',
  end_date = '',
                                  }: GetPersons): Promise<Response> => {
  return await themovieDB({
    url: `person/changes`,
    params: {
      page,
      start_date,
      end_date,
    },
  })
}

export default getPersonChangeList
