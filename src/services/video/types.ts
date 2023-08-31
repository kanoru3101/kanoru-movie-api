import {MovieDB, TvDB, TvEpisodeDB, TvSeasonDB} from "@services/themovie/types";

export type SaveOrUpdateVideos = {
    data: TvDB[] | TvSeasonDB[] | TvEpisodeDB[] | MovieDB[]
}
