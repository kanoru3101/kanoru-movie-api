import themovieDB from '@config/themovieDB'
import { TvDB } from '../types'

export type GetTV = {
  tvId: number
  language?: string
  appendToResponse?: boolean
}

export type GetTVResponse = TvDB

const getTV = async ({
  tvId,
  language,
  appendToResponse = true,
}: GetTV): Promise<GetTVResponse> => {
  return await themovieDB({ url: `tv/${tvId}`, language, appendToResponse: appendToResponse ? ['videos'] : [] })
}

export default getTV
