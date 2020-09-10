'use strict'

const { logger } = require('../../utils/configuracionWinston')
const closePoolDb = require('./closePoolDb')

module.exports = async (db, req, res, params) => {
  logger.info('Iniciando POST /disconnect/database [Services/autenticacion/]')
  if (db) {
    closePoolDb(db, req, res, params)
  } else {
    logger.war('No Database')
    logger.info('Final POST /disconnect/database [Services/autenticacion/]')
    res.status(500).send({
      message: 'No Database'
    })
  }
}
