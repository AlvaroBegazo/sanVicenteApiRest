'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

exports.createToken = (usuario) => {
  const payload = {
    idUsuario: usuario.idUsuario,
    nombre: usuario.nombres,
    apellidotPaterno: usuario.apellidotPaterno,
    apellidoMaterno: usuario.apellidoMaterno,
    email: usuario.email,
    dni: usuario.dni,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  }
  const secretKey = process.env.SECRET_KEY || 'clave-secreta-para-generar-token9009'
  return jwt.encode(payload, secretKey)
}
