import type { RequestHandler } from 'express'

const myMiddleware: RequestHandler = (req, _res, next) => {
  // eslint-disable-next-line no-console
  console.log('#### REQUEST', req.url)
  next()
}

export { myMiddleware }
