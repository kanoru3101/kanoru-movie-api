import { Router } from 'express'
import * as peopleController from '@controllers/people'
import { GetPerson, GetPersonMovies } from './types'
import { routeHandler, TypeHandler } from '@utils'

const router = Router()

router.get(
  '/:imdbId',
  routeHandler(async (req: TypeHandler<GetPerson>, res) => {
    const person = await peopleController.getPersonByImdb({
      imdbId: req.params.imdbId,
      language: req.movieLanguage,
    })

    res.status(200).json(person)
  })
)

router.get(
  '/:imdbId/cast',
  routeHandler(async (req: TypeHandler<GetPersonMovies>, res) => {
    const cast = await peopleController.getPersonMovies({
      imdbId: req.params.imdbId,
      language: req.movieLanguage,
    })

    res.status(200).json(cast)
  })
)

export default router
