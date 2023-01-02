import ApiError from '@errors'
import rickAndMortyApi from '@config/rickAndMortyApi'
import { Character } from './types'


type CharacterNumber = {
  characterNumber: number
}

const getCharacter = async ({ characterNumber }: CharacterNumber): Promise<Character> => {
  if (!characterNumber) {
    throw new ApiError('Missing characterNumber')
  }

  const data = await rickAndMortyApi({ url: `character/${characterNumber}`})

  return data
}

export default getCharacter
