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
  Asesor,
  SolicitudCliente,
} from '../models';
import {AsesorRepository} from '../repositories';

export class AsesorSolicitudClienteController {
  constructor(
    @repository(AsesorRepository) protected asesorRepository: AsesorRepository,
  ) { }

  @get('/asesors/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Array of Asesor has many SolicitudCliente',
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
    return this.asesorRepository.solicitudClientes(id).find(filter);
  }

  @post('/asesors/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Asesor model instance',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudCliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Asesor.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {
            title: 'NewSolicitudClienteInAsesor',
            exclude: ['Id'],
            optional: ['asesorId']
          }),
        },
      },
    }) solicitudCliente: Omit<SolicitudCliente, 'Id'>,
  ): Promise<SolicitudCliente> {
    return this.asesorRepository.solicitudClientes(id).create(solicitudCliente);
  }

  @patch('/asesors/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Asesor.SolicitudCliente PATCH success count',
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
    return this.asesorRepository.solicitudClientes(id).patch(solicitudCliente, where);
  }

  @del('/asesors/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Asesor.SolicitudCliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SolicitudCliente)) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.asesorRepository.solicitudClientes(id).delete(where);
  }
}
