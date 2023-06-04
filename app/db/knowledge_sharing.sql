-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2023 at 05:39 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `knowledge_sharing`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `warning` enum('0','1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`email`, `password`, `role`, `warning`) VALUES
('phuctv@gmail.com', '12345678', 'user', '1'),
('tieptd@gmail.com', '12345678', 'admin', '0');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `knowledge_id` int(11) NOT NULL,
  `categories` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `content` varchar(2047) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `knowledge_id` int(11) NOT NULL,
  `description` varchar(2047) NOT NULL,
  `isfree` tinyint(1) NOT NULL,
  `fee` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses_lesson`
--

CREATE TABLE `courses_lesson` (
  `courses_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `offset` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `following` varchar(255) NOT NULL,
  `followed` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `knowledge`
--

CREATE TABLE `knowledge` (
  `id` int(11) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `update_at` varchar(255) DEFAULT NULL,
  `create_at` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `learning_time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learn`
--

CREATE TABLE `learn` (
  `email` varchar(255) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lesson`
--

CREATE TABLE `lesson` (
  `knowledge_id` int(11) NOT NULL,
  `content` mediumtext NOT NULL,
  `views` int(11) NOT NULL,
  `visible` enum('0','1','2') NOT NULL COMMENT '0 is private, 1 is default, 2 is public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mark`
--

CREATE TABLE `mark` (
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `money` bigint(20) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `social_link` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `visible` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `learner_email` varchar(255) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `type` enum('request','invite') NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `score` enum('0','1','2','3','4','5') NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD KEY `categories_knowledge_id_fk1` (`knowledge_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_email_fk1` (`email`),
  ADD KEY `comment_knowledge_id_fk2` (`knowledge_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`knowledge_id`);

--
-- Indexes for table `courses_lesson`
--
ALTER TABLE `courses_lesson`
  ADD PRIMARY KEY (`courses_id`,`lesson_id`),
  ADD KEY `courses_lesson_lesson_id_fk1` (`lesson_id`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`following`,`followed`),
  ADD KEY `follow_followed_fk2` (`followed`);

--
-- Indexes for table `knowledge`
--
ALTER TABLE `knowledge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `knowledge_owner_email_fk1` (`owner_email`);

--
-- Indexes for table `learn`
--
ALTER TABLE `learn`
  ADD PRIMARY KEY (`email`,`courses_id`),
  ADD KEY `learn_courses_id_fk2` (`courses_id`);

--
-- Indexes for table `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`knowledge_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_email_fk1` (`email`);

--
-- Indexes for table `mark`
--
ALTER TABLE `mark`
  ADD PRIMARY KEY (`email`,`knowledge_id`),
  ADD KEY `mark_knowledge_id_fk2` (`knowledge_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_email_fk1` (`email`),
  ADD KEY `payment_courses_id_fk2` (`courses_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_owner_email_fk1` (`owner_email`),
  ADD KEY `request_learner_email_fk2` (`learner_email`),
  ADD KEY `request_courses_id_fk3` (`courses_id`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`email`,`knowledge_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `knowledge`
--
ALTER TABLE `knowledge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `comment_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Constraints for table `courses_lesson`
--
ALTER TABLE `courses_lesson`
  ADD CONSTRAINT `courses_lesson_courses_id_fk1` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `courses_lesson_lesson_id_fk1` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`knowledge_id`);

--
-- Constraints for table `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_followed_fk2` FOREIGN KEY (`followed`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `follow_following_fk1` FOREIGN KEY (`following`) REFERENCES `account` (`email`);

--
-- Constraints for table `knowledge`
--
ALTER TABLE `knowledge`
  ADD CONSTRAINT `knowledge_owner_email_fk1` FOREIGN KEY (`owner_email`) REFERENCES `account` (`email`);

--
-- Constraints for table `learn`
--
ALTER TABLE `learn`
  ADD CONSTRAINT `learn_courses_id_fk2` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `learn_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Constraints for table `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `lesson_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Constraints for table `mark`
--
ALTER TABLE `mark`
  ADD CONSTRAINT `mark_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `mark_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_courses_id_fk2` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `payment_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_courses_id_fk3` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `request_learner_email_fk2` FOREIGN KEY (`learner_email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `request_owner_email_fk1` FOREIGN KEY (`owner_email`) REFERENCES `account` (`email`);

--
-- Constraints for table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `score_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
