'use strict'

module.exports = async (db, idUsuario) => {
  let roles 
  try {
    roles = await db.solicitarRoles(idUsuario)
    return {
      status: true,
      lista: roles
    }
  } catch (error) {
    console.log(`solicitarRoles -ERROR: ${error}`)
    roles.status = false
    return {
      status: false,
      lista: []
    }
  }
}
