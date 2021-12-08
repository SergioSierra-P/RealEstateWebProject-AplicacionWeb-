import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Ciudad} from './ciudad.model';
import {Asesor} from './asesor.model';
import {SolicitudCliente} from './solicitud-cliente.model';

@model()
export class Inmueble extends Entity {
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
  Descripcion: string;

  @property({
    type: 'string',
    required: true,
  })
  Direccion: string;

  @property({
    type: 'number',
    required: true,
  })
  PorcentajeDeParticipacion: number;

  @property({
    type: 'number',
    required: true,
  })
  Valor: number;

  @property({
    type: 'string',
    required: true,
  })
  TipoDeInmueble: string;

  @property({
    type: 'string',
    required: true,
  })
  TipoDeSolicitud: string;

  @property({
    type: 'string',
    required: true,
  })
  TipoDeEstado: string;

  @property({
    type: 'string',
  })
  ImagenDelInmueble?: string;

  @belongsTo(() => Ciudad)
  ciudadId: string;

  @belongsTo(() => Asesor)
  asesorId: string;

  @hasMany(() => SolicitudCliente)
  solicitudClientes: SolicitudCliente[];

  constructor(data?: Partial<Inmueble>) {
    super(data);
  }
}

export interface InmuebleRelations {
  // describe navigational properties here
}

export type InmuebleWithRelations = Inmueble & InmuebleRelations;
