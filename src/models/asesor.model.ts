import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Administrador} from './administrador.model';
import {Inmueble} from './inmueble.model';
import {SolicitudCliente} from './solicitud-cliente.model';

@model()
export class Asesor extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  Id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  Apellido: string;

  @property({
    type: 'string',
    required: true,
  })
  Cedula: string;

  @property({
    type: 'string',
    required: false,//contaseña false, es decir no oblitaroia para que se genere automaticamente.
  })
  Contrasena: string;

  @property({
    type: 'string',
    required: true,
  })
  CorreoElectronico: string;

  @property({
    type: 'string',
    required: true,
  })
  NumeroDeCelular: string;

  @belongsTo(() => Administrador)
  administradorId: string;

  @hasMany(() => Inmueble)
  inmuebles: Inmueble[];

  @hasMany(() => SolicitudCliente)
  solicitudClientes: SolicitudCliente[];

  constructor(data?: Partial<Asesor>) {
    super(data);
  }
}

export interface AsesorRelations {
  // describe navigational properties here
}

export type AsesorWithRelations = Asesor & AsesorRelations;
