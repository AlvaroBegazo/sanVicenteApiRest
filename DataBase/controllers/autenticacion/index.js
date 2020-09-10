'use strict'

const bcrypt = require('bcrypt')
const jwt = require('../../../helpers/jwt')
const { logger } = require('../../../Services/utils/configuracionWinston')

module.exports = {
  // loginUsuario: loginUsuario,
  loginMaster: async (mysqlInstance, correo, contrasenia, gettoken = false) => {
    logger.info('Iniciando loginMaster [DataBase/controllers/autenticacion/index]')
    const credencialMaster = {}
    const query = 'CALL solicitarContraseniaMaster(?)'
    try {
      const process = await mysqlInstance.query(query, [correo])
      console.log("process");
      console.log(process[0])

      if (process[0].length > 0 && process[0][0].password !== undefined) {
        credencialMaster.status = true
        credencialMaster.contrasenia = process[0][0].password
        credencialMaster.idPersona = process[0][0].idPersona
      } else {
        credencialMaster.status = false
      }
    } catch (error) {
      logger.error(`ERROR [DataBase/controllers/autenticacion/index]: Pasword-Master : ${error}`)
      credencialMaster.status = false
    }

    if (credencialMaster.status) {
      let compararContrasenia
      try {
        compararContrasenia = await bcrypt.compare(contrasenia, credencialMaster.contrasenia)
        logger.info(`luego de comparacion ${compararContrasenia}`)
      } catch (error) {
        compararContrasenia = false
      }

      if (compararContrasenia) {
        // contraseña correcta, entonces ahora a obtener sus datos
        let datosPersona = {}
        try {
          datosPersona = await solicitarDatosPersona(mysqlInstance, credencialMaster.idPersona, gettoken)
        } catch (error) {
          logger.error(`ERROR solicitarDatosPersona [DataBase/controllers/autenticacion/index]: : ${error}`)
        }
        return datosPersona
      } else {
        logger.warn('Contraseña incorrecta.')
        return {
          status: false,
          message: 'Contraseña incorrecta.'
        }
      }
    } else {
      return {
        status: false
      }
    }
  },

  loginUser: async (mysqlInstance, usuario, contrasenia, gettoken = false) => {
    logger.info('Iniciando loginUser [DataBase/controllers/autenticacion/index]')
    const credencialUser = {}
    const query = 'CALL solicitarContraseniaUser(?)'
    try {
      const process = await mysqlInstance.query(query, [usuario])
      console.log("<------------------------------------------->");
      console.log(process[0])
      console.log("<------------------------------------------->");
      console.log(process[0][0])
      console.log("<------------------------------------------->");

      if (process[0].length > 0 && process[0][0].password !== undefined) {
        credencialUser.status = true
        credencialUser.contrasenia = process[0][0].password
        credencialUser.idPersona = process[0][0].idPersona
      } else {
        credencialUser.status = false
      }
    } catch (error) {
      // logger.log('ERROR: Password-User')
      logger.error(`ERROR loginUser [DataBase/controllers/autenticacion/index]: Password-User : ${error}`)
      credencialUser.status = false
    }

    if (credencialUser.status) {
      let compararContrasenia
      try {
        compararContrasenia = await bcrypt.compare(contrasenia, credencialUser.contrasenia)
      } catch (error) {
        logger.error(`ERROR  [DataBase/controllers/autenticacion/index]:  ${error}`)
        // Password - User
        compararContrasenia = false
      }

      if (compararContrasenia) {
        // contraseña correcta, entonces ahora a obtener sus datos
        let datosPersona = {}
        try {
          datosPersona = await solicitarDatosPersona(mysqlInstance, credencialUser.idPersona, gettoken)
        } catch (error) {
          logger.error(`ERROR funcion datos!! [DataBase/controllers/autenticacion/index]:  ${error}`)
        }
        logger.info('FINAL loginUser [DataBase/controllers/autenticacion/index]')
        return datosPersona
      } else {
        logger.warn('Contraseña incorrecta.')
        logger.info('Final loginUser [DataBase/controllers/autenticacion/index]')
        return {
          status: false,
          message: 'Contraseña incorrecta.'
        }
      }
    } else {
      logger.info('terminando loginUser [DataBase/controllers/autenticacion/index]')
      return {
        status: false
      }
    }
  }
}

async function solicitarDatosPersona(mysqlInstance, idPersona, gettoken) {
  // console.log("SolicitaDatosPersona");
  // console.log(idPersona, gettoken );
  logger.info('Iniciando solicitarDatosPersona [DataBase/controllers/autenticacion/index]')
  const query = 'CALL solicitaDatosPersona(?)'
  // let statusProcess = true
  const datosPersona = {}
  let statusProcess
  try {
    const process = await mysqlInstance.query(query, [idPersona])
    console.log("<------------------------------------------->");
    console.log(process[0])
    console.log("<------------------------------------------->");
    console.log(process[0][0])
    console.log("<------------------------------------------->");
    // console.log("El process es: ");
    // console.log(process)
    // console.log("El process[0][0] es: ");
    // console.log(process[0][0])
    // console.log("StatusProcess");
    // console.log(statusProcess);

    if (process[0].length > 0 && process[0][0].idPersona !== undefined) {
      datosPersona.status = true
      datosPersona.idPersona = process[0][0].idPersona
      datosPersona.dni = process[0][0].dni
      datosPersona.nombres = process[0][0].nombres
      datosPersona.apellidoPaterno = process[0][0].apellidoPaterno
      datosPersona.apellidoMaterno = process[0][0].apellidoMaterno
      datosPersona.email = process[0][0].email
      // console.log(datosPersona);
    } else {
      logger.warn('datos NO obtenidos')
      datosPersona.status = false
    }
  } catch (error) {
    statusProcess = false
    logger.error(`ERROR-DATOS solicitarDatosPersona [DataBase/controllers/autenticacion/index]:  ${error}`)
  }

  // console.log(statusProcess);
  // console.log('token: ');
  // console.log(datosPersona.status);
  if (datosPersona.status) {
    if (gettoken) {
      const token = jwt.createToken(datosPersona)
      logger.info('Final solicitarDatosPersona [DataBase/controllers/autenticacion/index]')
      return {
        status: true,
        token
      }
    } else {
      logger.info('Datos cargados correctamente.')
      logger.info('Final solicitarDatosPersona [DataBase/controllers/autenticacion/index] con datos de Persona')
      return {
        status: true,
        message: 'Datos cargados correctamente.',
        persona: datosPersona
      }
    }
  } else {
    logger.warn('No se pudo obtener los datos.')
    logger.info('Final solicitarDatosPersona [DataBase/controllers/autenticacion/index]')
    return {
      status: false,
      message: 'No se pudo obtener los datos.'
    }
  }
}
