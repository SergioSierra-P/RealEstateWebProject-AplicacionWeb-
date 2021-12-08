import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {Inmueble, InmuebleRelations, Ciudad, Asesor, SolicitudCliente} from '../models';
import {CiudadRepository} from './ciudad.repository';
import {AsesorRepository} from './asesor.repository';
import {SolicitudClienteRepository} from './solicitud-cliente.repository';

export class InmuebleRepository extends DefaultCrudRepository<
  Inmueble,
  typeof Inmueble.prototype.Id,
  InmuebleRelations
> {

  public readonly ciudad: BelongsToAccessor<Ciudad, typeof Inmueble.prototype.Id>;

  public readonly asesor: BelongsToAccessor<Asesor, typeof Inmueble.prototype.Id>;

  public readonly solicitudClientes: HasManyRepositoryFactory<SolicitudCliente, typeof Inmueble.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('CiudadRepository') protected ciudadRepositoryGetter: Getter<CiudadRepository>, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>, @repository.getter('SolicitudClienteRepository') protected solicitudClienteRepositoryGetter: Getter<SolicitudClienteRepository>,
  ) {
    super(Inmueble, dataSource);
    this.solicitudClientes = this.createHasManyRepositoryFactoryFor('solicitudClientes', solicitudClienteRepositoryGetter,);
    this.registerInclusionResolver('solicitudClientes', this.solicitudClientes.inclusionResolver);
    this.asesor = this.createBelongsToAccessorFor('asesor', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesor', this.asesor.inclusionResolver);
    this.ciudad = this.createBelongsToAccessorFor('ciudad', ciudadRepositoryGetter,);
    this.registerInclusionResolver('ciudad', this.ciudad.inclusionResolver);
  }
}
