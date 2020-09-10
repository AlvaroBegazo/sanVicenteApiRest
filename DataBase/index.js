'use strict'

const mysql = require('mysql')
var Promise = require('bluebird')
const { promisify } = require('util')
const keys = require('../keys')
// const uuid = require('uuid-base62') // agregar

// controllers
const adminController = require('./controllers/administrativo/index')
const loginController = require('./controllers/autenticacion/index')
// const docenteController = require('./controllers/docente/index')

const { logger } = require('../Services/utils/configuracionWinston')

const defaults = {
  host: 'localhost',
  user: 'practica',
  password: 'practica',
  database: 'colegio_san_vicente'
}

const defaults2 = {
  host: 'http://digitalcole.net.pe',
  port: '2082',
  user: 'root',
  password: 'mfgm*dc*2021'
}

class Db {
  constructor(options) {
    console.log('-----------------------')
    console.log(`Options : ${options}`)
    console.log(options)
    // console.log(options)
    console.log('----BD-constructor.....')
    options = {}

    // this.host = keys.mysql.host || defaults.host
    // this.user = keys.mysql.user || defaults.user
    // this.password = keys.mysql.password || defaults.password
    // this.database = keys.mysql.database || defaults.database

    // this.host = options.host || defaults.host
    // this.user = options.user || defaults.user
    // this.password = options.password || defaults.password
    // this.database = options.database || defaults.database

    this.host = 'brq2obab09sofnhxd4cf-mysql.services.clever-cloud.com' || defaults.host
    this.user = 'uefb61qu4c65prv0' || defaults.user
    this.password = '7pOlnLhXibQn6okGwu69' || defaults.password
    this.database = 'brq2obab09sofnhxd4cf' || defaults.database
    // this.port = '3306' || defaults.port

    this.setup
    if (!options.setup) {
      logger.info('NO-setup')
      this.setup = true
    } else {
      logger.info('Setup-Existe')
      this.setup = options.setup
    }
    this.connected = false
    // this.mysqlInstance = null
    this.mysqlInstance = mysql.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      // port : this.port
    })
    // conection:
    this.mysqlInstance.getConnection((err, connection) => {
      if (err) {
        logger.info('error-DB-Connect [Index(database)]')
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          logger.warn('Database connecion se cerró [Index(database)]')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          logger.warn('Database tiene varias conexiones [Index(database)]')
        }
        if (err.code === 'ECONNREFUSED') {
          logger.warn('Database conexion rechazada [Index(database)]')
        }
        logger.error('BD-Error-Connected [Index(database)]')
        return Promise.reject(new Error({
          message: 'BD-Error-Connected',
          status: 500
        }))
      }

      // empezar conexion
      if (connection) {
        connection.release()
        this.connected = true
        logger.info('BD-Connect')
        return Promise.resolve({
          message: 'BD-Connected',
          status: 200
        })
      }
    })
    logger.info('BD-Contructor')
    // configurar peticiones como promesas
    this.mysqlInstance.query = promisify(this.mysqlInstance.query)
  }

  /*
  connect () {
    // conection:
    this.mysqlInstance.getConnection((err, connection) => {
      if (err) {
        console.log('error-DB-Connect')
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connecion se cerró')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database tiene varias conexiones')
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database conexion rechazada')
        }
        return Promise.reject({
          message: 'BD-Error-Connected',
          status: 500
        })
      }

      // empezar conexion
      if (connection) {
        connection.release()
        this.connected = true
        console.log('BD-Connect')
        return Promise.resolve({
          message: 'BD-Connected',
          status: 200
        })
      }
    })
    console.log('BD-Contructor')
    // configurar peticiones como promesas
    this.mysqlInstance.query = promisify(this.mysqlInstance.query)
  }
  */

  _statusDB() {
    if (!this.connected) {
      logger.error('BD no conectada')
      return {
        message: 'BD no conectada',
        status: false
      }
    }
  }

  /*
  async connect (callback) {
    console.log('proceso de conexion')
    try {
      await this.mysqlInstance.getConnection((err, connection) => {
        if (err) {
          console.log('error-DB-Connect')
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connecion se cerró')
          }
          if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database tiene varias conexiones')
          }
          if (err.code === 'ECONNREFUSED') {
            console.error('Database conexion rechazada')
          }
          return Promise.resolve({
            message: 'BD-Error-Connected',
            status: 500
          })
        }
        console.log('conexion-await-after')
        // empezar conexion
        if (connection) {
          connection.release()
          this.connected = true
          console.log('BD-Connect')
          return Promise.resolve({
            message: 'BD-Connected',
            status: 200
          })
        }
      })
    } catch (error) {
      console.log('**BD--ERROR**', error)
    }

  }
  */
  async disconnect() {
    logger.info('Inicio de disconnect [index(database)]')
    if (!this.connected) {
      // console.log('no esta conectado')
      // return Promise.reject(new Error('No connected'))
      logger.warn('BD no conectada')
      return {
        message: 'BD no conectada',
        status: 'error'
      }
    }

    await this.mysqlInstance.end((err) => {
      console.log('mysql-END...')
      if (err) {
        // return Promise.reject(new Error('Error on disconnect'))
        logger.warn('Error al desconectar BD')
        return {
          message: 'Error al desconectar BD',
          status: 'error'
        }
      }
      this.connected = false
      // return Promise.resolve(this.mysqlInstance)
      logger.info('BD desconectada correctamente')
      return {
        message: 'BD desconectada correctamente',
        status: 'success'
      }
    })
  }

  /** * REGISTROS ***/
  async registrarPersona(persona) {
    this._statusDB()
    return adminController.registrarPersona(this.mysqlInstance, persona)
  }

  async registrarUsuario(newUsuario) {
    this._statusDB()
    return adminController.registrarUsuario(this.mysqlInstance, newUsuario)
  }

  async registrarAula(newAula) {
    this._statusDB()
    return adminController.registrarAula(this.mysqlInstance, newAula)
  }

  // registrar matricula
  async matricularPeriodo(objMatricula) {
    this._statusDB()
    return adminController.matricularPeriodo(this.mysqlInstance, objMatricula)
  }

  /** * VERIFICACIONES ***/
  async verificarRegistroSistema(dni) {
    this._statusDB()
    return adminController.verificarRegistroSistema(this.mysqlInstance, dni)
  }

  async verificarCorreoUnico(email) {
    this._statusDB()
    return adminController.verificarCorreoUnico(this.mysqlInstance, email)
  }

  /** * ASIGNAR ROLES ***/
  async solicitarRoles(idUsuario) {
    this._statusDB()
    return adminController.solicitarRoles(this.mysqlInstance, idUsuario)
  }

  async agregarRolAdministrativo(idUsuario) {
    this._statusDB()
    return adminController.agregarRolAdministrativo(this.mysqlInstance, idUsuario)
  }

  async agregarRolProfesor(idUsuario) {
    this._statusDB()
    return adminController.agregarRolProfesor(this.mysqlInstance, idUsuario)
  }

  async agregarRolAlumno(idUsuario, periodoActual) {
    this._statusDB()
    return adminController.agregarRolAlumno(this.mysqlInstance, idUsuario, periodoActual)
  }

  async agregarRolPadre(idUsuario) {
    this._statusDB()
    return adminController.agregarRolPadre(this.mysqlInstance, idUsuario)
  }

  /** * LOGIN ***/
  loginMaster(correo, contrasenia, gettoken) {
    console.log('.. loginMaster -> index-BD')
    this._statusDB()
    return loginController.loginMaster(this.mysqlInstance, correo, contrasenia, gettoken)
  }

  loginUser(usuario, contrasenia, gettoken) {
    return loginController.loginUser(this.mysqlInstance, usuario, contrasenia, gettoken)
  }

  /** * LISTADOS ***/
  listarPersonas() {
    this._statusDB()
    return adminController.listarPersonas(this.mysqlInstance)
  }

  listarApoderados() {
    return adminController.listarApoderados(this.mysqlInstance)
  }

  async listarAulas() {
    this._statusDB()
    return adminController.listarAulas(this.mysqlInstance)
  }

  /** * DETALLES ***/
  detallePersona(dni) {
    console.log('en detalle persona - BD')
    this._statusDB()
    return adminController.detallePersona(this.mysqlInstance, dni)
  }
}
module.exports = Db
