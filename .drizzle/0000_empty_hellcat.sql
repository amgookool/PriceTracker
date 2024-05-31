CREATE TABLE `price_histories` (
	`price_history_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`price` real NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`product_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`product_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(255),
	`desired_price` real NOT NULL,
	`product_url` text(255) NOT NULL,
	`site_product_name` text(255),
	`website` text NOT NULL,
	`image_url` text(255),
	`user_id` integer NOT NULL,
	`schedule_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`schedule_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer,
	`user_id` integer NOT NULL,
	`last_scraped_at` text,
	`job_name` text,
	`scrape_interval` text(255),
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);