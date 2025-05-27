DROP TABLE `part_categories`;--> statement-breakpoint
DROP TABLE `part_manufacturers`;--> statement-breakpoint
DROP TABLE `parts`;--> statement-breakpoint
DROP TABLE `schedules`;--> statement-breakpoint
DROP TABLE `used_parts`;--> statement-breakpoint
ALTER TABLE `appointments` DROP FOREIGN KEY `appointments_client_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-27 01:56:45.977';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-27 01:56:45.977';--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_client_id_users_id_fk` FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;