import themovieDB from '@config/themovieDB'
import { TVExternalIdsTMDB } from './types'

export type GetTVExternalIds = {
  tvId: number
}

export type GetTVExternalIdsResponse = TVExternalIdsTMDB

const getTVExternalIds = async ({
  tvId,
}: GetTVExternalIds): Promise<GetTVExternalIdsResponse> => {
  return await themovieDB({ url: `tv/${tvId}/external_ids` })
}

export default getTVExternalIds
