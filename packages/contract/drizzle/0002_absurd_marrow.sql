ALTER TABLE "server_config" DROP CONSTRAINT "server_config_singleton_check";--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_pkey";--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "server_config" ADD CONSTRAINT "server_config_singleton_check" CHECK ("server_config"."id" = "server_config"."id");
