CREATE DATABASE  IF NOT EXISTS `forumdb`;
USE `forumdb`;

DROP TABLE IF EXISTS `categorytab`;
CREATE TABLE `categorytab` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(45) NOT NULL,
  `opened` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author` varchar(45) NOT NULL,
  `p_category` varchar(45) NOT NULL,
  `p_title` varchar(45) NOT NULL,
  `p_content` varchar(5000) NOT NULL,
  `p_date` varchar(45) NOT NULL,
  `edit` varchar(45) NOT NULL,
  `pin` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE `useraccount` (
  `username` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(45) NOT NULL,
  `birthdate` varchar(45) NOT NULL,
  `usertype` varchar(45) NOT NULL,
  `loggedin` varchar(5) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `useraccount` VALUES ('admin','admin','admin@email.com','101690','admin','false');
