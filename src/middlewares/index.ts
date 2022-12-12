import type { RequestHandler } from 'express'

const myMiddleware: RequestHandler = (req, _res, next) => {
  console.log('#### REQUEST', req.url)
  next()
}

export { myMiddleware }
