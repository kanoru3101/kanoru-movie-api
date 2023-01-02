import * as models from '@models';
import dataSource from '@config/ormconfig';


export const user = dataSource.getRepository(models.User);
export const log = dataSource.getRepository(models.Log);