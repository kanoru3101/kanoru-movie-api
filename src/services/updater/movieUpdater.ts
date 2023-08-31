import {
  CreateOrUpdateMovieProps,
} from '@services/updater/types'
import { getMovie } from '@services/themovie'
import Bluebird from 'bluebird'
import { MOVIE_LANGUAGE, MOVIE_STATUSES } from '@constants'
import { repositories } from '@services/typeorm'
import { Genre, Movie } from '@models'
import {getAllGenres, getGenresForRelations} from '@services/genre'
import { saveOrUpdateVideos } from '@services/video'
import allSettled from '@utils/allSettled'
import { In } from 'typeorm'
import moment from 'moment'
import { chooseData, chooseDataForTranslate } from '@utils/chooseData'
import withTryCatch from '@utils/withTryCatch'
import { MovieDB } from '@services/themovie/types'
import {sortItemsByIds} from "@utils/sortResultsByIds";

export type CreateOrUpdateMovie = {
  tmdb_id: number
  imdb_id: string
  language: MOVIE_LANGUAGE
  title: string
  overview: string
  original_title: string
  original_language: string
  adult: boolean
  backdrop_path: string
  budget: number
  homepage: string
  popularity: number
  poster_path: string
  release_date: string
  revenue: number
  runtime: number
  status: MOVIE_STATUSES
  tagline: string
  video: boolean
  vote_average: number
  vote_count: number
}

export const createOrUpdateMovieData = async (
  movieData: CreateOrUpdateMovie
): Promise<Movie> => {
  const findMovie = await repositories.movie.findOne({
    where: { tmdb_id: movieData.tmdb_id, language: movieData.language },
  })

  return await repositories.movie.save({
    ...findMovie,
    ...movieData,
  })
}

// export const getMovieGenres = ({
//   allGenres,
//   genres,
//   language,
// }: GetMovieGenresProps): GetMovieGenresResponse => {
//   const movieGenres = genres
//     .map(
//       genreData =>
//         allGenres.find(
//           genre =>
//             genreData.id === genre.tmdb_id && genre.language === language
//         )?.id || null
//     )
//     .filter(Boolean) as number[]
//
//   return movieGenres.map(id => ({ id }))
// }

