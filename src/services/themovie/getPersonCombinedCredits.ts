import themovieDB from '@config/themovieDB'
import { CombinedCredits } from './types'

export type GetPersonCombinedCredits = {
  personId: number
  language?: string
}

export type GetPersonCombinedCreditsResponse = CombinedCredits

const getPersonCombinedCredits = async ({
  personId,
  language,
}: GetPersonCombinedCredits): Promise<GetPersonCombinedCreditsResponse> => {
  return await themovieDB({
    url: `person/${personId}/combined_credits`,
    language,
  })
}

export default getPersonCombinedCredits
