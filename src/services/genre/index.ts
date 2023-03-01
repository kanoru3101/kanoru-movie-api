import Bluebird from "bluebird";
import {MOVIE_LANGUAGE} from "@constants";
import getGenres from "@services/themovie/getGenres";
import {repositories} from "@services/typeorm";
import {Genre} from "@models";

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

export const getAllGenres = async (): Promise<Genre[]> => {
    return repositories.genre.find({ take: 1000 })
}

export const getGenreById = async ({ id }: { id: number}): Promise<Genre | null> => repositories.genre.findOne({ where: { id: id }})
