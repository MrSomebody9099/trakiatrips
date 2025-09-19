import { type User, type InsertUser, type Booking, type InsertBooking, type Guest, type InsertGuest, type PaymentTransaction, type InsertPaymentTransaction } from "../shared/schema.js";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private guests: Map<string, Guest>;
  private paymentTransactions: Map<string, PaymentTransaction>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.guests = new Map();
    this.paymentTransactions = new Map();
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
}

export const storage = new MemStorage();