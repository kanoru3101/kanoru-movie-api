import {GetCastByMovieImdbIdProps} from "@controllers/cast/types";
import {Cast} from "@models";
import {repositories} from "@services/typeorm";
import castUpdater from "@services/updater/castUpdater";
import {personUpdater} from "@services/updater";

export const getCastByMovieImdbId = async ({
    movieImdbId,
    language
}: GetCastByMovieImdbIdProps): Promise<Cast[] | []> => {
    const movie = await repositories.movie.findOne( { where: { imdb_id: movieImdbId, language}});

    if (!movie) {
        return []
    }

    console.log("####HERE")

    await personUpdater({
        movieTmdbId: movie.movie_db_id,
        language,
    })

    console.log("####HERE2")
    return await castUpdater({
        movieTmdbId: movie.movie_db_id,
        language,
    })
}