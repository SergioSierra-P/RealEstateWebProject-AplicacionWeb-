import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SolicitudCliente,
  Inmueble,
} from '../models';
import {SolicitudClienteRepository} from '../repositories';

export class SolicitudClienteInmuebleController {
  constructor(
    @repository(SolicitudClienteRepository)
    public solicitudClienteRepository: SolicitudClienteRepository,
  ) { }

  @get('/solicitud-clientes/{id}/inmueble', {
    responses: {
      '200': {
        description: 'Inmueble belonging to SolicitudCliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Inmueble)},
          },
        },
      },
    },
  })
  async getInmueble(
    @param.path.string('id') id: typeof SolicitudCliente.prototype.Id,
  ): Promise<Inmueble> {
    return this.solicitudClienteRepository.inmueble(id);
  }
}
