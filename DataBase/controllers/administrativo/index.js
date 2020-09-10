'use strict'

// const log = bunyan.createLogger({ name: "DB-administrativo" })

const { logger } = require('../../../Services/utils/configuracionWinston')
const fileDir = '[Database/controllers/administrativo]'

module.exports = {
  /**
   * @Registros
   */
  verificarRegistroSistema: async (mysqlInstance, dni) => {
    logger.info(`Iniciando verificarRegistroSistema ${fileDir}`)
    let query
    let process
    try {
      query = 'CALL verificarRegistroPersona(?)' // q retorne su idPersona y la lista de roles (por id)
      process = await mysqlInstance.query(query, [dni])
      console.log('--BD-VERIFICAR REGISTRO-- ')
      console.log(process)
      console.log(process[0])
    } catch (err) {
      logger.error(`error verificarRegistroSistema (${err}) ${fileDir}`)
      console.log(`error ${err}`)
    }
    if (process[0].length > 0) {
      if (process[0][0].idPersona !== undefined) {
        logger.info(`Final verificarRegistroSistema ${fileDir}`)
        return {

          status: true,
          idPersona: process[0][0].idPersona,
          idAdmin: process[0][0].idAdmin,
          idProfesor: process[0][0].idProfesor,
          idAlumno: process[0][0].idAlumno,
          idPadre: process[0][0].idPadre
        }
      } else {
        logger.error('Server-Error.')
        logger.info(`Final verificarRegistroSistema ${fileDir}`)
        return {
          status: false,
          message: 'Server-Error.'
        }
      }
    } else {
      logger.warn('no hay registro :v')
      logger.info(`Final verificarRegistroSistema ${fileDir}`)
      return {
        status: false
      }
    }
  },

  obtenerDatosPeriodo: async (mysqlInstance, idPeriodo) => {
    logger.info(`Iniciando obtenerDatosPeriodo ${fileDir}`)
    const query = 'CALL obtenerIdPeriodo(?)' // q retorne su idPeriodo y año
    const process = await mysqlInstance.query(query, [idPeriodo])
    logger.info(`Final obtenerDatosPeriodo ${fileDir}`)
    return process[0][0] // {idPeriodo, anio}
  },

  registrarPersona: async (mysqlInstance, persona) => {
    logger.info(`Iniciando registrarPersona ${fileDir}`)
    // console.log(persona)
    // console.log('---***BD**-------')
    const query = 'CALL registrarPersona(?,?,?,?,?,?,?,?)' // q retorne su idPersona
    const process = await mysqlInstance.query(query, [persona.dni, persona.nombres, persona.apellidoPaterno, persona.apellidoMaterno, persona.email, persona.telefono, persona.direccion, persona.fechaNacimiento])

    console.log(process[0][0].idPersona)
    if (process[0][0].idPersona !== undefined) {
      logger.info(`Final registrarPersona ${fileDir}`)
      return {
        status: true,
        idPersona: process[0][0].idPersona
      }
    } else {
      logger.info(`Final registrarPersona ${fileDir}`)
      return {
        status: false
      }
    }
  },

  verificarCorreoUnico: async (mysqlInstance, email) => {
    logger.info(`Iniciando verificarCorreoUnico ${fileDir}`)
    const query = 'CALL verificarCorreoUnico(?)' // q retorne su idPersona
    const process = await mysqlInstance.query(query, [email])
    if (process[0].length > 0) {
      logger.info(`Final verificarCorreoUnico ${fileDir}`)
      return {
        status: true
      }
    } else {
      logger.info(`Final verificarCorreoUnico ${fileDir}`)
      return {
        status: false
      }
    }
  },

  registrarUsuario: async (mysqlInstance, newUsuario) => {
    logger.info(`Iniciando registrarUsuario ${fileDir}`)
    const query = 'CALL registrarUsuario(?,?,?)' // q retorne su idUsuario
    let process
    try {
      process = await mysqlInstance.query(query, [newUsuario.idPersona, newUsuario.usuario, newUsuario.contrasenia])
    } catch (error) {
      logger.error(`Error registrarUsuario ${fileDir} : ${error}`)
    }

    if (process[0][0].idUsuario !== undefined) {
      logger.info(`Final registrarUsuario ${fileDir}`)
      return {
        status: true,
        idUsuario: process[0][0].idUsuario
      }
    } else {
      logger.info(`Final registrarUsuario ${fileDir}`)
      return {
        status: false
      }
    }
  },

  registrarAula: async (mysqlInstance, newAula) => {
    /*
    aula: {
      -numeroAula
      -idGrado
      -idNivel
      -nombreSeccion
      -vacantes
    }
    */
    logger.info(`Iniciando registrarAula ${fileDir}`)
    const query = 'CALL registrarAula(?,?,?,?)' // q retorne su idAula
    console.log("ENTRE AL SP ");
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [newAula.numeroAula, newAula.idGrado , newAula.idSeccion, newAula.vacantes])
      // console.log(process);
      console.log(" RESULTADO DE : process[0]");
      console.log(process[0]);
      // console.log(" RESULTADO DE : process[0][0]");
      // console.log(process[0][0]);

      // process = await mysqlInstance.query(query, [newAula.numeroAula, newAula.idGrado, newAula.idNivel, newAula.nombreSeccion, newAula.vacantes])
    } catch (error) {
      processStatus = false
      logger.error(`Error registrarAula ${fileDir} : ${error}`)
    }

    if (process[0] !== undefined && processStatus) {
      logger.info(`Final registrarAula ${fileDir}`)
      return {
        status: true,
        idAula: process[0]
      }
    } else {
      logger.info(`Final registrarAula ${fileDir}`)
      return {
        status: false
      }
    }
  },

  /**
   * @AsignarRoles
   * */
  solicitarRoles: async (mysqlInstance, idUsuario) => {
    logger.info(`Iniciando solicitarRoles ${fileDir}`)
    const query = 'CALL solicitarRoles(?)'
    let processStatus = true
    let process
    try {
      process = await mysqlInstance.query(query, [idUsuario])
      logger.info('roles obtenidos')
    } catch (error) {
      logger.error(`Error solicitarRoles ${fileDir} : ${error}`)
      processStatus = false
      console.log(`BD-ERROR - solicitar Roles: ${error}`)
    }

    if (processStatus) {
      logger.info(`Final solicitarRoles ${fileDir}`)
      console.log("Process");
      console.log(process);
      console.log("Process [0]");
      console.log(process[0]);
      console.log("Process[0][0]");
      console.log(process[0][0]);

      return {
        status: true,
        roles: {
          idAdmin: process[0][0].idAdmin,
          idAlumno: process[0][0].idAlumno,
          idProfesor: process[0][0].idProfesor,
          idPadre: process[0][0].idPadre
        }
      }
    } else {
      logger.warn('Roles no obtenidos.')
      logger.info(`Final solicitarRoles ${fileDir}`)
      return {
        status: false,
        message: 'Roles no obtenidos.'
      }
    }
  },
  
  solicitarRolesT: async (mysqlInstance, dni) => {
    logger.info(`Iniciando solicitarRolesT ${fileDir}`)
    const query = 'CALL solicitarRolesT(?)'

    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [dni])
      logger.info('roles obtenidos')
    } catch (error) {
      logger.error(`Error solicitarRoles ${fileDir} : ${error}`)
      processStatus = false
      console.log(`BD-ERROR - solicitar Roles: ${error}`)
    }

    if (processStatus) {
      logger.info(`Final solicitarRoles ${fileDir}`)
      console.log("Process");
      console.log(process);
      console.log("Process [0]");
      console.log(process[0]);
      console.log("Process[0][0]");
      console.log(process[0][0]);

      return {
        status: true,
        roles: {
          // idAdmin: process[0][0].idAdmin,
          // idAlumno: process[0][0].idAlumno,
          // idProfesor: process[0][0].idProfesor,
          idPadre: process[0][0].idPadre
        }
      }
    } else {
      logger.warn('Roles no obtenidos.')
      logger.info(`Final solicitarRoles ${fileDir}`)
      return {
        status: false,
        message: 'Roles no obtenidos.'
      }
    }
  },

  agregarRolAdministrativo: async (mysqlInstance, idUsuario) => {
    const query = 'CALL agregarRolAdministrativo(?)' // que devuelva el ultimo idAdministrativo registrado
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [idUsuario])
      // console.log(process[0])
    } catch (error) {
      logger.error(`error: ${error}`)
      processStatus = false
    }
    if (process[0].length === 1 && processStatus) {
      return {
        status: true,
        idRol: process[0][0].idAdministrativo
      }
    } else {
      return {
        status: false
      }
    }
  },

  agregarRolProfesor: async (mysqlInstance, idUsuario) => {
    logger.info(`Iniciando agregarRolProfesor ${fileDir}`)
    const query = 'CALL agregarRolProfesor(?)' // que devuelva el ultimo idProfesor registrado
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [idUsuario])
    } catch (error) {
      processStatus = false
    }
    if (process[0].length === 1 && processStatus) {
      logger.info(`Final agregarRolProfesor ${fileDir}`)
      return {
        status: true,
        idRol: process[0][0].idProfesor
      }
    } else {
      logger.info(`Final agregarRolProfesor ${fileDir}`)
      return {
        status: false
      }
    }
  },

  agregarRolPadre: async (mysqlInstance, idUsuario) => {
    logger.info(`Iniciando agregarRolPadre ${fileDir}`)
    const query = 'CALL agregarRolPadre(?)' // que devuelva el ultimo idPadre registrado
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [idUsuario])
    } catch (error) {
      processStatus = false
    }
    if (process[0].length === 1 && processStatus) {
      logger.info(`Final agregarRolPadre ${fileDir}`)
      return {
        status: true,
        idRol: process[0][0].idPadre
      }
    } else {
      logger.info(`Final agregarRolPadre ${fileDir}`)
      return {
        status: false
      }
    }
  },

  agregarRolAlumno: async (mysqlInstance, idUsuario, periodoActual) => {
    const query = 'CALL agregarRolAlumno(?,?)' // que devuelva el ultimo idAlumno registrado
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [idUsuario])
    } catch (error) {
      processStatus = false
    }
    if (process[0].length === 1 && processStatus) {
      return {
        status: true,
        idRol: process[0][0].idAlumno
      }
    } else {
      return {
        status: false
      }
    }
  },

  //  REVISION ----###############################################################
  matriculaPeriodo: async (mysqlInstance, objMatricula) => {
    logger.info(`Iniciando matriculaPeriodo ${fileDir}`)
    const query = 'CALL matricularAlumno(?,?,?)'
    const process = await mysqlInstance.query(query, [objMatricula.idAlumno, objMatricula.idPeriodo, objMatricula.idAula])
    if (process[0].affectedRows === 1) {
      logger.info(`Final matriculaPeriodo ${fileDir}`)
      return {
        status: true,
        statusCode: 200,
        message: 'Alumno matriculado correctamente.'
      }
    } else {
      logger.warn('No se pudo matricular al alumno, intente nuevamente.')
      logger.info(`Final matriculaPeriodo ${fileDir}`)
      return {
        status: false,
        statusCode: 500,
        message: 'No se pudo matricular al alumno, intente nuevamente.'
      }
    }
  },

  /**
   * @Listados
   * */
  listarAulas: async (mysqlInstance) => {
    logger.info(`Iniciando listarAulas ${fileDir}`)
    const query = 'CALL listarAulas()'
    let process
    try {
      process = await mysqlInstance.query(query, [])
    } catch (error) {
      console.log(`Error-listarAulas-DB: ${error}`)
    }
    if (process[0].length > 0) {
      logger.info(`Final listarAulas ${fileDir}`)
      return {
        status: true,
        statusCode: 200,
        listaAulas: process[0]
      }
    } else {
      logger.warn('No se pudo obtener la lista de aulas')
      logger.info(`Iniciando listarAulas ${fileDir}`)
      return {
        status: false,
        statusCode: 500,
        message: 'No se pudo obtener la lista de aulas'
      }
    }
  },

  listarAulasFiltro: async (mysqlInstance, tipoFiltro) => {
    logger.info(`Iniciando listarAulasFiltro ${fileDir}`)
    // tipoFiltro: {1: grado,  2: seccion}
    const query = 'CALL listarAulas(?)'
    const process = await mysqlInstance.query(query, [tipoFiltro])
    if (process[0][0].length > 0) {
      logger.info(`Final listarAulasFiltro ${fileDir}`)
      return {
        status: true,
        statusCode: 200,
        listaAulas: process[0][0]
      }
    } else {
      logger.warn('No se pudo obtener la lista de aulas')
      logger.info(`Final listarAulasFiltro ${fileDir}`)
      return {
        status: false,
        statusCode: 500,
        message: 'No se pudo obtener la lista de aulas'
      }
    }
  },

  listarPersonas: async (mysqlInstance) => {
    logger.info(`Iniciando listarPersonas ${fileDir}`)
    const query = 'CALL listarPersonas()'
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [])
    } catch (error) {
      processStatus = false
      logger.error(`Error: ${error}`)
    }
    logger.info(`Final listarPersonas ${fileDir}`)
    if (processStatus) {
      return {
        status: true,
        listado: process[0]
      }
    } else {
      return {
        status: false,
        listado: []
      }
    }
  },

  listarApoderados : async (mysqlInstance) => {
    logger.info(`Iniciando listarPersonas ${fileDir}`)
    const query = 'CALL listarApoderados()'
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [])
      // console.log("ESTE ES EL PROCESS");
      // console.log(process);
      // console.log("ESTE ES EL PROCESS[0]");
      // console.log(process[0]); // me dicta todo la lista
      // console.log("ESTE ES EL PROCESS[0][0]");
      // console.log(process[0][0]); // me dicta solo al primero de la lista
      // console.log("-------------------------->>>>>>");
    } catch (error) {
      processStatus = false
      logger.error(`Error: ${error}`)
    }
    logger.info(`Final listarPersonas ${fileDir}`)
    if (processStatus) {
      return {
        status: true,
        listado: process[0]
      }
    } else {
      return {
        status: false,
        listado: []
      }
    }
  },

  /**
   * @Detalles
   */
  detallePersona: async (mysqlInstance, dni) => {
    logger.info(`Iniciando detallePersona ${fileDir}`)
    const query = 'CALL detallePersonas(?)'
    let processStatus = true
    let process = {}
    try {
      process = await mysqlInstance.query(query, [dni])
    } catch (error) {
      processStatus = false
      logger.error(`Error: ${error}`)
    }
    logger.info(`Final detallePersona ${fileDir}`)
    if (processStatus && process[0].length === 1) {
      return {
        status: true,
        persona: process[0][0]
      }
    } else {
      return {
        status: false,
        persona: undefined
      }
    }
  }
}
