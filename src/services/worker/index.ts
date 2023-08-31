import redis from '../../config/redis';
import { Queue, Worker } from 'bullmq';
import {tvEpisodeUpdater, tvSeasonsUpdater} from "@services/updater";

export const updateQueue = new Queue('updateQueue', { connection: redis });

export const updateWorker = new Worker('updateQueue', async (job) => {
  const { name, data}  = job

  if (name === 'tvSeasons') {
    return await tvSeasonsUpdater(data)
  } else if (name === 'tvEpisodes') {
    // eslint-disable-next-line no-console
    console.log('#####tvEpisodes')
    return await tvEpisodeUpdater(data)
  } else {
    // eslint-disable-next-line no-console
    console.log("#JOB", {
      name,
      data
    })
  }
}, { connection: redis, concurrency: 2 })
