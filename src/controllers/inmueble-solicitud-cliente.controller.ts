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
  Inmueble,
  SolicitudCliente,
} from '../models';
import {InmuebleRepository} from '../repositories';

export class InmuebleSolicitudClienteController {
  constructor(
    @repository(InmuebleRepository) protected inmuebleRepository: InmuebleRepository,
  ) { }

  @get('/inmuebles/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Array of Inmueble has many SolicitudCliente',
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
    return this.inmuebleRepository.solicitudClientes(id).find(filter);
  }

  @post('/inmuebles/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Inmueble model instance',
        content: {'application/json': {schema: getModelSchemaRef(SolicitudCliente)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Inmueble.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {
            title: 'NewSolicitudClienteInInmueble',
            exclude: ['Id'],
            optional: ['inmuebleId']
          }),
        },
      },
    }) solicitudCliente: Omit<SolicitudCliente, 'Id'>,
  ): Promise<SolicitudCliente> {
    return this.inmuebleRepository.solicitudClientes(id).create(solicitudCliente);
  }

  @patch('/inmuebles/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Inmueble.SolicitudCliente PATCH success count',
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
    return this.inmuebleRepository.solicitudClientes(id).patch(solicitudCliente, where);
  }

  @del('/inmuebles/{id}/solicitud-clientes', {
    responses: {
      '200': {
        description: 'Inmueble.SolicitudCliente DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SolicitudCliente)) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.inmuebleRepository.solicitudClientes(id).delete(where);
  }
}
