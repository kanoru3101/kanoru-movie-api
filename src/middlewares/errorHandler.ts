import { ErrorRequestHandler } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = err.status || 400
  const message = err.message
  res.status(status).json({ message })
}

export default errorHandler
