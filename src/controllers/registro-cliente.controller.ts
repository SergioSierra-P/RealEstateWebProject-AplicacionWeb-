import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
//se crea una importacion para hacer llamados asincronicos desde url externas.
import {Credenciales, RegistroCliente} from '../models';
import {RegistroClienteRepository} from '../repositories';
import {AutenticacionService} from '../services';
//const fetch = require('node-fetch');
const https = require('https');
const http = require('http');

export class RegistroClienteController {
  constructor(
    @repository(RegistroClienteRepository)
    public registroClienteRepository: RegistroClienteRepository,
    //este constructor se crea para importar el servicio de autenticacion creado.
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  //Metodo a implementar para el tema de autenticacion.
  @post("/identificarRegistroCliente", {
    responses: {
      '200': {
        description: "Identificacion del cliente."
      }
    }
  })
  async identificarRegistroCliente(
    @requestBody() credenciales: Credenciales
  ) {
    let p = await this.servicioAutenticacion.IdentificaciondelCliente(credenciales.Usuario, credenciales.Clave)
    if (p) {
      let token = this.servicioAutenticacion.GenerarTokenJWTCliente(p);
      return {
        datos: {
          nombre: p.Nombre + "" + p.Apellido,
          correo: p.CorreoElectronico,
          id: p.Id
        },
        tk: token
      }

    } else {
      throw new HttpErrors[401]("Datos Invalidos")
    }
  }

  @post('/registro-clientes')
  @response(200, {
    description: 'RegistroCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(RegistroCliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroCliente, {
            title: 'NewRegistroCliente',
            exclude: ['Id'],
          }),
        },
      },
    })
    registroCliente: Omit<RegistroCliente, 'Id'>,
  ): Promise<RegistroCliente> {

    //Proseso para generar una clave automatica y cifrada.

    //let clave = this.servicioAutenticacion.GenerarClave();
    let clave = registroCliente.Contrasena
    let claveCifrada = this.servicioAutenticacion.CifrarClave(registroCliente.Contrasena);
    registroCliente.Contrasena = claveCifrada;
    let p = await this.registroClienteRepository.create(registroCliente);

    //Notificar al usuario.
    //Como la aprte de notifiaicon se  hizo en un program aparte por temas de seguridad.
    //Se debe instalar un paquete para hacer llamados asincronicas desde url externas
    //paquete es npm i node-fetch

    let destino = registroCliente.CorreoElectronico;
    let asunto = "Registro en la Plataforma";
    let contenido = `Hola ${registroCliente.Nombre} ${registroCliente.Apellido}, su nombre de usuario es: ${registroCliente.CorreoElectronico} y su contraseña es: ${clave}.`;
    http.get(`http://127.0.0.1:5000/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
    return p;
  }

  @get('/registro-clientes/count')
  @response(200, {
    description: 'RegistroCliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RegistroCliente) where?: Where<RegistroCliente>,
  ): Promise<Count> {
    return this.registroClienteRepository.count(where);
  }

  @get('/registro-clientes')
  @response(200, {
    description: 'Array of RegistroCliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RegistroCliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RegistroCliente) filter?: Filter<RegistroCliente>,
  ): Promise<RegistroCliente[]> {
    return this.registroClienteRepository.find(filter);
  }

  @patch('/registro-clientes')
  @response(200, {
    description: 'RegistroCliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroCliente, {partial: true}),
        },
      },
    })
    registroCliente: RegistroCliente,
    @param.where(RegistroCliente) where?: Where<RegistroCliente>,
  ): Promise<Count> {
    return this.registroClienteRepository.updateAll(registroCliente, where);
  }

  @get('/registro-clientes/{id}')
  @response(200, {
    description: 'RegistroCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RegistroCliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RegistroCliente, {exclude: 'where'}) filter?: FilterExcludingWhere<RegistroCliente>
  ): Promise<RegistroCliente> {
    return this.registroClienteRepository.findById(id, filter);
  }

  @patch('/registro-clientes/{id}')
  @response(204, {
    description: 'RegistroCliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RegistroCliente, {partial: true}),
        },
      },
    })
    registroCliente: RegistroCliente,
  ): Promise<void> {
    await this.registroClienteRepository.updateById(id, registroCliente);
  }

  @put('/registro-clientes/{id}')
  @response(204, {
    description: 'RegistroCliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() registroCliente: RegistroCliente,
  ): Promise<void> {
    await this.registroClienteRepository.replaceById(id, registroCliente);
  }

  @del('/registro-clientes/{id}')
  @response(204, {
    description: 'RegistroCliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.registroClienteRepository.deleteById(id);
  }
}
