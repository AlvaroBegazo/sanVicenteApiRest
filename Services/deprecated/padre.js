'use strict'

const HttpHash = require('http-hash')
const Db = require('sanVicente_bd/src')
const config = require('../config/index')
const { ejemplo, closePoolDb } = require('../controllers/estudiante')

// controllers
const env = process.env.NODE_ENV || 'production'
const configDb = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}
// let db = new db(config.db)
const db = new Db(configDb)
// console.log('API - baseDatos->', db)
const hash = HttpHash()

/**
 * Funciones relacionada solo con los alumnos
 */

const uri = '/padre'
// const padreServiceController = require('./controllers/')

// rutas
hash.set(`GET ${uri}/datosPersonales/:idPadre`, async function (req, res, params) {
  _privateFunction()
})

hash.set('POST /disconnect/database', function (req, res, params) {
  if (db) {
    closePoolDb(db, req, res, params)
  } else {
    send(req, 500, {
      message: 'No Database'
    })
  }
})

function _privateFunction (callback, req, res, params, periodoActual) {
  if (db.connected) {
    console.log(db.connected)
    callback(db, req, res, params, periodoActual)
  } else {
    logger.warn('No hay Base de datos [/Services/Administracion]')
    res.status(500).send({
      message: 'Not Database'
    })
  }
}

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
      res.status(500).send({ error: `Error-server: ${error.message}` })
    }
  } else {
    res.status(404).send({ error: 'Ruta no encontrada' })
  }
}
