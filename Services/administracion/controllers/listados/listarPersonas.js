'use strict'

const { logger } = require('../../../utils/configuracionWinston')

module.exports = async (db, req, res, params) => {
  logger.info('Iniciando ListarPersona [Controller - administracion]')
  let listarPersonas = {}
  let processStatus = true
  try {
    listarPersonas = await db.listarPersonas()
  } catch (error) {
    processStatus = false
    logger.error(`ERROR: ${error}`)
  }
  if (listarPersonas.status > 0 && processStatus) {
    res.status(200).send({
      listarPersonas: listarPersonas.listado,
      status: true,
      message: 'Lista cargada correctamente.'
    })
    logger.info('Lista cargada correctamente.')
  } else if (!listarPersonas.status && processStatus) {
    res.status(404).send({
      status: false,
      message: 'No hay personas registradas.'
    })
    logger.info('Lista cargada correctamente.')
  } else {
    res.status(500).send({
      status: false,
      message: 'No se pudo carga la lista'
    })
    logger.warn('No se pudo carga la lista')
  }
}
