ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 12:25:27.736';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 12:25:27.736';--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(255);