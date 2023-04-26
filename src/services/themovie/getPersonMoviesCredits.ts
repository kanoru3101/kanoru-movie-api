import themovieDB from '@config/themovieDB'
import {PersonMovieCredits} from './types'

export type GetPersonMoviesCredits = {
    personId: number
    language?: string
}

export type GetPersonMoviesCreditsResponse = PersonMovieCredits

const getPersonMoviesCredits = async ({
    personId,
    language
}: GetPersonMoviesCredits): Promise<GetPersonMoviesCreditsResponse> => {
    return await themovieDB({ url: `/person/${personId}/movie_credits`, language })
}

export default getPersonMoviesCredits
