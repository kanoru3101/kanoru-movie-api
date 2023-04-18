import type { RequestHandler } from 'express'
import morganMiddleware from './morganMiddleware'
import errorHandler from './errorHandler'
import authMiddleware from './authMiddleware'
import cors from './cors'
import languageMiddleware from "./languageMiddleware";

const myMiddleware: RequestHandler = (req, _res, next) => {
  next()
}

export { myMiddleware, morganMiddleware, errorHandler, authMiddleware, cors, languageMiddleware }
