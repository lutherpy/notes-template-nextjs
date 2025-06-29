CREATE TABLE "user_details" (
	"user_id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"identification_number" text NOT NULL,
	"country" text NOT NULL,
	"province" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;