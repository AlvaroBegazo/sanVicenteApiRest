'use strict'

const { logger } = require('../../../Services/utils/configuracionWinston')

module.exports = {

  /** * LISTADOS ***/

  listarAulas: async (mysqlInstance) => {
    logger.info('Iniciando listarAulas Database/Controller/Docente/index.js')
    // logger.info(`Iniciando listarAulas ${fileDir}`)
    const query = 'CALL listaAulas()'
    const process = await mysqlInstance.query(query, [])

    if (process[0].length > 0) {
      // logger.info(`Final listarAulas ${fileDir}`)
      logger.info('Final listarAulas - if process[0]')
      return {
        status: true,
        statusCode: 200,
        listaAulas: process[0]
      }
    } else {
      // logger.warning('No se pudo obtener la lista de aulas')
      logger.info('No se pudo obtener la lista de aulas')
      // logger.info(`Iniciando listaAulas ${fileDir}`)
      return {
        status: false,
        statusCode: 500,
        message: 'No se pudo obtener la lista de aulas'
      }
    }
  }

}
