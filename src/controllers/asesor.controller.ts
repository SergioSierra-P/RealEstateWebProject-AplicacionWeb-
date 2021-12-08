import {authenticate} from '@loopback/authentication';
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
import {Asesor, Credenciales} from '../models';
import {AsesorRepository} from '../repositories';
import {AutenticacionService} from '../services';
const https = require('https');
const http = require('http');

export class AsesorController {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  //Metodo a implementar para el tema de autenticacion.
  @post("/identificarAsesor", {
    responses: {
      '200': {
        description: "Identificacion del Asesor."
      }
    }
  })
  async identificarAsesor(
    @requestBody() credenciales: Credenciales
  ) {
    let p = await this.servicioAutenticacion.IdentificaciondelAsesor(credenciales.Usuario, credenciales.Clave)
    if (p) {
      let token = this.servicioAutenticacion.GenerarTokenJWTAsesor(p);
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

  @authenticate("admin")
  @post('/asesors')
  @response(200, {
    description: 'Asesor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Asesor)}},
  })
  //Se pone el tema de roles aca para probar-
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {
            title: 'NewAsesor',
            exclude: ['Id'],
          }),
        },
      },
    })
    asesor: Omit<Asesor, 'Id'>,
  ): Promise<Asesor> {
    //Proseso para generar una clave automatica y cifrada.

    let clave = this.servicioAutenticacion.GenerarClave();
    //let clave = administrador.Contrasena
    let claveCifrada = this.servicioAutenticacion.CifrarClave(asesor.Contrasena);
    asesor.Contrasena = claveCifrada;
    let p = await this.asesorRepository.create(asesor);

    //Notificar al usuario.
    //Como la aprte de notifiaicon se  hizo en un program aparte por temas de seguridad.
    //Se debe instalar un paquete para hacer llamados asincronicas desde url externas
    //paquete es npm i node-fetch

    let destino = asesor.CorreoElectronico;
    let asunto = "Registro en la Plataforma";
    let contenido = `Hola ${asesor.Nombre} ${asesor.Apellido}, su nombre de usuario es: ${asesor.CorreoElectronico} y su contraseña es: ${clave}.`;
    http.get(`http://127.0.0.1:5000/envio-correo?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
    return p;
  }

  @get('/asesors/count')
  @response(200, {
    description: 'Asesor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.count(where);
  }

  @get('/asesors')
  @response(200, {
    description: 'Array of Asesor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Asesor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Asesor) filter?: Filter<Asesor>,
  ): Promise<Asesor[]> {
    return this.asesorRepository.find(filter);
  }

  @patch('/asesors')
  @response(200, {
    description: 'Asesor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.updateAll(asesor, where);
  }

  @get('/asesors/{id}')
  @response(200, {
    description: 'Asesor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Asesor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Asesor, {exclude: 'where'}) filter?: FilterExcludingWhere<Asesor>
  ): Promise<Asesor> {
    return this.asesorRepository.findById(id, filter);
  }

  @patch('/asesors/{id}')
  @response(204, {
    description: 'Asesor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.updateById(id, asesor);
  }

  @put('/asesors/{id}')
  @response(204, {
    description: 'Asesor PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.replaceById(id, asesor);
  }

  @del('/asesors/{id}')
  @response(204, {
    description: 'Asesor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.asesorRepository.deleteById(id);
  }
}
