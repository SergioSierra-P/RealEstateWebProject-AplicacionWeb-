import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SolicitudCliente} from '../models';
import {SolicitudClienteRepository} from '../repositories';

export class SolicitudClienteController {
  constructor(
    @repository(SolicitudClienteRepository)
    public solicitudClienteRepository : SolicitudClienteRepository,
  ) {}

  @post('/solicitud-clientes')
  @response(200, {
    description: 'SolicitudCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(SolicitudCliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {
            title: 'NewSolicitudCliente',
            exclude: ['Id'],
          }),
        },
      },
    })
    solicitudCliente: Omit<SolicitudCliente, 'Id'>,
  ): Promise<SolicitudCliente> {
    return this.solicitudClienteRepository.create(solicitudCliente);
  }

  @get('/solicitud-clientes/count')
  @response(200, {
    description: 'SolicitudCliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SolicitudCliente) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.solicitudClienteRepository.count(where);
  }

  @get('/solicitud-clientes')
  @response(200, {
    description: 'Array of SolicitudCliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SolicitudCliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SolicitudCliente) filter?: Filter<SolicitudCliente>,
  ): Promise<SolicitudCliente[]> {
    return this.solicitudClienteRepository.find(filter);
  }

  @patch('/solicitud-clientes')
  @response(200, {
    description: 'SolicitudCliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {partial: true}),
        },
      },
    })
    solicitudCliente: SolicitudCliente,
    @param.where(SolicitudCliente) where?: Where<SolicitudCliente>,
  ): Promise<Count> {
    return this.solicitudClienteRepository.updateAll(solicitudCliente, where);
  }

  @get('/solicitud-clientes/{id}')
  @response(200, {
    description: 'SolicitudCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SolicitudCliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SolicitudCliente, {exclude: 'where'}) filter?: FilterExcludingWhere<SolicitudCliente>
  ): Promise<SolicitudCliente> {
    return this.solicitudClienteRepository.findById(id, filter);
  }

  @patch('/solicitud-clientes/{id}')
  @response(204, {
    description: 'SolicitudCliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SolicitudCliente, {partial: true}),
        },
      },
    })
    solicitudCliente: SolicitudCliente,
  ): Promise<void> {
    await this.solicitudClienteRepository.updateById(id, solicitudCliente);
  }

  @put('/solicitud-clientes/{id}')
  @response(204, {
    description: 'SolicitudCliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() solicitudCliente: SolicitudCliente,
  ): Promise<void> {
    await this.solicitudClienteRepository.replaceById(id, solicitudCliente);
  }

  @del('/solicitud-clientes/{id}')
  @response(204, {
    description: 'SolicitudCliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.solicitudClienteRepository.deleteById(id);
  }
}
