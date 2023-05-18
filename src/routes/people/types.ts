import {Cast, Person} from "@models";

export type GetPerson = {
    query: void
    body: void
    params: { imdbId: string }
    response: Person
}

export type GetPersonMovies = {
    query: void
    body: void
    params: { imdbId: string }
    response: Array<Cast>
}
