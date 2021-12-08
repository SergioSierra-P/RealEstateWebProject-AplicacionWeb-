import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {RegistroCliente, RegistroClienteRelations, CoDeudor, SolicitudCliente} from '../models';
import {CoDeudorRepository} from './co-deudor.repository';
import {SolicitudClienteRepository} from './solicitud-cliente.repository';

export class RegistroClienteRepository extends DefaultCrudRepository<
  RegistroCliente,
  typeof RegistroCliente.prototype.Id,
  RegistroClienteRelations
> {

  public readonly coDeudor: HasOneRepositoryFactory<CoDeudor, typeof RegistroCliente.prototype.Id>;

  public readonly solicitudClientes: HasManyRepositoryFactory<SolicitudCliente, typeof RegistroCliente.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('CoDeudorRepository') protected coDeudorRepositoryGetter: Getter<CoDeudorRepository>, @repository.getter('SolicitudClienteRepository') protected solicitudClienteRepositoryGetter: Getter<SolicitudClienteRepository>,
  ) {
    super(RegistroCliente, dataSource);
    this.solicitudClientes = this.createHasManyRepositoryFactoryFor('solicitudClientes', solicitudClienteRepositoryGetter,);
    this.registerInclusionResolver('solicitudClientes', this.solicitudClientes.inclusionResolver);
    this.coDeudor = this.createHasOneRepositoryFactoryFor('coDeudor', coDeudorRepositoryGetter);
    this.registerInclusionResolver('coDeudor', this.coDeudor.inclusionResolver);
  }
}
