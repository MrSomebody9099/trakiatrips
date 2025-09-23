import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  email: text("email").unique(), // Add email field for better user management
});

// Note: This schema should not include hashedPassword for API inputs
// Password hashing should be handled on the server side
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"), // This will be hashed server-side
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Leads table for complete lead information
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  packageName: text("package_name"),
  role: text("role").notNull().default("lead_booker"), // 'lead_booker' | 'guest'
  leadBookerId: varchar("lead_booker_id"), // For guests, references lead booker
  withLeadName: text("with_lead_name"), // Denormalized for easy display
  status: text("status").notNull().default("email_only"),
  bookingId: varchar("booking_id").references(() => bookings.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  role: z.enum(["lead_booker", "guest"]).default("lead_booker"),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: text("user_email").notNull(),
  leadBookerName: text("lead_booker_name"),
  leadBookerPhone: text("lead_booker_phone"),
  packageName: text("package_name").notNull(),
  packagePrice: decimal("package_price", { precision: 10, scale: 2 }).notNull(),
  dates: text("dates").notNull(),
  numberOfGuests: integer("number_of_guests").notNull(),
  roomType: text("room_type").notNull(),
  addOns: jsonb("add_ons").default([]),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  paymentPlan: text("payment_plan").default("full"), // full, installment
  installmentStatus: jsonb("installment_status").default(null), // { deposit: paid/pending, balance: paid/pending, dueDate: string }
  depositPaid: boolean("deposit_paid").default(false), // Track if deposit payment is completed
  fondyOrderId: text("fondy_order_id"),
  // Stripe fields for installment payments
  stripeCustomerId: text("stripe_customer_id"),
  stripePaymentMethodId: text("stripe_payment_method_id"), 
  stripeSessionId: text("stripe_session_id"), // For idempotency
  scheduledPaymentIntentId: text("scheduled_payment_intent_id"),
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }),
  balanceDueDate: text("balance_due_date"), // Due date for remaining balance
  flightNumber: text("flight_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Guests table
export const guests = pgTable("guests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

// Coupon usage tracking table
export const couponUsage = pgTable("coupon_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponCode: text("coupon_code").notNull(),
  userEmail: text("user_email").notNull(),
  bookingId: varchar("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
  numberOfPeople: integer("number_of_people").notNull(), // Track how many people this usage counts for
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Unique constraint to prevent duplicate usage per booking
  uniqueBookingCoupon: sql`UNIQUE(booking_id, coupon_code)`,
  // Unique constraint to prevent multiple usage per email for same coupon
  uniqueEmailCoupon: sql`UNIQUE(user_email, coupon_code)`,
}));

export const insertCouponUsageSchema = createInsertSchema(couponUsage).omit({
  id: true,
  createdAt: true,
});

export type InsertCouponUsage = z.infer<typeof insertCouponUsageSchema>;
export type CouponUsage = typeof couponUsage.$inferSelect;

// Payment transactions table for tracking installment payments
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  fondyOrderId: text("fondy_order_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: text("payment_type").notNull(), // deposit, balance, full
  status: text("status").notNull(), // pending, approved, declined, succeeded
  paymentProvider: text("payment_provider").notNull().default("fondy"), // fondy, stripe
  fondyResponse: jsonb("fondy_response"),
  stripeResponse: jsonb("stripe_response"),
  scheduledAt: timestamp("scheduled_at"), // For scheduled payments
  processedAt: timestamp("processed_at"), // When payment was actually processed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
