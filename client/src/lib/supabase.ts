import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Lead {
  id?: string;
  email: string;
  status: 'email_only' | 'booking_started' | 'booking_confirmed';
  created_at?: string;
  booking_id?: string;
}

export interface Booking {
  id?: string;
  user_email: string;
  package_name: string;
  number_of_guests: number;
  total_amount: string; // Decimal stored as string
  payment_plan: 'full' | 'installment';
  payment_status: 'pending' | 'paid' | 'failed';
  room_type: string;
  add_ons?: any[]; // JSONB array
  created_at?: string;
}

export interface Guest {
  id?: string;
  booking_id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at?: string;
}