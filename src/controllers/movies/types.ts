import { GetTopRateMovieResponse } from '@services/themovie/getTopRateMovies'
import { TrendingResponse } from '@services/themovie/getTrending'
import { MovieDB } from '@services/themovie/types'
import {LANGUAGES, MOVIE_LANGUAGE} from "@constants";
import {Movie} from "@models";

export type GetMovieById = {
  imdbId: string;
  language?: MOVIE_LANGUAGE
}

export type GetMovieByIdResponse = Movie

export type GetMovies = {
  trending: TrendingResponse
  topRate: GetTopRateMovieResponse,
}

export type Movies = Movie[]
