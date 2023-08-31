import {MovieDB} from "@services/themovie/types";
import {Genre} from "@models";
import {MOVIE_LANGUAGE} from "@constants";

export type GetGenresForRelationsProps = {
  genres: MovieDB['genres'],
  allGenres: Genre[],
  language: MOVIE_LANGUAGE,
}

export type GetGenresForRelationsResponse = Array<Record<'id', number>>
