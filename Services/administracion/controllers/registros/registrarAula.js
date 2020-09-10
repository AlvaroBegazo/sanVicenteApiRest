'use strict'

const { default: validator } = require('validator')
const { logger } = require('../../../utils/configuracionWinston')

const fileDir = '[controller/administracion/registrarAula]'

module.exports = async (db, req, res, periodoActual) => {
  let newAula = null
  let catchBodyReq = true
  try {
    console.log("Entre al registrarAula");
    newAula = await req.body
    console.log(newAula);
  } catch (error) {
    catchBodyReq = false
    logger.error(`Error - ${fileDir} : ${error}`)
  }

  if (newAula && catchBodyReq) {
    console.log("entre al primer if");
    if (validateData(newAula)) {
      let processStatus = true
      let registro = {}
      try {
        registro = await db.registrarAula(newAula)
        // console.log(registro);
      } catch (error) {
        processStatus = false
      }
      if (registro.status && processStatus) {
        console.log("entre al indez");
        res.status(200).send({
          status: true,
          message: 'Aula registrada correctamente.'
        })
      } else {
        res.status(500).send({
          status: false,
          message: 'Ocurrió un problema al registrar el aula.'
        })
      }
    } else {
      res.status(400).send({
        status: false,
        message: 'Datos incorrectos.'
      })
    }
  } else {
    res.status(500).send({
      status: false,
      message: 'Ocurrió un problema con los datos enviados.'
    })
  }
}

function validateData (newAula) {
  console.log("Entre al validar");
  let validado = true
  const validaciones = []

  validaciones[0] = !validator.isEmpty(newAula.numeroAula)
  validaciones[1] = !validator.isEmpty(newAula.idGrado)
  validaciones[2] = !validator.isEmpty(newAula.idSeccion)
  validaciones[3] = !validator.isEmpty(newAula.vacantes)

  validaciones.filter(item => {
    validado = validado && item
  })
  console.log(validado);
  return validado
}
