CREATE TABLE `address_ens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`address` text NOT NULL,
	`has_ens` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()),
	`avatar_url` text,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `address_ens_address_unique` ON `address_ens` (`address`);