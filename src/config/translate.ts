/* eslint-disable no-console */
import ApiError from '@errors'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://translate.googleapis.com/',
  timeout: 5000,
})

const translateApi = async ({ url }: { url: string }) => {
  try {
    const { data } = await instance.get(url)
    return data[0][0][0]
  } catch (error) {
    console.log('###ERROR_TRANSLATE_API', error)
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message)
      throw new ApiError(error.message)
    } else {
      console.log('unexpected error: ', error)
      return 'An unexpected error occurred'
    }
  }
}

export default translateApi
