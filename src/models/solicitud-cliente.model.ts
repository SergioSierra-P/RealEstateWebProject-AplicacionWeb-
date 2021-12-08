import {Entity, model, property, belongsTo} from '@loopback/repository';
import {RegistroCliente} from './registro-cliente.model';
import {Inmueble} from './inmueble.model';
import {Asesor} from './asesor.model';

@model()
export class SolicitudCliente extends Entity {
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
  EstadoSolicitud: string;

  @property({
    type: 'string',
  })
  Comentarios?: string;

  @property({
    type: 'date',
    required: true,
  })
  FechaDeSolicitud: string;

  @belongsTo(() => RegistroCliente)
  registroClienteId: string;

  @belongsTo(() => Inmueble)
  inmuebleId: string;

  @belongsTo(() => Asesor)
  asesorId: string;

  constructor(data?: Partial<SolicitudCliente>) {
    super(data);
  }
}

export interface SolicitudClienteRelations {
  // describe navigational properties here
}

export type SolicitudClienteWithRelations = SolicitudCliente & SolicitudClienteRelations;
