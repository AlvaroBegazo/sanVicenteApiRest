const express = require('express')
const consign = require('consign')
const app = express()

const serviceFolder = ''
consign()
  .include(`${serviceFolder}/lib/middlewares.js`) // agregar configuraciones
  .then(`${serviceFolder}/routes`) // rutas
  .include(`${serviceFolder}/lib/boot.js`) // inicialización
  .into(app) // enviar 'app' a los archivos
