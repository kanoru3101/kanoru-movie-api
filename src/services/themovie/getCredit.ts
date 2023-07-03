import themovieDB from '@config/themovieDB'
import {Credit} from './types'

export type GetCredits= {
    creditId: string
    language?: string
}

export type GetCreditResponse = Credit

const getCredit = async ({
  creditId,
  language
}: GetCredits): Promise<GetCreditResponse> => {
    return await themovieDB({ url: `credit/${creditId}`, language })
}

export default getCredit
