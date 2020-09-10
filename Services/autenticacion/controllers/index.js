
const closePoolDb = require('./closePoolDb')
const loginAdmin = require('./loginAdmin')
const loginUser = require('./loginUser')
const disconnect = require('./disconnect')

// const registrarProfesor = require('./registrarProfesor')
// const registrarPadre = require('./registrarPadre')

module.exports = {

  closePoolDB: closePoolDb,
  loginAdmin: loginAdmin,
  loginUser: loginUser,
  disconnect: disconnect

}
