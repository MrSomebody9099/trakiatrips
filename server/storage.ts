import { type User, type InsertUser, type Booking, type InsertBooking, type Guest, type InsertGuest, type PaymentTransaction, type InsertPaymentTransaction, type Lead, type InsertLead, users, bookings, guests, paymentTransactions, leads } from "../../shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByUserEmail(userEmail: string): Promise<Booking[]>;
  getBookingByEmail(userEmail: string): Promise<Booking | undefined>;
  getBookingByStripeSession(sessionId: string): Promise<Booking | undefined>;
  getBookingsDueForPayment(dueDate: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined>;
  updateBookingPaymentStatus(fondyOrderId: string, status: string): Promise<Booking | undefined>;
  updateBookingStatusById(bookingId: string, status: string): Promise<Booking | undefined>;
  
  // Guest operations
  createGuest(guest: InsertGuest): Promise<Guest>;
  getGuestsByBookingId(bookingId: string): Promise<Guest[]>;
  updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | undefined>;
  deleteGuest(id: string): Promise<boolean>;
  
  // Payment transaction operations
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransactionByFondyOrderId(fondyOrderId: string): Promise<PaymentTransaction | undefined>;
  updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined>;
  updatePaymentTransactionByStripeIntent(stripePaymentIntentId: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined>;

  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  updateLeadStatus(email: string, status: string, bookingId?: string): Promise<Lead | undefined>;

  // Enhanced booking operations for pending bookings
  getPendingBookingsByEmail(userEmail: string): Promise<Booking[]>;
  reactivatePendingBooking(bookingId: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private guests: Map<string, Guest>;
  private paymentTransactions: Map<string, PaymentTransaction>;
  private leads: Map<string, Lead>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.guests = new Map();
    this.paymentTransactions = new Map();
    this.leads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: now, 
      updatedAt: now,
      addOns: insertBooking.addOns || [],
      installmentStatus: insertBooking.installmentStatus || null,
      paymentStatus: insertBooking.paymentStatus || "pending",
      paymentPlan: insertBooking.paymentPlan || "full",
      fondyOrderId: insertBooking.fondyOrderId || null,
      flightNumber: insertBooking.flightNumber || null,
      stripeCustomerId: insertBooking.stripeCustomerId || null,
      stripePaymentMethodId: insertBooking.stripePaymentMethodId || null,
      stripeSessionId: insertBooking.stripeSessionId || null,
      scheduledPaymentIntentId: insertBooking.scheduledPaymentIntentId || null,
      remainingAmount: insertBooking.remainingAmount || null,
      balanceDueDate: insertBooking.balanceDueDate || null
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByUserEmail(userEmail: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userEmail === userEmail
    );
  }

  async getBookingByEmail(userEmail: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.userEmail === userEmail
    );
  }

  async getBookingByStripeSession(sessionId: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.stripeSessionId === sessionId
    );
  }

  async getBookingsDueForPayment(dueDate: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.balanceDueDate === dueDate && 
                   booking.paymentPlan === 'installment' &&
                   booking.paymentStatus !== 'paid'
    );
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { 
      ...booking, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async updateBookingPaymentStatus(fondyOrderId: string, status: string): Promise<Booking | undefined> {
    const booking = Array.from(this.bookings.values()).find(
      (b) => b.fondyOrderId === fondyOrderId
    );
    if (!booking) return undefined;
    
    return this.updateBooking(booking.id, { paymentStatus: status });
  }

  async updateBookingStatusById(bookingId: string, status: string): Promise<Booking | undefined> {
    return this.updateBooking(bookingId, { paymentStatus: status });
  }

  // Guest operations
  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const id = randomUUID();
    const now = new Date();
    const guest: Guest = { ...insertGuest, id, createdAt: now, updatedAt: now };
    this.guests.set(id, guest);
    return guest;
  }

  async getGuestsByBookingId(bookingId: string): Promise<Guest[]> {
    return Array.from(this.guests.values()).filter(
      (guest) => guest.bookingId === bookingId
    );
  }

  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | undefined> {
    const guest = this.guests.get(id);
    if (!guest) return undefined;
    
    const updatedGuest = { 
      ...guest, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.guests.set(id, updatedGuest);
    return updatedGuest;
  }

  async deleteGuest(id: string): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Payment transaction operations
  async createPaymentTransaction(insertTransaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const id = randomUUID();
    const now = new Date();
    const transaction: PaymentTransaction = { 
      ...insertTransaction, 
      id, 
      createdAt: now, 
      updatedAt: now,
      fondyResponse: insertTransaction.fondyResponse || null,
      stripeResponse: insertTransaction.stripeResponse || null,
      scheduledAt: insertTransaction.scheduledAt || null,
      processedAt: insertTransaction.processedAt || null,
      paymentProvider: insertTransaction.paymentProvider || 'fondy',
      fondyOrderId: insertTransaction.fondyOrderId || null,
      stripePaymentIntentId: insertTransaction.stripePaymentIntentId || null
    };
    this.paymentTransactions.set(id, transaction);
    return transaction;
  }

  async getPaymentTransactionByFondyOrderId(fondyOrderId: string): Promise<PaymentTransaction | undefined> {
    return Array.from(this.paymentTransactions.values()).find(
      (transaction) => transaction.fondyOrderId === fondyOrderId
    );
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const transaction = this.paymentTransactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { 
      ...transaction, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.paymentTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async updatePaymentTransactionByStripeIntent(stripePaymentIntentId: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const transaction = Array.from(this.paymentTransactions.values()).find(
      (t) => t.stripePaymentIntentId === stripePaymentIntentId
    );
    if (!transaction) return undefined;
    
    return this.updatePaymentTransaction(transaction.id, updates);
  }

  // Lead operations
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const now = new Date();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: now,
      status: insertLead.status || "email_only"
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    return Array.from(this.leads.values()).find(
      (lead) => lead.email === email
    );
  }

  async updateLeadStatus(email: string, status: string, bookingId?: string): Promise<Lead | undefined> {
    const lead = await this.getLeadByEmail(email);
    if (!lead) return undefined;
    
    lead.status = status;
    if (bookingId !== undefined) {
      lead.bookingId = bookingId;
    }
    
    this.leads.set(lead.id, lead);
    return lead;
  }

  async getPendingBookingsByEmail(userEmail: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userEmail === userEmail && booking.paymentStatus === 'pending');
  }

  async reactivatePendingBooking(bookingId: string): Promise<Booking | undefined> {
    const booking = await this.getBooking(bookingId);
    if (!booking) return undefined;
    
    booking.paymentStatus = 'pending';
    booking.updatedAt = new Date();
    
    this.bookings.set(bookingId, booking);
    return booking;
  }
}

