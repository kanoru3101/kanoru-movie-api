import dataSource from '@config/ormconfig';
import * as models from '@models'
import * as repostories from './repostories';

export default dataSource;
export { models, repostories }