import {Router} from "express";
import * as tvController from '@controllers/tv'
import {routeHandler, TypeHandler} from '@utils'
import {GetTrending, GetTv, GetTvSeasons} from "./types";

const router = Router()

router.get('/trending', routeHandler(async (req: TypeHandler<GetTrending>, res) => {
  const tvs = await tvController.getTrending({ language: req.movieLanguage })

  res.status(200).json(tvs)
}));


router.get('/:imdbId', routeHandler(async (req: TypeHandler<GetTv>, res) => {
  const tv = await tvController.getTvById({
    imdbId: req.params.imdbId,
    language: req.movieLanguage
  })

  res.status(200).json(tv)
}));

router.get('/:imdbId/seasons', routeHandler(async (req: TypeHandler<GetTvSeasons>, res) => {
  const seasons = await tvController.getTvSeasons({
    imdbId: req.params.imdbId,
    language: req.movieLanguage
  })

  res.status(200).json(seasons)
}));
export default router
