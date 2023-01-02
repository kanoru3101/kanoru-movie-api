/* eslint-disable no-console */
import ApiError from "@errors";
import axios from "axios";

const instance = axios.create({
  baseURL: 'https://rickandmortyapi.com/api/',
  timeout: 1000,
})

const rickAndMortyApi = async({ url }: { url: string}) => {
  try {
    const { data } = await instance.get(url)

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

export default rickAndMortyApi;