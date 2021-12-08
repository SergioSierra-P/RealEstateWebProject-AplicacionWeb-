import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {NongodbDataSource} from '../datasources';
import {SolicitudCliente, SolicitudClienteRelations, RegistroCliente, Inmueble, Asesor} from '../models';
import {RegistroClienteRepository} from './registro-cliente.repository';
import {InmuebleRepository} from './inmueble.repository';
import {AsesorRepository} from './asesor.repository';

export class SolicitudClienteRepository extends DefaultCrudRepository<
  SolicitudCliente,
  typeof SolicitudCliente.prototype.Id,
  SolicitudClienteRelations
> {

  public readonly registroCliente: BelongsToAccessor<RegistroCliente, typeof SolicitudCliente.prototype.Id>;

  public readonly inmueble: BelongsToAccessor<Inmueble, typeof SolicitudCliente.prototype.Id>;

  public readonly asesor: BelongsToAccessor<Asesor, typeof SolicitudCliente.prototype.Id>;

  constructor(
    @inject('datasources.nongodb') dataSource: NongodbDataSource, @repository.getter('RegistroClienteRepository') protected registroClienteRepositoryGetter: Getter<RegistroClienteRepository>, @repository.getter('InmuebleRepository') protected inmuebleRepositoryGetter: Getter<InmuebleRepository>, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>,
  ) {
    super(SolicitudCliente, dataSource);
    this.asesor = this.createBelongsToAccessorFor('asesor', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesor', this.asesor.inclusionResolver);
    this.inmueble = this.createBelongsToAccessorFor('inmueble', inmuebleRepositoryGetter,);
    this.registerInclusionResolver('inmueble', this.inmueble.inclusionResolver);
    this.registroCliente = this.createBelongsToAccessorFor('registroCliente', registroClienteRepositoryGetter,);
    this.registerInclusionResolver('registroCliente', this.registroCliente.inclusionResolver);
  }
}