export const fetchMoviesData = async ({
  movieId,
  tinyErrors,
  language,
}: {
  movieId: number
  language: MOVIE_LANGUAGE
  tinyErrors?: boolean
}): Promise<{
  movieDataByLanguages: Array<{
    isReturn: boolean
    language: MOVIE_LANGUAGE
    movieTMDB: MovieDB | null
  }>
  allGenres: Array<Genre>
}> => {
  const [movieDataByLanguages, allGenres] = await Promise.all([
    await Bluebird.mapSeries(
      [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
      async lng => {
        const getMovieQuery = tinyErrors
          ? withTryCatch(getMovie, null)
          : getMovie

        return {
          isReturn: lng === language,
          language: lng,
          movieTMDB: await getMovieQuery({ movieId, language: lng }),
        }
      }
    ),
    getAllGenres(),
  ])

  return {
    movieDataByLanguages,
    allGenres,
  }
}

export const generateInputDataForMovie = async ({
  movieData,
  originalMovieData,
  allGenres,
  movieId,
  language,
  isUseOriginal,
}: {
  movieData: MovieDB
  originalMovieData: MovieDB | null
  movieId: number
  language: MOVIE_LANGUAGE
  isUseOriginal: boolean
  allGenres: Array<Genre>
}) => {
  const chooseDataWrapper = <T>(mainText: T, secondaryText?: T): T =>
    chooseData(isUseOriginal, mainText, secondaryText)

  const chooseDataForTranslateWrapper = async (
    mainText: string,
    secondaryText?: string | null,
  ): Promise<string> => {
    const options = {
      isUseOriginal,
      originalLanguage: originalMovieData?.original_language,
      language,
    }

    if (mainText && mainText != "") {
      return mainText
    }

    return await chooseDataForTranslate(options, mainText, secondaryText)
  }

  const videos = await saveOrUpdateVideos({
    data: [movieData],
  })

  return {
    tmdb_id: movieId,
    imdb_id: movieData.imdb_id,
    language,
    title: await chooseDataForTranslateWrapper(
      movieData.title,
      originalMovieData?.title
    ),
    overview: await chooseDataForTranslateWrapper(
      movieData.overview,
      originalMovieData?.overview
    ),
    original_title: movieData.original_title,
    original_language: movieData.original_language,
    adult: movieData.adult,
    backdrop_path:
      movieData?.backdrop_path &&
      `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
    budget: chooseDataWrapper(movieData.budget, originalMovieData?.budget),
    homepage: chooseDataWrapper(
      movieData.homepage,
      originalMovieData?.homepage
    ),
    popularity: chooseDataWrapper(
      movieData.popularity,
      originalMovieData?.popularity
    ),
    poster_path:
      movieData?.poster_path &&
      `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
    release_date: chooseDataWrapper(
      movieData.release_date,
      originalMovieData?.release_date
    ),
    revenue: chooseDataWrapper(movieData.revenue, originalMovieData?.revenue),
    runtime: chooseDataWrapper(movieData.runtime, originalMovieData?.runtime),
    status: chooseDataWrapper(
      movieData.status,
      originalMovieData?.status
    ) as MOVIE_STATUSES,
    tagline: await chooseDataForTranslateWrapper(
      movieData.tagline,
      originalMovieData?.tagline
    ),
    video: movieData.video,
    vote_average: chooseDataWrapper(
      movieData.vote_average,
      originalMovieData?.vote_average
    ),
    vote_count: chooseDataWrapper(
      movieData.vote_count,
      originalMovieData?.vote_count
    ),
    genres: getGenresForRelations({
      allGenres: allGenres,
      genres: movieData.genres,
      language,
    }),
    videos: videos.map(video => ({ id: video.id })),
  }
}

export const findMovieByOriginalLanguageTMDB = (movieDataByLanguages: Array<{language: MOVIE_LANGUAGE, movieTMDB: MovieDB | null}>, useOriginMovie: boolean): {
  data: MovieDB | null,
  isUseOriginal: boolean
} => {
  const findMovie = movieDataByLanguages.find(
    ({ language }) => language === MOVIE_LANGUAGE.EN
  )?.movieTMDB

  const originalMovieData =
    findMovie?.id && useOriginMovie ? findMovie : null

  return {
    data: originalMovieData,
    isUseOriginal: !!findMovie
  }
}

export const createOrUpdateMovie = async ({
  movieId,
  language,
  useOriginMovie = true,
  tinyErrors = false,
}: CreateOrUpdateMovieProps): Promise<Movie | null> => {
  const {movieDataByLanguages, allGenres} =
    await fetchMoviesData({
      language,
      tinyErrors,
      movieId
    })

  const {data: originalMovieData, isUseOriginal } = findMovieByOriginalLanguageTMDB(movieDataByLanguages, useOriginMovie)

  const moviesData = await allSettled(
    movieDataByLanguages.map(async data => {
      const { isReturn, language, movieTMDB } = data

      if (!movieTMDB || !movieTMDB.imdb_id || movieTMDB.imdb_id === '') {
        return { isReturn: false, language }
      }

      const inputData = await generateInputDataForMovie({
        movieData: movieTMDB,
        originalMovieData,
        allGenres,
        movieId,
        language,
        isUseOriginal
      })

      const { id } = await createOrUpdateMovieData(inputData)

      return { id, isReturn, language }
    })
  )

  const movieIdForReturn = moviesData
    .filter(({ isReturn }) => isReturn)
    .map(({ id }) => id)[0]

  if (!movieIdForReturn) {
    return null
  }
  return (await repositories.movie.findOneBy({ id: movieIdForReturn })) as Movie
}

export default async ({
  movieIds,
  language,
  updateAll = false,
}: {
  movieIds: number[]
  language: MOVIE_LANGUAGE
  updateAll?: boolean
}): Promise<Movie[]> => {
  const movieIdsForUpdate = []
  const movies = await repositories.movie.find({
    where: { tmdb_id: In(movieIds), language },
    take: 100,
  })

  if (updateAll || !movies.length) {
    movieIdsForUpdate.push(...movieIds)
  } else {
    movieIds.forEach(movieId => {
      const movie = movies.find(movie => movie.tmdb_id === movieId)
      if (!movie) {
        movieIdsForUpdate.push(movieId)
      } else {
        const movieMoment = moment(new Date(movie.updated_at))
        const nowMoment = moment(new Date())

        if (nowMoment.diff(movieMoment, 'days') > 5) {
          movieIdsForUpdate.push(movieId)
        }
      }
    })
  }

  const updatedMovie = await allSettled(
    movieIdsForUpdate.map(movieId => createOrUpdateMovie({ movieId, language }))
  )

  const results = [
    ...movies,
    ...updatedMovie.filter((movie): movie is Movie => movie !== null),
  ]

  return sortItemsByIds(
    movieIds,
    results,
    (movie) => movie.tmdb_id
  )
}
