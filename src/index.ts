import express, { Express } from 'express'
import dotenv from 'dotenv'
import {myMiddleware, morganMiddleware, errorHandler, authMiddleware, languageMiddleware} from './middlewares'
import routers from './routes'
import bodyParser from 'body-parser'
import connectDB from './config/ormconfig'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './http-extensions'
import {cronMovieChanges, cronPeopleChanges} from "./workers";

dotenv.config()

connectDB
  .initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`Data Source has been initialized`)
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log({
      host: process.env.POSTGRES_HOST || 'localhost',
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
    })
    // eslint-disable-next-line no-console
    console.error(`Data Source initialization error`, err)
  })

const PORT = (process.env.PORT || 8080) as number
const HOST = process.env.HOST || '0.0.0.0'
const app: Express = express()


cronMovieChanges
cronPeopleChanges

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(myMiddleware)
app.use(authMiddleware)
app.use(languageMiddleware)
app.use(morganMiddleware)

app.use(routers)

app.use(errorHandler)

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at https://${HOST}:${PORT}`)
})
