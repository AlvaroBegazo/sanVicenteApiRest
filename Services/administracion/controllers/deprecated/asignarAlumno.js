
const { default: validator } = require('validator')

const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'registrarAlumno' })

module.exports = async (db, data, res, params, periodoActual) => {
  const { dni } = data
  const roleAlumno = '1' // rol de Alumno
  console.log('dni---->', dni)
  // verificar si el Alumno ya existe en el sistema:
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

    if (idAdmin !== undefined || idProfesor !== undefined || idPadre !== undefined) {
      // el dni pertenece a un persona que ya tiene otro rol
      res.status(400).send({
        status: false,
        message: `El dni ${dni} pertenece a un persona que tiene un rol`
      })
    } else {

    }

    // ya existe el registro de la persona:
    if (idAlumno !== undefined) {
      log.warn({ lang: 'es' }, `DNI-${dni} ya esta registrado en el sistema como alumno`)

      // verificar si la persona ya tiene rol de Alumno
      res.status(200).send({
        message: 'Un alumno ya está registrado con ese dni',
        status: false
      })
    } else {
      if (!idAlumno) { // si no tiene el rol de alumno
        // como ya existe un usuario con ese dni, entonces ya estan sus datos en el sistema
        // y como tiene no tiene rol de alumno ni Alumno, entonces se agregara a un usuario
        // que ya tiene un rol de profesor o padre
        let agregarRolAlumno = {}
        try {
          agregarRolAlumno = await db.agregarRolAlumno(idPersona)
        } catch (error) {
          log.error({ lang: 'es' }, `ERROR: ${error}`)
          agregarRolAlumno.status = false
        }

        if (agregarRolAlumno.status) {
          log.info({ lang: 'es' }, `DNI-${dni} se agrego rol de Alumno`)
          res.status(200).send({
            message: 'Se agregó el rol de Alumno correctamente.',
            // message: `Se agregó el rol de Alumno al usuario ${agregarRolAlumno.persona.nombre} ${agregarRolAlumno.persona.apellidoPaterno} ${agregarRolAlumno.persona.apellidoMaterno}`,
            status: true
          })
        } else {
          log.warn({ lang: 'es' }, `DNI-${dni} no se agrego rol de Alumno`)
          res.status(400).send({
            message: 'No se pudo agregar el rol de Alumno',
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
    log.info({ lang: 'es' }, 'Registro de nuevo usuario-Alumno')
    // registrar al Alumno
    const { nombres, apellidoPaterno, apellidoMaterno, email } = data
    const newAlumno = {
      dni,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      email
    }

    if (_validarDatos(newAlumno)) {
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
        res.status(400).send({
          message: 'Correo ya registrado, intente con otro.',
          status: false
        })
      } else {
        log.info({ lang: 'es' }, 'Registrando...')
        let registroPersona = {}
        try {
          registroPersona = await db.registrarPersona(newAlumno)
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
            let agregarRolAlumno
            try {
              agregarRolAlumno = await db.agregarRolAlumno(registroPersona.idPersona)
            } catch (error) {
              log.error({ lang: 'es' }, `ERROR: ${error}`)
              agregarRolAlumno.status = false
            }

            if (agregarRolAlumno.status) {
              log.info({ lang: 'es' }, 'Asignacion de rol de Alumno exitoso')

              res.status(200).send({
                message: 'Se agregó el rol de Alumno correctamente.',
                // message: `Se agregó el rol de Alumno al usuario ${agregarRolAlumno.persona.nombre} ${agregarRolAlumno.persona.apellidoPaterno} ${agregarRolAlumno.persona.apellidoMaterno}`,
                status: agregarRolAlumno.status
              })
            } else {
              log.warn({ lang: 'es' }, 'Asignacion de rol de Alumno exitoso')
              res.status(400).send({
                message: 'No se pudo agregar el rol de Alumno',
                status: agregarRolAlumno.status
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
      log.warn({ lang: 'es' }, 'Datos incorrectos')
    }
  }
}
