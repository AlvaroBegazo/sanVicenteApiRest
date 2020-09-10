'use strict'

const HttpHash = require('http-hash')
const Db = require('sanVicente_bd/src')
const config = require('../config/index')
const { ejemplo, closePoolDb } = require('../controllers/estudiante')

// controllers
const { registerStudent, showStudent, sendSingleHomework, showCourse } = require('../controllers/student')

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

const uri = '/estudiante'

// rutas
hash.set(`POST ${uri}/:id`, function (req, res, params) {
  ejemplo(db, req, res, params)
})

hash.set(`POST ${uri}/register`, async function (req, res, params) {
  if (db) {
    registerStudent(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
  }
})

hash.set(`POST ${uri}/subscribeOnCourse/:idCourse`, async function (req, res, params) {

})

hash.set(`GET ${uri}/getStudent/:codeStudent`, function (req, res, params) {
  if (db) {
    showStudent(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
  }
})

hash.set(`GET ${uri}/getCourse/:codeCourse`, function (req, res, params) {
  if (db) {
    showCourse(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
  }
})

hash.set(`POST ${uri}/sendHomework`, async function (req, res, params) {
  console.log('enviando tarea')
  if (db) {
    sendSingleHomework(db, req, res, params)
  } else {
    res.status(500).send({
      message: 'No hay Base de datos'
    })
  }
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
