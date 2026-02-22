-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table laundigi_db.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `laundry_id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laundry_id` (`laundry_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`laundry_id`) REFERENCES `laundries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.customers: ~1 rows (approximately)
INSERT INTO `customers` (`id`, `laundry_id`, `name`, `phone`, `notes`, `created_at`) VALUES
	(5, 1, 'Budi', '08123', NULL, '2026-02-07 11:10:55'),
	(6, 1, 'Manuj', '08123', NULL, '2026-02-07 15:06:47');

-- Dumping structure for table laundigi_db.laundries
CREATE TABLE IF NOT EXISTS `laundries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `package` varchar(50) DEFAULT NULL,
  `active_until` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.laundries: ~5 rows (approximately)
INSERT INTO `laundries` (`id`, `name`, `package`, `active_until`, `created_at`, `address`, `phone`) VALUES
	(1, 'Laundry Utama', NULL, NULL, '2026-02-07 10:57:59', NULL, NULL),
	(2, 'Laundry Agung', 'Basic', '2027-01-01', '2026-02-07 15:54:23', NULL, NULL),
	(3, 'Laundry Cendana', 'Basic', '2027-01-01', '2026-02-14 14:10:11', 'JL. Sadar Cendana RT12/RW01', '08121212212'),
	(5, 'Laundry Bersih Jaya', 'Basic', '2026-03-15', '2026-02-15 09:10:48', 'Jl Raya Bogor', '08123456789'),
	(6, 'Laundry Rebo Jaya', 'Basic', '2026-03-15', '2026-02-15 09:13:00', 'Jl Raya Pasar rebo', '08123452179');

-- Dumping structure for table laundigi_db.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `laundry_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `total_price` decimal(12,2) DEFAULT '0.00',
  `status` varchar(50) DEFAULT 'DITERIMA',
  `received_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `package_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `laundry_id` (`laundry_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`laundry_id`) REFERENCES `laundries` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.orders: ~2 rows (approximately)
INSERT INTO `orders` (`id`, `laundry_id`, `customer_id`, `total_price`, `status`, `received_at`, `finished_at`, `created_at`, `package_type`) VALUES
	(3, 1, 5, 23000.00, 'DITERIMA', '2026-02-07 18:10:55', NULL, '2026-02-07 11:10:55', 'REGULER'),
	(4, 1, 6, 26000.00, 'DITERIMA', '2026-02-07 22:06:47', NULL, '2026-02-07 15:06:47', 'EXPRESS');

-- Dumping structure for table laundigi_db.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `service_id` int NOT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `price_per_kg` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.order_items: ~4 rows (approximately)
INSERT INTO `order_items` (`id`, `order_id`, `service_id`, `weight`, `price_per_kg`, `subtotal`, `notes`) VALUES
	(1, 3, 1, 2.00, 7000.00, 14000.00, 'tanpa pewangi'),
	(2, 3, 2, 1.00, 9000.00, 9000.00, 'lipat rapi'),
	(3, 4, 1, 2.00, 7000.00, 14000.00, NULL),
	(4, 4, 2, 1.00, 9000.00, 9000.00, NULL);

-- Dumping structure for table laundigi_db.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.payments: ~0 rows (approximately)

-- Dumping structure for table laundigi_db.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `laundry_id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `price_per_kg` decimal(10,2) DEFAULT NULL,
  `express_multiplier` decimal(5,2) DEFAULT '1.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `laundry_id` (`laundry_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`laundry_id`) REFERENCES `laundries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.services: ~3 rows (approximately)
INSERT INTO `services` (`id`, `laundry_id`, `name`, `price_per_kg`, `express_multiplier`, `created_at`) VALUES
	(1, 1, 'Cuci Kering', 7000.00, 1.00, '2026-02-07 11:10:10'),
	(2, 1, 'Cuci + Setrika', 9000.00, 1.00, '2026-02-07 11:10:10'),
	(3, 1, 'Setrika Saja', 6000.00, 1.00, '2026-02-07 11:10:10');

-- Dumping structure for table laundigi_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `laundry_id` int NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('owner','admin') DEFAULT 'admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `laundry_id` (`laundry_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`laundry_id`) REFERENCES `laundries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table laundigi_db.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `laundry_id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
	(1, 5, 'Munir', 'munir@gmail.com', '$2b$10$.bjvJl4sFOWLjK0ySXpVH.dqQE/5UnIC677ZQCgwMBanf8smMRQ0i', 'owner', '2026-02-15 09:10:48'),
	(2, 6, 'lopi', 'lopi@gmail.com', '$2b$10$vmDtmZ1R2fXwDlNvwMdqEu3HE4Veva3jG/lT.4nw.HdF3/liaIy52', 'owner', '2026-02-15 09:13:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
