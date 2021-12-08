import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {CoDeudor} from './co-deudor.model';
import {SolicitudCliente} from './solicitud-cliente.model';

@model()
export class RegistroCliente extends Entity {
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
    required: true, //se tiene que poner true or false dependiendo sie s obligatoria o no.
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

  @hasOne(() => CoDeudor)
  coDeudor: CoDeudor;

  @hasMany(() => SolicitudCliente)
  solicitudClientes: SolicitudCliente[];

  constructor(data?: Partial<RegistroCliente>) {
    super(data);
  }
}

export interface RegistroClienteRelations {
  // describe navigational properties here
}

export type RegistroClienteWithRelations = RegistroCliente & RegistroClienteRelations;
