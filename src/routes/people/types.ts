import {Person} from "@models";

export type GetPerson = {
    query: void
    body: void
    params: { imdbId: string }
    response: Person
}
