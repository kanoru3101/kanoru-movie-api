import movieUpdater from '@services/updater/movieUpdater'
import genreUpdater from '@services/updater/genreUpdater'
import personUpdater from '@services/updater/personUpdater'
import personCastUpdater from './personCastUpdater'
import castUpdater from './castUpdater'
import tvUpdater from './tvUpdater'
import tvSeasonsUpdater from "./tvSeasonsUpdater";
import tvEpisodeUpdater from './tvEpisodeUpdater';

export {
  movieUpdater,
  tvUpdater,
  tvSeasonsUpdater,
  tvEpisodeUpdater,
  genreUpdater,
  personUpdater,
  castUpdater,
  personCastUpdater,
}
