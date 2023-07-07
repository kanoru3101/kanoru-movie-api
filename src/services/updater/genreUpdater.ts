import Bluebird from "bluebird";
import {MOVIE_LANGUAGE} from "@constants";
import getGenres from "@services/themovie/getGenres";
import {repositories} from "@services/typeorm";

export default async (): Promise<void> => {
    const genresData = await Bluebird.mapSeries(
        [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
        async (language) => ({
            language,
            genres: await getGenres({ language })
        }))

    const result = genresData.map(({language, genres}) => {
        return genres.map(genre => ({
            tmdb_id: genre.id,
            language: language,
            name: genre.name,
        }))
    }).flat()

    await repositories.genre.upsert(result, ['tmdb_id', 'language'])
}
