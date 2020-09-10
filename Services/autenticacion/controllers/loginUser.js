'use strict'

const { logger } = require('../../utils/configuracionWinston')

const path = require('path')
const dirPath = path.join(__filename)
const uri = 'autenticacion'

module.exports = async (db, req, res) => {
  logger.info('Iniciando loginUser ' + dirPath)
  let credentials
  try {
    credentials = req.body // correo, contrasenia
    console.log('credenciales: ', { credentials })
  } catch (error) {
    console.log(`ERROR ----->> ${error}`)
  }
  let auth = {}
  try {
    if (credentials.gettoken) {
      auth = await db.loginUser(credentials.usuario, credentials.password, credentials.gettoken)
    } else {
      auth = await db.loginUser(credentials.usuario, credentials.password)
    }
  } catch (error) {
    auth.status = false
    logger.error(`Error POST ${uri}/user [Services/autenticacion/]`)
  }
  if (auth.status) {
    logger.info(`Final POST ${uri}/user [Services/autenticacion/]`)
    res.status(200).send({
      status: true,
      message: 'Bienvenido!!',
      token: auth.token,
      persona: auth.persona
    })
  } else {
    logger.war('Usuario no identificado.')
    logger.info(`Final POST ${uri}/user [Services/autenticacion/]`)
    res.status(400).send({
      status: false,
      message: 'Usuario no identificado.'
    })
  }
}
