'use strict'

const { logger } = require('../../../utils/configuracionWinston')

module.exports = async (db, req, res) => {
  logger.info('Iniciando ListarAula [Controller - administracion]')
  let listarAulas = {}
  let processStatus = true
  try {
    listarAulas = await db.listarAulas()
    // console.log({listarAulas})
  } catch (error) {
    processStatus = false
    logger.error(`ERROR: ${error}`)
  }
  if (processStatus) {
    if (listarAulas.listaAulas.length > 0) {
      res.status(200).send({
        listarAulas,
        status: true,
        message: 'Lista cargada correctamente.'
      })
      logger.info('Lista cargada correctamente.')
    } else {
      res.status(200).send({
        status: false,
        message: 'No hay aulas registradas.'
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
