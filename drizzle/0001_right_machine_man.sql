DROP TABLE `client_profiles`;--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 12:19:18.030';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 12:19:18.030';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `name` varchar(100) DEFAULT 'Пользователь' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;