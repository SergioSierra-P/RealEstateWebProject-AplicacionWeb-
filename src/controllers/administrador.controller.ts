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
import {Administrador, Credenciales} from '../models';
import {AdministradorRepository} from '../repositories';
import {AutenticacionService} from '../services';
const https = require('https');
const http = require('http');

export class AdministradorController {
  constructor(
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,
    //este constructor se crea para importar el servicio de autenticacion creado.
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  //Metodo a implementar para el tema de autenticacion.
  @post("/identificarAdministrador", {
    responses: {
      '200': {
        description: "Identificacion del administrador."
      }
    }
  })
  async identificarAdministrador(
    @requestBody() credenciales: Credenciales
  ) {
    let p = await this.servicioAutenticacion.IdentificaciondelAdministrador(credenciales.Usuario, credenciales.Clave)
    if (p) {
      let token = this.servicioAutenticacion.GenerarTokenJWTAdministrador(p);
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

  @post('/administradors')
  @response(200, {
    description: 'Administrador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Administrador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {
            title: 'NewAdministrador',
            exclude: ['Id'],
          }),
        },
      },
    })
    administrador: Omit<Administrador, 'Id'>,
  ): Promise<Administrador> {
    //Proseso para generar una clave automatica y cifrada.

    //let clave = this.servicioAutenticacion.GenerarClave();
    let clave = administrador.Contrasena
    let claveCifrada = this.servicioAutenticacion.CifrarClave(administrador.Contrasena);
    administrador.Contrasena = claveCifrada;
    let p = await this.administradorRepository.create(administrador);

    //Notificar al usuario.
    //Como la aprte de notifiaicon se  hizo en un program aparte por temas de seguridad.
    //Se debe instalar un paquete para hacer llamados asincronicas desde url externas
    //paquete es npm i node-fetch

    let destino = administrador.CorreoElectronico;
    let asunto = "Registro en la Plataforma";
    let contenido = `Hola ${administrador.Nombre} ${administrador.Apellido}, su nombre de usuario es: ${administrador.CorreoElectronico} y su contraseña es: ${clave}.`;
    http.get(`http://127.0.0.1:5000/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
    return p;
  }

  @get('/administradors/count')
  @response(200, {
    description: 'Administrador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.count(where);
  }

  @get('/administradors')
  @response(200, {
    description: 'Array of Administrador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Administrador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Administrador) filter?: Filter<Administrador>,
  ): Promise<Administrador[]> {
    return this.administradorRepository.find(filter);
  }

  @patch('/administradors')
  @response(200, {
    description: 'Administrador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.updateAll(administrador, where);
  }

  @get('/administradors/{id}')
  @response(200, {
    description: 'Administrador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Administrador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Administrador, {exclude: 'where'}) filter?: FilterExcludingWhere<Administrador>
  ): Promise<Administrador> {
    return this.administradorRepository.findById(id, filter);
  }

  @patch('/administradors/{id}')
  @response(204, {
    description: 'Administrador PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.updateById(id, administrador);
  }

  @put('/administradors/{id}')
  @response(204, {
    description: 'Administrador PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.replaceById(id, administrador);
  }

  @del('/administradors/{id}')
  @response(204, {
    description: 'Administrador DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administradorRepository.deleteById(id);
  }
}
