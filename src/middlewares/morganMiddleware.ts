import morgan, { StreamOptions } from 'morgan'

import Logger from '@config/logger'

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: message => Logger.http(message),
}

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || 'development'
  return env !== 'development'
}

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return [
      `Method: ${tokens.method(req, res)}`,
      `URL: ${tokens.url(req, res)}`,
      `STATUS: ${tokens.status(req, res)}`,
      `DATE: ${tokens.date(req, res)}`,
    ].join(', ')
  },
  { stream, skip }
)

export default morganMiddleware
