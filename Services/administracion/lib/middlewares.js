const bodyParser = require('body-parser')
const upload = require('express-fileupload')
const keys = require('../../../keys')

module.exports = app => {
  app.set('json spaces', 4)

  app.set('port', keys.ports_services.administrativo)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(upload())

  // Configuracion de CORS:
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', keys.host.frontend)
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
  })
}
