
const { logger } = require('../../utils/configuracionWinston')

module.exports = async (db, data, res, params, periodoActual) => {
  const { dni, rematricula, idAula } = data // rematricula: true - false
  const role = '4' // rol de alumno
  logger.info('Iniciando [Services/controllers/administracion/matricula]')
  // console.log("Entre al atriculacontroller de services")

  // en el caso un alumno ya se haya matriculado en el periodo anterior, solo se verifica que sus datos ya existan en el sistema:
  if (rematricula) {
    // verificar si el alumno ya existe en el sistema:
    let verificacion
    try {
      verificacion = await db.verificarRegistroSistema(db, dni)
    } catch (error) {
      console.log(`Error matricula ${error}`)
      logger.error(`Error [Services/controllers/administracion/matricula] : ${error}`)
    }

    if (1) {
      // ya existe el registro del alumno, entonces se puede proceder a su matricula:
      const objMatricula = {
        idAlumno: verificacion.idPersona,
        idPeriodo: periodoActual,
        idAula: idAula
      }
      const exito = await db.matriculaPeriodo(db, objMatricula)
      logger.info('Final [Services/controllers/administracion/matricula]')
      res.status(exito.statusCode).send({
        message: exito.message,
        status: exito.status
      })
    } else {
      logger.info('Final [Services/controllers/administracion/matricula]')
      logger.warn('El alumno no tiene registros en el sistema.')
      res.status(404).send({
        message: 'El alumno no tiene registros en el sistema.',
        status: false
      })
    }
  } else {
    // matricula por primera vez:
    const { dni, nombres, apellidoPat, apellidoMat, email } = data
    const newAlumno = {
      dni,
      nombres,
      apellidoPat,
      apellidoMat,
      email,
      role
    }
    const registro = await db.registrarPersona(db, newAlumno)
    if (registro.status) {
      const objMatricula = {
        idAlumno: registro.idPersona,
        idPeriodo: periodoActual,
        idAula: idAula
      }
      const exito = await db.matriculaPeriodo(db, objMatricula)
      logger.info('Final [Services/controllers/administracion/matricula]')
      res.status(exito.statusCode).send({
        message: exito.message,
        status: exito.status
      })
    } else {
      logger.warn('No se pudo registrar los datos del alumno, intente nuevamente.')
      logger.info('Final [Services/controllers/administracion/matricula]')
      res.status(500).send({
        message: 'No se pudo registrar los datos del alumno, intente nuevamente.',
        status: exito.status
      })
    }
  }

  // FALTA MEJORAR LOS LOGS y TERMINAR EL JS

  if (verificacion[0][0].dni && verificacion[0][0].idPersona) {
    // el alumno ya está registrado, ahora verificar si ya se matriculó en el periodo actual
    const matricula = verificarMatricula(verificacion[0][0].idPersona, periodoActual)

    if (verificarMatricula[0][0].idMatricula && verificarMatricula[0][0].idPersona) {
      // el alumno ya está matriculado en el periodo actual
      logger.warn('El alumno ya está matriculado en el actual periodo.')
      res.status(200).send({
        status: true,
        message: 'El alumno ya está matriculado en el actual periodo.'
      })
    } else {
      // el alumno ya está registrado en el sistema, entonces
    }
  }
}

async function verificarMatricula (idPersona, idPeriodo) {
  logger.info('Iniciando verificarMatricula [Services/controllers/administracion/matricula]')
  const queryVerificarMatricula = 'CALL verificarMatriculaAlumno(?,?,?)' // que retorno el idMatricula y idPersona
  const verificarMatricula = await db.query(queryVerificarMatricula, [idPersona, idPeriodo])
  // console.log(verificarMatricula[0])
  logger.info('Final verificarMatricula [Services/controllers/administracion/matricula]')
  return verificarMatricula[0][0]
}
