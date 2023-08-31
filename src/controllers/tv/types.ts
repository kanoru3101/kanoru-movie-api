import {MOVIE_LANGUAGE} from "@constants";

export type GetTvById = {
  imdbId: string;
  language?: MOVIE_LANGUAGE
}
