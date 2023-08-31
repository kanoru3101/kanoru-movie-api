import {TV, TVSeason} from "@models";

export type GetTrending = {
  query: void
  body: void
  params: void
  response: TV[]
}

export type GetTv = {
  query: void
  body: void
  params: { imdbId: string }
  response: TV
}

export type GetTvSeasons = {
  query: void
  body: void
  params: { imdbId: string }
  response: TVSeason[]
}
