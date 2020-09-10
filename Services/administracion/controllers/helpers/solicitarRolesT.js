'use strict'

module.exports = async (db, dni) => {
  let roles = {}
  console.log(dni)
  try {
    console.log("entre al try");
    roles = await db.solicitarRolesT(dni)
    // return {
      //   status: true,
      //   lista: roles
      // }
    } catch (error) {
      console.log(`solicitarRoles -ERROR: ${error}`)
      roles.status = false
      return {
        status: false,
        lista: []
      }
    }
    console.log(roles);
}
