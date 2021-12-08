import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {CoDeudor, CoDeudorRelations} from '../models';

export class CoDeudorRepository extends DefaultCrudRepository<
  CoDeudor,
  typeof CoDeudor.prototype.Id,
  CoDeudorRelations
> {
  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource,
  ) {
    super(CoDeudor, dataSource);
  }
}
