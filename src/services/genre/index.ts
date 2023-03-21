import {repositories} from "@services/typeorm";
import {Genre} from "@models";

export const getAllGenres = async (): Promise<Genre[]> => {
    return repositories.genre.find({ take: 1000 })
}

export const getGenreById = async ({ id }: { id: number}): Promise<Genre | null> => repositories.genre.findOne({ where: { id: id }})
