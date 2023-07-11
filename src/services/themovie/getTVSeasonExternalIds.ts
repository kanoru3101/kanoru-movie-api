import themovieDB from '@config/themovieDB'
import {TVSeasonExternalIdsTMDB} from './types'

export type GetTVSeasonExternalIds = {
  tvId: number
  season_number: number
}

export type GetTVSeasonExternalIdsResponse = TVSeasonExternalIdsTMDB

const getTVSeasonExternalIds = async ({
  tvId,
  season_number
}: GetTVSeasonExternalIds): Promise<GetTVSeasonExternalIdsResponse> => {
  return await themovieDB({ url: `tv/${tvId}/season/${season_number}/external_ids` })
}

export default getTVSeasonExternalIds
