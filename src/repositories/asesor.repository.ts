import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {Asesor, AsesorRelations, Administrador, Inmueble, SolicitudCliente} from '../models';
import {AdministradorRepository} from './administrador.repository';
import {InmuebleRepository} from './inmueble.repository';
import {SolicitudClienteRepository} from './solicitud-cliente.repository';

export class AsesorRepository extends DefaultCrudRepository<
  Asesor,
  typeof Asesor.prototype.Id,
  AsesorRelations
> {

  public readonly administrador: BelongsToAccessor<Administrador, typeof Asesor.prototype.Id>;

  public readonly inmuebles: HasManyRepositoryFactory<Inmueble, typeof Asesor.prototype.Id>;

  public readonly solicitudClientes: HasManyRepositoryFactory<SolicitudCliente, typeof Asesor.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>, @repository.getter('InmuebleRepository') protected inmuebleRepositoryGetter: Getter<InmuebleRepository>, @repository.getter('SolicitudClienteRepository') protected solicitudClienteRepositoryGetter: Getter<SolicitudClienteRepository>,
  ) {
    super(Asesor, dataSource);
    this.solicitudClientes = this.createHasManyRepositoryFactoryFor('solicitudClientes', solicitudClienteRepositoryGetter,);
    this.registerInclusionResolver('solicitudClientes', this.solicitudClientes.inclusionResolver);
    this.inmuebles = this.createHasManyRepositoryFactoryFor('inmuebles', inmuebleRepositoryGetter,);
    this.registerInclusionResolver('inmuebles', this.inmuebles.inclusionResolver);
    this.administrador = this.createBelongsToAccessorFor('administrador', administradorRepositoryGetter,);
    this.registerInclusionResolver('administrador', this.administrador.inclusionResolver);
  }
}
