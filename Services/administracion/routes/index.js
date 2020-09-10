'use strict'

const Administrativo = require('../controllers/index')
const { logger } = require('../../utils/configuracionWinston')

const uri = '/administracion' 
module.exports = (app, db, periodoActual) => {
  app.post(`${uri}/registrar/persona`, (req, res) => {
    const tarea = `POST ${uri}/registrar/persona`
    _privateFunction(Administrativo.registrarPersona, req, res, tarea, db, periodoActual)
  })

  app.post(`${uri}/registrar/aula`, (req, res) => {
    const tarea = `POST ${uri}/registrar/aula`
    _privateFunction(Administrativo.registrarAula, req, res, tarea, db, periodoActual)
  })

  app.post(`${uri}/asignar-rol/:tipoRol/:idUsuario`, (req, res) => {
    const tarea = `POST ${uri}/asignar-rol/:tipoRol/:idUsuario`
    _privateFunction(Administrativo.asignarRol, req, res, tarea, db, periodoActual)
  })

  app.post(`${uri}/quitar-rol/:tipoRol`, (req, res) => {
    const tarea = `POST ${uri}/quitar-rol/:tipoRol`
    _privateFunction(Administrativo.asignarRol, req, res, tarea, db, periodoActual)
  })

  app.post(`${uri}/matricular`, (req, res) => {
    const tarea = `POST ${uri}/quitar-rol/:tipoRol`
    _privateFunction(Administrativo.matricular, req, res, tarea, db, periodoActual)
  })



  // app.post(`${uri}/listar-roles/usuario/:dni`, (req, res) => {
  //   const tarea = `POST ${uri}/listar-roles/usuario/:dni`
  //   _privateFunction(Administrativo.asignarRol, req, res, tarea, db, periodoActual)
  // })


  // listados
  app.get(`${uri}/listar-personas/activas`, (req, res) => {
    const tarea = `GET ${uri}/listar-personas/activas`
    _privateFunction(Administrativo.listarPersonas, req, res, tarea, db)
  })

  app.get(`${uri}/detalle-persona/:dni`, (req, res) => {
    const tarea = `POST ${uri}/registrar/persona`
    _privateFunction(Administrativo.detallePersona, req, res, tarea, db)
  })

  app.get(`${uri}/listar-aulas/`, (req, res) => {
    const tarea = `GET ${uri}/listar-aulas`
    _privateFunction(Administrativo.listarAulas, req, res, tarea, db)
  })

  app.get(`${uri}/listar-roles/:dni`, (req, res) => { // recordar que en la tabla el campo de usuario es el mismo dni
    const tarea = `GET ${uri}//listar-roles/`
    _privateFunction(Administrativo.listarRoles, req, res, tarea, db)
  })

  app.get(`${uri}/listar-apoderados`, (req, res) => { // recordar que en la tabla el campo de usuario es el mismo dni
    const tarea = `GET ${uri}/listar-apoderados`
    _privateFunction(Administrativo.listarApoderados, req, res, tarea, db)
  })

}

function _privateFunction (callback, req, res, tarea, db, periodoActual) {
  logger.info(`Iniciando ${tarea}`)
  if (db.connected) {
    console.log('db-conectada')
    console.log(db.connected)
    if (periodoActual) {
      console.log({ periodoActual })
      callback(db, req, res, periodoActual)
    } else {
      console.log('no hay periodo actual ')
      callback(db, req, res)
    }
  } else {
    logger.warn('No hay Base de datos [/Services/Administracion]')
    res.status(500).send({
      message: 'Not Database'
    })
  }
  logger.info(`Finalizando ${tarea} CALLBACk`)
}
