import type {RequestHandler} from 'express'
import {LANGUAGES, MOVIE_LANGUAGE} from "@constants";
import {fromCountryToMovieLanguage} from "@utils/converterLanguages";

export type ReqLanguage = LANGUAGES
export type ReqMovieLanguage = MOVIE_LANGUAGE


const languageMiddleware: RequestHandler = async (req, _res, next) => {
    const userLanguage = req.user?.language
    const cookieLanguage = req.cookies?.language

    const language: LANGUAGES = userLanguage || cookieLanguage || LANGUAGES.EN

    req.language = language;
    req.movieLanguage = fromCountryToMovieLanguage(language)

    next()
}

export default languageMiddleware
