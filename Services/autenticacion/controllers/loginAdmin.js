'use strict'

const { logger } = require('../../utils/configuracionWinston')

const path = require('path')
const dirPath = path.join(__filename)

module.exports = async (db, req, res) => {
  logger.info('Iniciando el loginAdmin.js ' + dirPath)

  let credentials = null
  let processStatus = true
  try {
    credentials = await req.body // correo, contrasenia
    console.log('credenciales: ', { credentials })
  } catch (error) {
    processStatus = false
    // logger.error(`ERROR ----->> ${error}`)
    console.log(`ERROR ----->> ${error}`)
  }

  if (credentials && processStatus) {
    let auth = null
    try {
      if (credentials.gettoken) {
        auth = await db.loginMaster(credentials.email, credentials.password, credentials.gettoken)
      } else {
        auth = await db.loginMaster(credentials.email, credentials.password)
      }
      console.log(auth)
    } catch (error) {
      auth = {}
      auth.status = false
      console.log(`..........verificacion 1 -- ${error}`)
    }

    if (auth.status) {
      res.status(200).send({
        status: true,
        message: 'Credenciales verificadas',
        token: auth.token,
        persona: auth.persona
      })
    } else {
      res.status(400).send({
        status: true,
        message: 'Error al consultar en BD'
      })
    }
  } else {
    res.status(500).send({
      status: false,
      message: 'No se pudo verificar las credenciales.'
    })
  }
}
