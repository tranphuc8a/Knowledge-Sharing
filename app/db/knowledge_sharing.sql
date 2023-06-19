-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th6 08, 2023 lúc 07:30 AM
-- Phiên bản máy phục vụ: 10.4.27-MariaDB
-- Phiên bản PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `knowledge_sharing`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `warning` enum('0','1','2','3') NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`email`, `password`, `role`, `warning`, `time`) VALUES
('phuctv@gmail.com', '12345678', 'user', '0', ''),
('tieptd@gmail.com', '12345678', 'admin', '0', ''),
('tranphuc8a@gmail.com', '12345678', 'user', '0', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `knowledge_id` int(11) NOT NULL,
  `categories` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`knowledge_id`, `categories`) VALUES
(20, '1'),
(20, '222'),
(21, '1'),
(21, '222'),
(23, '1'),
(23, '222'),
(24, '1'),
(24, '222');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `content` varchar(2047) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comment`
--

INSERT INTO `comment` (`id`, `email`, `knowledge_id`, `content`, `time`) VALUES
(2, 'phuctv@gmail.com', 1, 'Halo halo', '2023-06-04 11:36:20'),
(3, 'phuctv@gmail.com', 1, 'Helloooo oop', '2023-06-04 17:08:16'),
(4, 'phuctv@gmail.com', 1, 'Halo halo', '2023-06-04 11:37:33'),
(5, 'phuctv@gmail.com', 1, 'Halo halo', '2023-06-04 17:00:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `courses`
--

CREATE TABLE `courses` (
  `knowledge_id` int(11) NOT NULL,
  `description` varchar(2047) NOT NULL,
  `isfree` tinyint(1) NOT NULL,
  `fee` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `courses`
--

INSERT INTO `courses` (`knowledge_id`, `description`, `isfree`, `fee`) VALUES
(1, 'Bài học đầu tiên', 1, 120000),
(6, 'Khóa học đầu tiên của Phúc', 1, 0),
(14, 'KHông có mô tả', 1, 120000),
(15, 'KHông có mô tả', 1, 120000),
(16, 'KHông có mô tả', 1, 120000),
(17, 'KHông có mô tả', 1, 120000),
(19, 'KHông có mô tả', 1, 120000),
(20, 'KHông có mô tả', 1, 120000),
(21, 'KHông có mô tả', 1, 120000),
(23, 'KHông có mô tả', 0, 1231),
(24, 'KHông có mô tả', 0, 1231);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `courses_lesson`
--

CREATE TABLE `courses_lesson` (
  `courses_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `offset` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `courses_lesson`
--

