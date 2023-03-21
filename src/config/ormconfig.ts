import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

const port = (process.env.POSTGRES_PORT || 5432) as number

const connectDB = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  entities: ['src/models/!(index.ts)'],
  migrations: ['src/migrations/*.ts'],
  logging: false,
  logger: 'advanced-console',
  synchronize: false,
  migrationsRun: true,
})

export default connectDB
