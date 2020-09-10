const express = require('express')
const consign = require('consign')
const app = express()

const Database = require('../../DataBase/index')
// const Database1 = require('../../Services/autenticacion')
const db = new Database(require('../../keys').mysql)

// const serviceFolder = '../../Services/administracion'
const serviceFolder = '/Services/autenticacion'

consign()
  .include(`${serviceFolder}/lib/middlewares.js`) // agregar configuraciones
  .then(`${serviceFolder}/routes`) // rutas
  .include(`${serviceFolder}/lib/boot.js`) // inicialización
  .into(app, db) // enviar 'app' a los archivos
