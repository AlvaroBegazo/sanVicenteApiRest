'use strict'
const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'Helper-admin-registrarRol' })

module.exports = async (db, idUsuario, tipoRol, periodoActual) => {
  let asignacion = {}
  let processStatus = true
  switch (parseInt(tipoRol)) {
    case 1:
      console.log('----------registrando administrativo--------------')
      try {
        asignacion = await db.agregarRolAdministrativo(idUsuario)
      } catch (error) {
        processStatus = false
        log.info(`Error - ${error}`)
      }
      break

    case 2:
      console.log('----------registrando profesor--------------')
      try {
        asignacion = await db.agregarRolProfesor(idUsuario)
      } catch (error) {
        processStatus = false
        log.info(`Error - ${error}`)
      }
      break

    case 3:
      console.log('----------registrando alumno--------------')
      try {
        asignacion = await db.agregarRolAlumno(idUsuario, periodoActual) // actualizar contraseña,
      } catch (error) {
        processStatus = false
        log.info(`Error - ${error}`)
      }
      break

    case 4:
      console.log('----------registrando padre--------------')
      try {
        asignacion = await db.agregarRolPadre(idUsuario)
      } catch (error) {
        processStatus = false
        log.info(`Error - ${error}`)
      }
      break
  }
  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
  console.log({
    asignacion,
    processStatus
  })
  console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
  if (asignacion.idRol && processStatus) {
    return {
      status: true,
      idRol: asignacion.idRol,
      message: 'Rol asignado correctamente.'
    }
  } else {
    return {
      status: false,
      message: 'No se pudo asignar el rol.'
    }
  }
}
