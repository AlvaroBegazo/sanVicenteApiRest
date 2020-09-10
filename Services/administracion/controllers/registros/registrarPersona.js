'use strict'

const { default: validator } = require('validator')
const bcrypt = require('bcrypt')
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'registrarPersona' })
const { logger } = require('../../../utils/configuracionWinston')

// module.exports = async (db, req, res, periodoActual) => {
module.exports = async ( db, req, res, params, periodoActual ) => {
  logger.info('Iniciando RegistrarPersona [Controller - administracion]')
  // const data = await json(req)
  const { dni, nombres, apellidoPaterno, apellidoMaterno, email, telefono, direccion, fechaNacimiento } = req.body
  const newPersona = {
    dni,
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    email,
    telefono,
    direccion,
    fechaNacimiento
  }
  console.log('dni---->', dni)
  // verificar si la persona que se registrará ya existe en el sistema:
  let verificacion = {}
  let processVerificacion = true
  try {
    verificacion = await db.verificarRegistroSistema(dni)
    log.info({ lang: 'es' }, `Verificando-sistema-${dni}`)
    console.log("Verificacion");
    console.log(verificacion);
    console.log("procesp de Verificacion");
    console.log(processVerificacion);

  } catch (error) {
    log.error({ lang: 'es' }, `ERROR: ${error}`)
    processVerificacion = false
  }

  if (processVerificacion) {
    if (verificacion.status) {
      log.warn({ lang: 'es' }, `DNI-${dni} ya registrado`)
      res.status(400).send({
        message: 'DNI ya registrado.',
        status: false
      })
    } else {
      if (_validarDatos(newPersona)) {
        log.info({ lang: 'es' }, 'Datos correctos')
        let verificarCorreoUnico = {}
        let processVerificarCorreo = true
        try {
          verificarCorreoUnico = await db.verificarCorreoUnico(email)
        } catch (error) {
          log.error({ lang: 'es' }, `ERROR: ${error}`)
          processVerificarCorreo = false
        }
        if (processVerificarCorreo) {
          if (verificarCorreoUnico.status) {
            // correo ya existente
            log.info({ lang: 'es' }, 'Correo ya existente')
            res.status(400).send({
              message: 'Correo ya registrado, intente con otro.',
              status: false
            })
          } else if (verificarCorreoUnico.status === false) {
            log.info({ lang: 'es' }, 'Registrando...')
            let registroPersona = {}
            try {
              registroPersona = await db.registrarPersona(newPersona)
            } catch (error) {
              log.error({ lang: 'es' }, `ERROR: ${error}`)
              registroPersona.status = false
            }

            if (registroPersona.status) { // se logro registrar a la persona, entonces ahora se debe registar su usuario
              log.info({ lang: 'es' }, 'Persona registrada correctamente')

              // registro de usuario:
              if (registroPersona.status) { // se logro registrar a la persona, entonces ahora se debe registar su usuario
                log.info({ lang: 'es' }, 'Persona registrada correctamente')
                let registroUsuario = {}
                let usuario
                let contrasenia
                try {
                  usuario = dni
                  contrasenia = nombres.substring(0, 2) + apellidoPaterno.substring(0, 2) + apellidoMaterno.substring(0, 2) + dni
                  const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10)
                  const newUsuario = {
                    idPersona: registroPersona.idPersona,
                    usuario,
                    contrasenia: contraseniaEncriptada
                  }
                  registroUsuario = await db.registrarUsuario(newUsuario)
                } catch (error) {
                  log.error({ lang: 'es' }, `ERROR: ${error}`)
                  registroUsuario.status = false
                }

                if (registroUsuario.status) {
                  log.info({ lang: 'es' }, 'Usuario registrado correctamente')
                  res.status(200).send({
                    message: 'Persona registrada y usuario creado correctamente.',
                    persona: {
                      dni,
                      nombres,
                      apellidoPaterno,
                      apellidoMaterno,
                      email,
                      idPersona: registroPersona.idPersona,
                      contrasenia,
                      idUsuario: registroUsuario.idUsuario
                    },
                    status: true
                  })
                } else {
                  log.error({ lang: 'es' }, 'Usuario no registrado')
                  res.status(500).send({
                    message: 'Se logró registrar a la persona, pero no al usuario, para registrar el usuario diríjase al módulo \'Registro de usuarios para persona registradas\'.',
                    status: false
                  })
                }
              } else {
                log.error({ lang: 'es' }, 'Persona no registrada')
                res.status(500).send({
                  message: 'No se pudo registrar los datos de persona, intente nuevamente.',
                  status: false
                })
              }
            } else {
              log.error({ lang: 'es' }, 'Persona no registrada')
              res.status(500).send({
                message: 'No se guardaron los datos, intente nuevamente.',
                status: false
              })
            }
          }
        } else {
          log.error({ lang: 'es' }, 'Error en verificacion disponibilidad de correo')
          res.status(500).send({
            message: 'Ocurrió un problema al verificar que el correo sea único.',
            status: false
          })
        }
      } else {
        log.warn({ lang: 'es' }, 'Datos incorrectos')
        res.status(500).send({
          message: 'Datos incompletos o incorrectos.',
          status: false
        })
      }
    }
  } else {
    log.error({ lang: 'es' }, 'Error en verificacion de persona')
    res.status(500).send({
      message: 'Ocurrió un problema al verificar el registro.',
      status: false
    })
  }
  logger.info('Terminando RegistrarPersona [Controller - administracion]')
}

function _validarDatos (persona) {
  logger.info('Iniciando _validarDatos [Controller - administracion]')
  let valido = true
  const validado = []
  try {
    validado[0] = !validator.isEmpty(persona.dni)
    validado[1] = !validator.isEmpty(persona.nombres)
    validado[2] = !validator.isEmpty(persona.apellidoPaterno)
    validado[3] = !validator.isEmpty(persona.apellidoMaterno)
    validado[4] = !validator.isEmpty(persona.email)

    validado[5] = !validator.isEmpty(persona.telefono)
    validado[6] = !validator.isEmpty(persona.fechaNacimiento)
    validado[7] = !validator.isEmpty(persona.direccion)

    for (let i = 0; i < validado.length; i++) {
      valido = valido && validado[i]
    }
    logger.info('Terminando _validarDatos [Controller - administracion]')
    return valido
  } catch (error) {
    logger.error(`Error RegistrarPersona [Controller - administracion] : ${error}`)
    return false
  }
}
