import {Router} from 'express'
import {routeHandler} from "@utils";

const router = Router()

router.get('/', routeHandler(async (req: any, res) => {
  res.status(200).json("￣\\_(ツ)_/￣")
}));

export default router
