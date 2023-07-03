import {Movie, Person} from "@models";
import {SEARCH_FILTERS} from "@constants";

export type MultiSearch = {
  query: {
    query: string,
    type?: SEARCH_FILTERS
  }
  body: void
  params: void
  response: {
    page: number
    total_pages: number
    total_results: number
    data: {
      movies: Array<Movie>
      people: Array<Person>
    }
  }
}
