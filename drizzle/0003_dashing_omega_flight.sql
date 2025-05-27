CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`phone` varchar(20),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 18:27:12.859';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 18:27:12.859';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role_id` int NOT NULL DEFAULT 3;--> statement-breakpoint
ALTER TABLE `appointments` ADD `address_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `address`;