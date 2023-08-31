import themovieDB from '@config/themovieDB'
import { TvSeasonDB } from '../types'

export type GetTVSeason = {
  tvId: number
  language?: string
  seasonNumber: number
  appendToResponse?: boolean
}

export type GetTVSeasonResponse = TvSeasonDB

const getTVSeason = async ({
  tvId,
  seasonNumber,
  language,
  appendToResponse = true,
}: GetTVSeason): Promise<GetTVSeasonResponse> => {
  return await themovieDB({
    url: `tv/${tvId}/season/${seasonNumber}`,
    language,
    appendToResponse: appendToResponse ? ['videos'] : [],
  })
}

export default getTVSeason
