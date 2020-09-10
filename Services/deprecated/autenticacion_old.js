'use strict'

const keys = require('../../keys')

const micro_cors = require('micro-cors')
const cors = micro_cors({
  allowHeaders: ['X-Requested-With', 'Access-Control-Allow-Origin', 'X-HTTP-Method-Override', 'Content-Type', 'Authorization', 'Accept'],
  origin: '*'
})
const HttpHash = require('http-hash')
const Db = require('../../DataBase/index')
const closePoolDb = require('./controllers/administracion/closePoolDb')
const { logger } = require('../utils/configuracionWinston')

// const env = process.env.NODE_ENV || 'production'
const db = new Db(keys.mysql)
const hash = HttpHash()
const uri = '/autenticacion'

hash.set(`POST ${uri}/admin`, async function authentication (req, res, params) {
  logger.info('Iniciando POST ${uri}/admin [Services/autenticacion/]')
  let credentials
  try {
    credentials = await json(req) // correo, contrasenia
  } catch (error) {
    console.log(error)
  }
  /* res.status(200).send({
    status: true,
    message: 'Bienvenido!!',
    //token: auth.token,
    //persona: auth.persona
  }) */
  // const credentials = await json(req) // correo, contrasenia
  console.log(credentials)
  let auth = {}
  try {
    if (credentials.gettoken) {
      auth = await db.loginMaster(credentials.email, credentials.password, credentials.gettoken)
    } else {
      auth = await db.loginMaster(credentials.email, credentials.password)
    }
  } catch (error) {
    auth.status = false
    logger.error('Error POST ${uri}/admin [Services/autenticacion/]')
  }
  if (auth.status) {
    logger.info('Final POST ${uri}/admin [Services/autenticacion/]')
    res.status(200).send({
      status: true,
      message: 'Bienvenido!!',
      token: auth.token,
      persona: auth.persona
    })
  } else {
    logger.warn('Usuario no identificado.')
    logger.info('Final POST ${uri}/admin [Services/autenticacion/]')
    res.status(400).send({
      status: false,
      message: 'Usuario no identificado.'
    })
  }
})

hash.set(`POST ${uri}/user`, async function authentication (req, res, params) {
  logger.info('Iniciando POST ${uri}/user [Services/autenticacion/]')
  const credentials = await json(req) // correo, contrasenia
  // console.log(credentials)
  let auth = {}
  try {
    if (credentials.gettoken) {
      auth = await db.loginUser(credentials.usuario, credentials.password, credentials.gettoken)
    } else {
      auth = await db.loginUser(credentials.usuario, credentials.password)
    }
  } catch (error) {
    auth.status = false
    logger.error('Error POST ${uri}/user [Services/autenticacion/]')
  }
  if (auth.status) {
    logger.info('Final POST ${uri}/user [Services/autenticacion/]')
    res.status(200).send({
      status: true,
      message: 'Bienvenido!!',
      token: auth.token,
      persona: auth.persona
    })
  } else {
    logger.war('Usuario no identificado.')
    logger.info('Final POST ${uri}/user [Services/autenticacion/]')
    res.status(400).send({
      status: false,
      message: 'Usuario no identificado.'
    })
  }
})

hash.set('POST /disconnect/database', async function (req, res, params) {
  logger.info('Iniciando POST /disconnect/database [Services/autenticacion/]')
  if (db) {
    closePoolDb(db, req, res, params)
  } else {
    logger.war('No Database')
    logger.info('Final POST /disconnect/database [Services/autenticacion/]')
    send(req, 500, {
      message: 'No Database'
    })
  }
})

async function main (req, res) {
  let { method, url } = req
  /*
  let credentials
  try {
    credentials = await json(req) // correo, contrasenia
    console.log(credentials)
  } catch (error) {
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    console.log(error)
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
  }
  */

  console.log({ method, url })
  if (method === 'OPTIONS') {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    console.log(req.headers)
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    method = Object.values(req.headers)[3]
  } else {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    console.log(req.headers)
  }
  // el match vera si hay alguna ruta con el patron definido
  const match = hash.get(`${method.toUpperCase()} ${url}`)
  if (match.handler) {
    try {
      // ejecutar handler:
      await match.handler(req, res, match.params)
    } catch (error) {
      console.log(error)
      logger.error('Error match.handler(req, res, match.params) [Services/autenticacion/]')
      logger.error(`Error-server: ${error.message}`)
      res.status(500).send({ error: `Error-server: ${error.message}` })
    }
  } else {
    logger.warn('Ruta no encontrada')
    res.status(404).send({ error: 'Ruta no encontrada' })
  }
}
module.exports = cors(main)

