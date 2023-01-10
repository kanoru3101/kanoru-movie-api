/* eslint-disable no-console */
import axios from 'axios'
import dotenv from 'dotenv'
import ApiError from '@errors'
import queryString from 'querystring';
import _ from 'lodash';

dotenv.config()

type ThemoviedbProps = {
  url: string
  language?: string
  params?: { [key: string]: number | string | undefined }
}

type BuildQueryParams = { [key: string]: number | string | undefined }

const THEMOVIE_API_KEY = process.env.THEMOVIE_API_KEY

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  timeout: 1000,
})

const buildQueryParams = (params: BuildQueryParams): string => {
  const cleanedObject = _.pickBy(params, v => v !== undefined)
  console.log("####cleanedObject", cleanedObject);
  
  if (Object.keys(cleanedObject).length == 0) {
    return ''
  }

  return `&${queryString.stringify(cleanedObject)}`
}

const themovieDB = async({
  url,
  language = 'en',
  params,
}: ThemoviedbProps): Promise<any> => {
  try {
    const additionalParams = params ? buildQueryParams(params) : ''
    console.log("####", `${url}?language=${language}&api_key=${THEMOVIE_API_KEY}${additionalParams}`);
    
    const { data } = await instance.get(
      `${url}?language=${language}&api_key=${THEMOVIE_API_KEY}${additionalParams}`
    )

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message)
      throw new ApiError(error.message)
    } else {
      console.log('unexpected error: ', error)
      throw new ApiError('An unexpected error occurred')
    }
  }
}

export default themovieDB