// Database storage implementation using Drizzle ORM
class DatabaseStorage implements IStorage {
  private db: any;
  
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required for database storage");
    }
    
    // Create postgres connection
    const connectionString = process.env.DATABASE_URL;
    const sql = postgres(connectionString);
    this.db = drizzle(sql);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Lead operations
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const result = await this.db.insert(leads).values(insertLead).returning();
    return result[0];
  }

  async getAllLeads(): Promise<Lead[]> {
    return await this.db.select().from(leads);
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const result = await this.db.select().from(leads).where(eq(leads.email, email)).limit(1);
    return result[0];
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await this.db.insert(bookings).values(insertBooking).returning();
    return result[0];
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.db.select().from(bookings);
  }

  async getBookingsByUserEmail(userEmail: string): Promise<Booking[]> {
    return await this.db.select().from(bookings).where(eq(bookings.userEmail, userEmail));
  }

  async getBookingByEmail(userEmail: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.userEmail, userEmail)).limit(1);
    return result[0];
  }

  async getBookingByStripeSession(sessionId: string): Promise<Booking | undefined> {
    const result = await this.db.select().from(bookings).where(eq(bookings.stripeSessionId, sessionId)).limit(1);
    return result[0];
  }

  async getBookingsDueForPayment(dueDate: string): Promise<Booking[]> {
    return await this.db.select().from(bookings).where(eq(bookings.balanceDueDate, dueDate));
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const result = await this.db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async updateBookingPaymentStatus(fondyOrderId: string, status: string): Promise<Booking | undefined> {
    const result = await this.db.update(bookings)
      .set({ paymentStatus: status })
      .where(eq(bookings.fondyOrderId, fondyOrderId))
      .returning();
    return result[0];
  }

  async updateBookingStatusById(bookingId: string, status: string): Promise<Booking | undefined> {
    const result = await this.db.update(bookings)
      .set({ paymentStatus: status })
      .where(eq(bookings.id, bookingId))
      .returning();
    return result[0];
  }

  // Guest operations
  async createGuest(insertGuest: InsertGuest): Promise<Guest> {
    const result = await this.db.insert(guests).values(insertGuest).returning();
    return result[0];
  }

  async getGuestsByBookingId(bookingId: string): Promise<Guest[]> {
    return await this.db.select().from(guests).where(eq(guests.bookingId, bookingId));
  }

  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | undefined> {
    const result = await this.db.update(guests).set(updates).where(eq(guests.id, id)).returning();
    return result[0];
  }

  async deleteGuest(id: string): Promise<boolean> {
    const result = await this.db.delete(guests).where(eq(guests.id, id)).returning();
    return result.length > 0;
  }

  // Payment transaction operations
  async createPaymentTransaction(insertTransaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const result = await this.db.insert(paymentTransactions).values(insertTransaction).returning();
    return result[0];
  }

  async getPaymentTransactionByFondyOrderId(fondyOrderId: string): Promise<PaymentTransaction | undefined> {
    const result = await this.db.select().from(paymentTransactions)
      .where(eq(paymentTransactions.fondyOrderId, fondyOrderId))
      .limit(1);
    return result[0];
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const result = await this.db.update(paymentTransactions)
      .set(updates)
      .where(eq(paymentTransactions.id, id))
      .returning();
    return result[0];
  }

  async updatePaymentTransactionByStripeIntent(stripePaymentIntentId: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const result = await this.db.update(paymentTransactions)
      .set(updates)
      .where(eq(paymentTransactions.stripePaymentIntentId, stripePaymentIntentId))
      .returning();
    return result[0];
  }

  // Enhanced lead operations
  async updateLeadStatus(email: string, status: string, bookingId?: string): Promise<Lead | undefined> {
    const updates: any = { status };
    if (bookingId) {
      updates.bookingId = bookingId;
    }
    const result = await this.db.update(leads)
      .set(updates)
      .where(eq(leads.email, email))
      .returning();
    return result[0];
  }

  // Enhanced booking operations for pending bookings
  async getPendingBookingsByEmail(userEmail: string): Promise<Booking[]> {
    return await this.db.select().from(bookings)
      .where(and(eq(bookings.userEmail, userEmail), eq(bookings.paymentStatus, 'pending')));
  }

  async reactivatePendingBooking(bookingId: string): Promise<Booking | undefined> {
    const result = await this.db.update(bookings)
      .set({ 
        paymentStatus: 'pending',
        updatedAt: new Date()
      })
      .where(eq(bookings.id, bookingId))
      .returning();
    return result[0];
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
