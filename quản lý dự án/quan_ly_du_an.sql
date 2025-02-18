-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 11, 2025 lúc 09:24 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quan_ly_du_an`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `du_an`
--

CREATE TABLE `du_an` (
  `id` int(11) NOT NULL,
  `ten_du_an` varchar(100) NOT NULL,
  `ngay_start` date NOT NULL,
  `tien` float DEFAULT NULL,
  `leader` int(11) DEFAULT NULL,
  `thanh_vien` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `du_an`
--

INSERT INTO `du_an` (`id`, `ten_du_an`, `ngay_start`, `tien`, `leader`, `thanh_vien`) VALUES
(1, 'Dự án Alpha', '2024-01-10', 50000000, 0, 'Nguyễn Văn A, Trần Thị B, Lê Văn C'),
(2, 'Dự án Beta', '2024-03-15', 120000000, 0, 'Trần Thị B, Phạm Thị D, Hoàng Văn E'),
(3, 'Dự án Gamma', '2024-06-20', 85000000, 0, 'Lê Văn C, Nguyễn Văn A, Hoàng Văn E'),
(4, 'Dự án Delta', '2024-08-05', 200000000, 0, 'Phạm Thị D, Trần Thị B, Lê Văn C'),
(5, 'Dự án Omega', '2024-10-30', 150000000, 0, 'Hoàng Văn E, Nguyễn Văn A, Phạm Thị D');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `username`, `password`, `email`) VALUES
(11, 'son', '$2b$10$gLsexr3DUDCpUfVnDHkLZOSimVt0VR3NbO862XO8dJApQkUWimj.m', 'sonmoonzxc@gmail.com'),
(12, 'ssss', '$2b$10$h7yXbgq2spvfDveoFZp./O1bTwPyruBZZ38JJbBEMmalgrzfkRPSy', 'daredevilmgz@gmail.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `id` int(11) NOT NULL,
  `ho` varchar(50) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `ngay_sinh` date NOT NULL,
  `phai` tinyint(1) NOT NULL,
  `khu_vuc` varchar(50) NOT NULL,
  `hinh_anh` varchar(225) NOT NULL,
  `mo_ta` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`id`, `ho`, `ten`, `ngay_sinh`, `phai`, `khu_vuc`, `hinh_anh`, `mo_ta`) VALUES
(2, 'Trần', 'Thị B', '1995-08-20', 0, 'Hà Nội', '', 'Nhân viên kế toán'),
(3, 'Lê', 'Văn C', '1988-12-15', 0, 'Đà Nẵng', '', 'Quản lý chi nhánh'),
(4, 'Phạm', 'Thị D', '1992-07-05', 0, 'Cần Thơ', '', 'Nhân viên hành chính'),
(5, 'Hoàng', 'Văn E', '1985-03-25', 0, 'Hải Phòng', '', 'Trưởng phòng kinh doanh'),
(6, 'Đỗ', 'Thị F', '1991-06-18', 0, 'Nha Trang', '', 'Nhân viên lễ tân'),
(7, 'Bùi', 'Văn G', '1987-09-22', 0, 'Bình Dương', '', 'Kỹ sư phần mềm'),
(8, 'Võ', 'Thị H', '1993-11-12', 0, 'Vũng Tàu', '', 'Nhân viên bán hàng'),
(9, 'Dương', 'Văn I', '1989-04-30', 0, 'Huế', '', 'Nhân viên bảo trì'),
(10, 'Lý', 'Thị J', '1996-07-21', 0, 'Cà Mau', '', 'Nhân viên chăm sóc khách hàng'),
(11, 'Hồ', 'Văn K', '1994-02-15', 0, 'Bắc Giang', '', 'Nhân viên giao hàng'),
(12, 'Tạ', 'Thị L', '1986-08-08', 0, 'Nam Định', '', 'Thư ký giám đốc'),
(13, 'Mai', 'Văn M', '1990-12-02', 0, 'Phú Yên', '', 'Nhân viên nhân sự'),
(14, 'Kiều', 'Thị N', '1997-03-17', 0, 'Bạc Liêu', '', 'Nhân viên thiết kế'),
(15, 'Đặng', 'Văn O', '1983-05-25', 0, 'Tây Ninh', '', 'Giám sát sản xuất'),
(16, 'Hà', 'Thị P', '1998-10-01', 0, 'Hải Dương', '', 'Nhân viên content marketing'),
(17, 'Cao', 'Văn Q', '1984-09-14', 0, 'Hà Giang', '', 'Trưởng nhóm kinh doanh'),
(18, 'Tô', 'Thị R', '1993-06-28', 0, 'Lạng Sơn', '', 'Nhân viên kiểm toán'),
(19, 'Ngô', 'Văn S', '1991-01-07', 0, 'Thái Bình', '', 'Nhân viên lập trình'),
(20, 'Chu', 'Thị T', '1992-04-09', 0, 'Quảng Ninh', '', 'Nhân viên tư vấn khách hàng'),
(31, 'Mai Thanh', 'Phát', '2025-02-16', 0, 'Miền Bắc', '/uploads/1739255931212-838756767.jpg', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `ten_task` varchar(100) NOT NULL,
  `du_an_id` int(11) NOT NULL,
  `nhan_vien_id` int(11) NOT NULL,
  `mo_ta` varchar(4000) DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `priority` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `task`
--

INSERT INTO `task` (`id`, `ten_task`, `du_an_id`, `nhan_vien_id`, `mo_ta`, `status`, `priority`) VALUES
(1, 'Thiết kế giao diện', 1, 2, 'Thiết kế UI/UX cho dự án Alpha', 2, 1),
(2, 'Phân tích yêu cầu', 1, 3, 'Thu thập và phân tích yêu cầu khách hàng', 0, 0),
(3, 'Lập trình backend', 2, 4, 'Phát triển API cho hệ thống', 0, 0),
(4, 'Kiểm thử phần mềm', 3, 5, 'Kiểm thử tính năng và sửa lỗi', 0, 0),
(5, 'Triển khai sản phẩm', 4, 1, 'Triển khai sản phẩm lên server', 0, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `du_an`
--
ALTER TABLE `du_an`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `du_an`
--
ALTER TABLE `du_an`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
