import {MovieDB} from "@services/themovie/types";
import {Genre} from "@models";


export type CreateOrUpdateMovieProps = {
    movieId: number
}

export type GetMovieGenresProps = {
    movieByLanguages: MovieDB[]
    genres: Genre[]
}

export type GetMovieGenresResponse = Array<Record<'id', number>>
