import themovieDB from '@config/themovieDB'
import { TvDB } from './types'

export type GetTV = {
  tvId: number
  language?: string
}

export type GetTVResponse = TvDB

const getTV = async ({
  tvId,
  language
}: GetTV): Promise<GetTVResponse> => {
  return await themovieDB({ url: `tv/${tvId}`, language, appendToResponse: ['videos'] })
}

export default getTV
