-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2024 at 09:32 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comm_craft`
--

-- --------------------------------------------------------

--
-- Table structure for table `collabration`
--

CREATE TABLE `collabration` (
  `ColabID` int(50) NOT NULL,
  `ProjectID` int(50) NOT NULL,
  `userID` int(50) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `Time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `material`
--

CREATE TABLE `material` (
  `MaterialID` int(50) NOT NULL,
  `MaterialName` varchar(255) NOT NULL,
  `Price` varchar(255) NOT NULL,
  `Quantity` int(100) NOT NULL,
  `Available` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material`
--

INSERT INTO `material` (`MaterialID`, `MaterialName`, `Price`, `Quantity`, `Available`) VALUES
(1112, 'wood', '25$', 3, 'yes'),
(1113, 'Plastic', '10', 50, '1');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `ProjectID` int(50) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` varchar(500) NOT NULL,
  `Difficulty` varchar(300) NOT NULL,
  `Material_id` varchar(255) NOT NULL,
  `Skills` varchar(500) NOT NULL,
  `GroupSize` int(100) NOT NULL,
  `Ranging` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skills_user`
--

CREATE TABLE `skills_user` (
  `Skill_id` varchar(255) NOT NULL,
  `Skill_Name` varchar(255) NOT NULL,
  `UserID` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `TaskID` int(50) NOT NULL,
  `UserID` int(50) NOT NULL,
  `TaskName` varchar(255) NOT NULL,
  `Details` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(50) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `Bio` varchar(700) NOT NULL,
  `Locations` varchar(255) NOT NULL,
  `Birthdate` varchar(50) NOT NULL,
  `Gender` varchar(50) NOT NULL,
  `Phone` int(50) NOT NULL,
  `SocialLinks` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Username`, `Password`, `Email`, `FullName`, `Bio`, `Locations`, `Birthdate`, `Gender`, `Phone`, `SocialLinks`) VALUES
(1, 'dima', '123', 'd@gmail.com', 'dima ', 'hi, ', 'Nablus', '11-10', 'femal', 5487, 'jhfyurnv'),
(2, 'MARK8', '$2b$10$6Hsm4EVfus5CRj4VLJcqIObC5.JgS8xtiatmsAWPJxk.GsDfAhKbi', 'ghy', 'Mark Sam', 'Designer', 'NewYork', '11/8', 'Male', 578, 'what'),
(3, 'sally', '$2b$10$ok9on20z9RycO6gceC/g0.GOhGCHDJIXiJgQzkLnJDz5IylanXji6', 'sa.@g', 'sally Sam', 'Designer', 'NewYork', '11/8', 'femal', 578, 'what');

-- --------------------------------------------------------

--
-- Table structure for table `user_res_book`
--

CREATE TABLE `user_res_book` (
  `booking_id` int(50) NOT NULL,
  `UserID` int(50) NOT NULL,
  `MaterialID` int(50) NOT NULL,
  `MaterialName` varchar(100) NOT NULL,
  `booking_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collabration`
--
ALTER TABLE `collabration`
  ADD PRIMARY KEY (`ColabID`);

--
-- Indexes for table `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`MaterialID`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`ProjectID`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`TaskID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `user_res_book`
--
ALTER TABLE `user_res_book`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `MaterialID` (`MaterialID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_res_book`
--
ALTER TABLE `user_res_book`
  MODIFY `booking_id` int(50) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_res_book`
--
ALTER TABLE `user_res_book`
  ADD CONSTRAINT `user_res_book_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `user_res_book_ibfk_2` FOREIGN KEY (`MaterialID`) REFERENCES `material` (`MaterialID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
