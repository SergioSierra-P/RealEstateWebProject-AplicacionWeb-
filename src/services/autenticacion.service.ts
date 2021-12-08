import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../configuracion/llaves';
import {Administrador, Asesor, RegistroCliente} from '../models';
//Importaciones para la autenticacion.
import {AdministradorRepository, AsesorRepository, RegistroClienteRepository} from '../repositories';
//Se instalaron dos paquetes para generar calves automaticas y generar un cifrado sobre estas.
// se generar constantes para trear estas importaciones.
//import generador from 'password-generator';
//import cryptoJS from 'crypto-js';
//import jsonwebtoken
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    //Para la autenticacion, se debe acceder a la base de datos, por eso se inyecta los repositorios de las clases que se utilizaran.
    //Registro Cliente.
    @repository(RegistroClienteRepository)
    public RegistroClienteRepository: RegistroClienteRepository,
    //Administrador.
    @repository(AdministradorRepository)
    public AdministradorRepository: AdministradorRepository,
    //Asesor.
    @repository(AsesorRepository)
    public AsesorRepository: AsesorRepository
  ) { }

  //Metodo para generar clave automatica.
  //npm i password-generator
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }

  // Metodo para cifrar la calve automatica.
  //npm i crypto.js
  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }
  //Identificacion para el Cliente.
  IdentificaciondelCliente(usuario: string, clave: string) { //Se debe inyectar en el contructor los repositoriso de las clases que requieran autenticacion.
    try {
      let p = this.RegistroClienteRepository.findOne({where: {CorreoElectronico: usuario, Contrasena: clave}})
      if (p) {
        return p
      }
      return false
    } catch {
      return false
    }
  }
  //Identificador para el Administrador.
  IdentificaciondelAdministrador(usuario: string, clave: string) { //Se debe inyectar en el contructor los repositoriso de las clases que requieran autenticacion.
    try {
      let p = this.AdministradorRepository.findOne({where: {CorreoElectronico: usuario, Contrasena: clave}})
      if (p) {
        return p
      }
      return false
    } catch {
      return false
    }
  }
  //Identificador para el Asesor.
  IdentificaciondelAsesor(usuario: string, clave: string) { //Se debe inyectar en el contructor los repositoriso de las clases que requieran autenticacion.
    try {
      let p = this.AsesorRepository.findOne({where: {CorreoElectronico: usuario, Contrasena: clave}})
      if (p) {
        return p
      }
      return false
    } catch {
      return false
    }
  }

  //Para la generacion del toquen se debe instalar el sigueinte paquete. npm i jsonwebtoken
  //Generacion del Token para el Cliente.
  GenerarTokenJWTCliente(registroCliente: RegistroCliente) {
    //Asi se crea un toquen.
    let token = jwt.sign({
      //Tener en cuenta los componenete de un Token.
      data: {
        id: registroCliente.Id,
        correo: registroCliente.CorreoElectronico,
        nombre: registroCliente.Nombre + " " + registroCliente.Apellido
        //Ahora en la carpeta src/configuracion se crea un archivo ts donde se guarden las llaves.
      }
    },
      Llaves.ClienteClaveJWT);
    return token;
  }
  //Generacion del Token para el Administrador.
  GenerarTokenJWTAdministrador(administrador: Administrador) {
    //Asi se crea un toquen.
    let token = jwt.sign({
      //Tener en cuenta los componenete de un Token.
      data: {
        id: administrador.Id,
        correo: administrador.CorreoElectronico,
        nombre: administrador.Nombre + " " + administrador.Apellido
        //Ahora en la carpeta src/configuracion se crea un archivo ts donde se guarden las llaves.
      }
    },
      Llaves.AdministradorClaveJWT);
    return token;
  }
  //Generacion del Token para el Asesor.
  GenerarTokenJWTAsesor(asesor: Asesor) {
    //Asi se crea un toquen.
    let token = jwt.sign({
      //Tener en cuenta los componenete de un Token.
      data: {
        id: asesor.Id,
        correo: asesor.CorreoElectronico,
        nombre: asesor.Nombre + " " + asesor.Apellido
        //Ahora en la carpeta src/configuracion se crea un archivo ts donde se guarden las llaves.
      }
    },
      Llaves.AsesorClaveJWT);
    return token;
  }

  ValidarTokenJWTCliente(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.ClienteClaveJWT);
      return datos;
    } catch {
      return false
    }
  }

  ValidarTokenJWTAsesor(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.AsesorClaveJWT);
      return datos;
    } catch {
      return false
    }
  }

  ValidarTokenJWTAdminsitrador(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.AdministradorClaveJWT);
      return datos;
    } catch {
      return false
    }
  }

}
