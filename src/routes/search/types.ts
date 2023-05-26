import {Movie, Person} from "@models";

export type MultiSearch = {
  query: { search: string, type: 'all' | 'movie' | 'person' }
  body: void
  params: void
  response: {
    page: number
    total_pages: number
    total_results: number
    results: Array<{
      // adult: boolean
      // backdrop_path: string
      // id: number
      // title: string
      // original_language: string
      // original_title: string
      // overview: string
      // poster_path: string
      // genre_ids: Array<number>
      // popularity: number
      // release_date: string
      // video: boolean
      // vote_average: number
      // vote_count: number
      media_type: 'movie' | 'tv' | 'person'
      media: Person | Movie
    }>
  }
}
