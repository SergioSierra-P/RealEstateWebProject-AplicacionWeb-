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
  Asesor,
} from '../models';
import {SolicitudClienteRepository} from '../repositories';

export class SolicitudClienteAsesorController {
  constructor(
    @repository(SolicitudClienteRepository)
    public solicitudClienteRepository: SolicitudClienteRepository,
  ) { }

  @get('/solicitud-clientes/{id}/asesor', {
    responses: {
      '200': {
        description: 'Asesor belonging to SolicitudCliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Asesor)},
          },
        },
      },
    },
  })
  async getAsesor(
    @param.path.string('id') id: typeof SolicitudCliente.prototype.Id,
  ): Promise<Asesor> {
    return this.solicitudClienteRepository.asesor(id);
  }
}
