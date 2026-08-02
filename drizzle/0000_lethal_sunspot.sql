CREATE TABLE `attempt_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`attempt_id` text NOT NULL,
	`question_id` text NOT NULL,
	`objective_id` text NOT NULL,
	`position` integer NOT NULL,
	`option_order` text NOT NULL,
	`selected_option_id` text,
	`is_correct` integer,
	`flagged` integer DEFAULT false NOT NULL,
	`time_spent_ms` integer DEFAULT 0 NOT NULL,
	`answered_at` integer,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `aq_attempt_idx` ON `attempt_questions` (`attempt_id`);--> statement-breakpoint
CREATE INDEX `aq_question_idx` ON `attempt_questions` (`question_id`);--> statement-breakpoint
CREATE INDEX `aq_objective_idx` ON `attempt_questions` (`objective_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `aq_attempt_position_unique` ON `attempt_questions` (`attempt_id`,`position`);--> statement-breakpoint
CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`mode` text NOT NULL,
	`locale` text NOT NULL,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`finished_at` integer,
	`time_limit_seconds` integer,
	`extra_time_applied` integer DEFAULT false NOT NULL,
	`question_count` integer NOT NULL,
	`score` integer,
	`pass_mark` integer NOT NULL,
	`passed` integer,
	`auto_submitted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `attempts_user_idx` ON `attempts` (`user_id`);--> statement-breakpoint
CREATE INDEX `attempts_cert_idx` ON `attempts` (`certification_id`);--> statement-breakpoint
CREATE INDEX `attempts_started_idx` ON `attempts` (`started_at`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`event` text NOT NULL,
	`outcome` text NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`meta` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `audit_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`title_nl` text NOT NULL,
	`title_en` text NOT NULL,
	`description_nl` text NOT NULL,
	`description_en` text NOT NULL,
	`question_count` integer NOT NULL,
	`pass_mark` integer NOT NULL,
	`duration_minutes` integer NOT NULL,
	`extra_time_minutes` integer DEFAULT 0 NOT NULL,
	`exam_language` text NOT NULL,
	`accent_color` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` text PRIMARY KEY NOT NULL,
	`certification_id` text NOT NULL,
	`code` text NOT NULL,
	`title_nl` text NOT NULL,
	`title_en` text NOT NULL,
	`weight` real NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `domains_cert_idx` ON `domains` (`certification_id`);--> statement-breakpoint
CREATE TABLE `fsrs_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`item_type` text NOT NULL,
	`item_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`due` integer NOT NULL,
	`stability` real DEFAULT 0 NOT NULL,
	`difficulty` real DEFAULT 0 NOT NULL,
	`elapsed_days` real DEFAULT 0 NOT NULL,
	`scheduled_days` real DEFAULT 0 NOT NULL,
	`reps` integer DEFAULT 0 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`state` integer DEFAULT 0 NOT NULL,
	`last_review` integer,
	`suspended` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fsrs_user_item_unique` ON `fsrs_cards` (`user_id`,`item_type`,`item_id`);--> statement-breakpoint
CREATE INDEX `fsrs_due_idx` ON `fsrs_cards` (`user_id`,`due`);--> statement-breakpoint
CREATE INDEX `fsrs_cert_idx` ON `fsrs_cards` (`certification_id`);--> statement-breakpoint
CREATE TABLE `fsrs_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`state` integer NOT NULL,
	`scheduled_days` real NOT NULL,
	`elapsed_days` real NOT NULL,
	`reviewed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`duration_ms` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `fsrs_cards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `fsrs_reviews_card_idx` ON `fsrs_reviews` (`card_id`);--> statement-breakpoint
CREATE INDEX `fsrs_reviews_user_idx` ON `fsrs_reviews` (`user_id`,`reviewed_at`);--> statement-breakpoint
CREATE TABLE `glossary_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`certification_id` text NOT NULL,
	`objective_id` text,
	`term_en` text NOT NULL,
	`term_nl` text NOT NULL,
	`definition_nl` text NOT NULL,
	`definition_en` text NOT NULL,
	`note_nl` text,
	`note_en` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`objective_id`) REFERENCES `objectives`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `glossary_cert_idx` ON `glossary_terms` (`certification_id`);--> statement-breakpoint
CREATE INDEX `glossary_term_idx` ON `glossary_terms` (`term_en`);--> statement-breakpoint
CREATE TABLE `objectives` (
	`id` text PRIMARY KEY NOT NULL,
	`domain_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`code` text NOT NULL,
	`topic_nl` text NOT NULL,
	`topic_en` text NOT NULL,
	`description_nl` text NOT NULL,
	`description_en` text NOT NULL,
	`bloom_level` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`domain_id`) REFERENCES `domains`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `objectives_domain_idx` ON `objectives` (`domain_id`);--> statement-breakpoint
CREATE INDEX `objectives_cert_idx` ON `objectives` (`certification_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `objectives_cert_code_unique` ON `objectives` (`certification_id`,`code`);--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`label` text NOT NULL,
	`text_nl` text NOT NULL,
	`text_en` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	`rationale_nl` text,
	`rationale_en` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `options_question_idx` ON `question_options` (`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`certification_id` text NOT NULL,
	`objective_id` text NOT NULL,
	`type` text DEFAULT 'standard' NOT NULL,
	`bloom_level` integer DEFAULT 1 NOT NULL,
	`difficulty` integer DEFAULT 2 NOT NULL,
	`stem_nl` text NOT NULL,
	`stem_en` text NOT NULL,
	`list_items` text,
	`explanation_nl` text NOT NULL,
	`explanation_en` text NOT NULL,
	`source_ref` text,
	`active` integer DEFAULT true NOT NULL,
	`origin` text DEFAULT 'seed' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`objective_id`) REFERENCES `objectives`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `questions_cert_idx` ON `questions` (`certification_id`);--> statement-breakpoint
CREATE INDEX `questions_objective_idx` ON `questions` (`objective_id`);--> statement-breakpoint
CREATE INDEX `questions_active_idx` ON `questions` (`active`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL,
	`blocked_until` integer
);
--> statement-breakpoint
CREATE INDEX `rate_limits_window_idx` ON `rate_limits` (`window_start`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`absolute_expires_at` integer NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`mfa_satisfied` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_expiry_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`exam_date` integer,
	`daily_review_target` integer DEFAULT 30 NOT NULL,
	`use_extra_time` integer DEFAULT false NOT NULL,
	`preferred_locale` text DEFAULT 'nl' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `study_plans_user_cert_unique` ON `study_plans` (`user_id`,`certification_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text NOT NULL,
	`locale` text DEFAULT 'nl' NOT NULL,
	`totp_secret` text,
	`totp_enabled_at` integer,
	`recovery_codes` text,
	`failed_login_count` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`last_login_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);