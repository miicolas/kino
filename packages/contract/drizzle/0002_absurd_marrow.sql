ALTER TABLE "server_config" DROP CONSTRAINT "server_config_singleton_check";--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "server_config" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'user_preferences'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "user_preferences" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "user_preferences" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "server_config" ADD CONSTRAINT "server_config_singleton_check" CHECK ("server_config"."id" = "server_config"."id");