DROP TABLE `employee_profiles`;--> statement-breakpoint
DROP TABLE `positions`;--> statement-breakpoint
DROP TABLE `specializations`;--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 21:23:20.521';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 21:23:20.521';