'use strict'

const { default: validator } = require('validator')

const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'registrarApoderado' })
const { logger } = require('../../../utils/configuracionWinston')

// const fileDir = '[controller/administracion/registrarAula]'

module.exports = async (db, req, res, periodoActual) => {

  // module.exports = async (db, data, res, params, periodoActual) => {
  const { dni } =  await req.body
  const rolePadre = '2' // rol de apoderado
  console.log('dni---->', dni)
  // verificar si el Padre ya existe en el sistema:
  let verificacion
  try {
    verificacion = await db.verificarRegistroSistema(dni)
    log.info({ lang: 'es' }, `Verificando-sistema-${dni}`)
  } catch (error) {
    log.error({ lang: 'es' }, `ERROR: ${error}`)
    verificacion.status = false
  }

  if (verificacion.status) {
    log.info({ lang: 'es' }, `DNI-${dni} registrado`)
    const idAdmin = verificacion.idAdmin
    const idProfesor = verificacion.idProfesor
    const idAlumno = verificacion.idAlumno
    const idPadre = verificacion.idPadre
    const idPersona = verificacion.idPersona

    // ya existe el registro de la persona:
    if (idPadre !== undefined) {
      log.warn({ lang: 'es' }, `DNI-${dni} ya esta registrado como Padre`)

      res.status(200).send( {
        message: 'Ya está registrado un Padre con ese dni',
        status: false
      })
    } else {
      if (!idAlumno) { // si no tiene el rol de alumno
        // como ya existe un usuario con ese dni, entonces ya estan sus datos en el sistema
        // y como tiene no tiene rol de alumno ni Padre, entonces se agregara a un usuario
        // que ya tiene un rol de administrativo o profesor
        let agregarRolPadre
        try {
          agregarRolPadre = await db.agregarRolPadre(idPersona)
        } catch (error) {
          log.error({ lang: 'es' }, `ERROR: ${error}`)
          agregarRolPadre.status = false
        }
        if (agregarRolPadre.status) {
          log.info({ lang: 'es' }, `DNI-${dni} se agrego rol de Padre`)
          res.status(200).send( {
            message: 'Se agregó el rol de padre correctamente.',
            // message: `Se agregó el rol de Padre al usuario ${agregarRolPadre.persona.nombre} ${agregarRolPadre.persona.apellidoPaterno} ${agregarRolPadre.persona.apellidoMaterno}`,
            status: true
          })
        } else {
          log.warn({ lang: 'es' }, `DNI-${dni} no se agrego rol de Padre`)
          res.status(400).send( {
            message: 'No se pudo agregar el rol de Padre',
            status: false
          })
        }
      } else {
        log.warn({ lang: 'es' }, `DNI-${dni} pertenece a un alumno`)
        res.status(400).send( {
          message: 'Hay un alumno registrado con ese dni',
          status: false
        })
      }
    }
  } else {
    log.info({ lang: 'es' }, 'Registro de nuevo usuario-Padre')
    // registrar al Padre
    const { nombres, apellidoPaterno, apellidoMaterno, email } = data
    const newPadre = {
      dni,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      email
    }

    if (_validarDatos(newPadre)) {
      log.info({ lang: 'es' }, 'Datos correctos')
      let verificarCorreoUnico
      try {
        verificarCorreoUnico = await db.verificarCorreoUnico(email)
      } catch (error) {
        log.error({ lang: 'es' }, `ERROR: ${error}`)
        verificarCorreoUnico.status = false
      }
      if (verificarCorreoUnico.status) {
        // correo ya existente
        log.info({ lang: 'es' }, 'Correo ya existente')
        res.status(400).send( {
          message: 'Correo ya registrado, intente con otro.',
          status: false
        })
      } else {
        log.info({ lang: 'es' }, 'Registrando...')
        let registroPersona
        try {
          registroPersona = await db.registrarPersona(newAdministrativo)
        } catch (error) {
          log.error({ lang: 'es' }, `ERROR: ${error}`)
          registroPersona.status = false
        }

        if (registroPersona.status) { // se logro registrar a la persona, entonces ahora se debe registar su usuario
          log.info({ lang: 'es' }, 'Persona registrada correctamente')
          let registroUsuario
          try {
            registroUsuario = await db.registrarUsuario(registroPersona.idPersona)
          } catch (error) {
            log.error({ lang: 'es' }, `ERROR: ${error}`)
            registroUsuario.status = false
          }

          if (registroUsuario.status) {
            log.info({ lang: 'es' }, 'Usuario registrado correctamente')
            // ya se registró el usuario, ahora se debe asignar su rol
            const agregarRolPadre = await db.agregarRolPadre(registroPersona.idPersona)

            if (agregarRolPadre.status) {
              log.info({ lang: 'es' }, 'Asignacion de rol de Padre exitoso')

              res.status(200).send( {
                message: 'Se agregó el rol de Padre correctamente.',
                // message: `Se agregó el rol de Padre al usuario ${agregarRolPadre.persona.nombre} ${agregarRolPadre.persona.apellidoPaterno} ${agregarRolPadre.persona.apellidoMaterno}`,
                status: agregarRolPadre.status
              })
            } else {
              log.warn({ lang: 'es' }, 'Asignacion de rol de Padre exitoso')
              res.status(400).send( {
                message: 'No se pudo agregar el rol de Padre',
                status: agregarRolPadre.status
              })
            }
          } else {
            log.error({ lang: 'es' }, 'Usuario no registrado')
            res.status(500).send( {
              message: 'No se pudo registrar el usuario',
              status: false
            })
          }
        } else {
          log.error({ lang: 'es' }, 'Persona no registrada')
          res.status(500).send( {
            message: 'No se guardaron los datos, intente nuevamente.',
            status: registro.status
          })
        }
      }
    } else {
      log.warn({ lang: 'es' }, 'Datos incorrectos')
    }
  }
}


function _validarDatos(persona) {
  const valido = true
  const validado = []

  validado[0] = !validator.isEmpty(persona.dni)
  validado[1] = !validator.isEmpty(persona.nombres)
  validado[2] = !validator.isEmpty(persona.apellidoPaterno)
  validado[3] = !validator.isEmpty(persona.apellidoMaterno)
  validado[4] = !validator.isEmpty(persona.email)

  for (let i = 0; i < validado.length; i++) {
    valido = valido && validado[i]
  }
  return valido
}
