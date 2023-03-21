import themovieDB from '@config/themovieDB'
import {GenreDB} from "./types";

export type GetGenres = {
    language?: string
}

const getGenres = async ({
    language,
}: GetGenres): Promise<Array<GenreDB>> => {
    const { genres } = await themovieDB({url: `genre/movie/list`, language})
    return genres
}

export default getGenres
