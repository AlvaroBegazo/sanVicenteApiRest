
const matricula = require('./matricula')
const closePoolDb = require('./closePoolDb')

// const registrarProfesor = require('./registrarProfesor')
// const registrarPadre = require('./registrarPadre')
// const registrarAdministrativo = require('./registrarAdministrativo')
const registrarPersona = require('./registros/registrarPersona')
const asignarRol = require('./asignarRol')
const listarPersonas = require('./listados/listarPersonas')
const detallePersona = require('./detalleDatos/detallePersona')
const registrarAula = require('./registros/registrarAula')
const listarAulas = require('./listados/listarAulas')

const listarRoles = require('./listados/listarRoles')
const listarApoderados = require('./listados/listarApoderados')

module.exports = {
  /* registrarProfesor: registrarProfesor,
    registrarPadre: registrarPadre,
    registrarAdministrativo: registrarAdministrativo, */
  closePoolDB: closePoolDb,
  registrarPersona: registrarPersona,
  asignarRol: asignarRol,
  listarPersonas: listarPersonas,
  detallePersona: detallePersona,
  matricula: matricula, // se matricula solo a los usuarios con rol de estudiante
  registrarAula: registrarAula,
  listarAulas: listarAulas,
  listarRoles : listarRoles,
  listarApoderados: listarApoderados
}