INSERT INTO `courses_lesson` (`courses_id`, `lesson_id`, `offset`) VALUES
(6, 5, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `follow`
--

CREATE TABLE `follow` (
  `following` varchar(255) NOT NULL,
  `followed` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `follow`
--

INSERT INTO `follow` (`following`, `followed`, `time`) VALUES
('phuctv@gmail.com', 'tranphuc8a@gmail.com', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `knowledge`
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

--
-- Đang đổ dữ liệu cho bảng `knowledge`
--

INSERT INTO `knowledge` (`id`, `owner_email`, `title`, `update_at`, `create_at`, `thumbnail`, `learning_time`) VALUES
(1, 'phuctv@gmail.com', 'Bài học đầu tiên', NULL, '', NULL, '120'),
(2, 'phuctv@gmail.com', 'Bài học đầu tiên', NULL, '2023-06-03 08:39:00', NULL, '120'),
(3, 'phuctv@gmail.com', 'Bài học thứ hai', NULL, '', NULL, ''),
(5, 'tranphuc8a@gmail.com', 'Bài học của tranphuc8a', NULL, '', NULL, ''),
(6, 'tranphuc8a@gmail.com', 'Khóa học đầu tiên của Phúc', NULL, '2023-06-03 09:30:00', NULL, '120'),
(7, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:26:33', NULL, '120'),
(8, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:27:12', NULL, '120'),
(9, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:28:34', NULL, '120'),
(10, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:28:56', NULL, '120'),
(11, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:30:32', NULL, '120'),
(12, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:31:33', NULL, '120'),
(13, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:32:03', NULL, '120'),
(14, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:36:07', NULL, '120'),
(15, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:38:57', NULL, '120'),
(16, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:39:26', NULL, '120'),
(17, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:39:52', NULL, '120'),
(19, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:42:13', NULL, '120'),
(20, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:42:53', NULL, '120'),
(21, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:43:16', NULL, '120'),
(23, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:45:54', NULL, '120'),
(24, 'phuctv@gmail.com', 'Khóa học của tôi', NULL, '2023-06-07 20:49:32', NULL, '120'),
(25, 'phuctv@gmail.com', 'Bài học của tôi', NULL, '2023-06-08 10:59:57', NULL, '120'),
(26, 'phuctv@gmail.com', 'Bài học của tôi', NULL, '2023-06-08 11:00:30', NULL, '120'),
(27, 'phuctv@gmail.com', 'Bài học của tôi', NULL, '2023-06-08 11:01:01', NULL, '120');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `learn`
--

CREATE TABLE `learn` (
  `email` varchar(255) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `learn`
--

INSERT INTO `learn` (`email`, `courses_id`, `time`) VALUES
('phuctv@gmail.com', 6, '2023-06-04 16:57:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lesson`
--

CREATE TABLE `lesson` (
  `knowledge_id` int(11) NOT NULL,
  `content` mediumtext NOT NULL,
  `views` int(11) NOT NULL,
  `visible` enum('0','1','2') NOT NULL COMMENT '0 is private, 1 is default, 2 is public'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lesson`
--

INSERT INTO `lesson` (`knowledge_id`, `content`, `views`, `visible`) VALUES
(2, 'Đây là bài học đầu tiên', 0, '0'),
(3, 'Bài học thứ hai', 0, '1'),
(5, 'Bài học của tranphuc8a', 0, '1'),
(27, 'Đây là nội dung', 0, '2');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `login`
--

INSERT INTO `login` (`id`, `email`, `token`, `refresh_token`, `time`) VALUES
(1, 'tranphuc8a@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5waHVjOGFAZ21haWwuY29tIiwiaWF0IjoxNjg1Nzk5MTQ2LCJleHAiOjE2ODU3OTk3NDZ9.BlfoOg-xDQt9WtfPGkVSwPdUs9q_jjrT45NI-U11RgM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5waHVjOGFAZ21haWwuY29tIiwiaWF0IjoxNjg1Nzk5MTQ2LCJleHAiOjE2ODY0MDM5NDZ9.7rGA5p8upIEQgq1NFh9w_p9OaWC-cTx86WI0kNWVHzY', '2023-06-03 20:32:26'),
(2, 'tranphuc8a@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5waHVjOGFAZ21haWwuY29tIiwiaWF0IjoxNjg1ODAwNTA5LCJleHAiOjE2ODY2NjQ1MDl9.ESsUHGwSsm5YOTZgnY1Qn-1VMMVC-OMbEhQ5JVGwTV8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyYW5waHVjOGFAZ21haWwuY29tIiwiaWF0IjoxNjg1ODAwNTA5LCJleHAiOjE2ODY0MDUzMDl9.7ZJ9HcLNX2Z5icCPPVUlyOvcsxn7-7MAh6utxTIPdEk', '2023-06-03 20:55:09'),
(3, 'phuctv@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBodWN0dkBnbWFpbC5jb20iLCJpYXQiOjE2ODU4MDYxNTAsImV4cCI6MTY4NjY3MDE1MH0.Mph8MNNJ5F3F4Ek-zcB9Wp_9vR7ubydWjAM_YrRsEzI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBodWN0dkBnbWFpbC5jb20iLCJpYXQiOjE2ODU4MDYxNTAsImV4cCI6MTY4NjQxMDk1MH0.ejRbFRDpLR0ZdfYD0-8M-rbByBAFyTbtk1DV2p-rTXA', '2023-06-03 22:29:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mark`
--

CREATE TABLE `mark` (
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `mark`
--

INSERT INTO `mark` (`email`, `knowledge_id`, `time`) VALUES
('phuctv@gmail.com', 1, '2023-06-04 11:50:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment`
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
-- Cấu trúc bảng cho bảng `profile`
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

--
-- Đang đổ dữ liệu cho bảng `profile`
--

INSERT INTO `profile` (`email`, `name`, `avatar`, `dob`, `phone`, `gender`, `address`, `job`, `social_link`, `description`, `visible`) VALUES
('phuctv@gmail.com', 'Trần Văn Phúc', NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, '0000'),
('tranphuc8a@gmail.com', 'Anh Phúc 8a', NULL, NULL, NULL, 'male', NULL, NULL, NULL, NULL, '1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `learner_email` varchar(255) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `type` enum('request','invite') NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `request`
--

INSERT INTO `request` (`id`, `owner_email`, `learner_email`, `courses_id`, `type`, `time`) VALUES
(26, 'phuctv@gmail.com', 'tranphuc8a@gmail.com', 1, 'invite', '2023-06-03 22:54:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `score`
--

CREATE TABLE `score` (
  `email` varchar(255) NOT NULL,
  `knowledge_id` int(11) NOT NULL,
  `score` enum('0','1','2','3','4','5') NOT NULL,
  `time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `score`
--

INSERT INTO `score` (`email`, `knowledge_id`, `score`, `time`) VALUES
('phuctv@gmail.com', 1, '5', '2023-06-04 11:04:11'),
('phuctv@gmail.com', 2, '5', '2023-06-04 11:16:01'),
('phuctv@gmail.com', 5, '5', '2023-06-04 16:59:59'),
('phuctv@gmail.com', 6, '5', '2023-06-04 11:17:14');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD KEY `categories_knowledge_id_fk1` (`knowledge_id`);

--
-- Chỉ mục cho bảng `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_email_fk1` (`email`),
  ADD KEY `comment_knowledge_id_fk2` (`knowledge_id`);

--
-- Chỉ mục cho bảng `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`knowledge_id`);

--
-- Chỉ mục cho bảng `courses_lesson`
--
ALTER TABLE `courses_lesson`
  ADD PRIMARY KEY (`courses_id`,`lesson_id`),
  ADD KEY `courses_lesson_lesson_id_fk1` (`lesson_id`);

--
-- Chỉ mục cho bảng `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`following`,`followed`),
  ADD KEY `follow_followed_fk2` (`followed`);

--
-- Chỉ mục cho bảng `knowledge`
--
ALTER TABLE `knowledge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `knowledge_owner_email_fk1` (`owner_email`);

--
-- Chỉ mục cho bảng `learn`
--
ALTER TABLE `learn`
  ADD PRIMARY KEY (`email`,`courses_id`),
  ADD KEY `learn_courses_id_fk2` (`courses_id`);

--
-- Chỉ mục cho bảng `lesson`
--
ALTER TABLE `lesson`
  ADD PRIMARY KEY (`knowledge_id`);

--
-- Chỉ mục cho bảng `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_email_fk1` (`email`);

--
-- Chỉ mục cho bảng `mark`
--
ALTER TABLE `mark`
  ADD PRIMARY KEY (`email`,`knowledge_id`),
  ADD KEY `mark_knowledge_id_fk2` (`knowledge_id`);

--
-- Chỉ mục cho bảng `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_email_fk1` (`email`),
  ADD KEY `payment_courses_id_fk2` (`courses_id`);

--
-- Chỉ mục cho bảng `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_owner_email_fk1` (`owner_email`),
  ADD KEY `request_learner_email_fk2` (`learner_email`),
  ADD KEY `request_courses_id_fk3` (`courses_id`);

--
-- Chỉ mục cho bảng `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`email`,`knowledge_id`),
  ADD KEY `score_knowledge_id_fk2` (`knowledge_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `knowledge`
--
ALTER TABLE `knowledge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Các ràng buộc cho bảng `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `comment_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Các ràng buộc cho bảng `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Các ràng buộc cho bảng `courses_lesson`
--
ALTER TABLE `courses_lesson`
  ADD CONSTRAINT `courses_lesson_courses_id_fk1` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `courses_lesson_lesson_id_fk1` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`knowledge_id`);

--
-- Các ràng buộc cho bảng `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_followed_fk2` FOREIGN KEY (`followed`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `follow_following_fk1` FOREIGN KEY (`following`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `knowledge`
--
ALTER TABLE `knowledge`
  ADD CONSTRAINT `knowledge_owner_email_fk1` FOREIGN KEY (`owner_email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `learn`
--
ALTER TABLE `learn`
  ADD CONSTRAINT `learn_courses_id_fk2` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `learn_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `lesson`
--
ALTER TABLE `lesson`
  ADD CONSTRAINT `lesson_knowledge_id_fk1` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Các ràng buộc cho bảng `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `mark`
--
ALTER TABLE `mark`
  ADD CONSTRAINT `mark_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `mark_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);

--
-- Các ràng buộc cho bảng `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_courses_id_fk2` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `payment_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_courses_id_fk3` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`knowledge_id`),
  ADD CONSTRAINT `request_learner_email_fk2` FOREIGN KEY (`learner_email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `request_owner_email_fk1` FOREIGN KEY (`owner_email`) REFERENCES `account` (`email`);

--
-- Các ràng buộc cho bảng `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_email_fk1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  ADD CONSTRAINT `score_knowledge_id_fk2` FOREIGN KEY (`knowledge_id`) REFERENCES `knowledge` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
