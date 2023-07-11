import themovieDB from '@config/themovieDB'
import {
  TVSeasonEpisodeExternalIdsTMDB,
  TVSeasonExternalIdsTMDB,
} from './types'

export type GetTVSeasonEpisodeExternalIds = {
  tvId: number
  season_number: number
  episode_number: number
}

export type GetTVSeasonEpisodeExternalIdsResponse =
  TVSeasonEpisodeExternalIdsTMDB

const getTVSeasonEpisodeExternalIds = async ({
  tvId,
  season_number,
  episode_number,
}: GetTVSeasonEpisodeExternalIds): Promise<GetTVSeasonEpisodeExternalIdsResponse> => {
  return await themovieDB({
    url: `tv/${tvId}/season/${season_number}/episode/${episode_number}/external_ids`,
  })
}

export default getTVSeasonEpisodeExternalIds
