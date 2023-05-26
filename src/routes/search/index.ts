import {routeHandler, TypeHandler} from "@utils";
import * as searchController from "@controllers/search";
import router from "../people";
import {MultiSearch} from "./types";

router.get(
  '/multi',
  routeHandler(async (req: TypeHandler<MultiSearch>, res) => {
    const results = await searchController.getSearch({
      type: req.query.type,
      search: req.query.search,
      language: req.movieLanguage,
    })

    res.status(200).json(results)
  })
)

export default router
