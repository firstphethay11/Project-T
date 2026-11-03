SET NAMES utf8mb4;

-- 1. สร้างฐานข้อมูลสำหรับ Project-T
CREATE DATABASE IF NOT EXISTS project_t_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE project_t_db;

-- 2. สร้างตาราง users สำหรับระบบ Login / สมัครสมาชิก
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'Member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. เพิ่มข้อมูลผู้ใช้ตัวอย่าง 2 คนสำหรับทดสอบ Login
INSERT INTO users (username, password, full_name, role)
VALUES
  ('member1', '1234', 'สมาชิกคนที่ 1', 'Frontend Developer'),
  ('member2', '1234', 'สมาชิกคนที่ 2', 'Backend Developer')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 4. ตรวจสอบข้อมูลในตาราง
SELECT * FROM users;
SET NAMES utf8mb4;

-- 1. สร้างฐานข้อมูลสำหรับ Project-T
CREATE DATABASE IF NOT EXISTS project_t_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE project_t_db;

-- 2. สร้างตาราง users สำหรับระบบ Login / สมัครสมาชิก
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'Member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. เพิ่มข้อมูลผู้ใช้ตัวอย่าง 2 คนสำหรับทดสอบ Login
INSERT INTO users (username, password, full_name, role)
VALUES
  ('member1', '1234', 'สมาชิกคนที่ 1', 'Frontend Developer'),
  ('member2', '1234', 'สมาชิกคนที่ 2', 'Backend Developer')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 4. ตรวจสอบข้อมูลในตาราง
SELECT * FROM users;

