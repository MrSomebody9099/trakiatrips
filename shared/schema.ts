import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userEmail: text("user_email").notNull(),
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
