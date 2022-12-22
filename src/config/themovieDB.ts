/* eslint-disable no-console */
import axios from 'axios'
import dotenv from 'dotenv'
import ApiError from '../errors'

dotenv.config()

type ThemoviedbProps = {
  url: string
  language?: string
}

const THEMOVIE_API_KEY = process.env.THEMOVIE_API_KEY

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  timeout: 1000,
})

const themovieDB = async ({
  url,
  language = 'en',
}: ThemoviedbProps): Promise<any> => {
  try {
    const { data } = await instance.get(
      `${url}?language=${language}&api_key=${THEMOVIE_API_KEY}`
    )

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message)
      throw new ApiError(error.message)
    } else {
      console.log('unexpected error: ', error)
      return 'An unexpected error occurred'
    }
  }
}

export default themovieDB
