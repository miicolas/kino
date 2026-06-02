ALTER TYPE "public"."library_type" ADD VALUE 'series';--> statement-breakpoint
ALTER TYPE "public"."library_type" ADD VALUE 'documentary';--> statement-breakpoint
ALTER TABLE "server_config" DROP CONSTRAINT "server_config_singleton_check";--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "default_subtitle_language" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "server_config" ADD COLUMN "singleton_key" text DEFAULT 'server' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "server_config_singleton_key_unique" ON "server_config" USING btree ("singleton_key");--> statement-breakpoint
ALTER TABLE "server_config" ADD CONSTRAINT "server_config_singleton_check" CHECK ("server_config"."singleton_key" = 'server');