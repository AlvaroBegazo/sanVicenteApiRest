Store Procedures
================
verificarRegistroPersona(dni): {
  return {
    idPersona,
    idAmin,
    idProfesor,
    idAlumno,
    idPadre
  }
  ---1-registar persona
  ---2-registar al usuario
  ---3-ya en el SP para asignar rol, se actualiza la tabla usuario, 
      y se inserta un registro en la tabla respectiva segun el rol 
      en la tabla 'usuario_rol_<nombreRol>'
}

*********** REGISTROS *********** 
----------------------------------
registrarPersona(dni, nombres, apellidoPaterno, apellidoMaterno, email): {
  **Script:
    INSERT INTO `persona` (dni, nombres, apellidoPaterno, apellidoMaterno, email) VALUES (Ndni, nombres, apellidoP, apellidoM, Nemail);
    SELECT MAX(idPersona) as ipPersona FROM persona;

}

registrarUsuario(idPersona, usuario, contrasenia):{
  **Script:
    BEGIN
    INSERT INTO `usuario` (`usuario`, `contraseña`,`idPersona`) VALUES (usuario, contrasenia, idPersonaParam);
    SELECT MAX(idUsuario) AS idUsuario FROM `usuario`;
    END
} 


*********** VERIFICACIONES ***********
---------------------------------------
verificarRegistroPersona(dni): {
  **Script:
    DELIMITER $
    CREATE PROCEDURE verificarRegistroPersona(IN dni INT)
    BEGIN
    SELECT @idPersona as idPersona from persona WHERE dni=dni;
    SELECT idAdmin, idProfesor. idAlumno, idPadre from usuario WHERE idPersona=@idPersona
    END$
    DELIMITER ;
}

verificarCorreoUnico(emailPar): {
  **Script:
    SELECT email FROM `persona` WHERE email=emailPar;
}


*********** ASIGNAR ROLES ***********
--------------------------------------
agregarRolAdministrativo(idUsuario): {
  return {
    idAdministrativo
  }
  **Script:
    DELIMITER $
    CREATE PROCEDURE agregarRolAdministrativo(IN idUsuario INT)
    BEGIN
      INSERT INTO usuario_rol_administrador (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idAdministrativo;

      UPDATE usuario set idAdmin = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$
    DELIMITER ;
}

agregarRolProfesor(idUsuario): {
  return {
    idProfesor
  }
  **Script:
    DELIMITER $
    CREATE PROCEDURE agregarRolProfesor(IN idUsuario INT)
    BEGIN
      INSERT INTO usuario_rol_administrador (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idProfesor;

      UPDATE usuario set idAdmin = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$
    DELIMITER ;
}

agregarRolAlumno(idUsuario): {
  return {
    idAlumno
  }
  **Script:
    DELIMITER $
    CREATE PROCEDURE agregarRolAlumno(IN idUsuario INT)
    BEGIN
      INSERT INTO usuario_rol_administrador (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idAlumno;

      UPDATE usuario set idAdmin = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$
    DELIMITER ;
}

agregarRolPadre(idUsuario): {
  return {
    idPadre
  }
  **Script:
    DELIMITER $
    CREATE PROCEDURE agregarRolPadre(IN idUsuario INT)
    BEGIN
      INSERT INTO usuario_rol_administrador (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idPadre;

      UPDATE usuario set idAdmin = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$
    DELIMITER ;
}


*********** DATOS PERIODO ***********
--------------------------------------
obtenerDatosPeriodo(idPeriodo): {
  return {
    idPeriodo,
    anio
  }
}


*********** MATRICULA ***********
--------------------------------------
matricularAlumno(idAlumno, idPeriodo, idAula): {
  // q sea solo un insert :v
}


*********** LISTADOS ***********
--------------------------------------

listarAulas(): {
  // mostrar todas las aulas
  /*idea que se me ocurrió: a listar las aulas se muestre en porcentajes su valor de calificaciones por aula como para mostrar qué aula es la tiene mejores notas xD*/
}

listarAulasPorSeccion(idSeccion): {
}

listarAulasPorGrado(idGrado): {
}

listarDatosPadreId(idPadre):{
  // mostrar datos de los padres por el id
}



*********** LOGIN ***********
------------------------------

solicitarContraseniaMaster(correo)
 SET @idPersonaVar := (SELECT persona.idPersona from persona WHERE persona.email=correo);
 SELECT usuario.`contraseña` as password, idPersona, idAdmin, idProfesor, idPadre, idPersona FROM usuario WHERE usuario.idPersona=@idPersonaVar;



solicitarContraseniaUser(usuarioParam)
SELECT usuario.`contraseña` as password, idPersona from usuario WHERE usuario=usuarioParam;



solicitaDatosPersona(idPersona)
SELECT * from persona where persona.idPersona=idPersonaParam




*********** OTRA DOC DE SP ***********
------------------------------



notas
=====================

servicioes


listar notas alumno de periodo anterior (idAlumno, idPeriodo)

listar hijos del padre q no esten matriculados en periodo actual



estados: char: {
  N : no matriculado
  M: matriculado,
  T: termino el colegio
}


paso1
-----

buscar padre:{
  datos
}

si tiene hijos matriculados {
  listarlos,
  2° seleccionar al hijo q desea matricular

  3° seleccionar aula (grado, seccion)

  4° entregar datos a modo de resumen {
    datos-padre
    datos-alumno {
      nombres, apellidos
      email,
    }
    datos-matricula
  }
}




registro aula

seleccion nivel ( 1, 2, 3)
seleccion grado

seleccion de seccion





--------------------

registros de {
  -cursos: {
    -horario
  }

  -aulas: {
    -grados
    -secciones
  }
  -asignar curso a un profe



}
