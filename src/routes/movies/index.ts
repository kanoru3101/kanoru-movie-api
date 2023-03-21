import { Router } from 'express'
import * as movieController from '@controllers/movies'
import {GetMovie, GetNowPlaying, GetTopRate, GetTrending} from './types'
import {routeHandler, TypeHandler} from '@utils'
import {fromCountryToMovieLanguage} from "@utils/converterLanguages";
import {getNowPlaying} from "@controllers/movies";

const router = Router()

router.get('/trending', routeHandler(async (req: TypeHandler<GetTrending>, res) => {
  const userLanguage = req.user?.language;
  const moviesLanguage = userLanguage && fromCountryToMovieLanguage(userLanguage)

  const movies = await movieController.getTrending({ language: moviesLanguage })

  res.status(200).json(movies)
}));

router.get('/top-rate', routeHandler(async (req: TypeHandler<GetTopRate>, res) => {
  const userLanguage = req.user?.language;
  const moviesLanguage = userLanguage && fromCountryToMovieLanguage(userLanguage)

  const movies = await movieController.getTopRate({ language: moviesLanguage })

  res.status(200).json(movies)
}));

router.get('/now-playing', routeHandler(async (req: TypeHandler<GetNowPlaying>, res) => {
  const userLanguage = req.user?.language;
  const moviesLanguage = userLanguage && fromCountryToMovieLanguage(userLanguage)

  const movies = await movieController.getNowPlaying({ language: moviesLanguage })

  res.status(200).json(movies)
}));

getNowPlaying

router.get('/:movieId', routeHandler(async (req: TypeHandler<GetMovie>, res) => {
  const movie = await movieController.getMovieById({
    movieId: req.params.movieId,
  })

  res.status(200).json(movie)
}));

export default router
