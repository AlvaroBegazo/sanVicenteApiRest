'use strict'

const { default: validator } = require('validator')
const helper = require('./helpers')
const { logger } = require('../../utils/configuracionWinston')

module.exports = async (db, req, res, periodoActual) => {
  const tipoRol = req.params.tipoRol
  const idUsuario = req.params.idUsuario
  let parseRol
  switch (parseInt(tipoRol)) {
    case 1: parseRol = 'Administrativo'
      break
    case 2: parseRol = 'Profesor'
      break
    case 3: parseRol = 'Alumno'
      break
    case 4: parseRol = 'Padre'
      break
  }
  /**
   * @doc - Roles
   * 1: administrativo
   * 2: profesor
   * 3: estudiante
   * 4: padre
   */
  if (validateData(idUsuario, tipoRol)) {
    // solicitar lista de roles:
    let roles = {}
    let processStatus = true
    try {
      roles = await helper.solicitarRoles(db, idUsuario)
      console.log({
        lista: roles.lista
      })
    } catch (error) {
      processStatus = false
      console.log(`solicitarRoles-ERROR: ${error}`)
    }

    if (roles.status && processStatus) {
      // verificar si ya tiene el rol que se le quiere asignar:
      const permiteRol = helper.informarRolExistente(tipoRol, roles.lista.roles)

      if (permiteRol) {
        console.log('se permite registro de rol')
        // si se le permite, entonces realizar su registro:
        let processStatus = true
        let asignarRol = {}
        try {
          asignarRol = await helper.registrarRol(db, idUsuario, tipoRol, periodoActual)
          console.log('proceso de asignarRol - sin-error')
          // console.log(`registrarRol - sin-error ----rol ${tipoRol} asignado a ${idUsuario} correctamente`)
        } catch (error) {
          processStatus = false
          console.log(`Error-asignar rol: ${error}`)
        }
        console.log('antes de la verificaion')
        console.log(asignarRol)

        if (asignarRol.status && processStatus) {
          res.status(200).send({
            status: true,
            idRol: asignarRol.idRol,
            message: `Se asignó el rol ${parseRol} al usuario ${idUsuario}`
          })
        } else {
          res.status(500).send({
            status: false,
            message: 'No se pudo asignar el rol.'
          })
        }
      } else {
        res.status(400).send({
          status: false,
          message: `El usuario ya cuenta con rol de ${parseRol}`
        })
      }
    } else {
      res.status(400).send({
        status: false,
        message: 'Hubo un error al verificar los roles del usuario.'
      })
    }
  } else {
    res.status(400).send({
      status: false,
      message: 'Datos incompletos.'
    })
  }
}

function validateData (idUsuario, tipoRol) {
  logger.info('Datos Enviados en el Request')
  console.log({ idUsuario, tipoRol })
  const validateIdUsuario = !validator.isEmpty(idUsuario)
  const validateTipoRol = !validator.isEmpty(tipoRol)
  return validateIdUsuario && validateTipoRol
}
