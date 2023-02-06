import { Router } from 'express'
import * as movieController from '@controllers/movies'
import { GetMovie, GetTopRate, GetTrending } from './types'
import { routeHandler, TypeHandler } from '@utils'

const router = Router()

router.get(
  '/trending',
  routeHandler(async (req: TypeHandler<GetTrending>, res) => {
    const movies = await movieController.getTrending()

    res.status(200).json(movies)
  })
)

router.get(
  '/top-rate',
  routeHandler(async (req: TypeHandler<GetTopRate>, res) => {
    const movies = await movieController.getTopRate()

    res.status(200).json(movies)
  })
)

router.get(
  '/:movieId',
  routeHandler(async (req: TypeHandler<GetMovie>, res) => {
    const movie = await movieController.getMovieById({
      movieId: req.params.movieId,
    })

    res.status(200).json(movie)
  })
)

export default router
