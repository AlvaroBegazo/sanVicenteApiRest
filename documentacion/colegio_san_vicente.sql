-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 02-09-2020 a las 18:07:33
-- Versión del servidor: 5.7.24
-- Versión de PHP: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `colegio_san_vicente`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`practica`@`localhost` PROCEDURE `agregarRolAdministrativo` (IN `NidUsuario` INT)  BEGIN
      INSERT INTO usuario_rol_administrador (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idAdministrativo;

      UPDATE usuario set idAdmin = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `agregarRolAlumno` (IN `idUsuario` INT)  BEGIN
      INSERT INTO usuario_rol_alumno (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idAlumno;

      UPDATE usuario set idAlumno = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `agregarRolPadre` (IN `NidUsuario` INT)  NO SQL
BEGIN
      INSERT INTO usuario_rol_padre (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idPadre;

      UPDATE usuario set idPadre = LAST_INSERT_ID() where 
      idUsuario=NidUsuario;
    END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `agregarRolProfesor` (IN `NidUsuario` VARCHAR(8))  NO SQL
BEGIN
      INSERT INTO usuario_rol_profesor (idUsuario) VALUES (NidUsuario);
      SELECT LAST_INSERT_ID() as idProfesor;

      UPDATE usuario set idProfesor = LAST_INSERT_ID() where idUsuario=NidUsuario;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `detallePersonas` (IN `Ndni` INT(9))  NO SQL
SELECT dni, nombres, apellidoPaterno, apellidoMaterno, email, telefono ,fechaNacimiento, direccion, usuario
  FROM persona INNER JOIN usuario ON dni=usuario
    WHERE persona.dni = Ndni$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `listarAulas` ()  NO SQL
SELECT numeroAula,grado,nivel,seccion FROM aula INNER JOIN grado on aula.idGrado=grado.idGrado INNER JOIN seccion on aula.idSeccion=seccion.idSeccion  
ORDER BY `aula`.`idAula` ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `listarAulasPorGrado` (IN `numGrado` INT(1))  NO SQL
SELECT numeroAula,grado,nivel,seccion FROM aula INNER JOIN grado on aula.idGrado=grado.idGrado INNER JOIN seccion on aula.idSeccion=seccion.idSeccion WHERE grado=numGrado$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `listarAulasPorSeccion` (IN `nameSection` VARCHAR(1))  NO SQL
SELECT numeroAula,grado,nivel,seccion FROM aula INNER JOIN grado on aula.idGrado=grado.idGrado INNER JOIN seccion on aula.idSeccion=seccion.idSeccion WHERE seccion=nameSection$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `listarPersonas` ()  NO SQL
SELECT * FROM persona$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obtenerDatosPeriodo` (IN `idPeriodo` INT(11))  NO SQL
SELECT nombreAño,año,fechaInicio,fechaFin FROM periodo p WHERE p.idPeriodo=idPeriodo$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `registrarPersona` (IN `Ndni` INT, IN `nombres` VARCHAR(30), IN `apellidoP` VARCHAR(20), IN `apellidoM` VARCHAR(30), IN `Nemail` VARCHAR(30), IN `Ntelefono` INT(9), IN `Ndireccion` VARCHAR(250), IN `NfechaNacimiento` DATE)  BEGIN
INSERT INTO `persona` (dni, nombres, apellidoPaterno, apellidoMaterno, email,telefono, direccion, fechaNacimiento ) VALUES (Ndni, nombres, apellidoP, apellidoM, Nemail, Ntelefono, Ndireccion, NfechaNacimiento);
     
SELECT MAX(idPersona) as idPersona FROM persona;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `registrarUsuario` (IN `idPersonaParam` INT(20), IN `usuario` VARCHAR(100), IN `contrasenia` VARCHAR(100))  NO SQL
BEGIN
INSERT INTO `usuario` (`usuario`, `contraseña`,`idPersona`) VALUES (usuario, contrasenia, idPersonaParam);
SELECT MAX(idUsuario) AS idUsuario FROM `usuario`;
END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `solicitaDatosPersona` (IN `idPersonaParam` INT(9))  NO SQL
SELECT * from persona where persona.idPersona=idPersonaParam$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `solicitarContraseniaMaster` (IN `correo` VARCHAR(50))  BEGIN
    SET @idPersonaVar := (SELECT persona.idPersona from persona WHERE persona.email=correo);
 SELECT usuario.`contraseña` as password, idPersona, idAdmin, idProfesor, idPadre, idPersona FROM usuario WHERE usuario.idPersona=@idPersonaVar;
      
    END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `solicitarPeriodoActual` ()  NO SQL
SELECT * FROM periodo ORDER BY idPeriodo DESC LIMIT 1$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `solicitarRoles` (IN `idUsuarioParam` INT(20))  NO SQL
select idAdmin, idAlumno, idProfesor,idPadre from usuario WHERE idUsuario=idUsuarioParam$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `verificarCorreoUnico` (IN `emailPar` VARCHAR(50))  NO SQL
SELECT email FROM `persona` WHERE email=emailPar$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `verificarRegistroPersona` (IN `dni` INT(9))  NO SQL
SELECT * FROM persona p WHERE p.dni = dni$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `verificarRegistroUsuario` (IN `user` INT(8), IN `pswd` VARCHAR(20))  NO SQL
SELECT idUsuario,idAdmin,idAlumno,idProfesor,idPadre,idPersona FROM usuario WHERE usuario=user AND contraseña=pswd$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderado`
--

CREATE TABLE `apoderado` (
  `idApoderado` int(20) NOT NULL,
  `idAlumno` int(20) NOT NULL,
  `idPadre` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `apoderado`
--

INSERT INTO `apoderado` (`idApoderado`, `idAlumno`, `idPadre`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10),
(11, 11, 11),
(12, 12, 12),
(13, 13, 13),
(14, 14, 14),
(15, 15, 15),
(16, 16, 16),
(17, 17, 17),
(18, 18, 18),
(19, 19, 19),
(20, 20, 20),
(21, 21, 21),
(22, 22, 22),
(23, 23, 23),
(24, 24, 24),
(25, 25, 25),
(26, 26, 26),
(27, 27, 27),
(28, 28, 28),
(29, 29, 29),
(30, 30, 30),
(31, 31, 31),
(32, 32, 32),
(33, 33, 33),
(34, 34, 34),
(35, 35, 35),
(36, 36, 36),
(37, 37, 37),
(38, 38, 38),
(39, 39, 39),
(40, 40, 40),
(41, 41, 41),
(42, 42, 42),
(43, 43, 43),
(44, 44, 44),
(45, 45, 45),
(46, 46, 46),
(47, 47, 47),
(48, 48, 48),
(49, 49, 49),
(50, 50, 50),
(51, 51, 51),
(52, 52, 52),
(53, 53, 53),
(54, 54, 54),
(55, 55, 55);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aula`
--

CREATE TABLE `aula` (
  `idAula` int(20) NOT NULL,
  `numeroAula` int(2) NOT NULL,
  `idGrado` int(20) NOT NULL,
  `idSeccion` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aula`
--

INSERT INTO `aula` (`idAula`, `numeroAula`, `idGrado`, `idSeccion`) VALUES
(1, 27, 1, 1),
(2, 4, 2, 1),
(3, 14, 3, 1),
(4, 14, 4, 2),
(5, 9, 4, 1),
(6, 25, 5, 2),
(7, 5, 5, 1),
(8, 10, 6, 2),
(9, 9, 6, 1),
(10, 9, 7, 2),
(11, 5, 7, 1),
(12, 19, 8, 2),
(13, 11, 8, 1),
(14, 24, 9, 2),
(15, 15, 9, 1),
(16, 12, 10, 2),
(17, 11, 10, 1),
(18, 23, 11, 2),
(19, 5, 11, 1),
(20, 3, 12, 2),
(21, 26, 12, 1),
(22, 26, 13, 2),
(23, 21, 13, 1),
(24, 34, 14, 2),
(25, 4, 14, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bimestre`
--

CREATE TABLE `bimestre` (
  `idBimestre` int(11) NOT NULL,
  `ordenBimestre` int(11) NOT NULL,
  `año` int(11) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `bimestre`
--

INSERT INTO `bimestre` (`idBimestre`, `ordenBimestre`, `año`, `fechaInicio`, `fechaFin`) VALUES
(1, 1, 2018, '2018-03-16', '2018-11-11'),
(2, 2, 2018, '2018-03-10', '2018-09-27'),
(3, 3, 2018, '2018-03-11', '2018-07-24'),
(4, 4, 2018, '2018-03-24', '2018-08-09'),
(5, 1, 2019, '2019-03-07', '2019-05-11'),
(6, 2, 2019, '2019-03-01', '2019-05-24'),
(7, 3, 2019, '2019-03-11', '2019-05-18'),
(8, 4, 2019, '2019-03-10', '2019-05-09'),
(9, 1, 2020, '2020-03-04', '2020-05-19'),
(10, 2, 2020, '2020-03-20', '2020-05-26'),
(11, 3, 2020, '2020-03-26', '2020-05-21'),
(12, 4, 2020, '2020-03-21', '2020-05-22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `idCalificaion` int(11) NOT NULL,
  `notaCuaderno` int(2) NOT NULL,
  `notaTareas` int(2) NOT NULL,
  `notaExamenes` int(2) NOT NULL,
  `notaPracticas` int(2) NOT NULL,
  `promBimestre` int(2) NOT NULL,
  `idAsignatura` int(11) NOT NULL,
  `idProm` int(11) NOT NULL,
  `idBimestre` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `calificaciones`
--

INSERT INTO `calificaciones` (`idCalificaion`, `notaCuaderno`, `notaTareas`, `notaExamenes`, `notaPracticas`, `promBimestre`, `idAsignatura`, `idProm`, `idBimestre`) VALUES
(1, 8, 3, 3, 20, 8, 1, 1, 12),
(2, 9, 19, 4, 3, 8, 2, 1, 12),
(3, 15, 10, 3, 19, 11, 3, 1, 12),
(4, 1, 17, 11, 12, 10, 4, 1, 12),
(5, 1, 20, 11, 19, 12, 5, 1, 12),
(6, 4, 10, 7, 18, 9, 6, 1, 12),
(7, 10, 15, 15, 12, 13, 7, 1, 12),
(8, 17, 4, 17, 1, 9, 8, 1, 12),
(9, 14, 15, 10, 9, 12, 9, 1, 12),
(10, 16, 1, 1, 4, 5, 10, 1, 12),
(11, 17, 13, 5, 16, 12, 11, 1, 12),
(12, 14, 8, 5, 3, 7, 12, 1, 12),
(13, 4, 5, 14, 18, 10, 13, 1, 12),
(14, 9, 19, 7, 4, 9, 14, 1, 12),
(15, 10, 20, 6, 17, 13, 15, 1, 12),
(16, 2, 15, 12, 16, 11, 1, 2, 12),
(17, 19, 9, 1, 16, 11, 2, 2, 12),
(18, 3, 2, 12, 20, 9, 3, 2, 12),
(19, 1, 14, 18, 2, 8, 4, 2, 12),
(20, 20, 8, 8, 19, 13, 5, 2, 12),
(21, 9, 7, 15, 12, 10, 6, 2, 12),
(22, 8, 14, 12, 3, 9, 7, 2, 12),
(23, 8, 14, 15, 4, 10, 8, 2, 12),
(24, 11, 4, 13, 19, 11, 9, 2, 12),
(25, 15, 14, 11, 17, 14, 10, 2, 12),
(26, 10, 1, 19, 10, 10, 11, 2, 12),
(27, 12, 9, 2, 16, 9, 12, 2, 12),
(28, 12, 4, 13, 17, 11, 13, 2, 12),
(29, 4, 8, 15, 7, 8, 14, 2, 12),
(30, 19, 15, 8, 9, 12, 15, 2, 12),
(31, 2, 9, 17, 11, 9, 1, 3, 12),
(32, 10, 15, 4, 13, 10, 2, 3, 12),
(33, 20, 2, 7, 12, 10, 3, 3, 12),
(34, 11, 18, 11, 20, 15, 4, 3, 12),
(35, 7, 7, 4, 3, 5, 5, 3, 12),
(36, 2, 1, 11, 8, 5, 6, 3, 12),
(37, 2, 6, 20, 1, 7, 7, 3, 12),
(38, 13, 3, 11, 4, 7, 8, 3, 12),
(39, 20, 14, 14, 13, 15, 9, 3, 12),
(40, 20, 15, 20, 1, 14, 10, 3, 12),
(41, 15, 11, 5, 13, 11, 11, 3, 12),
(42, 7, 13, 18, 14, 13, 12, 3, 12),
(43, 15, 14, 12, 12, 13, 13, 3, 12),
(44, 8, 17, 4, 9, 9, 14, 3, 12),
(45, 2, 4, 4, 20, 7, 15, 3, 12),
(46, 4, 16, 7, 7, 8, 1, 4, 12),
(47, 5, 15, 3, 13, 9, 2, 4, 12),
(48, 20, 11, 2, 20, 13, 3, 4, 12),
(49, 19, 16, 1, 3, 9, 4, 4, 12),
(50, 7, 17, 13, 13, 12, 5, 4, 12),
(51, 19, 14, 11, 12, 14, 6, 4, 12),
(52, 16, 5, 17, 2, 10, 7, 4, 12),
(53, 16, 10, 19, 3, 12, 8, 4, 12),
(54, 12, 10, 9, 11, 10, 9, 4, 12),
(55, 12, 8, 15, 13, 12, 10, 4, 12),
(56, 2, 5, 6, 7, 5, 11, 4, 12),
(57, 6, 2, 8, 1, 4, 12, 4, 12),
(58, 17, 3, 2, 19, 10, 13, 4, 12),
(59, 2, 7, 5, 14, 7, 14, 4, 12),
(60, 4, 9, 12, 20, 11, 15, 4, 12),
(61, 16, 3, 3, 20, 10, 1, 5, 12),
(62, 20, 14, 1, 11, 11, 2, 5, 12),
(63, 6, 7, 1, 3, 4, 3, 5, 12),
(64, 18, 4, 17, 17, 14, 4, 5, 12),
(65, 15, 9, 3, 9, 9, 5, 5, 12),
(66, 19, 12, 10, 1, 10, 6, 5, 12),
(67, 3, 1, 20, 8, 8, 7, 5, 12),
(68, 20, 2, 9, 11, 10, 8, 5, 12),
(69, 4, 20, 1, 5, 7, 9, 5, 12),
(70, 10, 13, 19, 9, 12, 10, 5, 12),
(71, 9, 3, 12, 10, 8, 11, 5, 12),
(72, 7, 8, 19, 2, 9, 12, 5, 12),
(73, 18, 18, 8, 19, 15, 13, 5, 12),
(74, 9, 20, 5, 12, 11, 14, 5, 12),
(75, 2, 20, 20, 10, 13, 15, 5, 12),
(76, 8, 10, 18, 6, 10, 1, 6, 12),
(77, 20, 16, 11, 14, 15, 2, 6, 12),
(78, 9, 20, 14, 14, 14, 3, 6, 12),
(79, 6, 6, 3, 1, 4, 4, 6, 12),
(80, 16, 14, 15, 20, 16, 5, 6, 12),
(81, 15, 8, 3, 1, 6, 6, 6, 12),
(82, 20, 9, 10, 15, 13, 7, 6, 12),
(83, 5, 15, 4, 20, 11, 8, 6, 12),
(84, 6, 18, 16, 6, 11, 9, 6, 12),
(85, 8, 3, 8, 2, 5, 10, 6, 12),
(86, 10, 14, 12, 19, 13, 11, 6, 12),
(87, 2, 6, 19, 18, 11, 12, 6, 12),
(88, 15, 9, 10, 6, 10, 13, 6, 12),
(89, 5, 12, 13, 13, 10, 14, 6, 12),
(90, 18, 5, 2, 1, 6, 15, 6, 12),
(91, 3, 20, 3, 9, 8, 1, 7, 12),
(92, 3, 8, 14, 4, 7, 2, 7, 12),
(93, 10, 14, 17, 12, 13, 3, 7, 12),
(94, 12, 9, 3, 20, 11, 4, 7, 12),
(95, 8, 7, 9, 14, 9, 5, 7, 12),
(96, 20, 16, 15, 13, 16, 6, 7, 12),
(97, 20, 8, 19, 1, 12, 7, 7, 12),
(98, 12, 16, 9, 3, 10, 8, 7, 12),
(99, 15, 6, 11, 10, 10, 9, 7, 12),
(100, 17, 4, 14, 5, 10, 10, 7, 12),
(101, 20, 20, 17, 20, 19, 11, 7, 12),
(102, 11, 16, 15, 9, 12, 12, 7, 12),
(103, 20, 4, 6, 10, 10, 13, 7, 12),
(104, 19, 19, 2, 7, 11, 14, 7, 12),
(105, 8, 17, 2, 1, 7, 15, 7, 12),
(106, 7, 3, 15, 6, 7, 1, 8, 12),
(107, 4, 19, 9, 4, 9, 2, 8, 12),
(108, 8, 20, 6, 13, 11, 3, 8, 12),
(109, 8, 2, 13, 19, 10, 4, 8, 12),
(110, 11, 5, 9, 20, 11, 5, 8, 12),
(111, 14, 4, 5, 19, 10, 6, 8, 12),
(112, 11, 4, 4, 9, 7, 7, 8, 12),
(113, 11, 2, 10, 8, 7, 8, 8, 12),
(114, 9, 16, 8, 10, 10, 9, 8, 12),
(115, 19, 6, 11, 16, 13, 10, 8, 12),
(116, 2, 4, 17, 13, 9, 11, 8, 12),
(117, 20, 8, 10, 3, 10, 12, 8, 12),
(118, 3, 3, 6, 15, 6, 13, 8, 12),
(119, 1, 5, 15, 16, 9, 14, 8, 12),
(120, 14, 9, 3, 8, 8, 15, 8, 12),
(121, 3, 19, 15, 17, 13, 1, 9, 12),
(122, 14, 9, 14, 9, 11, 2, 9, 12),
(123, 5, 9, 19, 4, 9, 3, 9, 12),
(124, 16, 1, 15, 8, 10, 4, 9, 12),
(125, 16, 18, 6, 20, 15, 5, 9, 12),
(126, 5, 16, 10, 5, 9, 6, 9, 12),
(127, 13, 16, 10, 13, 13, 7, 9, 12),
(128, 20, 13, 18, 19, 17, 8, 9, 12),
(129, 10, 11, 1, 5, 6, 9, 9, 12),
(130, 10, 20, 14, 18, 15, 10, 9, 12),
(131, 9, 14, 5, 9, 9, 11, 9, 12),
(132, 1, 3, 1, 5, 2, 12, 9, 12),
(133, 16, 14, 1, 2, 8, 13, 9, 12),
(134, 1, 20, 13, 6, 10, 14, 9, 12),
(135, 13, 3, 5, 16, 9, 15, 9, 12),
(136, 8, 3, 14, 1, 6, 1, 10, 12),
(137, 5, 14, 4, 10, 8, 2, 10, 12),
(138, 2, 18, 14, 2, 9, 3, 10, 12),
(139, 17, 18, 2, 10, 11, 4, 10, 12),
(140, 6, 6, 20, 8, 10, 5, 10, 12),
(141, 10, 8, 7, 2, 6, 6, 10, 12),
(142, 12, 11, 11, 6, 10, 7, 10, 12),
(143, 9, 4, 4, 2, 4, 8, 10, 12),
(144, 3, 11, 20, 10, 11, 9, 10, 12),
(145, 8, 2, 18, 18, 11, 10, 10, 12),
(146, 11, 18, 1, 11, 10, 11, 10, 12),
(147, 5, 3, 20, 17, 11, 12, 10, 12),
(148, 15, 1, 15, 5, 9, 13, 10, 12),
(149, 20, 17, 3, 17, 14, 14, 10, 12),
(150, 2, 4, 10, 6, 5, 15, 10, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `competencias`
--

CREATE TABLE `competencias` (
  `idCompetencia` int(11) NOT NULL,
  `nomCompetencia` varchar(50) NOT NULL,
  `idBimestre` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `competencias`
--

INSERT INTO `competencias` (`idCompetencia`, `nomCompetencia`, `idBimestre`) VALUES
(1, 'Project Manager', 1),
(2, 'Graphic Designer', 2),
(3, 'Graphic Designer', 3),
(4, 'Staff Scientist', 4),
(5, 'Information Systems Manager', 5),
(6, 'Nurse', 6),
(7, 'Human Resources Manager', 7),
(8, 'Marketing Manager', 8),
(9, 'Database Administrator III', 9),
(10, 'VP Accounting', 10),
(11, 'Web Developer II', 11),
(12, 'Accounting Assistant III', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `idCurso` int(20) NOT NULL,
  `nombreCurso` varchar(20) NOT NULL,
  `area` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`idCurso`, `nombreCurso`, `area`) VALUES
(1, 'Algebra', 'Matematica'),
(2, 'Aritmetica', 'Matematica'),
(3, 'Geometria', 'Matematica'),
(4, 'Trigonometria', 'Matematica'),
(5, 'Lenguaje', 'Comunicacion'),
(6, 'Literatura', 'Comunicacion'),
(7, 'Psicologia', 'Ciencias Sociales'),
(8, 'Educacion Civica', 'Ciencias Sociales'),
(9, 'Historia', 'Ciencias Sociales'),
(10, 'Geografia', 'Ciencias Sociales'),
(11, 'Economia', 'Ciencias Sociales'),
(12, 'Filosofia', 'Ciencias Sociales'),
(13, 'Fisica', 'Ciencia y Tecnologia'),
(14, 'Quimica', 'Ciencia y Tecnologia'),
(15, 'Biologia', 'Ciencia y Tecnologia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `idGrado` int(20) NOT NULL,
  `grado` int(2) NOT NULL,
  `nivel` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grado`
--

INSERT INTO `grado` (`idGrado`, `grado`, `nivel`) VALUES
(1, 3, 'inicial'),
(2, 4, 'inicial'),
(3, 5, 'inicial'),
(4, 1, 'primaria'),
(5, 2, 'primaria'),
(6, 3, 'primaria'),
(7, 4, 'primaria'),
(8, 5, 'primaria'),
(9, 6, 'primaria'),
(10, 1, 'secundaria'),
(11, 2, 'secundaria'),
(12, 3, 'secundaria'),
(13, 4, 'secundaria'),
(14, 5, 'secundaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado_has_curso`
--

CREATE TABLE `grado_has_curso` (
  `idAsignatura` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `idAula` int(11) NOT NULL,
  `idProfesor` int(11) NOT NULL,
  `idHorario` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grado_has_curso`
--

INSERT INTO `grado_has_curso` (`idAsignatura`, `idCurso`, `idAula`, `idProfesor`, `idHorario`, `idPeriodo`) VALUES
(1, 1, 1, 6, 13, 3),
(2, 1, 2, 10, 12, 3),
(3, 1, 3, 1, 1, 3),
(4, 1, 4, 7, 7, 3),
(5, 1, 5, 7, 13, 3),
(6, 1, 6, 9, 3, 3),
(7, 1, 7, 10, 3, 3),
(8, 1, 8, 10, 5, 3),
(9, 1, 9, 5, 7, 3),
(10, 1, 10, 2, 12, 3),
(11, 1, 11, 5, 9, 3),
(12, 1, 12, 3, 6, 3),
(13, 1, 13, 10, 11, 3),
(14, 1, 14, 10, 4, 3),
(15, 1, 15, 2, 1, 3),
(16, 1, 16, 9, 4, 3),
(17, 1, 17, 6, 3, 3),
(18, 1, 18, 6, 9, 3),
(19, 1, 19, 8, 6, 3),
(20, 1, 20, 1, 4, 3),
(21, 1, 21, 4, 2, 3),
(22, 1, 22, 8, 8, 3),
(23, 1, 23, 1, 7, 3),
(24, 1, 24, 1, 8, 3),
(25, 1, 25, 10, 1, 3),
(26, 2, 1, 5, 4, 3),
(27, 2, 2, 6, 6, 3),
(28, 2, 3, 9, 2, 3),
(29, 2, 4, 5, 11, 3),
(30, 2, 5, 9, 1, 3),
(31, 2, 6, 7, 10, 3),
(32, 2, 7, 9, 13, 3),
(33, 2, 8, 11, 6, 3),
(34, 2, 9, 1, 14, 3),
(35, 2, 10, 10, 3, 3),
(36, 2, 11, 9, 1, 3),
(37, 2, 12, 6, 9, 3),
(38, 2, 13, 1, 11, 3),
(39, 2, 14, 3, 13, 3),
(40, 2, 15, 10, 1, 3),
(41, 2, 16, 8, 2, 3),
(42, 2, 17, 11, 14, 3),
(43, 2, 18, 5, 14, 3),
(44, 2, 19, 5, 3, 3),
(45, 2, 20, 3, 5, 3),
(46, 2, 21, 8, 13, 3),
(47, 2, 22, 6, 8, 3),
(48, 2, 23, 2, 11, 3),
(49, 2, 24, 6, 13, 3),
(50, 2, 25, 6, 2, 3),
(51, 3, 1, 1, 6, 3),
(52, 3, 2, 7, 10, 3),
(53, 3, 3, 9, 10, 3),
(54, 3, 4, 7, 4, 3),
(55, 3, 5, 6, 7, 3),
(56, 3, 6, 10, 10, 3),
(57, 3, 7, 4, 4, 3),
(58, 3, 8, 3, 1, 3),
(59, 3, 9, 4, 12, 3),
(60, 3, 10, 7, 11, 3),
(61, 3, 11, 1, 10, 3),
(62, 3, 12, 11, 7, 3),
(63, 3, 13, 4, 11, 3),
(64, 3, 14, 5, 2, 3),
(65, 3, 15, 5, 2, 3),
(66, 3, 16, 7, 13, 3),
(67, 3, 17, 7, 9, 3),
(68, 3, 18, 10, 13, 3),
(69, 3, 19, 6, 14, 3),
(70, 3, 20, 1, 11, 3),
(71, 3, 21, 8, 4, 3),
(72, 3, 22, 4, 2, 3),
(73, 3, 23, 10, 11, 3),
(74, 3, 24, 4, 8, 3),
(75, 3, 25, 6, 5, 3),
(76, 4, 1, 7, 5, 3),
(77, 4, 2, 10, 7, 3),
(78, 4, 3, 2, 14, 3),
(79, 4, 4, 11, 4, 3),
(80, 4, 5, 10, 1, 3),
(81, 4, 6, 8, 4, 3),
(82, 4, 7, 7, 15, 3),
(83, 4, 8, 9, 14, 3),
(84, 4, 9, 4, 1, 3),
(85, 4, 10, 5, 14, 3),
(86, 4, 11, 2, 2, 3),
(87, 4, 12, 7, 9, 3),
(88, 4, 13, 5, 6, 3),
(89, 4, 14, 7, 9, 3),
(90, 4, 15, 8, 12, 3),
(91, 4, 16, 4, 6, 3),
(92, 4, 17, 11, 14, 3),
(93, 4, 18, 11, 4, 3),
(94, 4, 19, 11, 3, 3),
(95, 4, 20, 10, 13, 3),
(96, 4, 21, 10, 4, 3),
(97, 4, 22, 6, 14, 3),
(98, 4, 23, 7, 8, 3),
(99, 4, 24, 6, 15, 3),
(100, 4, 25, 7, 8, 3),
(101, 5, 1, 11, 5, 3),
(102, 5, 2, 1, 13, 3),
(103, 5, 3, 10, 6, 3),
(104, 5, 4, 8, 10, 3),
(105, 5, 5, 4, 9, 3),
(106, 5, 6, 11, 9, 3),
(107, 5, 7, 5, 13, 3),
(108, 5, 8, 11, 1, 3),
(109, 5, 9, 11, 8, 3),
(110, 5, 10, 11, 14, 3),
(111, 5, 11, 4, 6, 3),
(112, 5, 12, 1, 11, 3),
(113, 5, 13, 11, 10, 3),
(114, 5, 14, 8, 6, 3),
(115, 5, 15, 6, 15, 3),
(116, 5, 16, 9, 10, 3),
(117, 5, 17, 5, 6, 3),
(118, 5, 18, 10, 2, 3),
(119, 5, 19, 6, 9, 3),
(120, 5, 20, 10, 1, 3),
(121, 5, 21, 11, 2, 3),
(122, 5, 22, 10, 10, 3),
(123, 5, 23, 8, 8, 3),
(124, 5, 24, 8, 12, 3),
(125, 5, 25, 7, 7, 3),
(126, 6, 1, 5, 12, 3),
(127, 6, 2, 7, 12, 3),
(128, 6, 3, 5, 1, 3),
(129, 6, 4, 8, 7, 3),
(130, 6, 5, 5, 6, 3),
(131, 6, 6, 1, 3, 3),
(132, 6, 7, 10, 4, 3),
(133, 6, 8, 4, 4, 3),
(134, 6, 9, 10, 7, 3),
(135, 6, 10, 3, 11, 3),
(136, 6, 11, 11, 5, 3),
(137, 6, 12, 8, 1, 3),
(138, 6, 13, 9, 3, 3),
(139, 6, 14, 10, 8, 3),
(140, 6, 15, 10, 2, 3),
(141, 6, 16, 9, 6, 3),
(142, 6, 17, 5, 2, 3),
(143, 6, 18, 2, 12, 3),
(144, 6, 19, 9, 7, 3),
(145, 6, 20, 1, 5, 3),
(146, 6, 21, 6, 4, 3),
(147, 6, 22, 4, 6, 3),
(148, 6, 23, 9, 14, 3),
(149, 6, 24, 7, 10, 3),
(150, 6, 25, 3, 3, 3),
(151, 7, 1, 6, 3, 3),
(152, 7, 2, 1, 1, 3),
(153, 7, 3, 1, 11, 3),
(154, 7, 4, 11, 5, 3),
(155, 7, 5, 2, 11, 3),
(156, 7, 6, 3, 15, 3),
(157, 7, 7, 2, 1, 3),
(158, 7, 8, 7, 8, 3),
(159, 7, 9, 1, 14, 3),
(160, 7, 10, 1, 6, 3),
(161, 7, 11, 10, 1, 3),
(162, 7, 12, 11, 14, 3),
(163, 7, 13, 8, 1, 3),
(164, 7, 14, 2, 6, 3),
(165, 7, 15, 6, 1, 3),
(166, 7, 16, 1, 2, 3),
(167, 7, 17, 10, 6, 3),
(168, 7, 18, 6, 11, 3),
(169, 7, 19, 8, 3, 3),
(170, 7, 20, 11, 2, 3),
(171, 7, 21, 6, 6, 3),
(172, 7, 22, 11, 11, 3),
(173, 7, 23, 4, 6, 3),
(174, 7, 24, 1, 9, 3),
(175, 7, 25, 8, 5, 3),
(176, 8, 1, 3, 8, 3),
(177, 8, 2, 4, 10, 3),
(178, 8, 3, 2, 7, 3),
(179, 8, 4, 5, 2, 3),
(180, 8, 5, 3, 9, 3),
(181, 8, 6, 11, 5, 3),
(182, 8, 7, 8, 8, 3),
(183, 8, 8, 1, 7, 3),
(184, 8, 9, 1, 15, 3),
(185, 8, 10, 8, 11, 3),
(186, 8, 11, 1, 4, 3),
(187, 8, 12, 6, 9, 3),
(188, 8, 13, 7, 4, 3),
(189, 8, 14, 7, 15, 3),
(190, 8, 15, 3, 8, 3),
(191, 8, 16, 1, 4, 3),
(192, 8, 17, 6, 8, 3),
(193, 8, 18, 2, 11, 3),
(194, 8, 19, 7, 8, 3),
(195, 8, 20, 8, 8, 3),
(196, 8, 21, 4, 5, 3),
(197, 8, 22, 11, 1, 3),
(198, 8, 23, 10, 2, 3),
(199, 8, 24, 9, 15, 3),
(200, 8, 25, 9, 15, 3),
(201, 9, 1, 3, 11, 3),
(202, 9, 2, 7, 3, 3),
(203, 9, 3, 11, 13, 3),
(204, 9, 4, 7, 5, 3),
(205, 9, 5, 10, 6, 3),
(206, 9, 6, 11, 2, 3),
(207, 9, 7, 3, 8, 3),
(208, 9, 8, 10, 15, 3),
(209, 9, 9, 2, 10, 3),
(210, 9, 10, 3, 10, 3),
(211, 9, 11, 7, 7, 3),
(212, 9, 12, 3, 6, 3),
(213, 9, 13, 11, 11, 3),
(214, 9, 14, 3, 1, 3),
(215, 9, 15, 2, 9, 3),
(216, 9, 16, 5, 10, 3),
(217, 9, 17, 9, 13, 3),
(218, 9, 18, 7, 15, 3),
(219, 9, 19, 2, 10, 3),
(220, 9, 20, 2, 2, 3),
(221, 9, 21, 3, 13, 3),
(222, 9, 22, 2, 3, 3),
(223, 9, 23, 6, 3, 3),
(224, 9, 24, 6, 10, 3),
(225, 9, 25, 11, 3, 3),
(226, 10, 1, 8, 10, 3),
(227, 10, 2, 5, 8, 3),
(228, 10, 3, 10, 10, 3),
(229, 10, 4, 10, 11, 3),
(230, 10, 5, 5, 15, 3),
(231, 10, 6, 1, 13, 3),
(232, 10, 7, 1, 5, 3),
(233, 10, 8, 2, 10, 3),
(234, 10, 9, 8, 7, 3),
(235, 10, 10, 7, 6, 3),
(236, 10, 11, 10, 4, 3),
(237, 10, 12, 5, 12, 3),
(238, 10, 13, 11, 13, 3),
(239, 10, 14, 10, 3, 3),
(240, 10, 15, 10, 8, 3),
(241, 10, 16, 11, 7, 3),
(242, 10, 17, 6, 5, 3),
(243, 10, 18, 1, 6, 3),
(244, 10, 19, 10, 9, 3),
(245, 10, 20, 8, 7, 3),
(246, 10, 21, 3, 3, 3),
(247, 10, 22, 10, 5, 3),
(248, 10, 23, 8, 15, 3),
(249, 10, 24, 1, 13, 3),
(250, 10, 25, 9, 10, 3),
(251, 11, 1, 11, 2, 3),
(252, 11, 2, 9, 14, 3),
(253, 11, 3, 2, 7, 3),
(254, 11, 4, 1, 12, 3),
(255, 11, 5, 11, 2, 3),
(256, 11, 6, 10, 10, 3),
(257, 11, 7, 5, 3, 3),
(258, 11, 8, 1, 2, 3),
(259, 11, 9, 9, 4, 3),
(260, 11, 10, 3, 7, 3),
(261, 11, 11, 9, 14, 3),
(262, 11, 12, 7, 6, 3),
(263, 11, 13, 4, 13, 3),
(264, 11, 14, 11, 7, 3),
(265, 11, 15, 8, 2, 3),
(266, 11, 16, 9, 8, 3),
(267, 11, 17, 6, 5, 3),
(268, 11, 18, 11, 14, 3),
(269, 11, 19, 8, 11, 3),
(270, 11, 20, 3, 6, 3),
(271, 11, 21, 1, 9, 3),
(272, 11, 22, 8, 4, 3),
(273, 11, 23, 8, 8, 3),
(274, 11, 24, 9, 11, 3),
(275, 11, 25, 1, 1, 3),
(276, 12, 1, 1, 8, 3),
(277, 12, 2, 4, 9, 3),
(278, 12, 3, 9, 10, 3),
(279, 12, 4, 11, 7, 3),
(280, 12, 5, 11, 8, 3),
(281, 12, 6, 2, 3, 3),
(282, 12, 7, 4, 12, 3),
(283, 12, 8, 11, 8, 3),
(284, 12, 9, 11, 7, 3),
(285, 12, 10, 8, 9, 3),
(286, 12, 11, 8, 12, 3),
(287, 12, 12, 2, 7, 3),
(288, 12, 13, 11, 11, 3),
(289, 12, 14, 6, 2, 3),
(290, 12, 15, 11, 3, 3),
(291, 12, 16, 6, 5, 3),
(292, 12, 17, 3, 6, 3),
(293, 12, 18, 1, 3, 3),
(294, 12, 19, 7, 4, 3),
(295, 12, 20, 7, 6, 3),
(296, 12, 21, 4, 11, 3),
(297, 12, 22, 7, 9, 3),
(298, 12, 23, 4, 8, 3),
(299, 12, 24, 11, 10, 3),
(300, 12, 25, 2, 8, 3),
(301, 13, 1, 4, 13, 3),
(302, 13, 2, 3, 4, 3),
(303, 13, 3, 3, 3, 3),
(304, 13, 4, 9, 12, 3),
(305, 13, 5, 3, 12, 3),
(306, 13, 6, 6, 6, 3),
(307, 13, 7, 11, 7, 3),
(308, 13, 8, 6, 3, 3),
(309, 13, 9, 6, 2, 3),
(310, 13, 10, 1, 8, 3),
(311, 13, 11, 3, 3, 3),
(312, 13, 12, 6, 9, 3),
(313, 13, 13, 1, 11, 3),
(314, 13, 14, 5, 14, 3),
(315, 13, 15, 11, 2, 3),
(316, 13, 16, 3, 13, 3),
(317, 13, 17, 2, 7, 3),
(318, 13, 18, 3, 10, 3),
(319, 13, 19, 4, 2, 3),
(320, 13, 20, 7, 13, 3),
(321, 13, 21, 7, 15, 3),
(322, 13, 22, 7, 6, 3),
(323, 13, 23, 7, 7, 3),
(324, 13, 24, 7, 2, 3),
(325, 13, 25, 6, 14, 3),
(326, 14, 1, 1, 8, 3),
(327, 14, 2, 5, 12, 3),
(328, 14, 3, 4, 5, 3),
(329, 14, 4, 2, 15, 3),
(330, 14, 5, 11, 4, 3),
(331, 14, 6, 8, 2, 3),
(332, 14, 7, 9, 15, 3),
(333, 14, 8, 11, 3, 3),
(334, 14, 9, 9, 9, 3),
(335, 14, 10, 1, 3, 3),
(336, 14, 11, 5, 13, 3),
(337, 14, 12, 11, 12, 3),
(338, 14, 13, 10, 15, 3),
(339, 14, 14, 10, 15, 3),
(340, 14, 15, 2, 2, 3),
(341, 14, 16, 6, 8, 3),
(342, 14, 17, 3, 6, 3),
(343, 14, 18, 1, 1, 3),
(344, 14, 19, 9, 2, 3),
(345, 14, 20, 1, 9, 3),
(346, 14, 21, 5, 13, 3),
(347, 14, 22, 10, 7, 3),
(348, 14, 23, 8, 6, 3),
(349, 14, 24, 7, 15, 3),
(350, 14, 25, 6, 13, 3),
(351, 15, 1, 3, 1, 3),
(352, 15, 2, 7, 11, 3),
(353, 15, 3, 5, 15, 3),
(354, 15, 4, 5, 14, 3),
(355, 15, 5, 3, 5, 3),
(356, 15, 6, 8, 11, 3),
(357, 15, 7, 11, 12, 3),
(358, 15, 8, 3, 12, 3),
(359, 15, 9, 2, 9, 3),
(360, 15, 10, 8, 6, 3),
(361, 15, 11, 2, 12, 3),
(362, 15, 12, 11, 4, 3),
(363, 15, 13, 6, 11, 3),
(364, 15, 14, 9, 15, 3),
(365, 15, 15, 6, 12, 3),
(366, 15, 16, 9, 1, 3),
(367, 15, 17, 6, 6, 3),
(368, 15, 18, 4, 14, 3),
(369, 15, 19, 5, 3, 3),
(370, 15, 20, 11, 15, 3),
(371, 15, 21, 11, 5, 3),
(372, 15, 22, 1, 12, 3),
(373, 15, 23, 3, 3, 3),
(374, 15, 24, 4, 8, 3),
(375, 15, 25, 6, 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `idHorario` int(20) NOT NULL,
  `diaSemana` varchar(10) NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`idHorario`, `diaSemana`, `horaInicio`, `horaFin`) VALUES
(1, 'LUNES', '08:00:00', '09:30:00'),
(2, 'LUNES', '09:45:00', '11:15:00'),
(3, 'LUNES', '11:30:00', '13:00:00'),
(4, 'LUNES', '13:00:00', '14:30:00'),
(5, 'MARTES', '08:00:00', '09:30:00'),
(6, 'MARTES', '09:45:00', '11:15:00'),
(7, 'MARTES', '11:30:00', '13:00:00'),
(8, 'MARTES', '13:00:00', '14:30:00'),
(9, 'MIERCOLES', '08:00:00', '09:30:00'),
(10, 'MIERCOLES', '09:45:00', '11:15:00'),
(11, 'MIERCOLES', '11:30:00', '13:00:00'),
(12, 'MIERCOLES', '13:00:00', '14:30:00'),
(13, 'JUEVES', '08:00:00', '09:30:00'),
(14, 'JUEVES', '09:45:00', '11:15:00'),
(15, 'JUEVES', '11:30:00', '13:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matricula`
--

CREATE TABLE `matricula` (
  `idMatricula` int(11) NOT NULL,
  `idAlumno` int(11) NOT NULL,
  `idAula` int(20) NOT NULL,
  `idPeriodo` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `matricula`
--

INSERT INTO `matricula` (`idMatricula`, `idAlumno`, `idAula`, `idPeriodo`) VALUES
(1, 1, 1, 3),
(2, 2, 1, 3),
(3, 3, 2, 3),
(4, 4, 2, 3),
(5, 5, 3, 3),
(6, 6, 3, 3),
(7, 7, 4, 3),
(8, 8, 4, 3),
(9, 9, 5, 3),
(10, 10, 5, 3),
(11, 11, 6, 3),
(12, 12, 6, 3),
(13, 13, 7, 3),
(14, 14, 7, 3),
(15, 15, 8, 3),
(16, 16, 8, 3),
(17, 17, 9, 3),
(18, 18, 9, 3),
(19, 19, 10, 3),
(20, 20, 10, 3),
(21, 21, 11, 3),
(22, 22, 11, 3),
(23, 23, 12, 3),
(24, 24, 12, 3),
(25, 25, 13, 3),
(26, 26, 13, 3),
(27, 27, 14, 3),
(28, 28, 14, 3),
(29, 29, 15, 3),
(30, 30, 15, 3),
(31, 31, 16, 3),
(32, 32, 16, 3),
(33, 33, 17, 3),
(34, 34, 17, 3),
(35, 35, 18, 3),
(36, 36, 18, 3),
(37, 37, 19, 3),
(38, 38, 19, 3),
(39, 39, 20, 3),
(40, 40, 20, 3),
(41, 41, 21, 3),
(42, 42, 21, 3),
(43, 43, 22, 3),
(44, 44, 22, 3),
(45, 45, 23, 3),
(46, 46, 23, 3),
(47, 47, 24, 3),
(48, 48, 24, 3),
(49, 49, 25, 3),
(50, 50, 25, 3),
(51, 51, 26, 3),
(52, 52, 26, 3),
(53, 53, 27, 3),
(54, 54, 27, 3),
(55, 55, 28, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodo`
--

CREATE TABLE `periodo` (
  `idPeriodo` int(20) NOT NULL,
  `nombreAño` varchar(50) NOT NULL,
  `año` int(4) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `periodo`
--

INSERT INTO `periodo` (`idPeriodo`, `nombreAño`, `año`, `fechaInicio`, `fechaFin`) VALUES
(1, 'Año del Diálogo y la Reconciliación Nacional', 2018, '2018-03-23', '2018-12-21'),
(2, 'Año de la lucha contra la corrupción e impunidad', 2019, '2019-03-22', '2019-12-20'),
(3, 'Año de la universalización de la salud', 2020, '2020-03-20', '2020-12-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPersona` int(100) NOT NULL,
  `dni` int(9) NOT NULL,
  `nombres` varchar(30) NOT NULL,
  `apellidoPaterno` varchar(20) NOT NULL,
  `apellidoMaterno` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `telefono` int(9) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `direccion` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPersona`, `dni`, `nombres`, `apellidoPaterno`, `apellidoMaterno`, `email`, `telefono`, `fechaNacimiento`, `direccion`) VALUES
(1, 46329700, 'Leelah', 'Leif', 'Peterkin', 'lpeterkin0@yellowpages.com', 0, '2020-09-09', ''),
(2, 89094900, 'Gilberta', 'Bahlmann', 'Blitzer', 'gblitzer1@csmonitor.com', 0, NULL, ''),
(3, 76753618, 'Atalanta', 'Sharp', 'Glasscock', 'aglasscock2@webnode.com', 0, NULL, ''),
(4, 15856196, 'Pierce', 'Sleney', 'Jerrome', 'pjerrome3@dropbox.com', 0, NULL, ''),
(5, 70665593, 'Corinne', 'Noke', 'Wilsey', 'cwilsey4@virginia.edu', 0, NULL, ''),
(6, 94340624, 'Obediah', 'Blancowe', 'Dossit', 'odossit5@vinaora.com', 0, NULL, ''),
(7, 49122604, 'Blair', 'Giraudoux', 'Giacomuzzo', 'bgiacomuzzo6@va.gov', 0, NULL, ''),
(8, 39866487, 'Matelda', 'Wrist', 'Olivie', 'molivie7@ucoz.com', 0, NULL, ''),
(9, 99579875, 'Elysha', 'Wibrew', 'Goodbarne', 'egoodbarne8@people.com.cn', 0, NULL, ''),
(10, 36874941, 'Deck', 'Vasyuchov', 'Poncet', 'dponcet9@disqus.com', 0, NULL, ''),
(11, 37637070, 'Garold', 'Stearn', 'Bulgen', 'gbulgena@amazon.co.uk', 0, NULL, ''),
(12, 88119997, 'Eben', 'Cable', 'Gerger', 'egergerb@bloglovin.com', 0, NULL, ''),
(13, 85201244, 'Mariska', 'Tofanelli', 'Vannikov', 'mvannikovc@stanford.edu', 0, NULL, ''),
(14, 45623201, 'Avictor', 'Newbery', 'Zeale', 'azealed@g.co', 0, NULL, ''),
(15, 25416926, 'Uriah', 'Balasini', 'Warmisham', 'uwarmishame@123-reg.co.uk', 0, NULL, ''),
(16, 90796965, 'Courtnay', 'Camilio', 'Eastmead', 'ceastmeadf@nba.com', 0, NULL, ''),
(17, 44996940, 'Meredith', 'Mattityahou', 'Churches', 'mchurchesg@canalblog.com', 0, NULL, ''),
(18, 89857484, 'Emlyn', 'Rebbeck', 'Glazyer', 'eglazyerh@cbc.ca', 0, NULL, ''),
(19, 20519552, 'Dionis', 'Mowling', 'Feaveer', 'dfeaveeri@businessweek.com', 0, NULL, ''),
(20, 85824198, 'Vladamir', 'Groucock', 'Elcomb', 'velcombj@ca.gov', 0, NULL, ''),
(21, 42612059, 'Ferdinande', 'Warboys', 'Huxley', 'fhuxleyk@myspace.com', 0, NULL, ''),
(22, 49778898, 'Leonid', 'Skellion', 'Antonucci', 'lantonuccil@cbslocal.com', 0, NULL, ''),
(23, 5440469, 'Stillman', 'Harnor', 'Harvey', 'sharveym@vk.com', 0, NULL, ''),
(24, 43767284, 'Welby', 'St. Pierre', 'Daburn', 'wdaburnn@nyu.edu', 0, NULL, ''),
(25, 24496303, 'Wade', 'Kellough', 'Frape', 'wfrapeo@boston.com', 0, NULL, ''),
(26, 47259918, 'Allegra', 'Purkiss', 'McGilroy', 'amcgilroyp@unblog.fr', 0, NULL, ''),
(27, 75165302, 'Carmine', 'Follin', 'Godehard.sf', 'cgodehardsfq@dion.ne.jp', 0, NULL, ''),
(28, 89935261, 'Darcie', 'Collins', 'Hackforth', 'dhackforthr@yahoo.com', 0, NULL, ''),
(29, 62032370, 'Jeremie', 'Stebbing', 'Taverner', 'jtaverners@free.fr', 0, NULL, ''),
(30, 14542099, 'Kitti', 'Blumfield', 'Arni', 'karnit@sina.com.cn', 0, NULL, ''),
(31, 19825793, 'Lauree', 'Corrett', 'Vasyagin', 'lvasyaginu@freewebs.com', 0, NULL, ''),
(32, 99732185, 'Lester', 'Phetteplace', 'Guidini', 'lguidiniv@mlb.com', 0, NULL, ''),
(33, 88196188, 'Tadio', 'Lamberth', 'Greson', 'tgresonw@utexas.edu', 0, NULL, ''),
(34, 49829551, 'Cecilio', 'Ondrus', 'Sykora', 'csykorax@multiply.com', 0, NULL, ''),
(35, 46961523, 'Rosco', 'Farlow', 'Sedman', 'rsedmany@so-net.ne.jp', 0, NULL, ''),
(36, 97571757, 'Emlyn', 'Lewty', 'Stranger', 'estrangerz@usa.gov', 0, NULL, ''),
(37, 59194378, 'Lynnelle', 'Arnoldi', 'Ironmonger', 'lironmonger10@ycombinator.com', 0, NULL, ''),
(38, 39969645, 'Lara', 'Millwater', 'Joney', 'ljoney11@furl.net', 0, NULL, ''),
(39, 58284391, 'Christy', 'Bedinham', 'Lindblom', 'clindblom12@nymag.com', 0, NULL, ''),
(40, 24522855, 'Edvard', 'Siveter', 'de\'-Ancy Willis', 'edeancywillis13@bloglovin.com', 0, NULL, ''),
(41, 53226204, 'Ber', 'McKyrrelly', 'Matthews', 'bmatthews14@nifty.com', 0, NULL, ''),
(42, 74954518, 'Stacey', 'Shillan', 'Ullyatt', 'sullyatt15@slideshare.net', 0, NULL, ''),
(43, 14222902, 'Arvy', 'Paynter', 'Weatherill', 'aweatherill16@alibaba.com', 0, NULL, ''),
(44, 95072724, 'Dorice', 'Leuren', 'Pfeifer', 'dpfeifer17@walmart.com', 0, NULL, ''),
(45, 95462675, 'Verene', 'Ropars', 'Hanrott', 'vhanrott18@cpanel.net', 0, NULL, ''),
(46, 69135141, 'Teri', 'Howden', 'Varty', 'tvarty19@reverbnation.com', 0, NULL, ''),
(47, 58596265, 'Marlon', 'Tweede', 'Stones', 'mstones1a@shutterfly.com', 0, NULL, ''),
(48, 74967305, 'York', 'Dunbobin', 'Harries', 'yharries1b@twitpic.com', 0, NULL, ''),
(49, 2244564, 'Maggee', 'Colbron', 'Rosencwaig', 'mrosencwaig1c@webnode.com', 0, NULL, ''),
(50, 54216548, 'Isabel', 'MacCawley', 'Chuney', 'ichuney1d@wikimedia.org', 0, NULL, ''),
(51, 41363858, 'Terrell', 'O\'Suaird', 'Millea', 'tmillea1e@ow.ly', 0, NULL, ''),
(52, 38531318, 'Blake', 'Brick', 'Elston', 'belston1f@yandex.ru', 0, NULL, ''),
(53, 8277333, 'Wanids', 'Evitts', 'Zapatero', 'wzapatero1g@skype.com', 0, NULL, ''),
(54, 9277230, 'Elise', 'Ungerer', 'Gregoriou', 'egregoriou1h@fotki.com', 0, NULL, ''),
(55, 69839306, 'Celinka', 'Ickowicz', 'Kingcott', 'ckingcott1i@nifty.com', 0, NULL, ''),
(56, 60871290, 'Estell', 'Elam', 'Fairn', 'efairn1j@theatlantic.com', 0, NULL, ''),
(57, 42352285, 'Ingram', 'Skupinski', 'Coytes', 'icoytes1k@globo.com', 0, NULL, ''),
(58, 99315530, 'Ingelbert', 'McAlester', 'Cream', 'icream1l@pagesperso-orange.fr', 0, NULL, ''),
(59, 83344771, 'Humfrey', 'Huson', 'Grinin', 'hgrinin1m@upenn.edu', 0, NULL, ''),
(60, 29796766, 'Jerrilyn', 'Dulake', 'Rhydderch', 'jrhydderch1n@acquirethisname.c', 0, NULL, ''),
(61, 7244186, 'Carmelina', 'Jouanot', 'Kayes', 'ckayes1o@shop-pro.jp', 0, NULL, ''),
(62, 94526376, 'Arte', 'Gillion', 'Zannelli', 'azannelli1p@github.io', 0, NULL, ''),
(63, 75413498, 'Catarina', 'Delahunt', 'Birkenhead', 'cbirkenhead1q@psu.edu', 0, NULL, ''),
(64, 64514760, 'Gaile', 'Naulty', 'Gaw', 'ggaw1r@vk.com', 0, NULL, ''),
(65, 10188501, 'Riley', 'Woollcott', 'Farr', 'rfarr1s@webs.com', 0, NULL, ''),
(66, 13462061, 'Olenolin', 'Arminger', 'Obispo', 'oobispo1t@ustream.tv', 0, NULL, ''),
(67, 20728470, 'Clementius', 'Gritsunov', 'Rubert', 'crubert1u@blogs.com', 0, NULL, ''),
(68, 6798434, 'Kirbee', 'Joseff', 'Gossage', 'kgossage1v@unesco.org', 0, NULL, ''),
(69, 48357226, 'Clotilda', 'Dargavel', 'Jimeno', 'cjimeno1w@ucoz.ru', 0, NULL, ''),
(70, 36226817, 'Northrop', 'Carnaman', 'Marsden', 'nmarsden1x@so-net.ne.jp', 0, NULL, ''),
(71, 7170485, 'Hillard', 'Vinten', 'Pelchat', 'hpelchat1y@dropbox.com', 0, NULL, ''),
(72, 86406831, 'Franchot', 'Redwin', 'Pes', 'fpes1z@bloomberg.com', 0, NULL, ''),
(73, 70164405, 'Michel', 'Geraldini', 'Leverson', 'mleverson20@networkadvertising', 0, NULL, ''),
(74, 17685804, 'Joletta', 'Crauford', 'Banister', 'jbanister21@php.net', 0, NULL, ''),
(75, 28882589, 'Peadar', 'Pothecary', 'Habberjam', 'phabberjam22@edublogs.org', 0, NULL, ''),
(76, 48967276, 'Morey', 'Aldin', 'Tabram', 'mtabram23@homestead.com', 0, NULL, ''),
(77, 28609054, 'Karia', 'Diviney', 'Brownsell', 'kbrownsell24@technorati.com', 0, NULL, ''),
(78, 17837838, 'Hermione', 'Sarsons', 'Durnall', 'hdurnall25@vinaora.com', 0, NULL, ''),
(79, 6682047, 'Terrence', 'Moatt', 'Corris', 'tcorris26@state.gov', 0, NULL, ''),
(80, 37605613, 'Octavius', 'Dunston', 'Sweedland', 'osweedland27@lulu.com', 0, NULL, ''),
(81, 97906873, 'Odell', 'Broadbere', 'Heinz', 'oheinz28@amazon.de', 0, NULL, ''),
(82, 74327118, 'Frants', 'Danilewicz', 'Worster', 'fworster29@dailymail.co.uk', 0, NULL, ''),
(83, 24193217, 'Darrelle', 'Syers', 'Woolerton', 'dwoolerton2a@weibo.com', 0, NULL, ''),
(84, 88991200, 'Florette', 'McGillicuddy', 'McKerlie', 'fmckerlie2b@latimes.com', 0, NULL, ''),
(85, 82902233, 'Claybourne', 'Dampney', 'Brunton', 'cbrunton2c@dailymotion.com', 0, NULL, ''),
(86, 45030581, 'Clarke', 'Endecott', 'Claque', 'cclaque2d@sciencedaily.com', 0, NULL, ''),
(87, 3246273, 'Sunny', 'Beldom', 'Sisley', 'ssisley2e@bloglines.com', 0, NULL, ''),
(88, 24330965, 'Francisca', 'Simmank', 'MacCrosson', 'fmaccrosson2f@google.it', 0, NULL, ''),
(89, 19404953, 'Karna', 'Hogben', 'Squeers', 'ksqueers2g@cargocollective.com', 0, NULL, ''),
(90, 22263457, 'Antonia', 'O\'Donnell', 'Fredi', 'afredi2h@multiply.com', 0, NULL, ''),
(91, 31891196, 'Mabelle', 'Conradsen', 'Ugoletti', 'mugoletti2i@behance.net', 0, NULL, ''),
(92, 5769255, 'Lulu', 'Kaesmakers', 'McGuffog', 'lmcguffog2j@webeden.co.uk', 0, NULL, ''),
(93, 22915548, 'Evey', 'Winch', 'Alesio', 'ealesio2k@pcworld.com', 0, NULL, ''),
(94, 8571002, 'Fons', 'Burel', 'Spurdon', 'fspurdon2l@goo.gl', 0, NULL, ''),
(95, 70877012, 'Xymenes', 'Stutard', 'Janko', 'xjanko2m@dagondesign.com', 0, NULL, ''),
(96, 69721015, 'Tate', 'O\'Kane', 'Buyers', 'tbuyers2n@furl.net', 0, NULL, ''),
(97, 1023807, 'Brett', 'Mortel', 'Toulch', 'btoulch2o@cdbaby.com', 0, NULL, ''),
(98, 21000082, 'Corrine', 'Coulthard', 'Meacher', 'cmeacher2p@dailymotion.com', 0, NULL, ''),
(99, 87121605, 'Vick', 'Crowter', 'Darcey', 'vdarcey2q@cam.ac.uk', 0, NULL, ''),
(100, 7291578, 'Buffy', 'Randal', 'Philot', 'bphilot2r@nih.gov', 0, NULL, ''),
(101, 19631598, 'Barnard', 'Hessentaler', 'Jolly', 'bjolly2s@free.fr', 0, NULL, ''),
(102, 98842614, 'Damita', 'Michell', 'Spada', 'dspada2t@cloudflare.com', 0, NULL, ''),
(103, 81797096, 'Max', 'Crooks', 'Finding', 'mfinding2u@yellowbook.com', 0, NULL, ''),
(104, 48033827, 'Mariquilla', 'Vidgen', 'Pesic', 'mpesic2v@nsw.gov.au', 0, NULL, ''),
(105, 53236075, 'Gilburt', 'Macveigh', 'Guerrier', 'gguerrier2w@networkadvertising', 0, NULL, ''),
(106, 96532838, 'Ignacius', 'Schoenrock', 'Easterby', 'ieasterby2x@nationalgeographic', 0, NULL, ''),
(107, 65465729, 'Leonard', 'Eustes', 'Gosswell', 'lgosswell2y@booking.com', 0, NULL, ''),
(108, 93343388, 'Nariko', 'Clewett', 'Killingworth', 'nkillingworth2z@washingtonpost', 0, NULL, ''),
(109, 51265845, 'Malena', 'Shawdforth', 'Deeming', 'mdeeming30@shutterfly.com', 0, NULL, ''),
(110, 83196926, 'Deidre', 'Fairleigh', 'Begent', 'dbegent31@reddit.com', 0, NULL, ''),
(111, 63424387, 'Stanley', 'Harsnipe', 'Lippitt', 'slippitt32@scientificamerican.', 0, NULL, ''),
(112, 442940, 'Emmalynne', 'Ellershaw', 'Keveren', 'ekeveren33@cpanel.net', 0, NULL, ''),
(113, 63842068, 'Garwood', 'Espada', 'Fairham', 'gfairham34@zimbio.com', 0, NULL, ''),
(114, 57760365, 'Sunny', 'Bousquet', 'Pobjay', 'spobjay35@liveinternet.ru', 0, NULL, ''),
(115, 18757515, 'Tonye', 'Duckerin', 'Boundley', 'tboundley36@fc2.com', 0, NULL, ''),
(116, 27134719, 'Lena', 'Ogelbe', 'Chasney', 'lchasney37@xing.com', 0, NULL, ''),
(117, 41775128, 'Mignonne', 'Grimsdike', 'Ianetti', 'mianetti38@ftc.gov', 0, NULL, ''),
(118, 95563384, 'Abdul', 'Giacopini', 'Nevins', 'anevins39@prweb.com', 0, NULL, ''),
(119, 6522886, 'Keen', 'Brecknell', 'Acock', 'kacock3a@shutterfly.com', 0, NULL, ''),
(120, 700196, 'Shayla', 'Boissier', 'Lockner', 'slockner3b@istockphoto.com', 0, NULL, ''),
(121, 9839139, 'Jeralee', 'Whatley', 'Dooland', 'jdooland3c@java.com', 0, NULL, ''),
(122, 17206796, 'Jane', 'Aburrow', 'Hay', 'jhay3d@quantcast.com', 0, NULL, ''),
(123, 16130527, 'Shelagh', 'Treweke', 'Easter', 'seaster3e@si.edu', 0, NULL, ''),
(137, 77531662, 'Fidel', 'Gonzales', 'Marca', 'mijailg07@gmail.com', 0, NULL, ''),
(138, 73885739, 'Alvaro', 'Begazo', 'Carhuayo', 'alvaro96-15@outlook.es', 0, NULL, ''),
(139, 73885712, 'Martin', 'Vizcarra', 'Presidente', 'al13-10@outlook.es', 0, NULL, ''),
(140, 12345678, 'prueba', 'pruebaP', 'pruebaM', 'prueba@outlook.es', 0, NULL, ''),
(141, 73885755, 'Hugo', 'Corderizi', 'Melo', 'hcordero@gmail.com', 0, NULL, ''),
(142, 73885751, 'nombreP', 'ApellidoP', 'ApellidoM', 'emailP', 0, NULL, ''),
(143, 73885766, 'ffff', 'gggg', 'hhhh', 'a@gg', 0, NULL, ''),
(144, 87654321, 'alvaro', 'prueba', 'prueba2', 'dfxgg', 0, NULL, ''),
(145, 99999999, 'alex', 'fernando', 'cabrera', 'assdads', 0, NULL, ''),
(146, 73885700, 'prueba', 'Vizcarra', 'Presidente', 'alv-10@outlook.es', 0, NULL, ''),
(147, 73885711, 'prueba2', 'Vizcarra2', 'Presidente2', 'alv-102@outlook.es', 0, NULL, ''),
(148, 88888888, 'pruebaN8', 'pruebaP8', 'pruebaM8', 'prueba8@outlook.es', 0, NULL, ''),
(150, 88888887, 'pruebaN8', 'pruebaP8', 'pruebaM8', 'prueba87@outlook.es', 0, NULL, ''),
(151, 87654123, 'qwert', 'asdfg', 'xcvb', 'asdfdgf@gmail.com', 0, NULL, ''),
(156, 55555555, 'alv', 'alv', 'alv', 'alv666@outlook.es', 0, NULL, ''),
(157, 73881111, 'prueba2', 'Vizcarra2', 'Presidente2', 'alv-gg@outlook.es', 0, NULL, ''),
(158, 73111111, 'prueba21', 'Vizcarra21', 'Presidente21', 'alv-gg1@outlook.es', 987654324, '2020-05-15', 'av canevaro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promedio`
--

CREATE TABLE `promedio` (
  `idProm` int(11) NOT NULL,
  `promedio` int(11) NOT NULL,
  `codigoMatricula` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `promedio`
--

INSERT INTO `promedio` (`idProm`, `promedio`, `codigoMatricula`) VALUES
(1, 13, 1),
(2, 8, 2),
(3, 19, 3),
(4, 19, 4),
(5, 2, 5),
(6, 9, 6),
(7, 20, 7),
(8, 12, 8),
(9, 1, 9),
(10, 10, 10),
(11, 10, 11),
(12, 12, 12),
(13, 11, 13),
(14, 17, 14),
(15, 3, 15),
(16, 9, 16),
(17, 14, 17),
(18, 11, 18),
(19, 20, 19),
(20, 12, 20),
(21, 12, 21),
(22, 12, 22),
(23, 8, 23),
(24, 20, 24),
(25, 2, 25),
(26, 16, 26),
(27, 13, 27),
(28, 13, 28),
(29, 20, 29),
(30, 1, 30),
(31, 3, 31),
(32, 1, 32),
(33, 15, 33),
(34, 10, 34),
(35, 2, 35),
(36, 3, 36),
(37, 15, 37),
(38, 14, 38),
(39, 2, 39),
(40, 18, 40),
(41, 16, 41),
(42, 20, 42),
(43, 13, 43),
(44, 16, 44),
(45, 11, 45),
(46, 5, 46),
(47, 20, 47),
(48, 5, 48),
(49, 16, 49),
(50, 14, 50),
(51, 12, 51),
(52, 18, 52),
(53, 5, 53),
(54, 19, 54),
(55, 10, 55);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int(100) NOT NULL,
  `nombreRol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRol`, `nombreRol`) VALUES
(1, 'Administrador'),
(2, 'Alumno'),
(3, 'Profesor'),
(4, 'Padre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seccion`
--

CREATE TABLE `seccion` (
  `idSeccion` int(20) NOT NULL,
  `seccion` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `seccion`
--

INSERT INTO `seccion` (`idSeccion`, `seccion`) VALUES
(1, 'A'),
(2, 'B');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(100) NOT NULL,
  `usuario` int(10) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `idAdmin` int(20) NOT NULL,
  `idAlumno` int(20) NOT NULL,
  `idProfesor` int(20) NOT NULL,
  `idPadre` int(20) NOT NULL,
  `idPersona` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `usuario`, `contraseña`, `idAdmin`, `idAlumno`, `idProfesor`, `idPadre`, `idPersona`) VALUES
(1, 66801940, 'up8sDlOPqKK', 1, 0, 0, 0, 1),
(2, 36010401, 'taOAmWw', 2, 0, 0, 0, 2),
(3, 34190108, 'dbr0tNgvmX2k', 0, 0, 1, 0, 3),
(4, 87861557, 'uJcKHwfjoSI', 0, 0, 2, 0, 4),
(5, 35893482, '4HC3VIV9', 0, 0, 3, 0, 5),
(6, 62762424, 'HAkI8HMVq9', 0, 0, 4, 0, 6),
(7, 44103241, 'klSTjy', 0, 0, 5, 0, 7),
(8, 22193397, '9thSHSFDrlZ', 0, 0, 6, 0, 8),
(9, 43200498, 'BKN5n1k', 0, 0, 7, 0, 9),
(10, 62626672, '28eitWNdzG', 0, 0, 8, 0, 10),
(11, 14735826, 'FZUOLT', 0, 0, 9, 0, 11),
(12, 69488476, 'qm393q4', 0, 0, 10, 0, 12),
(13, 32776996, 'djQI52Ig', 0, 0, 11, 0, 13),
(14, 65083345, 'U2hJkhm5UGkB', 0, 1, 0, 0, 14),
(15, 96058403, 'NgBN4pCW7', 0, 2, 0, 0, 15),
(16, 1232367, '3TNjaf3J', 0, 3, 0, 0, 16),
(17, 90150704, 'mrSffRUhVBC', 0, 4, 0, 0, 17),
(18, 30051196, 'EhT75xWSFp3j', 0, 5, 0, 0, 18),
(19, 65349876, 'nMljnQLZmIfk', 0, 6, 0, 0, 19),
(20, 63125431, 'IsnEgRoxYi', 0, 7, 0, 0, 20),
(21, 15788191, 'U7XoPysBP5', 0, 8, 0, 0, 21),
(22, 30866894, 'oVQskH', 0, 9, 0, 0, 22),
(23, 82856607, 'hqTMpFP', 0, 10, 0, 0, 23),
(24, 6403217, 'mUFUxzAAx2X', 0, 11, 0, 0, 24),
(25, 94803942, 'XMzQnT', 0, 12, 0, 0, 25),
(26, 63700051, 'DiV269gyff4m', 0, 13, 0, 0, 26),
(27, 68527266, '5WMmwOM', 0, 14, 0, 0, 27),
(28, 19069805, '6juosi38ne', 0, 15, 0, 0, 28),
(29, 77918338, '6THApMk', 0, 16, 0, 0, 29),
(30, 13609647, 'lBEjAgRd', 0, 17, 0, 0, 30),
(31, 28270350, 'nyOvbmu89plM', 0, 18, 0, 0, 31),
(32, 75491604, 's4DfZFNTcKq4', 0, 19, 0, 0, 32),
(33, 45250851, 'DfQ8lF', 0, 20, 0, 0, 33),
(34, 11248928, 'dO67M6LuRt2', 0, 21, 0, 0, 34),
(35, 5253801, 'ZCaszC1WFR1', 0, 22, 0, 0, 35),
(36, 90650213, 'A06Wi6v3p', 0, 23, 0, 0, 36),
(37, 97134460, 'NnQR8vA', 0, 24, 0, 0, 37),
(38, 46224313, 'mFnDhAuuPuzR', 0, 25, 0, 0, 38),
(39, 16129493, 'nJciuebXQcb', 0, 26, 0, 0, 39),
(40, 92613474, 'bl0Vei', 0, 27, 0, 0, 40),
(41, 42368811, 'ynG6FW7zn', 0, 28, 0, 0, 41),
(42, 96729331, 'FWKamJ15', 0, 29, 0, 0, 42),
(43, 12375883, 'qVJ42rjCD', 0, 30, 0, 0, 43),
(44, 59582385, 'kj0jEcZ', 0, 31, 0, 0, 44),
(45, 63538093, 'gJi7I6BOaD', 0, 32, 0, 0, 45),
(46, 3251643, '7uUPKyb', 0, 33, 0, 0, 46),
(47, 94931656, 'mkT27GE', 0, 34, 0, 0, 47),
(48, 26638600, 'L4A5yKCC', 0, 35, 0, 0, 48),
(49, 39420377, 'L2s61casjHR', 0, 36, 0, 0, 49),
(50, 70976931, 'y9dmyvgj', 0, 37, 0, 0, 50),
(51, 81119976, 'LxPYYwz7M', 0, 38, 0, 0, 51),
(52, 93523751, 'TN0FiwURv5lO', 0, 39, 0, 0, 52),
(53, 21114143, 'DOVd9E8FUwz', 0, 40, 0, 0, 53),
(54, 98832367, 'E7xaYq', 0, 41, 0, 0, 54),
(55, 19379258, 'u4HG2yphhTLZ', 0, 42, 0, 0, 55),
(56, 66097251, 'edqWaqrcm0', 0, 43, 0, 0, 56),
(57, 17053269, 'Q5aT9xEHRjd', 0, 44, 0, 0, 57),
(58, 10808659, 'dJcQ3NJt', 0, 45, 0, 0, 58),
(59, 90289154, '0a9LGobuGv', 0, 46, 0, 0, 59),
(60, 65031470, 'ol94ObSc', 0, 47, 0, 0, 60),
(61, 66714053, 'CovUNz', 0, 48, 0, 0, 61),
(62, 24686779, 'FubeDLLk41', 0, 49, 0, 0, 62),
(63, 91943361, 'kNFD0EPrsBA', 0, 50, 0, 0, 63),
(64, 26308355, '6uisSf', 0, 51, 0, 0, 64),
(65, 90918837, '2sjecqUBnAU', 0, 52, 0, 0, 65),
(66, 57961952, '9n2XZq', 0, 53, 0, 0, 66),
(67, 13477690, 'g0Wz3Dlzlq', 0, 54, 0, 0, 67),
(68, 72832196, 'tC9O5ZU7aI6', 0, 55, 0, 0, 68),
(69, 1759318, 'aoqLx48IEW', 0, 0, 0, 1, 69),
(70, 63373460, 'xg5DZxBag', 0, 0, 0, 2, 70),
(71, 93387019, 'COLKNOO', 0, 0, 0, 3, 71),
(72, 62040460, 'BOt2IF', 0, 0, 0, 4, 72),
(73, 52702132, 'tSrCyJv6uT', 0, 0, 0, 5, 73),
(74, 93891981, 'gfpENfAvEX', 0, 0, 0, 6, 74),
(75, 42925806, 'Mu6JYuLtiSu', 0, 0, 0, 7, 75),
(76, 70062471, 'qRjy1pFD', 0, 0, 0, 8, 76),
(77, 58996445, 'jnS6fZSizT', 0, 0, 0, 9, 77),
(78, 89726900, 'LvxxvrzT', 0, 0, 0, 10, 78),
(79, 62610059, 'EYSa8pcEWu', 0, 0, 0, 11, 79),
(80, 57494545, 'wBymVY7OTKt', 0, 0, 0, 12, 80),
(81, 79265219, 'YDxKVzX3T', 0, 0, 0, 13, 81),
(82, 47288103, 'NGXiw6Au', 0, 0, 0, 14, 82),
(83, 1447183, '6bXZ6T', 0, 0, 0, 15, 83),
(84, 76391055, '5ckk08k8T', 0, 0, 0, 16, 84),
(85, 69897553, 'esVcOT', 0, 0, 0, 17, 85),
(86, 58055338, 'uxRTQhEEBs', 0, 0, 0, 18, 86),
(87, 90309470, 'Lutdosu', 0, 0, 0, 19, 87),
(88, 59265317, '9vmCoWr', 0, 0, 0, 20, 88),
(89, 26206389, 'wdNMfI', 0, 0, 0, 21, 89),
(90, 89081151, 'X2i36Ls', 0, 0, 0, 22, 90),
(91, 48159732, '9PTlIPD', 0, 0, 0, 23, 91),
(92, 47159640, 'uLXzDG', 0, 0, 0, 24, 92),
(93, 36351006, 'HSo60bP', 0, 0, 0, 25, 93),
(94, 67611587, '69BOQSBy9fY', 0, 0, 0, 26, 94),
(95, 44530386, '5YCSAYaZ', 0, 0, 0, 27, 95),
(96, 46009472, 'oBDLqUwTcrf', 0, 0, 0, 28, 96),
(97, 64243721, 'tNeD4E1Vbz57', 0, 0, 0, 29, 97),
(98, 14463188, 'Sr8U5j', 0, 0, 0, 30, 98),
(99, 14459925, 'rZFSOrMF', 0, 0, 0, 31, 99),
(100, 70609514, 'uRBPyl9gmC', 0, 0, 0, 32, 100),
(101, 36874540, 'qssqHUIIK', 0, 0, 0, 33, 101),
(102, 61439716, 'zMWZMM0Gm7', 0, 0, 0, 34, 102),
(103, 83085910, 'q1dFipi3INNO', 0, 0, 0, 35, 103),
(104, 18572492, 'lqlpEQwK', 0, 0, 0, 36, 104),
(105, 48008423, 'IoTIz6', 0, 0, 0, 37, 105),
(106, 18265314, 'I9sQRzR4', 0, 0, 0, 38, 106),
(107, 26053301, 'XrOVQEebCgC', 0, 0, 0, 39, 107),
(108, 5435440, 'kPlrXgDq6P', 0, 0, 0, 40, 108),
(109, 71081702, 'ywp8RXh', 0, 0, 0, 41, 109),
(110, 17500709, 'q8DL3XoGp', 0, 0, 0, 42, 110),
(111, 85227312, 'N6ElePvTu9', 0, 0, 0, 43, 111),
(112, 14475221, 'KBBwyHY', 0, 0, 0, 44, 112),
(113, 42375466, 'CBtltEd', 0, 0, 0, 45, 113),
(114, 82518491, 'VEOyax', 0, 0, 0, 46, 114),
(115, 92375129, 'i25QWyu8U', 0, 0, 0, 47, 115),
(116, 9930073, 'IqBBr3', 0, 0, 0, 48, 116),
(117, 40572043, 'vj6VhYU', 0, 0, 0, 49, 117),
(118, 34699779, 'T8Pi3Wc', 0, 0, 0, 50, 118),
(119, 99766951, 'raAXNlobg8', 0, 0, 0, 51, 119),
(120, 41027707, 'dF5v5KGDC', 0, 0, 0, 52, 120),
(121, 51793924, 'OyUFmtyG9B', 0, 0, 0, 53, 121),
(122, 13394668, 'uk2QMwCB', 0, 0, 0, 54, 122),
(123, 23406100, 'J3sLcH', 0, 0, 0, 55, 123),
(126, 77531662, '$2b$10$WC59o2e8SeUTEAFbk/DD8eNchbQEAtulKt0voRrxBr1a9PEyhJNPO', 0, 0, 0, 0, 137),
(127, 73885739, '$2b$10$/oluaF3LQS3utlAZ4HdW6es2MbGZUwlUoFUFSBSqWoziT/9cit6w2', 0, 0, 0, 0, 138),
(128, 73885712, '$2b$10$t7BqndzWA9S4V/Nrh97Sd.Mm8PP7aaRXr8ftdlaxaylym1FJysmf.', 0, 0, 0, 0, 139),
(129, 12345678, '$2b$10$stC2Ttd4jybJuyTaJpapdO1cQaDBnXNT/FmzVanIlljRlVS.9r90S', 0, 0, 0, 0, 140),
(130, 73885755, '$2b$10$/acy2D0..SJjCVCsbl4buONTjRlZ3TgqUkEaIPCNg.vnOEzLmEFvi', 0, 0, 0, 0, 141),
(131, 73885751, '$2b$10$2edgqWqXtgtuij/lKpYbR.dUwbV2mv2ETQDmBQfubqblDlfA5OGZG', 0, 0, 0, 0, 142),
(132, 73885766, '$2b$10$CHBmQD9jsjXk91nBLxbJDegYmquhx70JVzdkPyWYZV24/E8Aet1H6', 0, 0, 0, 0, 143),
(133, 87654321, '$2b$10$fNdox56AnBMUR7A7MnIQu.69wM/G8ZQ.ecXOBC9thUxfdKKuNxmNW', 0, 0, 0, 0, 144),
(134, 99999999, '$2b$10$baRGQPltaTAuPg8NsfRTxe5ZgoWQ4H3Rwq0gWpzkspVFWoLqRFhge', 0, 0, 0, 60, 145),
(135, 73885700, '$2b$10$MpqLpqMKoySrbsv0iK1PZObXVaraAOsfakdM9NCYpbyIAIZcJurvW', 10, 0, 0, 59, 146),
(136, 73885711, '$2b$10$yy1tJsKQ8HGUJ3PimCXJnePgmrUHc74m0JFcmaK1gvJlzedkMX7XO', 0, 0, 0, 0, 147),
(137, 88888888, '$2b$10$3w1k59rkeENs0B7D63T/JOQhgDpB8UB1Rvtkeric8MGIvqfDuVZdq', 0, 0, 0, 0, 148),
(139, 88888887, '$2b$10$vhEFSlNbPlX5vrBwNEkAY.nhhR5TvqfnACA3tJC7WYiLMCMVdvjE.', 0, 0, 0, 0, 150),
(145, 55555555, '$2b$10$qd6i5u60KUevqF51GJqcfe4LOokYeFo9uBMoqAT/vOTX6A14THMDK', 0, 0, 0, 0, 156),
(146, 73881111, '$2b$10$wDHTjk5wBTlswNN.XvfWQu2MMhR2ULfM.960LO15cKlps/ODTnvHm', 0, 0, 0, 0, 157),
(147, 73111111, '$2b$10$3ycV8llFe3yBGZtTqNbQ1u9D8QYd0bLuY7XwkIkAylZpYJOmzpgDa', 0, 0, 0, 0, 158);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol_administrador`
--

CREATE TABLE `usuario_rol_administrador` (
  `idAdministrador` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_rol_administrador`
--

INSERT INTO `usuario_rol_administrador` (`idAdministrador`, `idUsuario`) VALUES
(1, 132),
(2, 1),
(3, 2),
(4, 135),
(5, 135),
(6, 135),
(7, 135),
(8, 135),
(9, 135),
(10, 135),
(11, 135);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol_alumno`
--

CREATE TABLE `usuario_rol_alumno` (
  `idAlumno` int(11) NOT NULL,
  `idPersona` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_rol_alumno`
--

INSERT INTO `usuario_rol_alumno` (`idAlumno`, `idPersona`) VALUES
(1, 14),
(2, 15),
(3, 16),
(4, 17),
(5, 18),
(6, 19),
(7, 20),
(8, 21),
(9, 22),
(10, 23),
(11, 24),
(12, 25),
(13, 26),
(14, 27),
(15, 28),
(16, 29),
(17, 30),
(18, 31),
(19, 32),
(20, 33),
(21, 34),
(22, 35),
(23, 36),
(24, 37),
(25, 38),
(26, 39),
(27, 40),
(28, 41),
(29, 42),
(30, 43),
(31, 44),
(32, 45),
(33, 46),
(34, 47),
(35, 48),
(36, 49),
(37, 50),
(38, 51),
(39, 52),
(40, 53),
(41, 54),
(42, 55),
(43, 56),
(44, 57),
(45, 58),
(46, 59),
(47, 60),
(48, 61),
(49, 62),
(50, 63),
(51, 64),
(52, 65),
(53, 66),
(54, 67),
(55, 68);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol_padre`
--

CREATE TABLE `usuario_rol_padre` (
  `idPadre` int(20) NOT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_rol_padre`
--

INSERT INTO `usuario_rol_padre` (`idPadre`, `idUsuario`) VALUES
(1, 69),
(2, 70),
(3, 71),
(4, 72),
(5, 73),
(6, 74),
(7, 75),
(8, 76),
(9, 77),
(10, 78),
(11, 79),
(12, 80),
(13, 81),
(14, 82),
(15, 83),
(16, 84),
(17, 85),
(18, 86),
(19, 87),
(20, 88),
(21, 89),
(22, 90),
(23, 91),
(24, 92),
(25, 93),
(26, 94),
(27, 95),
(28, 96),
(29, 97),
(30, 98),
(31, 99),
(32, 100),
(33, 101),
(34, 102),
(35, 103),
(36, 104),
(37, 105),
(38, 106),
(39, 107),
(40, 108),
(41, 109),
(42, 110),
(43, 111),
(44, 112),
(45, 113),
(46, 114),
(47, 115),
(48, 116),
(49, 117),
(50, 118),
(51, 119),
(52, 120),
(53, 121),
(54, 122),
(55, 123),
(56, 136),
(57, 136),
(58, 136),
(59, 135),
(60, 134),
(61, 138),
(62, 141),
(63, 142),
(64, 143),
(65, 144);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol_profesor`
--

CREATE TABLE `usuario_rol_profesor` (
  `idProfesor` int(100) NOT NULL,
  `idUsuario` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_rol_profesor`
--

INSERT INTO `usuario_rol_profesor` (`idProfesor`, `idUsuario`) VALUES
(1, 3),
(2, 4),
(3, 5),
(4, 6),
(5, 7),
(6, 8),
(7, 9),
(8, 10),
(9, 11),
(10, 12),
(11, 13);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  ADD PRIMARY KEY (`idApoderado`);

--
-- Indices de la tabla `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`idAula`);

--
-- Indices de la tabla `bimestre`
--
ALTER TABLE `bimestre`
  ADD PRIMARY KEY (`idBimestre`);

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`idCalificaion`);

--
-- Indices de la tabla `competencias`
--
ALTER TABLE `competencias`
  ADD PRIMARY KEY (`idCompetencia`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`idCurso`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`idGrado`);

--
-- Indices de la tabla `grado_has_curso`
--
ALTER TABLE `grado_has_curso`
  ADD PRIMARY KEY (`idAsignatura`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`idHorario`);

--
-- Indices de la tabla `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`idMatricula`);

--
-- Indices de la tabla `periodo`
--
ALTER TABLE `periodo`
  ADD PRIMARY KEY (`idPeriodo`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`idPersona`);

--
-- Indices de la tabla `promedio`
--
ALTER TABLE `promedio`
  ADD PRIMARY KEY (`idProm`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `seccion`
--
ALTER TABLE `seccion`
  ADD PRIMARY KEY (`idSeccion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- Indices de la tabla `usuario_rol_administrador`
--
ALTER TABLE `usuario_rol_administrador`
  ADD PRIMARY KEY (`idAdministrador`);

--
-- Indices de la tabla `usuario_rol_alumno`
--
ALTER TABLE `usuario_rol_alumno`
  ADD PRIMARY KEY (`idAlumno`);

--
-- Indices de la tabla `usuario_rol_padre`
--
ALTER TABLE `usuario_rol_padre`
  ADD PRIMARY KEY (`idPadre`);

--
-- Indices de la tabla `usuario_rol_profesor`
--
ALTER TABLE `usuario_rol_profesor`
  ADD PRIMARY KEY (`idProfesor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  MODIFY `idApoderado` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `aula`
--
ALTER TABLE `aula`
  MODIFY `idAula` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `bimestre`
--
ALTER TABLE `bimestre`
  MODIFY `idBimestre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `idCalificaion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT de la tabla `competencias`
--
ALTER TABLE `competencias`
  MODIFY `idCompetencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `idCurso` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `grado`
--
ALTER TABLE `grado`
  MODIFY `idGrado` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `grado_has_curso`
--
ALTER TABLE `grado_has_curso`
  MODIFY `idAsignatura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=376;

--
-- AUTO_INCREMENT de la tabla `matricula`
--
ALTER TABLE `matricula`
  MODIFY `idMatricula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `periodo`
--
ALTER TABLE `periodo`
  MODIFY `idPeriodo` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPersona` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT de la tabla `promedio`
--
ALTER TABLE `promedio`
  MODIFY `idProm` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT de la tabla `usuario_rol_administrador`
--
ALTER TABLE `usuario_rol_administrador`
  MODIFY `idAdministrador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario_rol_alumno`
--
ALTER TABLE `usuario_rol_alumno`
  MODIFY `idAlumno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `usuario_rol_padre`
--
ALTER TABLE `usuario_rol_padre`
  MODIFY `idPadre` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `usuario_rol_profesor`
--
ALTER TABLE `usuario_rol_profesor`
  MODIFY `idProfesor` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
