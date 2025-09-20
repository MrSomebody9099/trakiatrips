CREATE TABLE "bookings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"package_name" text NOT NULL,
	"package_price" numeric(10, 2) NOT NULL,
	"dates" text NOT NULL,
	"number_of_guests" integer NOT NULL,
	"room_type" text NOT NULL,
	"add_ons" jsonb DEFAULT '[]'::jsonb,
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_plan" text DEFAULT 'full',
	"installment_status" jsonb DEFAULT 'null'::jsonb,
	"fondy_order_id" text,
	"stripe_customer_id" text,
	"stripe_payment_method_id" text,
	"stripe_session_id" text,
	"scheduled_payment_intent_id" text,
	"remaining_amount" numeric(10, 2),
	"balance_due_date" text,
	"flight_number" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" varchar NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'email_only' NOT NULL,
	"booking_id" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" varchar NOT NULL,
	"fondy_order_id" text,
	"stripe_payment_intent_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"payment_type" text NOT NULL,
	"status" text NOT NULL,
	"payment_provider" text DEFAULT 'fondy' NOT NULL,
	"fondy_response" jsonb,
	"stripe_response" jsonb,
	"scheduled_at" timestamp,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;