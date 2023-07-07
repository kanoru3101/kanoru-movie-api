import { GetSearch } from '@controllers/search/types'
import {MOVIE_LANGUAGE, SEARCH_FILTERS} from '@constants'
import { movieUpdater, personUpdater } from '@services/updater'
import { MultiSearch } from '@services/themovie/types'
import { repositories } from '@services/typeorm'
import { In } from 'typeorm'
import { sortItemsByIds } from '@utils/sortResultsByIds'
import {getMoviesSearch, getMultiSearch, getPeopleSearch} from "@services/themovie";
import ApiError from "@errors";

type Props = {
  type: SEARCH_FILTERS
  query: string
  language: MOVIE_LANGUAGE
}

export const getSearch = async ({
  type,
  query,
  language,
}: Props): Promise<GetSearch> => {
  let data = null as unknown as MultiSearch
  const moviesTMDBIds = [] as Array<number>
  const peopleTMDBIds= [] as Array<number>
  if (type === SEARCH_FILTERS.ALL) {
    data = await getMultiSearch({
      query,
      language,
    })

    moviesTMDBIds.push(...data?.results
      .filter(item => item.media_type === 'movie')
      .map(item => item.id) || [])


    peopleTMDBIds.push(...data?.results
      .filter(item => item.media_type === 'person')
      .map(item => item.id) || [])
  }

  if (type === SEARCH_FILTERS.MOVIES) {
    data = await getMoviesSearch({
      query,
      language,
    })

    moviesTMDBIds.push(...data.results.map(({ id }) => id))
  }

  if (type === SEARCH_FILTERS.PEOPLE) {
    data = await getPeopleSearch({
      query,
      language,
    })

    peopleTMDBIds.push(...data.results.map(({ id }) => id))
  }

  if (!data) {
    throw new ApiError("Wrong type")
  }

  await Promise.all([
    await movieUpdater({
      movieIds: moviesTMDBIds,
      language,
    }),
    await personUpdater({
      personTmdbIds: peopleTMDBIds,
      language,
    }),
  ])

  const [movies, people] = await Promise.all([
    await repositories.movie.find({
      where: {
        tmdb_id: In(moviesTMDBIds),
        language,
      },
      relations: {
        cast: {
          person: true
        },
      },
      loadEagerRelations: false
    }),
    await repositories.person.find({
      where: {
        tmdb_id: In(peopleTMDBIds),
        language,
      },
      relations: {
        cast: {
          movie: true
        }
      },
      loadEagerRelations: false
    }),
  ])

  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    data: {
      movies: sortItemsByIds(moviesTMDBIds, movies, movie => movie.tmdb_id),
      people: sortItemsByIds(peopleTMDBIds, people, movie => movie.tmdb_id),
    },
  }
}
