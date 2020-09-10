'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const secretKey = process.env.SECRET_KEY_AUTH || 'clave-secreta-para-generar-token9009'

module.exports = (req, res) => {
  // Comprobar si llega la autorizacion
  if (!req.headers.authorization) {
    return {
      status: false
    }
    /*
    res.status(400).send({
      message: 'La petición no tiene la cabecera de authorization',
      status: false
    }) */
  } else {
    console.log('parece q hay headers.!!!!')
    // Limpiar token, quitar comillas
    const token = req.headers.authorization.replace(/['"]+/g, '')
    console.log('------SI - HEADER -------')
    /*
    try {
      // Decodificar el token
      var payload = jwt.decode(token, secretKey)

      // Comprobar expiración del token
      if (payload.exp <= moment().unix()) {
        return res.status(403).send({
          message: 'Token ha expirado'
        })
      }
    } catch (error) {
      res.status(403).send({
        message: 'Token inválido'
      })
    }
    */

    // Adjuntar usuario identificado a request
    // req.user = payload

    req.atributoEjem = 'Texto-atributo'
    return {
      status: true,
      token: token
    }
  }
}
