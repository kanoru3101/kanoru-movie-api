import cron from 'node-cron'
import {repositories} from '@services/typeorm'
import {Between} from 'typeorm'
import {WORKER_NAME, WORKER_STATUS} from '@constants'
import moment from 'moment/moment'
import {execSync} from 'child_process'

const typeToScriptMapping = {
  [WORKER_NAME.UPDATE_PEOPLE]: 'getUpdatesPerson',
  [WORKER_NAME.UPDATE_MOVIES]: 'getUpdatesMovie',
};

const tmdbChanges = async (workerName: WORKER_NAME): Promise<any> => {
  const now = moment()
  const startDate = now.subtract(1, 'day').format('YYYY-MM-DD')
  const endDate = now.format('YYYY-MM-DD')
  const scriptName = typeToScriptMapping[workerName]

  const events = await repositories.worker.find({
    where: {
      name: workerName,
      started_at: Between(startDate, endDate),
      finished_at: Between(startDate, endDate),
    },
    order: { id: 'DESC' },
  })

  if (events?.length === 0) {
    return execSync(
      `npx ts-node src/scripts/${scriptName}.ts --startDate="${startDate}" --endDate="${endDate}"`,
      { stdio: 'inherit' }
    )
  }

  if (events.find(e => e.status === WORKER_STATUS.FINISHED)) {
    return;
  }

  const maxObject = events.reduce(
    (max, obj) => (obj?.data?.progress > max?.data?.progress ? obj : max),
    events[0]
  )

  if (maxObject.data?.total > maxObject.data?.progress || maxObject.data?.total === 0) {
    return execSync(
      `npx ts-node src/scripts/${scriptName}.ts --startDate="${startDate}" --endDate="${endDate}" --startFrom="${maxObject.data?.progress}" --workerId="${maxObject.id}"`,
      { stdio: 'inherit' }
    )
  }
}

export const cronMovieChanges = cron.schedule('0 */2 * * *', async () => tmdbChanges(WORKER_NAME.UPDATE_MOVIES))
export const cronPeopleChanges = cron.schedule('1-23/2 * * * *', async () => tmdbChanges(WORKER_NAME.UPDATE_PEOPLE))
