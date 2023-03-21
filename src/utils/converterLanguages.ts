import {LANGUAGES, MOVIE_LANGUAGE} from "@constants";

export const fromMovieLanguageToCountryCode = (movieLanguage: MOVIE_LANGUAGE): LANGUAGES => {
    if (movieLanguage === MOVIE_LANGUAGE.EN) {
        return LANGUAGES.EN
    } else {
        return LANGUAGES.UA
    }
}

export const fromCountryToMovieLanguage = (country: LANGUAGES): MOVIE_LANGUAGE => {
    if (country === LANGUAGES.EN) {
        return MOVIE_LANGUAGE.EN
    } else {
        return MOVIE_LANGUAGE.UA
    }
}
