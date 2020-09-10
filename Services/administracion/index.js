const express = require('express')
const consign = require('consign')
const app = express()
const Database = require('../../DataBase/index')
const db = new Database(require('../../keys').mysql)
const serviceFolder = '/Services/administracion'
const { logger } = require('../utils/configuracionWinston')

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

consign()
  .include(`${serviceFolder}/lib/middlewares.js`) // agregar configuraciones
  .then(`${serviceFolder}/routes`) // rutas
  .include(`${serviceFolder}/lib/boot.js`) // inicialización
  .into(app, db, periodoActual) // enviar 'app' a los archivos
