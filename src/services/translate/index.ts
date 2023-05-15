import {MOVIE_LANGUAGE} from '@constants'
import translateApi from '@config/translate'

type Translate = {
  sourceLang: MOVIE_LANGUAGE
  targetLang: MOVIE_LANGUAGE
  text: string
}

const generateParams = ({
  sourceLang,
  targetLang,
  text,
}: Translate): string => {
  return `translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${text}`
}

export const translate = async ({
  sourceLang,
  targetLang,
  text,
}: Translate): Promise<string> => {
  if (!text) {
    return ''
  }

  if (sourceLang === targetLang) {
    return text
  }
  return await translateApi({
    url: generateParams({
      sourceLang,
      targetLang,
      text
    }),
  })
}
