'use strict'

const HttpHash = require('http-hash')
const Db = require('../../DataBase/index')
const Docente = require('../controllers/docente/index')
const closePoolDb = require('../controllers/docente/closePoolDb')
const { logger } = require('../utils/configuracionWinston')
// const config = require('../config/index')

// fuuturos controllers

// const env = process.env.NODE_ENV || 'production'
const configDb = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'practica',
  password: process.env.MYSQL_PASSWORD || 'practica',
  database: process.env.MYSQL_DATABASE || 'colegio_san_vicente'
}

const defaults = {
  host: 'http://digitalcole.net.pe',
  port: '2082',
  user: 'root',
  password: 'mfgm*dc*2021',
  database: 'colegio_san_vicente'
}

const db = new Db(configDb)
const hash = HttpHash()
const uri = '/docente'

// const queryPeriodo = 'CALL solicitarPeriodoActual()' // que retorno el idPeriodo actual
// let periodoActual = {}

// db.mysqlInstance.query(queryPeriodo, [], (err, rows, fields) => {
//   if (err) {
//     logger.error(`Error: No se obtuvo el periodo actual ${err}`)
//     // console.log('Error: No se obtuvo el periodo actual', err)
//   }
//   if (!rows) { //row
//     logger.error('No se cargo el periodo actual')
//   } else {
//     console.log('-----------------------------------')
//     periodoActual.id = rows[0][0].idPeriodo
//     periodoActual.val = rows[0][0].año
//     console.log(`El periodo Actual es:  ${periodoActual}`)
//     console.log('-----------------------------------')
//     //periodoActual = rows.periodoActual
//   }
// })

// el front mandara el id del usuario(profe) con el cual se mostrara los cursos que lleva actualmente
hash.set(`GET ${uri}/cursos/:id`, async function (req, res, params) {
  logger.info('Inciando GET ${uri}/cursos/:id')
  if (db) {
    // const data = await json(req)
    console.log('El id  enviado es : ', data.id)
    Docente.listarAulas(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
    // logger.warning(`No hay Base de datos [Inciando GET ${uri}/cursos/:id]`)
    logger.info(`No hay Base de datos [Inciando GET ${uri}/cursos/:id]`)
  }
  logger.info('Terminando GET ${uri}/cursos/:id')
})

hash.set(`GET ${uri}/listaraulas`, async function (req, res, params) {
  logger.info('Inciando GET ${uri}/listaraulas')
  if (db) {
    // const data = await json(req)
    // console.log( 'El id  enviado es : ' ,data.id);
    Docente.listarAulas(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
    logger.info(`No hay Base de datos [Inciando GET ${uri}/cursos/:id]`)
    // logger.warning(`No hay Base de datos [Inciando GET ${uri}/cursos/:id]`)
  }
  logger.info('Terminando GET ${uri}/cursos/:id')
})

hash.set('POST /disconnect/database', async function (req, res, params) {
  logger.info('Iniciando POST /disconnect/database [Services/docente/]')
  if (db) {
    closePoolDb(db, req, res, params)
  } else {
    logger.war('No Database')
    logger.info('Final POST /disconnect/database [Services/docente/]')
    send(req, 500, {
      message: 'No Database'
    })
  }
})

module.exports = async function main (req, res) {
  const { method, url } = req

  // el match vera si hay alguna ruta con el patron definido
  const match = hash.get(`${method.toUpperCase()} ${url}`)

  // si hay alguna ruta, se retorna un objeto sino null
  if (match.handler) {
    try {
      // ejecutar handler:
      await match.handler(req, res, match.params)
    } catch (error) {
      res.status(500).send({ error: `Error-server: ${error.message}` }),
      logger.error(`Error-server: ${error.message}`)
    }
  } else {
    res.status(404).send({ error: 'Ruta no encontrada' })
    logger.error('Ruta no encontrada')
  }
}
