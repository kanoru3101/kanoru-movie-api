import {Movie, Person} from "@models";

export type GetSearch = {
  page: number
  total_pages: number
  total_results: number
  data: {
    movies: Array<Movie>
    people: Array<Person>
  }
}
