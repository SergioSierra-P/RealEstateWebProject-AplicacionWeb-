import {Entity, model, property, hasOne} from '@loopback/repository';
import {RegistroCliente} from './registro-cliente.model';

@model()
export class CoDeudor extends Entity {
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
    required: true,
  })
  CorreoElectronico: string;

  @property({
    type: 'string',
    required: true,
  })
  NumeroDeCelular: string;

  @property({
    type: 'string',
    required: true,
  })
  SituacionLaboral: string;

  @property({
    type: 'string',
    required: true,
  })
  IngresosMensuales: string;

  @property({
    type: 'string',
  })
  registroClienteId?: string;

  constructor(data?: Partial<CoDeudor>) {
    super(data);
  }
}

export interface CoDeudorRelations {
  // describe navigational properties here
}

export type CoDeudorWithRelations = CoDeudor & CoDeudorRelations;
