/* eslint-disable no-console */
import {
  getMovie, getMovieChangeList,
  getMovieCredits, getPerson,
  getPersonChangeList, getPersonMoviesCredits,
} from '@services/themovie'
import { Genre } from '@models'
import {MovieCredits, MovieDB, PersonDB, PersonMovieCredits} from '@services/themovie/types'
import { MOVIE_LANGUAGE } from '@constants'
import withTryCatch from '@utils/withTryCatch'
import { getAllGenres } from '@services/genre'
import Bluebird from 'bluebird'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import moment from 'moment/moment'

export const languages = [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA]

export const getArg = yargs(hideBin(process.argv))
  .usage('Usage: $0 --startDate [startDate] --endDate [endDate]')
  .demandOption(['startDate', 'endDate'])
  .alias('s', 'startDate')
  .alias('e', 'endDate')
  .default('startDate', moment().subtract(1, 'day').toString())
  .default('endDate', moment().toString()).argv as {
  startDate: string
  endDate: string
}

export const getDate = (date: string): string => date.replace(/"/g, '')

export const isNeedToUpdate = ({
  id,
  updated_at,
  diffTimeAtDays = 1,
}: {
  id?: number
  updated_at?: Date
  diffTimeAtDays?: number
}) => {
  if (id && updated_at) {
    const personMoment = moment(new Date(updated_at))
    const nowMoment = moment(new Date())

    return nowMoment.diff(personMoment, 'days') > diffTimeAtDays
  }

  return true
}

export const getMovieIdsForUpdates = async (
  type: 'movie' | 'person',
  startDate: string,
  endDate: string
): Promise<Array<number>> => {
  const allChanges = []
  console.log('GET PAGES')

  let data;
  if (type === "movie") {
    data  = await getMovieChangeList({
      start_date: startDate,
      end_date: endDate,
    })
  } else {
    data = await getPersonChangeList({
      start_date: startDate,
      end_date: endDate,
    })
  }

  const totalPages = data.total_pages

  allChanges.push(...data.results.map(({ id }) => id))

  if (data.total_results > 0 && totalPages > 1) {
    for (let i = 2; i < totalPages; i++) {
      console.log(`#GETTING PAGES: (${i}|${totalPages})`)
      let results;
      if (type === "movie") {
        results = await getMovieChangeList({
          start_date: startDate,
          end_date: endDate,
        })
      } else {
        results = await getPersonChangeList({
          start_date: startDate,
          end_date: endDate,
        })
      }

      await new Promise(resolve => setTimeout(resolve, 100))

      allChanges.push(...results.results.map(({ id }) => id))
    }
  }

  const allChangesLength = [...new Set(allChanges)].length
  console.log(`FOUND: ${allChangesLength} changes at ${type.toUpperCase()}`)
  return [...new Set(allChanges)]
}

type MovieDataResult = {
  allGenres: Array<Genre>;
  movieCastTMDB: MovieCredits | null;
  moviesTMDBData: Array<{ movieTMDB: MovieDB | null; language: MOVIE_LANGUAGE }>;
};

type PersonDataResult = {
  peopleTMDBData: Array<{ personTMDB: PersonDB | null, language: MOVIE_LANGUAGE}>;
  personCast: PersonMovieCredits | null;
};


export type GetMovieData = MovieDataResult & {
  personTMDB?: never;
};

export type GetPersonData = PersonDataResult & {
  movieTMDB?: never;
};

export const getData = async ({
                                movieTmdbId,
                                personTmdbId,
                                getAllGenresData = true,
                                getMovieData = true,
                                getMovieCastData = true,
                                getPersonMoviesData = true,
                              }: {
  movieTmdbId?: number;
  personTmdbId?: number;
  getAllGenresData?: boolean;
  getMovieData?: boolean;
  getMovieCastData?: boolean;
  getPersonMoviesData?: boolean;
}): Promise<GetMovieData | GetPersonData | void> => {
  const wrappedGetAllGenres = withTryCatch(getAllGenres, []);
  const wrappedGetMovieCredits = withTryCatch(getMovieCredits, null);
  const wrappedGetMovie = withTryCatch(getMovie, null);
  const wrappedGetPerson = withTryCatch(getPerson, null);
  const wrapperPersonCredits = withTryCatch(getPersonMoviesCredits, null);

  if (movieTmdbId !== undefined) {
    const [allGenres, movieCastTMDB, moviesTMDBData] = await Promise.all([
      getAllGenresData ? await wrappedGetAllGenres() : [],
      getMovieCastData ? await wrappedGetMovieCredits({ movieId: movieTmdbId }) : null,
      await Bluebird.mapSeries(languages, async (lng) => ({
        movieTMDB: getMovieData ? await wrappedGetMovie({ movieId: movieTmdbId, language: lng }) : null,
        language: lng,
      })),
    ]);

    return {
      allGenres,
      movieCastTMDB,
      moviesTMDBData,
      personTMDB: undefined,
    };
  }

  if (personTmdbId !== undefined) {
    const [peopleTMDBData, personCast] = await Promise.all([
      await Bluebird.mapSeries(languages, async (lng) => ({
        personTMDB: getMovieData ? await wrappedGetPerson({ personId: personTmdbId, language: lng }) : null,
        language: lng,
      })),
      getPersonMoviesData ? await wrapperPersonCredits({ personId: personTmdbId }) : null,
    ]);

    return {
      peopleTMDBData,
      personCast,
      movieTMDB: undefined,
    };
  }

  return undefined;
};
