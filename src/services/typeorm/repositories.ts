import * as models from '@models';
import dataSource from '@config/ormconfig';

export const user = dataSource.getRepository(models.User);
export const log = dataSource.getRepository(models.Log);
export const movie = dataSource.getRepository(models.Movie);
export const genre = dataSource.getRepository(models.Genre);

export const video = dataSource.getRepository(models.Video);
