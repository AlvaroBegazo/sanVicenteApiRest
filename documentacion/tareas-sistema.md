Lista de tareas que debería tener el sistema:

MODULO-REGISTRO
===============

**gestion de usuarios
---------------------
-CRUD registro de personas-usuarios
  ->un administrativo tiene un cargo q permisos por defecto
-CRUD asignar roles a usuarios
-

**gestion de permisos
---------------------
-CRUD
-relacionar un cargo con una lista de permisos
-asignar permisos a un administrativo


**gestion-padre
---------------
-asignar hijos a un padre
-listar hijos de un padre
-editar lista de hijos de un padre



MODULO-GESTION-CURRICULAR
==========================

**Gestion de aula
-----------------
-crear aula
  ->asignar nivel, grado
-relacionar aula+cursos[]

**Gestion de curso
--------------------
-crear curso:
  ->nombre, vincularlo a un area
    ->CRUD de areas
-asignar profe
-asignacion de horario (un curso puede tener varios horarios [en caso de curso-partido])
-un curso de un aula tiene varias sesiones de aprendizaje(CRUD)


MODULO-MATRICULA
=================
-gestion de periodo: CRUD
-matricula
  ->asignar un aula a un alumno para tal periodo


MODULO-CALIFICACIONES
======================
-en progreso


- 5 casos de prueba funcionales
- 3 casos de prueba de performance
- 2 casos de prueba de integración (si aplica, sino funcionales)


Realizar las pruebas de stress que ha identificado en sus casos de prueba.
Utilice una herramienta para ejecutar sus pruebas de stress.
Muestre los resultados de las pruebas realizadas.
