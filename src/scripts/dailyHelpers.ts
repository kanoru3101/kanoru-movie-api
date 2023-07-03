/* eslint-disable no-console */
import {Worker} from "@models";
import moment from "moment/moment";
import path from "path";
import uploadTMDBFile from "../services/themovie/uploadFileTmdb";
import fs from "fs";
import pako from "pako";
import {promisify} from "util";
import _ from "lodash";

export const dailyTmdbFileName = (date: string) => ({
  movies: `movie_ids_${date}.json.gz`,
  people: `person_ids_${date}.json.gz`,
})

export const checkFileExists = (filePath: string) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (err) {
    return false
  }
}

const readFileAsync = promisify(fs.readFile)

export const readCompressedJSONFile = async (
  filePath: string
): Promise<Array<object>> => {
  try {
    const fileData = await readFileAsync(filePath)
    const uncompressedData = pako.inflate(fileData, { to: 'string' })
    const jsonObjects = uncompressedData.trim().split('\n')
    const jsonData = jsonObjects.map(jsonStr => JSON.parse(jsonStr))
    return _.orderBy(jsonData, 'popularity', 'desc');
  } catch (error) {
    console.error('An error occurred while reading the file:', error)
    throw error
  }
}

export const getJsonData = async ({workerData, fileNameType}: {workerData: Worker, fileNameType: 'movies' | 'people'}): Promise<Array<object>> => {
  const dateMMDDYYYY = moment(workerData.started_at).format('MM_DD_YYYY')

  const fileName = dailyTmdbFileName(dateMMDDYYYY)[fileNameType]
  const fileUrl = path.resolve(`src/temp/${fileName}`)
  let filePath = fileUrl

  const isFile = checkFileExists(fileUrl)

  if (!isFile) {
    const uploadPath = await uploadTMDBFile(fileName)
    if (!filePath) {
      throw `No FILE_PATH for filename: ${fileName}`
    }
    filePath = uploadPath as string
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  return await readCompressedJSONFile(filePath)
}
