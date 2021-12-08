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
  RegistroCliente,
} from '../models';
import {SolicitudClienteRepository} from '../repositories';

export class SolicitudClienteRegistroClienteController {
  constructor(
    @repository(SolicitudClienteRepository)
    public solicitudClienteRepository: SolicitudClienteRepository,
  ) { }

  @get('/solicitud-clientes/{id}/registro-cliente', {
    responses: {
      '200': {
        description: 'RegistroCliente belonging to SolicitudCliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RegistroCliente)},
          },
        },
      },
    },
  })
  async getRegistroCliente(
    @param.path.string('id') id: typeof SolicitudCliente.prototype.Id,
  ): Promise<RegistroCliente> {
    return this.solicitudClienteRepository.registroCliente(id);
  }
}
