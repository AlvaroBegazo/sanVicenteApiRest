'use strict'

// const keys = require('../../../keys')
// const Db = require('../../../DataBase/index')
// let db = new Db(keys.mysql)

const Autenticacion = require('../controllers/index')

const uri = '/autenticacion'

module.exports = (app, db) => {
  // const { method, url } = req

  // // el match vera si hay alguna ruta con el patron definido
  // const match = hash.get(`${method.toUpperCase()} ${url}`)
  // console.log("Request");
  // console.log(req);
  // // si hay alguna ruta, se retorna un objeto sino null
  // console.log("Antes del cors");
  // console.log(match.handler)
  // console.log(match)
  // if (match.handler) {
  //   try {
  //     // ejecutar handler:
  //     // console.log(match.handler(req, res, match.params));
  //     await match.handler(req, res, match.params)
  //   } catch (error) {
  //     logger.error('Error match.handler(req, res, match.params) [Services/autenticacion/]')
  //     logger.error(`Error-server: ${error.message}`)
  //     res.send(res, 500, { error: `Error-server: ${error.message}` })
  //   }
  // } else {
  //   logger.warn('Ruta no encontrada')
  //   res.send(res, 404, { error: 'Ruta no encontrada'})
  // }

  // async function main (req, res) {
  //   res.setHeader("Access-Control-Allow-Origin", "*")
  //   res.setHeader("Access-Control-Allow-Credentials", "true")
  //   res.setHeader("Access-Control-Max-Age", "1800")
  //   res.setHeader("Access-Control-Allow-Headers", "content-type")
  //   res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS")
  //   res.setHeader("Connection", "keep-alive")
  //   res.setHeader("Content-Length", "45")
  //   // res.setHeader("Content-Type", "application/json; charset=utf-8")
  //   console.log('\n\n\n')
  //   /*
  //   if (req.method === "OPTIONS") {
  //     //return res.status(200).end();
  //     let data
  //     try {
  //       data = await json(req)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //     res.status(404).send({ status: true, error: 'Ruta no encontrada - options'})
  //   } else {*/
  //     console.log('*****************************************************************************************************************************')
  //     /*
  //     let originCorrect = true
  //     try {
  //       if (req.headers.origin === keys.host.frontend) {
  //         originCorrect = true
  //       } else {
  //         originCorrect = false
  //       }
  //     } catch (error) {
  //       originCorrect = false
  //     }
  //     */
  //     let { method, url } = req
  //     console.log({method, url})
  //     if (method === 'OPTIONS') {
  //       console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
  //       console.log(req.headers)
  //       console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
  //       method = Object.values(req.headers)[3]
  //     } else {
  //       console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  //       //console.log(req)
  //     }
  //     // el match vera si hay alguna ruta con el patron definido
  //     const match = hash.get(`${method.toUpperCase()} ${url}`)
  //     console.log('---------------***************-------------')
  //     console.log(match)
  //     if (match.handler) {
  //       try {
  //         // ejecutar handler:
  //         await match.handler(req, res, match.params)
  //       } catch (error) {
  //         console.log(error)
  //         logger.error('Error match.handler(req, res, match.params) [Services/autenticacion/]')
  //         logger.error(`Error-server: ${error.message}`)
  //         res.status(500).send({ error: `Error-server: ${error.message}` })
  //       }
  //     } else {
  //       logger.warn('Ruta no encontrada')
  //       res.status(404).send({ error: 'Ruta no encontrada'})
  //     }

  // }
  // module.exports = cors(main)

  app.post(`${uri}/loginAdmin`, (req, res) => {
    Autenticacion.loginAdmin(db, req, res)
  })

  app.post(`${uri}/loginUser`, (req, res) => {
    Autenticacion.loginUser(db, req, res)
  })

  app.post('/disconnect/database', (req, res) => {
    Autenticacion.disconnect(db, req, res)
  })
}
