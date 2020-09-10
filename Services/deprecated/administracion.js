'use strict'

const keys = require('../../keys')
const { send, json } = require('micro')
const HttpHash = require('http-hash')
const Db = require('../../DataBase/index')
const closePoolDb = require('../administracion/controllers/closePoolDb')
const { logger } = require('../utils/configuracionWinston')
const microCors = require('micro-cors')
const cors = microCors({
  allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['X-Requested-With', 'Access-Control-Allow-Origin', 'X-HTTP-Method-Override', 'Content-Type', 'Authorization', 'Accept'],
  origin: '*'
})

// controllers
const matricula = require('./administracion/controllers/administracion/matricula')
const Administrativo = require('../administracion/controllers/index')
const auth = require('../../helpers/autenticacion')

// const db = new Db(configDb)
const db = new Db(keys.mysql)
const hash = HttpHash()
const uri = '/administracion'

const queryPeriodo = 'CALL solicitarPeriodoActual()' // que retorno el idPeriodo actual
const periodoActual = {}

db.mysqlInstance.query(queryPeriodo, [], (err, rows, fields) => {
  if (err) {
    logger.error(`Error: No se obtuvo el periodo actual ${err}`)
    // console.log('Error: No se obtuvo el periodo actual', err)
  }
  if (!rows) { // row
    logger.error('No se cargo el periodo actual')
  } else {
    console.log('-----------------------------------')
    periodoActual.id = rows[0][0].idPeriodo
    periodoActual.val = rows[0][0].año
    console.log(`El periodo Actual es:  ${periodoActual}`)
    console.log('-----------------------------------')
    // periodoActual = rows.periodoActual
  }
})

hash.set(`POST ${uri}/matricula`, async function (req, res, params) {
  logger.info('Inciando POST ${uri}/matricula')
  if (db) {
    const data = await json(req)
    matricula(db, data, res, params, periodoActual)
  } else {
    send(res, 500, {
      message: 'No hay Base de datos'
    })
    logger.warn(`No hay Base de datos [POST ${uri}/matricula]`)
  }
  logger.info('Terminando POST ${uri}/matricula ')
})

hash.set(`POST ${uri}/registrar/persona`, async function (req, res, params) {
  const tarea = `POST ${uri}/registrar/persona`
  _privateFunction(Administrativo.registrarPersona, req, res, params, tarea, periodoActual)
})

hash.set(`POST ${uri}/registrar/aula`, async function (req, res, params) {
  const tarea = `POST ${uri}/registrar/aula`
  _privateFunction(Administrativo.registrarAula, req, res, params, tarea, periodoActual)
})

hash.set(`POST ${uri}/asignar-rol/:tipoRol/:idUsuario`, async function (req, res, params) {
  const tarea = `POST ${uri}/asignar-rol/:tipoRol/:idUsuario`
  _privateFunction(Administrativo.asignarRol, req, res, params, tarea, periodoActual)
})

hash.set(`POST ${uri}/quitar-rol/:tipoRol`, async function (req, res, params) {
  const tarea = `POST ${uri}/quitar-rol/:tipoRol`
  _privateFunction(Administrativo.asignarRol, req, res, params, tarea, periodoActual)
})

hash.set(`POST ${uri}/listar-roles/usuario/:dni`, async function (req, res, params) {
  const tarea = `POST ${uri}/listar-roles/usuario/:dni`
  _privateFunction(Administrativo.asignarRol, req, res, params, tarea, periodoActual)
})

hash.set('POST /disconnect/database', async function (req, res, params) {
  const tarea = 'POST /disconnect/databas'
  _privateFunction(closePoolDb, req, res, params, tarea)
})

// listados
hash.set(`GET ${uri}/listar-personas/activas`, async function (req, res, params) {
  const tarea = `GET ${uri}/listar-personas/activas`
  _privateFunction(Administrativo.listarPersonas, req, res, params, tarea)
})

hash.set(`GET ${uri}/detalle-persona/:dni`, async function (req, res, params) {
  const tarea = `POST ${uri}/registrar/persona`
  _privateFunction(Administrativo.detallePersona, req, res, params, tarea)
})

hash.set(`GET ${uri}/listar-aulas/`, async function (req, res, params) {
  const tarea = `GET ${uri}/listar-aulas`
  _privateFunction(Administrativo.listarAulas, req, res, params, tarea)
})

function _privateFunction (callback, req, res, params, tarea, periodoActual) {
  logger.info(`Iniciando ${tarea}`)
  if (db.connected) {
    console.log(db.connected)
    if (periodoActual) callback(db, req, res, params, periodoActual)
    else callback(db, req, res, params)
  } else {
    logger.warn('No hay Base de datos [/Services/Administracion]')
    send(res, 500, {
      message: 'Not Database'
    })
  }
  logger.info(`Finalizando ${tarea}`)
}

async function main (req, res) {
  let { method, url } = req
  console.log({ method, url })
  if (method === 'OPTIONS') {
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    console.log(req.headers)
    console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    method = Object.values(req.headers)[3]
  }
  // el match vera si hay alguna ruta con el patron definido
  const match = hash.get(`${method.toUpperCase()} ${url}`)

  // si hay alguna ruta, se retorna un objeto sino null
  if (match.handler) {
    try {
      // ejecutar handler:
      await cors(match.handler(req, res, match.params))
    } catch (error) {
      send(res, 500, { error: `Error-server: ${error.message}` }),
      logger.error(`Error-server: ${error.message}`)
    }
  } else {
    send(res, 404, { error: 'Ruta no encontrada' })
    logger.error('Ruta no encontrada')
  }
}
module.exports = cors(main)

/*
servicios
----------
permisos de alumno, padre, profe en duro

listar administracion, profes, alumnos, padres(con hijo)

servicioes

listar notas alumno de periodo anterior (idAlumno, idPeriodo)

listar hijos del padre q no esten matriculados en periodo actual

estados: char: {
  N : no matriculado
  M: matriculado,
  T: termino el colegio
}

paso1
-----

buscar padre:{
  datos
}

si tiene hijos matriculados {
  listarlos,
  2° seleccionar al hijo q desea matricular

  3° seleccionar aula (grado, seccion)

  4° entregar datos a modo de resumen {
    datos-padre
    datos-alumno {
      nombres, apellidos
      email,
    }
    datos-matricula
  }
}

registro aula
seleccion nivel ( 1, 2, 3)
seleccion grado
seleccion de seccion
*/
