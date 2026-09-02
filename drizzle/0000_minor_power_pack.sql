CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text NOT NULL,
	`dog_id` text NOT NULL,
	`walker_id` text NOT NULL,
	`district` text NOT NULL,
	`duration` integer NOT NULL,
	`scheduled_for` integer NOT NULL,
	`status` text NOT NULL,
	`price_manat` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`dog_id`) REFERENCES `dogs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_bookings_owner_user_id` ON `bookings` (`owner_user_id`);--> statement-breakpoint
CREATE INDEX `idx_bookings_owner_status` ON `bookings` (`owner_user_id`,`status`);--> statement-breakpoint
CREATE TABLE `dogs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_user_id` text NOT NULL,
	`name` text NOT NULL,
	`breed` text NOT NULL,
	`age_years` integer NOT NULL,
	`size` text NOT NULL,
	`energy` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_dogs_owner_user_id` ON `dogs` (`owner_user_id`);