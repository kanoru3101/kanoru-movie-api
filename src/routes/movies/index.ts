import { Router } from 'express'
import * as movieController from '@controllers/movies'
import { GetMovie, GetTopRate, GetTrending } from './types'
import { TypeHandler } from '@utils'

const router = Router()

router.get('/trending', async (req: TypeHandler<GetTrending>, res) => {
  const movies = await movieController.getTrending()

  res.status(200).json(movies)
})

router.get('/top-rate', async (req: TypeHandler<GetTopRate>, res) => {
  const movies = await movieController.getTopRate()

  res.status(200).json(movies)
})

router.get('/:movieId', async (req: TypeHandler<GetMovie>, res) => {
  const movie = await movieController.getMovieById({
    movieId: req.params.movieId,
  })

  res.status(200).json(movie)
})

export default router
