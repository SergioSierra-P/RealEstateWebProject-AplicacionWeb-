import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  RegistroCliente,
  SolicitudCliente,
} from '../models';
import {RegistroClienteRepository} from '../repositories';

export class RegistroClienteSolicitudClienteController {
  constructor(
    @repository(RegistroClienteRepository) protected registroClienteRepository: RegistroClienteRepository,
  ) { }

  @get('/registro-clientes/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Array of RegistroCliente has many SolicitudCliente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SolicitudCliente)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SolicitudCliente>,
  ): Promise<SolicitudCliente[]> {
    return this.registroClienteRepository.solicitudClientes(id).find(filter);
  }

  @post('/registro-clientes/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'RegistroCliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudCliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof RegistroCliente.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {
            title: 'NewSolicitudClienteInRegistroCliente',
            exclude: ['Id'],
            optional: ['registroClienteId']
          }),
        },
      },
    }) solicitudCliente: Omit<SolicitudCliente, 'Id'>,
  ): Promise<SolicitudCliente> {
    return this.registroClienteRepository.solicitudClientes(id).create(solicitudCliente);
  }

  @patch('/registro-clientes/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'RegistroCliente.SolicitudCliente PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {partial: true}),
        },
      },
    })
    solicitudCliente: Partial<SolicitudCliente>,
    @param.query.object('where', getWhereSchemaFor(SolicitudCliente)) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.registroClienteRepository.solicitudClientes(id).patch(solicitudCliente, where);
  }

  @del('/registro-clientes/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'RegistroCliente.SolicitudCliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SolicitudCliente)) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.registroClienteRepository.solicitudClientes(id).delete(where);
  }
}
