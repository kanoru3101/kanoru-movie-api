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
  appendToResponse?: string[]
}

type BuildQueryParams = { [key: string]: number | string | undefined }

const THEMOVIE_API_KEY = process.env.THEMOVIE_API_KEY

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  timeout: 8000,
})

const buildQueryParams = (params: BuildQueryParams): string => {
  const cleanedObject = _.pickBy(params, v => v !== undefined)

  if (Object.keys(cleanedObject).length == 0) {
    return ''
  }

  return `&${queryString.stringify(cleanedObject)}`
}

const buildAppendToResponse = (values: Array<string>): string => {
  if (!values.length) {
    return ''
  }

  return `&append_to_response=${_.join(values, ',')}`
}

const themovieDB = async({
  url,
  language = 'en',
  params,
  appendToResponse,
}: ThemoviedbProps): Promise<any> => {
  try {
    const additionalParams = params ? buildQueryParams(params) : ''
    const appendToResponseParams = buildAppendToResponse(appendToResponse || [])
    const { data } = await instance.get(
      `${url}?language=${language}&api_key=${THEMOVIE_API_KEY}${appendToResponseParams}${additionalParams}`
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
