import {CreateOrUpdateMovieProps, GetMovieGenresProps, GetMovieGenresResponse} from "@services/movie/types";
import {getMovie} from "@services/themovie";
import Bluebird from 'bluebird';
import {MOVIE_LANGUAGE, MOVIE_STATUSES} from "@constants";
import { repositories } from "@services/typeorm";
import { Movie} from "@models";
import {getAllGenres } from "@services/genre";
import {saveOrUpdateVideos} from "@services/video";
import allSettled from "@utils/allSettled";
import {In} from "typeorm";
import moment from "moment";

export type CreateOrUpdateMovie = {
    movie_db_id: number,
    imdb_id: string,
    language: MOVIE_LANGUAGE,
    title: string,
    overview: string,
    original_title: string,
    original_language: string,
    adult: boolean,
    backdrop_path: string,
    budget: number,
    homepage: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    revenue: number,
    runtime: number,
    status: MOVIE_STATUSES,
    tagline: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
}

export const createOrUpdateMovieData = async (movieData: CreateOrUpdateMovie): Promise<Movie> => {
    const findMovie = await repositories.movie.findOne({ where: { movie_db_id: movieData.movie_db_id, language: movieData.language } });

    return await repositories.movie.save({
        ...findMovie,
        ...movieData
    })
}

export const getMovieGenres = ({ allGenres, genres, language }: GetMovieGenresProps): GetMovieGenresResponse => {
    const movieGenres = genres
        .map((genreData) =>
            allGenres.find(genre => genreData.id === genre.movie_db_id && genre.language === language)?.id || null
        ).filter(Boolean) as number[]

    return movieGenres.map((id) => ({id}))
}

export const createOrUpdateMovie = async ({movieId, language }: CreateOrUpdateMovieProps): Promise<Movie | null> => {
    const [movieDataByLanguages, allGenres] = await Promise.all([
        await Bluebird.mapSeries(
            [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
            async (lng) => ({
                isReturn: lng === language,
                language: lng,
                movieData: await getMovie({ movieId, language: lng })
            })),
        getAllGenres(),
    ])

    console.log("####2.1")

    const moviesData = await allSettled(movieDataByLanguages.map(async data => {
        const { isReturn, language, movieData } = data;

        if (!movieData.imdb_id || movieData.imdb_id === '') {
            return { isReturn: false, language }
        }

        const videos = await saveOrUpdateVideos({
            movies: [movieData]
        })

        const inputData = {
            movie_db_id: movieId,
            imdb_id: movieData.imdb_id,
            language,
            title: movieData.title,
            overview: movieData.overview,
            original_title: movieData.original_title,
            original_language: movieData.original_language,
            adult: movieData.adult,
            backdrop_path: movieData?.backdrop_path && `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
            budget: movieData.budget,
            homepage: movieData.homepage,
            popularity: movieData.popularity,
            poster_path: movieData?.poster_path && `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
            release_date: movieData.release_date,
            revenue: movieData.revenue,
            runtime: movieData.runtime,
            status: movieData.status as MOVIE_STATUSES,
            tagline: movieData.tagline,
            tagline_ua: movieData.tagline,
            video: movieData.video,
            vote_average: movieData.vote_average,
            vote_count: movieData.vote_count,
            genres: getMovieGenres({
                allGenres: allGenres,
                genres: movieData.genres,
                language,
            }),
            videos: videos.map((video) => ({ id: video.id }))
        }

        const { id } = await createOrUpdateMovieData(inputData);

        return { id, isReturn, language }
    }));

    const movieIdForReturn = moviesData.filter(({ isReturn }) => isReturn).map(({ id }) => id)[0]

    if (!movieIdForReturn) {
        return null;
    }
    return await repositories.movie.findOneBy({ id: movieIdForReturn }) as Movie;
}

export default async ({movieIds, language, updateAll = false }: { movieIds: number[], language: MOVIE_LANGUAGE, updateAll?: boolean} ): Promise<Movie[]> => {
    const movieIdsForUpdate = [];
    const movies = await repositories.movie.find({ where: {movie_db_id: In(movieIds), language}, take: 100});

    console.log("####1")

    if (updateAll || !movies.length) {
        movieIdsForUpdate.push(...movieIds)
    } else {
        movieIds.forEach((movieId) => {
            const movie = movies.find((movie) => movie.movie_db_id === movieId)
            if (!movie) {
                movieIdsForUpdate.push(movieId)
            } else {
                const movieMoment = moment(new Date(movie.updated_at))
                const nowMoment = moment(new Date())

                if (nowMoment.diff(movieMoment, 'days') > 1) {
                    movieIdsForUpdate.push(movieId)
                }
            }
        });
    }

    console.log("####2")
    const updatedMovie = await allSettled(movieIdsForUpdate.map(movieId => createOrUpdateMovie({movieId, language})))

    return [
        ...movies,
        ...updatedMovie.filter((movie): movie is Movie => movie !== null),
    ]
}
