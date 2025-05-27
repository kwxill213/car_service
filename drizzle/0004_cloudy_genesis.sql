CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone` varchar(20),
	`message` text NOT NULL,
	`user_id` int,
	`status` varchar(20) NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 21:13:01.293';--> statement-breakpoint
ALTER TABLE `reviews` MODIFY COLUMN `created_at` datetime NOT NULL DEFAULT '2025-05-26 21:13:01.293';--> statement-breakpoint
ALTER TABLE `contact_submissions` ADD CONSTRAINT `contact_submissions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;