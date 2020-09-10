
const { default: validator } = require('validator')

const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'registrarProfesor' })

module.exports = async (db, data, res, params, periodoActual) => {
  const { dni } = data
  const roleProfesor = '2' // rol de profesor
  console.log('dni---->', dni)
  // verificar si el profesor ya existe en el sistema:
  let verificacion = {}
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
    if (idProfesor !== undefined) {
      log.warn({ lang: 'es' }, `DNI-${dni} ya esta registrado como profesor`)

      // verificar si la persona ya tiene rol de profesor
      res.status(200).send({
        message: 'Ya está registrado un profesor con ese dni',
        status: false
      })
    } else {
      if (!idAlumno) { // si no tiene el rol de alumno
        // como ya existe un usuario con ese dni, entonces ya estan sus datos en el sistema
        // y como tiene no tiene rol de alumno ni profesor, entonces se agregara a un usuario
        // que ya tiene un rol de administrativo o padre
        let agregarRolProfesor = {}
        try {
          agregarRolProfesor = await db.agregarRolProfesor(idPersona)
        } catch (error) {
          log.error({ lang: 'es' }, `ERROR: ${error}`)
          agregarRolProfesor.status = false
        }
        if (agregarRolProfesor.status) {
          log.info({ lang: 'es' }, `DNI-${dni} se agrego rol de profesor`)
          res.status(200).send({
            message: 'Se agregó el rol de profesor correctamente.',
            // message: `Se agregó el rol de profesor al usuario ${agregarRolProfesor.persona.nombre} ${agregarRolProfesor.persona.apellidoPaterno} ${agregarRolProfesor.persona.apellidoMaterno}`,
            status: true
          })
        } else {
          log.warn({ lang: 'es' }, `DNI-${dni} no se agrego rol de profesor`)
          res.status(400).send({
            message: 'No se pudo agregar el rol de profesor',
            status: false
          })
        }
      } else {
        log.warn({ lang: 'es' }, `DNI-${dni} pertenece a un alumno`)
        res.status(400).send({
          message: 'Hay un alumno registrado con ese dni',
          status: false
        })
      }
    }
  } else {
    log.info({ lang: 'es' }, 'Registro de nuevo usuario-profesor')
    // registrar al profesor
    const { nombres, apellidoPaterno, apellidoMaterno, email } = data
    const newProfesor = {
      dni,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      email
    }

    if (_validarDatos(newProfesor)) {
      log.info({ lang: 'es' }, 'Datos correctos')
      let processStatus = true
      let verificarCorreoUnico = {}
      try {
        verificarCorreoUnico = await db.verificarCorreoUnico(email)
      } catch (error) {
        log.error({ lang: 'es' }, `ERROR: ${error}`)
        processStatus = false
      }
      if (processStatus) {
        if (verificarCorreoUnico.status) {
          // correo ya existente
          log.info({ lang: 'es' }, 'Correo ya existente')
          res.status(400).send({
            message: 'Correo ya registrado, intente con otro.',
            status: false
          })
        } else {
          log.info({ lang: 'es' }, 'Registrando...')
          let registroPersona = {}
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
              const agregarRolProfesor = await db.agregarRolProfesor(registroPersona.idPersona)

              if (agregarRolProfesor.status) {
                log.info({ lang: 'es' }, 'Asignacion de rol de profesor exitoso')

                res.status(200).send({
                  message: 'Se agregó el rol de profesor correctamente.',
                  // message: `Se agregó el rol de profesor al usuario ${agregarRolProfesor.persona.nombre} ${agregarRolProfesor.persona.apellidoPaterno} ${agregarRolProfesor.persona.apellidoMaterno}`,
                  status: agregarRolProfesor.status
                })
              } else {
                log.warn({ lang: 'es' }, 'Asignacion de rol de profesor exitoso')
                res.status(400).send({
                  message: 'No se pudo agregar el rol de profesor',
                  status: agregarRolProfesor.status
                })
              }
            } else {
              log.error({ lang: 'es' }, 'Usuario no registrado')
              res.status(500).send({
                message: 'No se pudo registrar el usuario',
                status: false
              })
            }
          } else {
            log.error({ lang: 'es' }, 'Persona no registrada')
            res.status(500).send({
              message: 'No se guardaron los datos, intente nuevamente.',
              status: registro.status
            })
          }
        }
      } else {
        res.status(500).send({
          message: 'Ocurrió un problema al verificar correo.',
          status: false
        })
      }
    } else {
      log.warn({ lang: 'es' }, 'Datos incorrectos')
    }
  }
}

function _validarDatos (persona) {
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
