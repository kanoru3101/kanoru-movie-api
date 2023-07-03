import {LANGUAGES, MOVIE_LANGUAGE} from "@constants";

const languageToCountryCodeMapping = {
    [MOVIE_LANGUAGE.EN]: LANGUAGES.EN,
    [MOVIE_LANGUAGE.UA]: LANGUAGES.UA,
};

const countryToLanguageMapping = {
    [LANGUAGES.EN]: MOVIE_LANGUAGE.EN,
    [LANGUAGES.UA]: MOVIE_LANGUAGE.UA,
};

export const fromMovieLanguageToCountryCode = (movieLanguage: MOVIE_LANGUAGE): LANGUAGES =>
  languageToCountryCodeMapping[movieLanguage];

export const fromCountryToMovieLanguage = (country: LANGUAGES): MOVIE_LANGUAGE =>
  countryToLanguageMapping[country];
