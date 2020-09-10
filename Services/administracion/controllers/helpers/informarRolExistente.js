'use strict'

module.exports = (tipoRol, roles) => {
  switch (parseInt(tipoRol)) {
    case 1:
      if (roles.idAdmin) {
        console.log(roles.idAdmin)
        return false
      } else {
        return true
      }

    case 2:
      if (roles.idProfesor) {
        return false
      } else {
        return true
      }

    case 3:
      if (roles.idAlumno || roles.idAdmin || roles.idPadre || roles.idProfesor) {
        return false
      } else {
        return true
      }

    case 4:
      if (roles.idPadre) {
        return false
      } else {
        return true
      }

    default:
      break
  }
}
