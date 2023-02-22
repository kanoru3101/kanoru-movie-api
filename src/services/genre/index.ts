import Bluebird from "bluebird";
import {MOVIE_LANGUAGE} from "@constants";
import getGenres from "@services/themovie/getGenres";
import {repositories} from "@services/typeorm";

export const createOrUpdateGenres = async (): Promise<void> => {
    const [enGenres, uaGenres] = await Bluebird.mapSeries(
        [MOVIE_LANGUAGE.EN, MOVIE_LANGUAGE.UA],
        (language) => getGenres({ language }))

    const result = enGenres.map((item) => {
        const uaGenre = uaGenres.find((uaItem => uaItem.id === item.id));
        return {
            movie_db_id: item.id,
            name: item.name,
            name_ua: uaGenre?.name || ''
        }
    })

    await repositories.genre.upsert(result, ['movie_db_id'])
}
