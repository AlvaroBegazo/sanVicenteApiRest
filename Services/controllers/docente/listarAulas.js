'use strict'

const { logger } = require('../../utils/configuracionWinston')

module.exports = async (db, req, res, params) => {
  logger.info('Iniciando ListarAulas [Controller - docente]')
  let listarAulas = {}
  let processStatus = true
  console.log('ANtes del try')
  try {
    listarAulas = await db.listarAulas()
  } catch (error) {
    processStatus = false
    logger.error(`ERROR: ${error}`)
  }
  console.log('EL listarAulas es')
  console.log(listarAulas)
  console.log('-------')
  console.log(Object.keys(listarAulas.listaAulas))
  console.log('-------')
  console.log(Object.keys(listarAulas.listaAulas[0]))
  console.log('-------')
  console.log(Object.keys(listarAulas.listaAulas[0]).length)
  console.log('-------')
  console.log(processStatus)
  console.log('-------')
  // if (listarAulas.listarAulas[0].length > 0 && processStatus) {
  if (Object.keys(listarAulas.listaAulas).length < 0 && processStatus) {
    res.status(200).send({
      listarAulas,
      status: true,
      message: 'Lista de cursos cargada correctamente.'
    })
    logger.info('Lista de cursos cargada correctamente.')
  } else {
    res.status(500).send({
      status: false,
      message: 'No se pudo carga la lista de cursos'
    })
    logger.warning('No se pudo carga la lista de cursos')
    // logger.info('No se pudo carga la lista de cursos')
  }
}
