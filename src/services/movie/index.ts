import {CreateOrUpdateMovieProps} from "@services/movie/types";
import {getMovie} from "@services/themovie";
import Bluebird from 'bluebird';
import {MOVIE_LANGUAGE, MOVIE_STATUSES} from "@constants";
import {repositories} from "@services/typeorm";
import {Genre} from "@models";
import {getAllGenres, getGenreById} from "@services/genre";


// export const getMovieTrailer = ({ language, videos}: { language: MOVIE_LANGUAGE, videos: Movie["videos"]}): string | null => {
//     const trailers = videos?.results?.map((video) => video.type === MOVIE_VIDEO_TYPE.TRAILER);
//
//     if (!trailers || trailers.length === 0) {
//         return null
//     }
//     // const latestTrailer = _.sortBy(trailers, (trailer) => new Date(trailer?.published_at))
//     const latestTrailer = _.sortBy(trailers, ['published_at'])[0];
// }

export type CreateOrUpdateMovieV2 = {
    movie_db_id: number,
    imdb_id: string,
    title: string,
    title_ua: string,
    overview: string,
    overview_ua: string,
    original_title: string,
    original_language: string,
    adult: boolean,
    backdrop_path: string,
    backdrop_path_ua: string,
    budget: number,
    homepage: string,
    popularity: number,
    poster_path: string,
    poster_path_ua: string,
    release_date: string,
    revenue: number,
    runtime: number,
    status: MOVIE_STATUSES,
    tagline: string,
    tagline_ua: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
}

export const createOrUpdateMovieV2 = async (movieData: CreateOrUpdateMovieV2): Promise<any> => {
    const findMovie = await repositories.movie.findOne({ where: { movie_db_id: movieData.movie_db_id } });
    console.log("###findMovie", findMovie)
    console.log("###DATA", {
        ...findMovie,
        ...movieData
    });
    return await repositories.movie.save({
        ...findMovie,
        ...movieData
    })
}

export const createOrUpdateMovie = async ({movieId}: CreateOrUpdateMovieProps): Promise<void> => {
    const [enMovie, uaMovie] = await Bluebird.mapSeries(
        [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
       (language) => getMovie({ movieId, language }))

    // Genres
    const allGenres = await getAllGenres()
    // console.log("#####allGenres")
    const enGenres = enMovie.genres?.map((genre) => genre.id);
    const uaGenres = uaMovie.genres?.map((genre) => genre.id);

    const inputData = {
        movie_db_id: movieId,
        imdb_id: enMovie.imdb_id,
        title: enMovie.title,
        title_ua: uaMovie.title,
        overview: enMovie.overview,
        overview_ua: uaMovie.overview,
        original_title: enMovie.original_title,
        original_language: enMovie.original_language,
        adult: enMovie.adult,
        backdrop_path: enMovie?.backdrop_path && `https://image.tmdb.org/t/p/original${enMovie.backdrop_path}`,
        backdrop_path_ua: uaMovie?.backdrop_path && `https://image.tmdb.org/t/p/original${uaMovie.backdrop_path}`,
        budget: enMovie.budget,
        homepage: enMovie.homepage,
        popularity: enMovie.popularity,
        poster_path: enMovie?.poster_path && `https://image.tmdb.org/t/p/original${enMovie.poster_path}`,
        poster_path_ua: uaMovie?.poster_path && `https://image.tmdb.org/t/p/original${uaMovie.poster_path}`,
        release_date: enMovie.release_date,
        revenue: enMovie.revenue,
        runtime: enMovie.runtime,
        status: enMovie.status as MOVIE_STATUSES,
        tagline: enMovie.tagline,
        tagline_ua: uaMovie.tagline,
        video: enMovie.video,
        vote_average: enMovie.vote_average,
        vote_count: enMovie.vote_count,
        //genres: genreIds.map((id) => ({genre_id: id}))
        genres: [{id: 2}, {id:10}],
    }

    const movie = await createOrUpdateMovieV2(inputData);


    // eslint-disable-next-line no-console
    console.log("####MOVIE", movie)

    // const movie2 = await movie.save({
    //     ...movie,
    //     genres: genreIds.map((id) => ({ genreId: id }))
    // })

    const enVideos = enMovie.videos?.results?.map((video) => video) || [];
    const uaVideos = uaMovie.videos?.results?.map((video) => video) || [];



    const videos = [...enVideos, ...uaVideos].map((video) => ({
        movie_id: movieId,
        movie_db_id: video.id,
        language: video.iso_639_1,
        name: video.name,
        site: video.site,
        key: video.key,
        size: video.size,
        official: video.official,
    }));

    // eslint-disable-next-line no-console
    //console.log("###videos", videos)

    //await repositories.video.upsert(videos, ['movie_db_id'])

    return movie
}
