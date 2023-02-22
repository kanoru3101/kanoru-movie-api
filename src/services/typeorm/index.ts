import dataSource from '@config/ormconfig';
import * as models from '@models'
import * as repositories from './repositories';

export default dataSource;
export { models, repositories }
