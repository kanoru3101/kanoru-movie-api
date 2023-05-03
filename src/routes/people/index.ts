import { Router } from 'express'
import * as peopleController from '@controllers/people'
import { GetPerson } from './types'
import {routeHandler, TypeHandler} from '@utils'

const router = Router()

router.get('/:imdbId', routeHandler(async (req: TypeHandler<GetPerson>, res) => {
    const person = await peopleController.getPersonByImdb({
        imdbId: req.params.imdbId,
        language: req.movieLanguage,
    })

    res.status(200).json(person)
}));

export default router
