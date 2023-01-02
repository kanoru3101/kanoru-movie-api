import { Router } from 'express'
import * as movieController from '@controllers/movies'
import { GetMovie } from './types'
import { TypeHandler } from '@utils'

const router = Router()

router.get('/:movieId', async (req: TypeHandler<GetMovie>, res) => {
  const movie = await movieController.getMovieById({
    movieId: req.params.movieId,
  })

  res.status(200).json({ movie })
})

export default router
