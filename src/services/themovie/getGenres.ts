import themovieDB from '@config/themovieDB'
import {Genre} from "./types";

export type GetGenres = {
    language?: string
}

const getGenres = async ({
    language,
}: GetGenres): Promise<Array<Genre>> => {
    const { genres } = await themovieDB({url: `genre/movie/list`, language})
    return genres
}

export default getGenres
