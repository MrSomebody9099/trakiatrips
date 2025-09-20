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
  lead_email: string;
  package_name: string;
  package_type: string;
  number_of_guests: number;
  total_amount: number;
  payment_plan: 'full' | 'installment';
  status: 'pending' | 'confirmed' | 'completed';
  created_at?: string;
  lead_booker_name?: string;
  lead_booker_phone?: string;
}

export interface Guest {
  id?: string;
  booking_id: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  is_lead_booker: boolean;
  created_at?: string;
}