/*
const keys = require('../keys')

const micro_cors = require('micro-cors')
const cors = micro_cors({
  allowHeaders: ['X-Requested-With','Access-Control-Allow-Origin','X-HTTP-Method-Override','Content-Type','Authorization','Accept'],
  origin: keys.host.frontend
})
const HttpHash = require('http-hash')
const Db = require('../DataBase/index')
const closePoolDb = require('./controllers/administracion/closePoolDb')
const { logger } = require('./utils/configuracionWinston')

// const env = process.env.NODE_ENV || 'production'
let db = new Db(keys.mysql)
const hash = HttpHash()
const uri = '/autenticacion'

hash.set(`POST ${uri}/admin`, async function authenticationAdmin (req, res, params) {
  logger.info('Iniciando POST ${uri}/admin [Services/autenticacion/]')
  const credentials = await json(req) // correo, contrasenia
  console.log(credentials)
  let auth = {}
  try {
    if (credentials.gettoken) {
      auth = await db.loginMaster(credentials.email, credentials.password, credentials.gettoken)
    } else {
      auth = await db.loginMaster(credentials.email, credentials.password)
    }
  } catch (error) {
    auth.status = false
    logger.error('Error POST ${uri}/admin [Services/autenticacion/]')
  }
  if (auth.status) {
    logger.info('Final POST ${uri}/admin [Services/autenticacion/]')
    res.status(200).send({
      status: true,
      message: 'Bienvenido!!',
      token: auth.token,
      persona: auth.persona
    })
  } else {
    logger.warn('Usuario no identificado.')
    logger.info('Final POST ${uri}/admin [Services/autenticacion/]')
    res.status(400).send({
      status: false,
      message: 'Usuario no identificado.'
    })
  }
})

hash.set(`POST ${uri}/user`, async function authentication (req, res, params) {
  logger.info('Iniciando POST ${uri}/user [Services/autenticacion/]')
  const credentials = await json(req) // correo, contrasenia
  console.log(credentials)
  let auth = {}
  try {
    if (credentials.gettoken) {
      auth = await db.loginUser(credentials.usuario, credentials.password, credentials.gettoken)
    } else {
      auth = await db.loginUser(credentials.usuario, credentials.password)
    }
  } catch (error) {
    auth.status = false
    logger.error('Error POST ${uri}/user [Services/autenticacion/]')
  }
  if (auth.status) {
    logger.info('Final POST ${uri}/user [Services/autenticacion/]')
    res.status(200).send({
      status: true,
      message: 'Bienvenido!!',
      token: auth.token,
      persona: auth.persona
    })
  } else {
    logger.war('Usuario no identificado.')
    logger.info('Final POST ${uri}/user [Services/autenticacion/]')
    res.status(400).send({
      status: false,
      message: 'Usuario no identificado.'
    })
  }
})

hash.set('POST /disconnect/database', async function(req, res, params) {
  logger.info('Iniciando POST /disconnect/database [Services/autenticacion/]')
  if (db) {
    closePoolDb(db, req, res, params)
  } else {
    logger.war('No Database')
    logger.info('Final POST /disconnect/database [Services/autenticacion/]')
    send(req, 500, {
      message: 'No Database'
    })
  }
})

async function main (req, res) {
  let { method, url } = req
  console.log({method, url})
  if (method === 'OPTIONS') {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    console.log(req.headers)
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    console.log(Object.values(req.headers))
    method = Object.values(req.headers)[3]
  }
  console.log({method, url})

  // el match vera si hay alguna ruta con el patron definido
  const match = hash.get(`${method.toUpperCase()} ${url}`)
  // si hay alguna ruta, se retorna un objeto sino null
  console.log("Antes del cors");
  console.log(match.handler)
  console.log(match)
  if (match.handler) {
    try {
      // ejecutar handler:
      // console.log(match.handler(req, res, match.params));
      await handler(req, res, match.params)
    } catch (error) {
      logger.error('Error match.handler(req, res, match.params) [Services/autenticacion/]')
      logger.error(`Error-server: ${error.message}`)
      res.status(500).send({ error: `Error-server: ${error.message}` })
    }
  } else {
    logger.warn('Ruta no encontrada')
    res.status(404).send({ error: 'Ruta no encontrada'})
  }
}

module.exports = cors(main)

*/
