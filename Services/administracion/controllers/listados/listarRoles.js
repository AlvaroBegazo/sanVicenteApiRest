'use strict'

const helper = require('../helpers')
const { logger } = require('../../../utils/configuracionWinston')

module.exports = async (db, req, res) => {
  logger.info('Iniciando listarRoles [Controller - administracion]')
  // let listarPersonas = {}
  let { dni } = req.params
  console.log(dni)
  let roles = {}

  let processStatus = true
  try {
    // listarPersonas = await db.listarPersonas()
    console.log(roles)
    // roles = await db.solicitarRolesT(dni)
    roles = await helper.solicitarRolesT(db, dni)
    console.log(roles)
  } catch (error) {
    processStatus = false
    // console.log("HUbo un error en el await");
    logger.error(`ERROR: ${error}`)
  }
  if (roles.status > 0 && processStatus) {
    res.status(200).send({
      roles: roles,
      status: true,
      message: 'Consulta de roles correctamente.'
    })
    logger.info('Consulta de roles correctamente.')
  } 
  // else if (!listarPersonas.status && processStatus) {
  //   res.status(404).send({
  //     status: false,
  //     message: 'No hay personas registradas.'
  //   })
  //   logger.info('Lista cargada correctamente.')
  // }
   else {
    res.status(500).send({
      status: false,
      message: 'No se pudo listar roles correctamente.'
    })
    logger.warn('No se pudo listar roles correctamente.')
  }
}
