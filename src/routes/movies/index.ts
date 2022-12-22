import { Router } from 'express'
import * as movieController from '@controllers/movies'
import { GetMovie } from './types'
import { RequestHandler } from '@utils/requestHandler'

const router = Router()

router.get('/:movieId', async (req: RequestHandler<GetMovie>, res) => {
  const movie = await movieController.getMovieById({
    movieId: req.params.movieId,
  })

  res.status(200).json({ movie })
})

export default router
