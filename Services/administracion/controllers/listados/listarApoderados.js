'use strict'

const { logger } = require('../../../utils/configuracionWinston')

module.exports = async (db, req, res) => {
  logger.info('Iniciando ListarApoderados [Controller - administracion]')
  let listarApoderados = {}
  let processStatus = true
  try {
    listarApoderados = await db.listarApoderados()
    // console.log({listarApoderados})
  } catch (error) {
    processStatus = false
    logger.error(`ERROR: ${error}`)
  }
  if (processStatus) {
    if ( Object.keys(listarApoderados).length > 0) {
      res.status(200).send({
        listarApoderados,
        status: true,
        message: 'Lista cargada correctamente.'
      })
      logger.info('Lista cargada correctamente.')
    } else {
      res.status(200).send({
        status: false,
        message: 'No hay apoderados registradas.'
      })
    }
  } else {
    res.status(500).send({
      status: false,
      message: 'No se pudo carga la lista'
    })
    logger.warn('No se pudo carga la lista')
  }
}
