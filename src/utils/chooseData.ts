import {translate} from "@services/translate";
import {MOVIE_LANGUAGE} from "@constants";

export const chooseData = <T>(isUseOriginal: boolean, item1: T, item2: T | undefined)=> {
  if (isUseOriginal && !!item2) {
    return item2
  }
  return item1
}

type ChooseDataForTranslateOption = {
  isUseOriginal: boolean,
  originalLanguage?: MOVIE_LANGUAGE,
  language: MOVIE_LANGUAGE
}
export const chooseDataForTranslate = async <T>(options: ChooseDataForTranslateOption, text1: T, text2: string | null | undefined): Promise<T | string> => {
  if (options.originalLanguage && options.isUseOriginal && text2) {
    return await translate({
      sourceLang: options.originalLanguage,
      targetLang: options.language,
      text: text2,
    });
  }
  return text1 || ''
}
