import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {Departamento, DepartamentoRelations, Ciudad} from '../models';
import {CiudadRepository} from './ciudad.repository';

export class DepartamentoRepository extends DefaultCrudRepository<
  Departamento,
  typeof Departamento.prototype.Id,
  DepartamentoRelations
> {

  public readonly ciudads: HasManyRepositoryFactory<Ciudad, typeof Departamento.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('CiudadRepository') protected ciudadRepositoryGetter: Getter<CiudadRepository>,
  ) {
    super(Departamento, dataSource);
    this.ciudads = this.createHasManyRepositoryFactoryFor('ciudads', ciudadRepositoryGetter,);
    this.registerInclusionResolver('ciudads', this.ciudads.inclusionResolver);
  }
}
