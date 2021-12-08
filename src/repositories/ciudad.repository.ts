import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {Ciudad, CiudadRelations, Departamento, Inmueble} from '../models';
import {DepartamentoRepository} from './departamento.repository';
import {InmuebleRepository} from './inmueble.repository';

export class CiudadRepository extends DefaultCrudRepository<
  Ciudad,
  typeof Ciudad.prototype.Id,
  CiudadRelations
> {

  public readonly departamento: BelongsToAccessor<Departamento, typeof Ciudad.prototype.Id>;

  public readonly inmuebles: HasManyRepositoryFactory<Inmueble, typeof Ciudad.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('DepartamentoRepository') protected departamentoRepositoryGetter: Getter<DepartamentoRepository>, @repository.getter('InmuebleRepository') protected inmuebleRepositoryGetter: Getter<InmuebleRepository>,
  ) {
    super(Ciudad, dataSource);
    this.inmuebles = this.createHasManyRepositoryFactoryFor('inmuebles', inmuebleRepositoryGetter,);
    this.registerInclusionResolver('inmuebles', this.inmuebles.inclusionResolver);
    this.departamento = this.createBelongsToAccessorFor('departamento', departamentoRepositoryGetter,);
    this.registerInclusionResolver('departamento', this.departamento.inclusionResolver);
  }
}
