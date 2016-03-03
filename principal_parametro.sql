-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 03-03-2016 a las 14:07:32
-- Versión del servidor: 10.1.9-MariaDB
-- Versión de PHP: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `access_control`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `principal_parametro`
--

CREATE TABLE `principal_parametro` (
  `cparam` varchar(3) NOT NULL,
  `nparam` varchar(30) NOT NULL,
  `param1` varchar(10) DEFAULT NULL,
  `param2` time NOT NULL,
  `param3` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `principal_parametro`
--

INSERT INTO `principal_parametro` (`cparam`, `nparam`, `param1`, `param2`, `param3`) VALUES
('001', 'Ingreso', 'I', '07:30:00', '0'),
('002', 'Salida', 'S', '12:00:00', '0'),
('003', 'Rango', 'R', '00:00:00', '2'),
('004', 'Sincronizacion', 'SY', '08:58:00', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `principal_parametro`
--
ALTER TABLE `principal_parametro`
  ADD PRIMARY KEY (`cparam`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
