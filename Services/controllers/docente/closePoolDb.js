
const { logger } = require('../../utils/configuracionWinston')

module.exports = async (db, req, res, params) => {
  await db.disconnect()
  // console.log('BD-Desconectada...')
  logger.info('BD-Desconectada... [closePoolDb]')
  res.status(200).send({
    message: 'BD-Disconnect'
  })
  logger.info('BD-Disconnect')
}
