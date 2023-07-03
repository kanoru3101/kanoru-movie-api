import {Router} from 'express'
import {routeHandler, TypeHandler} from '@utils'
import * as searchController from '@controllers/search'
import {MultiSearch} from './types'
import {SEARCH_FILTERS} from "@constants";

const router = Router()

router.get(
  '/multi',
  routeHandler(async (req: TypeHandler<MultiSearch>, res) => {
    const data = await searchController.getSearch({
      type: req.query.type || SEARCH_FILTERS.ALL,
      query: req.query.query,
      language: req.movieLanguage,
    })

    res.status(200).json(data)
  })
)

export default router
