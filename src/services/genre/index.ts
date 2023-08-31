import {repositories} from "@services/typeorm";
import {Genre} from "@models";
import {GetGenresForRelationsProps, GetGenresForRelationsResponse} from "@services/genre/types";

export const getAllGenres = async (): Promise<Genre[]> => {
    return repositories.genre.find({ take: 1000 })
}

export const getGenreById = async ({ id }: { id: number}): Promise<Genre | null> => repositories.genre.findOne({ where: { id: id }})

export const getGenresForRelations = ({
    allGenres,
    genres,
    language,
}: GetGenresForRelationsProps): GetGenresForRelationsResponse => {
    const movieGenres = genres
      .map(
        genreData =>
          allGenres.find(
            genre =>
              genreData.id === genre.tmdb_id && genre.language === language
          )?.id || null
      )
      .filter(Boolean) as number[]

    return movieGenres.map(id => ({ id }))
}
