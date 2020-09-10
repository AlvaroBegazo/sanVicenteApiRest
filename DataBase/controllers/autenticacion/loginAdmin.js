// 'use strict'

// const bcrypt = require('bcrypt')
// const { default: validator } = require('validator')
// const bunyan = require('bunyan')
// // const log = bunyan.createLogger({ name: "registrarPersona" })
// const { logger } = require('../../../Services/utils/configuracionWinston')

// module.exports = async (db, data, res, params) => {
//   logger.info('Iniciando [DataBase/controllers/autenticacion/]')
//   if (_validateData(data.correo, data.contrasenia)) {
//     // solicitar contraseña
//     let solicitarContrasenia = {}
//     const query = 'CALL solicitarContrasenia(?)'
//     try {
//       const process
//     } catch (error) {
//       solicitarContrasenia.status = false
//       logger.error(`Error [DataBase/controllers/autenticacion/] : ${error}`)
//     }
//     if (solicitarContrasenia.status) {

//     } else {
//       logger.warn('Datos incompletos o incorrectos.')
//       res.status(404).send({
//         status: false,
//         message: 'Usuario no encontrado'
//       })
//     }
//   } else {
//     logger.warn('Datos incompletos o incorrectos.')
//     res.status(400).send({
//       status: false,
//       message: 'Datos incompletos o incorrectos.'
//     })
//   }
// }

// function _validateData (correo, contrasenia) {
//   logger.info('Iniciando _validarData [DataBase/controllers/autenticacion/]')
//   const valido = true
//   const correoValido = !validator.isEmpty(correo) && validator.isEmail(correo)
//   const contraseniaValida = !validator.isEmpty(contrasenia)
//   logger.info('Final _validarData [DataBase/controllers/autenticacion/]')
//   return correoValido && contraseniaValida
// }
