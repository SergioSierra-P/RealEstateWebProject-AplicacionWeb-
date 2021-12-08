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
  CoDeudor,
} from '../models';
import {RegistroClienteRepository} from '../repositories';

export class RegistroClienteCoDeudorController {
  constructor(
    @repository(RegistroClienteRepository) protected registroClienteRepository: RegistroClienteRepository,
  ) { }

  @get('/registro-clientes/{id}/co-deudor', {
    responses: {
      '200': {
        description: 'RegistroCliente has one CoDeudor',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CoDeudor),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<CoDeudor>,
  ): Promise<CoDeudor> {
    return this.registroClienteRepository.coDeudor(id).get(filter);
  }

  @post('/registro-clientes/{id}/co-deudor', {
    responses: {
      '200': {
        description: 'RegistroCliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(CoDeudor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof RegistroCliente.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CoDeudor, {
            title: 'NewCoDeudorInRegistroCliente',
            exclude: ['Id'],
            optional: ['registroClienteId']
          }),
        },
      },
    }) coDeudor: Omit<CoDeudor, 'Id'>,
  ): Promise<CoDeudor> {
    return this.registroClienteRepository.coDeudor(id).create(coDeudor);
  }

  @patch('/registro-clientes/{id}/co-deudor', {
    responses: {
      '200': {
        description: 'RegistroCliente.CoDeudor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CoDeudor, {partial: true}),
        },
      },
    })
    coDeudor: Partial<CoDeudor>,
    @param.query.object('where', getWhereSchemaFor(CoDeudor)) where?: Where<CoDeudor>,
  ): Promise<Count> {
    return this.registroClienteRepository.coDeudor(id).patch(coDeudor, where);
  }

  @del('/registro-clientes/{id}/co-deudor', {
    responses: {
      '200': {
        description: 'RegistroCliente.CoDeudor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(CoDeudor)) where?: Where<CoDeudor>,
  ): Promise<Count> {
    return this.registroClienteRepository.coDeudor(id).delete(where);
  }
}
