import themovieDB from '@config/themovieDB'
import {
  TVSeasonEpisodeExternalIdsTMDB,
  TVSeasonExternalIdsTMDB,
} from '../types'

export type GetTVSeasonEpisodeExternalIds = {
  tvId: number
  seasonNumber: number
  episodeNumber: number
}

export type GetTVSeasonEpisodeExternalIdsResponse =
  TVSeasonEpisodeExternalIdsTMDB

const getTVSeasonEpisodeExternalIds = async ({
  tvId,
  seasonNumber,
  episodeNumber,
}: GetTVSeasonEpisodeExternalIds): Promise<GetTVSeasonEpisodeExternalIdsResponse> => {
  return await themovieDB({
    url: `tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/external_ids`,
  })
}

export default getTVSeasonEpisodeExternalIds
