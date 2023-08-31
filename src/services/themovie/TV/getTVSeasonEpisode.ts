import themovieDB from '@config/themovieDB'
import { TvEpisodeDB } from '../types'

export type GetTVSeasonEpisode = {
  tvId: number
  language?: string
  seasonNumber: number
  episodeNumber: number
}

export type GetTVSeasonEpisodeResponse = TvEpisodeDB

const getTVSeasonEpisode = async ({
  tvId,
  seasonNumber,
  episodeNumber,
  language,
}: GetTVSeasonEpisode): Promise<GetTVSeasonEpisodeResponse> => {
  return await themovieDB({
    url: `tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
    language,
    appendToResponse: ['videos'],
  })
}

export default getTVSeasonEpisode
