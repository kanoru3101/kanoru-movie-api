import {MovieDB} from "@services/themovie/types";
import {Genre} from "@models";
import {MOVIE_LANGUAGE} from "@constants";


export type CreateOrUpdateMovieProps = {
    movieId: number
    language: MOVIE_LANGUAGE
    useOriginMovie?: boolean
    tinyErrors?: boolean
    isReturnAll?: boolean
}

export type GetMovieGenresProps = {
    genres: MovieDB['genres'],
    allGenres: Genre[],
    language: MOVIE_LANGUAGE,
}

export type GetMovieGenresResponse = Array<Record<'id', number>>
