import { Router } from 'express'
import * as movieController from '@controllers/movies'
import * as castController from '@controllers/cast'
import {GetMovie, GetMovieCast, GetNowPlaying, GetRecommendations, GetTopRate, GetTrending} from './types'
import {routeHandler, TypeHandler} from '@utils'

const router = Router()

router.get('/trending', routeHandler(async (req: TypeHandler<GetTrending>, res) => {
  const movies = await movieController.getTrending({ language: req.movieLanguage })

  res.status(200).json(movies)
}));

router.get('/top-rate', routeHandler(async (req: TypeHandler<GetTopRate>, res) => {
  const movies = await movieController.getTopRate({ language: req.movieLanguage })

  res.status(200).json(movies)
}));

router.get('/now-playing', routeHandler(async (req: TypeHandler<GetNowPlaying>, res) => {
  const movies = await movieController.getNowPlaying({ language: req.movieLanguage })

  res.status(200).json(movies)
}));

router.get('/:imdbId', routeHandler(async (req: TypeHandler<GetMovie>, res) => {
  const movie = await movieController.getMovieById({
    imdbId: req.params.imdbId,
    language: req.movieLanguage,
  })

  res.status(200).json(movie)
}));


router.get('/:imdbId/recommendations', routeHandler(async (req: TypeHandler<GetRecommendations>, res) => {
 const recommendations = await movieController.getRecommendationMovies({
    imdbId: req.params.imdbId,
    language: req.movieLanguage,
  })

  res.status(200).json(recommendations)
}));

router.get('/:imdbId/similar', routeHandler(async (req: TypeHandler<GetRecommendations>, res) => {
  const similarMovies = await movieController.getSimilarMovies({
    imdbId: req.params.imdbId,
    language: req.movieLanguage,
  })

  res.status(200).json(similarMovies)
}));

router.get('/:movieImdbId/cast', routeHandler(async (req: TypeHandler<GetMovieCast>, res) => {
    const cast = await castController.getCastByMovieImdbId({
        movieImdbId: req.params.movieImdbId,
        language: req.movieLanguage,
    })

    res.status(200).json(cast)
}));

export default router
